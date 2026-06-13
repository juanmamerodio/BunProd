from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.services.dit_service import DITService

router = APIRouter(prefix="/dit", tags=["DIT Ingestion Agent"])

class IngestFileRequest(BaseModel):
    file_id: str = Field(description="Google Drive File ID")
    client_id: str = Field(description="Client ID in Firestore")
    client_name: str = Field(description="Name of the client")
    original_filename: str = Field(description="Original name of the uploaded video brute file")

@router.post("/ingest", response_model=Dict[str, Any])
async def trigger_ingestion(request: IngestFileRequest, background_tasks: BackgroundTasks):
    """
    Triggers the file ingestion pipeline (metadata check, ffmpeg audio extract, rename, move, firestore log).
    Runs asynchronously in background tasks to avoid timeouts for large video files.
    """
    dit_service = DITService()
    
    # We run the pipeline as a background task to respond quickly
    background_tasks.add_task(
        dit_service.ingest_new_drive_file,
        file_id=request.file_id,
        client_id=request.client_id,
        client_name=request.client_name,
        original_filename=request.original_filename
    )
    
    return {
        "status": "ingestion_triggered",
        "message": f"DIT Agent ingestion pipeline has been spawned in the background for file {request.original_filename}.",
        "file_id": request.file_id,
        "client_id": request.client_id
    }
