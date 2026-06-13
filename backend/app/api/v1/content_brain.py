from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.services.content_brain_service import ContentBrainService

router = APIRouter(prefix="/content-brain", tags=["Content-Brain Agent"])

class ProcessAudioRequest(BaseModel):
    content_id: str = Field(description="Firestore Content Document ID")
    client_id: str = Field(description="Firestore Client Document ID")
    audio_path: str = Field(description="Local server path to cached audio file")

@router.post("/process", response_model=Dict[str, Any])
async def trigger_content_brain(request: ProcessAudioRequest, background_tasks: BackgroundTasks):
    """
    Triggers transcription, strategic copy-creation and hooks suggestions using Gemini 1.5,
    outputs markdown files, updates Firestore and triggers alerts.
    """
    cb_service = ContentBrainService()
    
    # Run in background to handle transcription and copywriting without blocking HTTP
    background_tasks.add_task(
        cb_service.process_audio_and_generate_strategy,
        content_id=request.content_id,
        client_id=request.client_id,
        audio_path=request.audio_path
    )
    
    return {
        "status": "processing_triggered",
        "message": f"Content-Brain strategist agent has been spawned in the background for content {request.content_id}.",
        "content_id": request.content_id
    }
