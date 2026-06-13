from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from app.config import settings
from app.core.firebase import init_firebase
from app.core.gemini import init_gemini
from app.api.v1 import dit, content_brain, contents

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("app.main")

# Initialize FastAPI App
app = FastAPI(
    title="Afterbow Agents Coordination Backend",
    description="FastAPI service controlling the DIT Agent, Content-Brain AI Strategist, and Firestore-Dashboard synchronization.",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS Middleware (Allows dashboard connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to match Vercel/dashboard domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Events
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Afterbow Coordination Backend...")
    # Initialize core services
    init_firebase()
    init_gemini()

# Include Routers
app.include_router(dit.router, prefix="/api/v1")
app.include_router(content_brain.router, prefix="/api/v1")
app.include_router(contents.router, prefix="/api/v1")

# Health Check Route
@app.get("/health", tags=["System"])
async def health_check():
    """
    Validates api server readiness.
    """
    return {
        "status": "online",
        "service": app.title,
        "version": app.version,
        "debug_mode": settings.DEBUG
    }

if __name__ == "__main__":
    # Start the server locally
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
