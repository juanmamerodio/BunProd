import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger("app.core.gemini")

def init_gemini():
    """
    Initializes the Google Generative AI SDK using the GEMINI_API_KEY from settings.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.warning("GEMINI_API_KEY is not configured in settings. Google Generative AI operations will fail.")
        return False

    try:
        genai.configure(api_key=api_key)
        logger.info("Google Generative AI configured successfully.")
        return True
    except Exception as e:
        logger.error(f"Failed to configure Google Generative AI: {e}")
        return False

# Trigger initialization on module import
init_gemini()
