import os
import logging
from googleapiclient.discovery import build
from google.oauth2 import service_account
from app.config import settings

logger = logging.getLogger("app.core.drive")

def get_drive_service():
    """
    Initializes and returns a Google Drive API service client (v3).

    Credential resolution order:
    1. Explicit GOOGLE_DRIVE_CREDENTIALS_PATH (service account JSON).
    2. GOOGLE_APPLICATION_CREDENTIALS env var (standard GCP ADC file).
    3. Application Default Credentials (automatic in Cloud Run / GCE / GKE).
    """
    scopes = ['https://www.googleapis.com/auth/drive']

    # Priority 1: Explicit Drive credentials file
    cred_path = settings.GOOGLE_DRIVE_CREDENTIALS_PATH
    if cred_path and os.path.exists(cred_path):
        try:
            creds = service_account.Credentials.from_service_account_file(
                cred_path, scopes=scopes
            )
            service = build('drive', 'v3', credentials=creds)
            logger.info("Google Drive service initialized with explicit credentials file.")
            return service
        except Exception as e:
            logger.error(f"Failed to initialize Drive with explicit credentials: {e}")
            return None

    # Priority 2: GOOGLE_APPLICATION_CREDENTIALS env var
    gac_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or settings.GOOGLE_APPLICATION_CREDENTIALS
    if gac_path and os.path.exists(gac_path):
        try:
            creds = service_account.Credentials.from_service_account_file(
                gac_path, scopes=scopes
            )
            service = build('drive', 'v3', credentials=creds)
            logger.info("Google Drive service initialized with GOOGLE_APPLICATION_CREDENTIALS.")
            return service
        except Exception as e:
            logger.error(f"Failed to initialize Drive with GOOGLE_APPLICATION_CREDENTIALS: {e}")
            return None

    # Priority 3: ADC (Cloud Run, GCE, GKE)
    try:
        import google.auth
        creds, project = google.auth.default(scopes=scopes)
        service = build('drive', 'v3', credentials=creds)
        logger.info(f"Google Drive service initialized with ADC (project: {project}).")
        return service
    except Exception as e:
        logger.warning(f"No Drive credentials available (explicit, GAC, or ADC): {e}. Drive operations will be unavailable.")
        return None
