from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    # Server configuration
    PORT: int = Field(default=8000, validation_alias="PORT")
    HOST: str = Field(default="0.0.0.0", validation_alias="HOST")
    DEBUG: bool = Field(default=True, validation_alias="DEBUG")

    # API Keys
    GEMINI_API_KEY: str = Field(default="", validation_alias="GEMINI_API_KEY")

    # Firebase
    FIREBASE_CREDENTIALS_PATH: Optional[str] = Field(default=None, validation_alias="FIREBASE_CREDENTIALS_PATH")

    # Google Drive
    GOOGLE_DRIVE_CREDENTIALS_PATH: Optional[str] = Field(default=None, validation_alias="GOOGLE_DRIVE_CREDENTIALS_PATH")
    GOOGLE_DRIVE_INBOUND_FOLDER_ID: str = Field(default="", validation_alias="GOOGLE_DRIVE_INBOUND_FOLDER_ID")
    GOOGLE_DRIVE_CLIENTS_FOLDER_ID: str = Field(default="", validation_alias="GOOGLE_DRIVE_CLIENTS_FOLDER_ID")

    # Webhooks
    CONTENT_BRAIN_WEBHOOK_URL: str = Field(default="http://localhost:8000/api/v1/content-brain/process", validation_alias="CONTENT_BRAIN_WEBHOOK_URL")
    PUBLISHER_WEBHOOK_URL: str = Field(default="http://localhost:8000/api/v1/publisher/trigger", validation_alias="PUBLISHER_WEBHOOK_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
