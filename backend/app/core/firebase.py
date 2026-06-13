import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
import os
import logging

logger = logging.getLogger("app.core.firebase")

db = None

def init_firebase():
    global db
    if db is not None:
        return db

    if not firebase_admin._apps:
        try:
            if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized with credentials from path.")
            else:
                # Try to initialize using default credentials (ADC)
                firebase_admin.initialize_app()
                logger.info("Firebase Admin SDK initialized with default credentials.")
        except Exception as e:
            logger.warning(f"Could not initialize Firebase Admin SDK: {e}. Firestore client will be unavailable.")
            return None

    try:
        db = firestore.client()
    except Exception as e:
        logger.error(f"Could not create Firestore client: {e}")
        db = None
    return db

# Initialize client on module import (or can be triggered at startup event)
init_firebase()
