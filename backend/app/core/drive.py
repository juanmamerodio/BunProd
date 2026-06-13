from googleapiclient.discovery import build
from google.oauth2 import service_account
from app.config import settings
import os
import logging

logger = logging.getLogger("app.core.drive")

def get_drive_service():
    """
    Initializes and returns a Google Drive API service client (v3).
    """
    credentials_path = settings.GOOGLE_DRIVE_CREDENTIALS_PATH
    if not credentials_path or not os.path.exists(credentials_path):
        logger.warning(f"Google Drive credentials path '{credentials_path}' not found or not provided. Drive operations will fail.")
        return None

    try:
        scopes = ['https://www.googleapis.com/auth/drive']
        creds = service_account.Credentials.from_service_account_file(
            credentials_path, scopes=scopes
        )
        service = build('drive', 'v3', credentials=creds)
        logger.info("Google Drive service successfully initialized.")
        return service
    except Exception as e:
        logger.error(f"Failed to initialize Google Drive service: {e}")
        return None
