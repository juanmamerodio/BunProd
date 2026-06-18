import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os
import logging

logger = logging.getLogger("app.core.firebase")

db = None

def init_firebase():
    """
    Initializes the Firebase Admin SDK with the following credential resolution order:
    1. Explicit FIREBASE_CREDENTIALS_PATH (path to a service account JSON).
    2. GOOGLE_APPLICATION_CREDENTIALS env var (standard GCP ADC).
    3. Application Default Credentials (automatic in Cloud Run / GCE / GKE).

    If FIREBASE_PROJECT_ID is set, it is passed explicitly to initialize_app()
    so that Firestore targets the correct project even when using ADC.
    """
    global db
    if db is not None:
        return db

    if not firebase_admin._apps:
        try:
            options = {}
            if settings.FIREBASE_PROJECT_ID:
                options["projectId"] = settings.FIREBASE_PROJECT_ID

            cred_path = settings.FIREBASE_CREDENTIALS_PATH
            gac_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or settings.GOOGLE_APPLICATION_CREDENTIALS

            if cred_path and os.path.exists(cred_path):
                # Priority 1: Explicit Firebase credentials file
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred, options or None)
                logger.info("Firebase Admin SDK initialized with explicit credentials file.")
            elif gac_path and os.path.exists(gac_path):
                # Priority 2: GOOGLE_APPLICATION_CREDENTIALS env var
                cred = credentials.Certificate(gac_path)
                firebase_admin.initialize_app(cred, options or None)
                logger.info("Firebase Admin SDK initialized with GOOGLE_APPLICATION_CREDENTIALS.")
            else:
                # Priority 3: ADC (automatic in Cloud Run, GCE, GKE)
                firebase_admin.initialize_app(options=options or None)
                logger.info("Firebase Admin SDK initialized with Application Default Credentials (ADC).")
        except Exception as e:
            logger.warning(f"Could not initialize Firebase Admin SDK: {e}. Firestore client will be unavailable.")
            return None

    try:
        db = firestore.client()
    except Exception as e:
        logger.error(f"Could not create Firestore client: {e}")
        db = None
    return db
