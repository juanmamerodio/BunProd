import os
import re
import io
import logging
import subprocess
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.errors import HttpError

from app.config import settings
from app.core.firebase import init_firebase
from app.core.drive import get_drive_service
from app.models.content import ContentStatus

logger = logging.getLogger("app.services.dit")


class DITService:
    """
    DIT (Digital Imaging Technician) Ingestion Service.

    Handles the complete lifecycle of raw video file ingestion:
    download → extract audio → rename in drive → trigger content-brain & clean up → log to Firestore.
    """

    def __init__(self):
        self.db = init_firebase()
        self.drive = get_drive_service()
        # 1. Directorio efímero en el contenedor (/tmp/)
        self.cache_dir = "/tmp/"
        os.makedirs(self.cache_dir, exist_ok=True)

    # ──────────────────────────────────────────────
    # PUBLIC PIPELINE
    # ──────────────────────────────────────────────

    async def ingest_new_drive_file(
        self,
        file_id: str,
        client_id: str,
        client_name: str,
        original_filename: str,
    ) -> Dict[str, Any]:
        """
        Main execution pipeline for DIT agent.
        """
        logger.info(f"DIT Agent: Processing file ingestion. File ID: {file_id}, Client: {client_name}")

        temp_video_path = os.path.join(self.cache_dir, f"{file_id}_{original_filename}")
        temp_audio_path = os.path.join(self.cache_dir, f"{file_id}_audio.mp3")

        # Nomenclatura Afterbow
        today_str = datetime.utcnow().strftime("%Y%m%d")
        tipo_plano, clip_nro = self._parse_video_specifications(original_filename)
        new_filename = (
            f"[AFT]-[{client_name.replace(' ', '_').upper()}]-"
            f"[{today_str}]-[{tipo_plano}]-[{clip_nro}]"
        )
        content_id = f"cont_{file_id}"

        try:
            # 1. Descarga Efímera con MediaIoBaseDownload en /tmp/
            self._download_drive_file(file_id, temp_video_path)

            # 2. Extracción de Audio a 128kbps
            self._extract_audio_128kbps(temp_video_path, temp_audio_path)

            # 3. Renombrado Estricto en la Nube
            self._rename_drive_file(file_id, new_filename)

            # Enviar a Content Brain Agent
            webhook_payload = {
                "content_id": content_id,
                "client_id": client_id,
                "audio_path": temp_audio_path,
                "original_filename": original_filename,
            }
            await self._trigger_content_brain_webhook(webhook_payload)

            # 5. Persistencia de Estado en Firestore
            self._update_firestore_status(client_id, content_id, drive_id=file_id, filename=new_filename)

            return {
                "status": "success",
                "content_id": content_id,
                "new_filename": new_filename,
                "drive_file_id": file_id,
            }

        except HttpError as e:
            logger.error(f"DIT Agent: Google API Network Error: {e}")
            raise Exception(f"Google API Error: {e}")
        except ValueError as e:
            logger.error(f"DIT Agent: Video processing error: {e}")
            raise e
        except Exception as e:
            logger.error(f"DIT Agent: Unexpected failure in DIT pipeline: {e}")
            raise e
        finally:
            # 4. Limpieza Absoluta de Disco
            self._absolute_disk_cleanup(temp_video_path, temp_audio_path)

    # ──────────────────────────────────────────────
    # 1. GOOGLE DRIVE DOWNLOAD
    # ──────────────────────────────────────────────

    def _download_drive_file(self, file_id: str, dest_path: str):
        """
        Downloads file into /tmp/ directory using MediaIoBaseDownload.
        """
        logger.info(f"DIT Agent: Downloading file ID {file_id} to {dest_path}...")
        if not self.drive:
            logger.warning("Mocking Drive download (service not initialized).")
            with open(dest_path, "wb") as f:
                f.write(b"mock video data")
            return

        try:
            request = self.drive.files().get_media(fileId=file_id)
            with io.FileIO(dest_path, "wb") as fh:
                downloader = MediaIoBaseDownload(fh, request, chunksize=1024 * 1024 * 5)
                done = False
                while not done:
                    status, done = downloader.next_chunk()
                    if status:
                        logger.info(f"DIT Agent: Download progress: {int(status.progress() * 100)}%")
            logger.info("DIT Agent: Download completed.")
        except HttpError as e:
            raise HttpError(e.resp, e.content)

    # ──────────────────────────────────────────────
    # 2. AUDIO EXTRACTION
    # ──────────────────────────────────────────────

    def _extract_audio_128kbps(self, video_path: str, audio_path: str):
        """
        Extracts audio as a 128kbps MP3 using an ffmpeg subprocess.
        """
        logger.info(f"DIT Agent: Extracting audio from {video_path} to {audio_path} at 128kbps.")
        try:
            command = [
                "ffmpeg", "-y", "-i", video_path,
                "-vn", "-ar", "44100", "-ac", "2", "-b:a", "128k",
                audio_path
            ]
            subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            logger.info("DIT Agent: Audio extraction successful.")
        except subprocess.CalledProcessError as e:
            error_msg = e.stderr.decode('utf-8', errors='ignore')
            logger.error(f"DIT Agent: ffmpeg failed: {error_msg}")
            raise ValueError(f"Codec format error or extraction failed: {error_msg}")
        except Exception as e:
            raise ValueError(f"Unexpected error during audio extraction: {e}")

    # ──────────────────────────────────────────────
    # 3. DRIVE RENAMING
    # ──────────────────────────────────────────────

    def _rename_drive_file(self, file_id: str, new_name: str):
        """
        Renames the file in Google Drive.
        """
        logger.info(f"DIT Agent: Renaming file {file_id} to {new_name}")
        if not self.drive:
            logger.warning("Mocking Drive rename (service not initialized).")
            return

        try:
            self.drive.files().update(
                fileId=file_id,
                body={"name": new_name},
                fields="id, name",
            ).execute()
        except HttpError as e:
            raise HttpError(e.resp, e.content)

    # ──────────────────────────────────────────────
    # 4. ABSOLUTE DISK CLEANUP
    # ──────────────────────────────────────────────

    def _absolute_disk_cleanup(self, *file_paths):
        """
        Ensures local storage remains at 0 bytes to prevent hidden costs.
        """
        for path in file_paths:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                    logger.info(f"DIT Agent: Cleaned up ephemeral file {path}")
                except Exception as e:
                    logger.warning(f"DIT Agent: Failed to clean up {path}: {e}")

    # ──────────────────────────────────────────────
    # 5. FIRESTORE PERSISTENCE
    # ──────────────────────────────────────────────

    def _update_firestore_status(self, client_id: str, content_id: str, drive_id: str, filename: str):
        """
        Updates the content document status to 'Audio_Listo'.
        """
        if not self.db:
            logger.warning("DIT Agent: Firestore client not initialized. Persistence skipped.")
            return

        try:
            doc_ref = (
                self.db.collection("afterbow-app")
                .document("clientes")
                .collection(client_id)
                .document(content_id)
            )

            # Create or update document
            doc_data = {
                "video_drive_url": f"https://drive.google.com/open?id={drive_id}",
                "status": "Audio_Listo",
                "filename": filename,
                "fecha_actualizacion": datetime.utcnow(),
            }
            doc_ref.set(doc_data, merge=True)
            logger.info(f"DIT Agent: Successfully updated state in Firestore for {content_id} to 'Audio_Listo'.")
        except Exception as e:
            logger.error(f"DIT Agent: Failed to persist state in Firestore: {e}")
            raise e

    # ──────────────────────────────────────────────
    # UTILS & WEBHOOKS
    # ──────────────────────────────────────────────

    @staticmethod
    def _parse_video_specifications(filename: str) -> Tuple[str, str]:
        """
        Extracts plan type and sequence from filename.
        """
        clean_name = filename.upper()
        tipo_plano = "B-ROLL"
        if "A-ROLL" in clean_name or "A_ROLL" in clean_name or "TALKING" in clean_name:
            tipo_plano = "A-ROLL"
        elif "HOOK" in clean_name:
            tipo_plano = "HOOK"

        numbers = re.findall(r"\d+", filename)
        clip_nro = numbers[-1].zfill(3) if numbers else "001"
        return tipo_plano, clip_nro

    async def _trigger_content_brain_webhook(self, payload: Dict[str, Any]):
        """
        Triggers the Content Brain Agent after audio extraction is ready.
        """
        import httpx
        webhook_url = settings.CONTENT_BRAIN_WEBHOOK_URL
        if not webhook_url:
            logger.warning("CONTENT_BRAIN_WEBHOOK_URL not configured. Skipping webhook.")
            return

        logger.info(f"Sending webhook to Content Brain Agent: {webhook_url}")
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(webhook_url, json=payload, timeout=60.0)
                response.raise_for_status()
            except Exception as e:
                logger.error(f"Failed to trigger Content-Brain webhook: {e}")
                raise e
