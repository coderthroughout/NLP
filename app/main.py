from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
from app.api.endpoints import router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NLP CAD Assistant",
    description="AI-powered CAD assistant with NLP capabilities",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": request.url.path,
            "timestamp": datetime.now().isoformat()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "status_code": 500,
            "path": request.url.path,
            "timestamp": datetime.now().isoformat()
        }
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    return {
        "status": "healthy",
        "version": app.version,
        "timestamp": datetime.now().isoformat(),
        "environment": settings.ENVIRONMENT
    }


# Startup and shutdown events with logging
@app.on_event("startup")
async def startup_event():
    logger.info("Application starting up...")
    try:
        # Initialize services
        logger.info("Initializing services...")
        # Add your service initialization here

        # Verify database connections
        logger.info("Verifying database connections...")
        # Add your database connection verification here

        # Load configurations
        logger.info("Loading configurations...")
        # Add your configuration loading here

        logger.info("Application startup completed successfully")
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}", exc_info=True)
        raise


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutting down...")
    try:
        # Cleanup resources
        logger.info("Cleaning up resources...")
        # Add your cleanup logic here

        # Close connections
        logger.info("Closing connections...")
        # Add your connection closing logic here

        logger.info("Application shutdown completed successfully")
    except Exception as e:
        logger.error(f"Shutdown failed: {str(e)}", exc_info=True)
        raise


# Include API router
@app.get("/", tags=["General"])
async def root() -> dict:
    return {"message": "Welcome to NLP CAD Assistant API!"}

app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS
    )