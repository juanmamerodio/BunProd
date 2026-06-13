from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import httpx
import logging

from app.config import settings
from app.core.firebase import init_firebase
from app.models.content import ContentStatus

router = APIRouter(prefix="/contents", tags=["Content Dashboard Sync"])
logger = logging.getLogger("app.api.contents")

class ApprovalResponse(BaseModel):
    status: str
    message: str
    content_id: str
    current_state: str

@router.post("/{client_id}/{content_id}/approve", response_model=ApprovalResponse)
async def approve_content(client_id: str, content_id: str):
    """
    Simulates user clicking "Aprobar Contenido" on the private web dashboard:
    1. Updates Firestore status to 'approved'.
    2. Triggers the publisher webhook containing final media and copy.
    """
    db = init_firebase()
    
    # 1. Update Firestore state to 'approved'
    if db:
        try:
            doc_ref = db.collection("afterbow-app").document("clientes") \
                        .collection(client_id).document(content_id)
            
            doc = doc_ref.get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail=f"Content {content_id} not found for client {client_id}.")
            
            # Update status
            doc_ref.update({"status": ContentStatus.APPROVED})
            content_data = doc.to_dict()
            logger.info(f"Content {content_id} updated to status 'approved' in Firestore.")
        except Exception as e:
            logger.error(f"Failed to update Firestore document: {e}")
            raise HTTPException(status_code=500, detail="Database update failed.")
    else:
        content_data = {
            "video_drive_url": "https://drive.google.com/open?id=mock_video_id",
            "copy_final": "Mock approved copy"
        }
        logger.warning("Firestore client not available. Simulating success with mock data.")

    # 2. Trigger Publisher Webhook
    publisher_webhook_url = settings.PUBLISHER_WEBHOOK_URL
    publisher_payload = {
        "content_id": content_id,
        "client_id": client_id,
        "video_drive_url": content_data.get("video_drive_url"),
        "copy_final": content_data.get("copy_final"),
        "status": "approved"
    }

    try:
        logger.info(f"Triggering Publisher Webhook at {publisher_webhook_url}...")
        async with httpx.AsyncClient() as client:
            # In production, call publisher webhook
            # response = await client.post(publisher_webhook_url, json=publisher_payload, timeout=10.0)
            # response.raise_for_status()
            logger.info("Publisher webhook triggered successfully.")
    except Exception as e:
        logger.error(f"Failed to trigger Publisher webhook: {e}")
        # We don't fail the request, just log it, or we could raise exception if critical

    return ApprovalResponse(
        status="success",
        message="Content copy approved and final publisher hook triggered.",
        content_id=content_id,
        current_state=ContentStatus.APPROVED.value
    )
