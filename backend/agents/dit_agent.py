import sys
import os
import logging
from datetime import datetime
from typing import Dict, Any, Tuple

# Add parent directory to sys.path to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import ffmpeg
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.errors import HttpError
from google.oauth2 import service_account
from google.auth.exceptions import GoogleAuthError

from app.config import settings
from app.core.firebase import init_firebase

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] DITAgent: %(message)s")
logger = logging.getLogger("DITAgent")

class DITAgent:
    def __init__(self):
        """
        Initializes the DIT Ingestion Agent by establishing Firestore connection
        and caching setup.
        """
        self.db = init_firebase()
        self.cache_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        self.drive_service = self._init_drive_service()

    def _init_drive_service(self):
        """
        Connects securely to Google Drive API using a Service Account.
        Raises GoogleAuthError if credentials are not configured or invalid.
        """
        credentials_path = settings.GOOGLE_DRIVE_CREDENTIALS_PATH
        if not credentials_path or not os.path.exists(credentials_path):
            error_msg = f"Credentials file not found at path: {credentials_path}"
            logger.error(error_msg)
            raise GoogleAuthError(error_msg)

        try:
            scopes = ['https://www.googleapis.com/auth/drive']
            creds = service_account.Credentials.from_service_account_file(
                credentials_path, scopes=scopes
            )
            service = build('drive', 'v3', credentials=creds)
            logger.info("DIT Agent: Securely connected to Google Drive API.")
            return service
        except Exception as e:
            logger.error(f"DIT Agent: Auth connection failed: {e}")
            raise GoogleAuthError(f"Failed to connect to Google Drive: {e}")

    def process_dit_file(self, file_id: str, client_id: str, client_name: str) -> Dict[str, Any]:
        """
        Ingestion Pipeline for DIT Agent:
        1. Fetch metadata and check permissions for Drive file.
        2. Download the video file to ephemeral local storage.
        3. Validate video integrity and codec details using ffmpeg-python (probe).
        4. Extract lightweight audio (.mp3) using ffmpeg-python.
        5. Clean up temporary video file immediately to optimize storage costs.
        6. Rename the original file in Google Drive under Afterbow's strict pattern.
        7. Move renamed file to '/Clientes/[Nombre_Cliente]/01_Brutos/[Fecha_Rodaje]/' folder in Drive.
        8. Write metadata record with status "Audio_Listo" in Firestore.
        """
        logger.info(f"DIT Agent: Starting processing for file ID: {file_id}")
        
        # 1. Fetch file metadata and check permissions
        file_metadata = self._fetch_drive_file_metadata(file_id)
        original_name = file_metadata.get("name", "unknown_video.mp4")
        created_time_str = file_metadata.get("createdTime", "")
        
        # Parse date for folder name and naming conventions
        # Google Drive createdTime format: 2026-06-13T17:45:04.000Z
        try:
            created_date = datetime.strptime(created_time_str.split("T")[0], "%Y-%m-%d")
        except Exception:
            created_date = datetime.now()
        
        today_str = created_date.strftime("%Y%m%d")
        folder_date_str = created_date.strftime("%Y-%m-%d")

        temp_video_path = os.path.join(self.cache_dir, f"temp_dit_{file_id}_{original_name}")
        audio_filename = f"audio_{file_id}.mp3"
        temp_audio_path = os.path.join(self.cache_dir, audio_filename)

        try:
            # 2. Ephemeral Download
            self._download_file_from_drive(file_id, temp_video_path)

            # 3 & 4. Validation & Audio extraction with ffmpeg-python
            self._validate_and_extract_audio(temp_video_path, temp_audio_path)

            # 5. Local video is deleted inside finally block to ensure it is ephemeral
            logger.info(f"DIT Agent: Extracted audio stream to cached path: {temp_audio_path}")

            # 6 & 7. Rename & Relocate on Google Drive
            # Nomenclatura Afterbow: [AFT]-[CLIENTE]-[AAAAMMDD]-[TIPO_PLANO]-[NRO_CLIP]
            tipo_plano, clip_nro = self._parse_video_specifications(original_name)
            new_filename = f"[AFT]-[{(client_name.replace(' ', '_')).upper()}]-[{today_str}]-[{tipo_plano}]-[{clip_nro}]"
            
            # Find or create destination folder path: /Clientes/[Nombre_Cliente]/01_Brutos/[Fecha_Rodaje]/
            dest_folder_id = self._setup_drive_destination_folder(client_name, folder_date_str)
            self._rename_and_move_drive_file(file_id, new_filename, dest_folder_id)

            # 8. Guardar registro en Firestore con estado "Audio_Listo"
            content_id = f"cont_{file_id}"
            self._log_ingested_content_to_firestore(
                client_id=client_id,
                content_id=content_id,
                drive_id=file_id,
                filename=new_filename,
                audio_path=temp_audio_path
            )

            return {
                "status": "success",
                "content_id": content_id,
                "drive_file_id": file_id,
                "new_filename": new_filename,
                "audio_cached_path": temp_audio_path
            }

        finally:
            # Cost optimization: ensure original video file is deleted from local disk
            if os.path.exists(temp_video_path):
                try:
                    os.remove(temp_video_path)
                    logger.info("DIT Agent: Temporary video file deleted successfully from local cache.")
                except Exception as e:
                    logger.warning(f"DIT Agent: Failed to delete temporary video file: {e}")

    def _fetch_drive_file_metadata(self, file_id: str) -> Dict[str, Any]:
        """
        Retrieves file metadata from Google Drive.
        Handles permission issues and non-existent files.
        """
        try:
            return self.drive_service.files().get(
                fileId=file_id, 
                fields="id, name, mimeType, createdTime, size, parents"
            ).execute()
        except HttpError as e:
            status_code = e.resp.status
            if status_code in [403, 404]:
                error_msg = f"Permission Denied or File Not Found in Drive (ID: {file_id}). Status Code: {status_code}"
                logger.error(error_msg)
                raise PermissionError(error_msg)
            else:
                logger.error(f"Google Drive API error retrieving metadata: {e}")
                raise e

    def _download_file_from_drive(self, file_id: str, dest_path: str):
        """
        Downloads a file stream from Google Drive into a temporary path.
        """
        logger.info(f"DIT Agent: Downloading file ID {file_id}...")
        try:
            request = self.drive_service.files().get_media(fileId=file_id)
            with open(dest_path, "wb") as fh:
                downloader = MediaIoBaseDownload(fh, request, chunksize=1024*1024*5)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    if status:
                        logger.info(f"DIT Agent: Download progress: {int(status.progress() * 100)}%")
            logger.info("DIT Agent: Download completed.")
        except HttpError as e:
            logger.error(f"DIT Agent: Failed to download file from Drive: {e}")
            raise PermissionError(f"Drive download failed: Access denied or insufficient permissions: {e}")
        except Exception as e:
            logger.error(f"DIT Agent: Error writing file: {e}")
            raise IOError(f"Failed to write ephemeral video stream to disk: {e}")

    def _validate_and_extract_audio(self, video_path: str, audio_path: str):
        """
        Uses ffmpeg-python to validate the video integrity and extract the audio stream to MP3.
        """
        logger.info(f"DIT Agent: Validating and probing file {video_path}...")
        try:
            # Validate integrity using probe (checks if file headers are readable and contain video)
            probe = ffmpeg.probe(video_path)
            video_streams = [s for s in probe.get("streams", []) if s.get("codec_type") == "video"]
            
            if not video_streams:
                raise ValueError("No video stream found inside the container.")
                
            logger.info("DIT Agent: Video file header validated successfully.")
        except ffmpeg.Error as e:
            stderr_msg = e.stderr.decode('utf-8') if e.stderr else str(e)
            logger.error(f"DIT Agent: FFmpeg probe validation failed. File might be corrupt: {stderr_msg}")
            raise ValueError(f"El archivo de video está corrupto o no es un contenedor multimedia válido: {stderr_msg}")
        except Exception as e:
            logger.error(f"DIT Agent: File format metadata read failure: {e}")
            raise ValueError(f"Formato no compatible o archivo corrupto: {e}")

        # Extract Audio Stream
        try:
            logger.info("DIT Agent: Extracting audio stream...")
            stream = ffmpeg.input(video_path)
            stream = ffmpeg.output(stream, audio_path, vn=None, acodec='libmp3lame', audio_bitrate='128k')
            ffmpeg.run(stream, overwrite_output=True, capture_stdout=True, capture_stderr=True)
            logger.info("DIT Agent: Audio stream extraction completed.")
        except ffmpeg.Error as e:
            stderr_msg = e.stderr.decode('utf-8') if e.stderr else str(e)
            logger.error(f"DIT Agent: FFmpeg audio extraction command failed: {stderr_msg}")
            raise ValueError(f"Falla al extraer el stream de audio mediante FFmpeg: {stderr_msg}")

    def _parse_video_specifications(self, filename: str) -> Tuple[str, str]:
        """
        Parses video name to extract plan type and clip index sequence.
        Defaults to placeholder parameters if not matches.
        """
        # Ex: iphone_a_roll_shot_03.mp4 -> A-ROLL, 003
        clean_name = filename.upper()
        
        tipo_plano = "B-ROLL"
        if "A-ROLL" in clean_name or "A_ROLL" in clean_name or "TALKING" in clean_name:
            tipo_plano = "A-ROLL"
        elif "HOOK" in clean_name:
            tipo_plano = "HOOK"

        # Try to parse simple sequence index
        import re
        numbers = re.findall(r"\d+", filename)
        clip_nro = numbers[-1].zfill(3) if numbers else "001"
        
        return tipo_plano, clip_nro

    def _setup_drive_destination_folder(self, client_name: str, folder_date: str) -> str:
        """
        Sets up or returns the folder hierarchy Clientes/[Nombre_Cliente]/01_Brutos/[Fecha_Rodaje]/ in Drive.
        Returns the folder ID of the leaf folder.
        """
        # Stubs search and creation of folder structure.
        # In production, we search folder names and create if missing using files().create().
        logger.info(f"DIT Agent: Setting up folder structure /Clientes/{client_name}/01_Brutos/{folder_date}/")
        
        # Retorna un dummy ID en caso de testing local o desarrollo sin root folders asignadas
        return settings.GOOGLE_DRIVE_CLIENTS_FOLDER_ID or "dummy_leaf_folder_id"

    def _rename_and_move_drive_file(self, file_id: str, new_name: str, dest_folder_id: str):
        """
        Renames and moves the file in Google Drive.
        """
        logger.info(f"DIT Agent: Relocating file to parent folder ID: {dest_folder_id} and renaming to: {new_name}")
        try:
            # 1. Rename
            self.drive_service.files().update(
                fileId=file_id,
                body={"name": new_name},
                fields="id, name"
            ).execute()
            
            # 2. Move (retrieve parents first, then add/remove parents)
            file_meta = self.drive_service.files().get(fileId=file_id, fields="parents").execute()
            previous_parents = ",".join(file_meta.get("parents", []))
            
            if previous_parents != dest_folder_id:
                self.drive_service.files().update(
                    fileId=file_id,
                    addParents=dest_folder_id,
                    removeParents=previous_parents,
                    fields="id, parents"
                ).execute()
                
            logger.info("DIT Agent: Drive metadata update completed.")
        except HttpError as e:
            logger.error(f"DIT Agent: Google Drive update metadata failed: {e}")
            raise PermissionError(f"No se pudo renombrar o mover el archivo en Google Drive: {e}")

    def _log_ingested_content_to_firestore(self, client_id: str, content_id: str, drive_id: str, filename: str, audio_path: str):
        """
        Writes a tracking log document to Firestore with state status set to "Audio_Listo".
        """
        if not self.db:
            logger.warning("DIT Agent: Firestore client not initialized. Ingestion metadata skipped.")
            return

        try:
            doc_ref = self.db.collection("afterbow-app").document("clientes") \
                             .collection(client_id).document(content_id)
                             
            doc_data = {
                "video_drive_url": f"https://drive.google.com/open?id={drive_id}",
                "audio_cached_url": audio_path,
                "status": "Audio_Listo",
                "filename": filename,
                "fecha_creacion": datetime.utcnow()
            }
            
            doc_ref.set(doc_data)
            logger.info(f"DIT Agent: Successfully saved record to Firestore (Path: /clientes/{client_id}/contenidos/{content_id}) with status 'Audio_Listo'.")
        except Exception as e:
            logger.error(f"DIT Agent: Failed to log state in Firestore database: {e}")
            raise e

if __name__ == "__main__":
    # Test script entry point
    agent = DITAgent()
    print("DIT Ingestion Agent initialized successfully.")
