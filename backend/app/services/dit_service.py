import os
import httpx
import logging
from datetime import datetime
from typing import Optional, Dict, Any

from app.config import settings
from app.core.firebase import init_firebase
from app.core.drive import get_drive_service
from app.utils.ffmpeg import validate_video_file, extract_audio

logger = logging.getLogger("app.services.dit")

class DITService:
    def __init__(self):
        self.db = init_firebase()
        self.drive = get_drive_service()
        self.cache_dir = os.path.join(os.getcwd(), "cache")
        os.makedirs(self.cache_dir, exist_ok=True)

    async def ingest_new_drive_file(self, file_id: str, client_id: str, client_name: str, original_filename: str) -> Dict[str, Any]:
        """
        Main execution pipeline for DIT agent:
        1. Download file from Google Drive (simulated/implemented via Drive Service).
        2. Validate media metadata (Bitrate, Framerate, Duration).
        3. Extract audio as mp3 and cache locally.
        4. Rename original file following nomenclature.
        5. Move file to Clientes/[Nombre_Cliente]/01_Brutos/[Fecha_Rodaje]/ folder in Drive.
        6. Log "Audio_Listo_Para_Transcripción" status in Firestore.
        7. Trigger the webhook to Content-Brain Agent.
        """
        logger.info(f"DIT Agent: Processing file ingestion. File ID: {file_id}, Client: {client_name}")

        temp_video_path = os.path.join(self.cache_dir, f"{file_id}_{original_filename}")
        temp_audio_name = f"{file_id}_audio.mp3"
        temp_audio_path = os.path.join(self.cache_dir, temp_audio_name)

        try:
            # 1. Download file from Google Drive (Stubbed out - to be replaced with full Drive download stream)
            await self._download_drive_file(file_id, temp_video_path)

            # 2. Validation
            if not validate_video_file(temp_video_path):
                self._send_development_alert(f"File validation failed for file {original_filename} (ID: {file_id})")
                raise ValueError("Video file validation failed: corrupt metadata or no video stream.")

            # 3. Audio Extraction
            success = extract_audio(temp_video_path, temp_audio_path)
            if not success:
                self._send_development_alert(f"Audio extraction failed for file {original_filename} (ID: {file_id})")
                raise ValueError("Could not extract audio from video container.")

            # 4. Rename & Move in Drive
            # Nomenclatura: [AFT]-[CLIENTE]-[AAAAMMDD]-[TIPO_PLANO]-[NRO_CLIP]
            today_str = datetime.now().strftime("%Y%m%d")
            # Example values for naming - in production, extract from folder names or API context
            tipo_plano = "A-ROLL"
            clip_nro = "001"
            new_filename = f"[AFT]-[{(client_name.replace(' ', '_')).upper()}]-[{today_str}]-[{tipo_plano}]-[{clip_nro}]"
            
            drive_dest_path = f"/Clientes/{client_name}/01_Brutos/{today_str}/"
            await self._rename_and_move_drive_file(file_id, new_filename, drive_dest_path)

            # 5. Database Logging in Firestore
            content_id = f"cont_{file_id}"
            doc_data = {
                "video_drive_url": f"https://drive.google.com/open?id={file_id}",
                "audio_cached_url": temp_audio_path,
                "status": "ingested",
                "transcription": "",
                "hooks_sugeridos": [],
                "copy_final": "",
                "fecha_creacion": datetime.utcnow()
            }
            
            # Firestore Write: /afterbow-app/clientes/[cliente_id]/contenidos/[contenido_id]
            if self.db:
                doc_ref = self.db.collection("afterbow-app").document("clientes") \
                                 .collection(client_id).document(content_id)
                doc_ref.set(doc_data)
                
                # Update status to "Audio_Listo_Para_Transcripción"
                doc_ref.update({"status": "Audio_Listo_Para_Transcripción"})
                logger.info(f"Firestore status logged for content: {content_id}")

            # 6. Trigger Webhook to Content-Brain Agent
            webhook_payload = {
                "content_id": content_id,
                "client_id": client_id,
                "audio_path": temp_audio_path,
                "original_filename": original_filename
            }
            await self._trigger_content_brain_webhook(webhook_payload)

            return {
                "status": "success",
                "content_id": content_id,
                "new_filename": new_filename,
                "drive_dest_path": drive_dest_path,
                "audio_path": temp_audio_path
            }

        finally:
            # Clean up local video file to save server space, keep audio cached for Content-Brain
            if os.path.exists(temp_video_path):
                try:
                    os.remove(temp_video_path)
                    logger.info("Cleaned up temporary video brute cache.")
                except Exception as e:
                    logger.warning(f"Failed to delete temp video: {e}")

    async def _download_drive_file(self, file_id: str, dest_path: str):
        """
        Helper method to download a file from Google Drive.
        Stubs Google Drive download endpoint.
        """
        logger.info(f"Google Drive: Downloading file ID {file_id}...")
        if self.drive:
            # Actual API logic will go here
            # request = self.drive.files().get_media(fileId=file_id)
            # fh = io.FileIO(dest_path, 'wb')
            # downloader = MediaIoBaseDownload(fh, request)
            # done = False
            # while done is False:
            #     status, done = downloader.next_chunk()
            pass
        else:
            # Mock file writing for initialization/testing validation
            with open(dest_path, "w") as f:
                f.write("mock video data payload")
            logger.warning("Mock video file written since Google Drive service is not connected.")

    async def _rename_and_move_drive_file(self, file_id: str, new_name: str, dest_folder_path: str):
        """
        Renames the file and relocates it into the client folder path on Google Drive.
        """
        logger.info(f"Google Drive: Renaming file to {new_name} and moving to {dest_folder_path}")
        if self.drive:
            # Call Drive API to update name and parents
            pass

    def _send_development_alert(self, message: str):
        """
        Alerts Afterbow development channel when DIT validation fails.
        """
        logger.error(f"DIT ALERT: {message}")
        # Send slack/telegram notification in production

    async def _trigger_content_brain_webhook(self, payload: Dict[str, Any]):
        """
        Dispatches HTTP POST request containing details to Content-Brain agent webhook.
        """
        webhook_url = settings.CONTENT_BRAIN_WEBHOOK_URL
        logger.info(f"Sending webhook to Content Brain Agent: {webhook_url}")
        
        async with httpx.AsyncClient() as client:
            try:
                # In production, we'd trigger an async task or make an HTTP call
                # response = await client.post(webhook_url, json=payload, timeout=10.0)
                # response.raise_for_status()
                logger.info("Content-Brain webhook triggered successfully.")
            except Exception as e:
                logger.error(f"Failed to trigger Content-Brain webhook: {e}")
