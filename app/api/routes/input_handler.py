from datetime import datetime

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.voice_processor import VoiceProcessor
from app.models.nlp_model import ProcessedInput
from app.services.image_processor import ImageProcessor
image_processor = ImageProcessor()

router = APIRouter(prefix="/input", tags=["input"])


class TextRequest(BaseModel):
    content: str = Field(..., description="Input text content")
    project_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional metadata for the input"

    )

    class Config:
        json_schema_extra = {
            "example": {
                "content": "Design a cylindrical component",
                "project_name": "Engine Parts",
                "metadata": {
                    "priority": "high"
                }
            }
        }


class InputResponse(BaseModel):
    input_id: str
    input_type: str
    content: str
    processed_at: datetime
    status: str
    project_name: Optional[str] = None


voice_processor = VoiceProcessor()


@router.post("/text", response_model=InputResponse)
async def process_text_input(request: TextRequest):
    try:
        processed_input = ProcessedInput(
            input_type="text",
            content=request.content,
            project_name=request.project_name,
            metadata=request.metadata
        )
        return processed_input
    except Exception as e:
        status_code = 500
        detail = f"Text processing error: {str(e)}"


@router.post("/voice", response_model=InputResponse)
async def process_voice_input(
        file: UploadFile = File(...),
        project_name: Optional[str] = None,
        language: Optional[str] = "en"
):
    try:
        if not file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an audio format"
            )

        content = await voice_processor.transcribe(
            audio_data=await file.read(),
            language=language
        )

        return ProcessedInput(
            input_type="voice",
            content=content,
            project_name=project_name,
            metadata={"original_filename": file.filename}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Voice processing error: {str(e)}"
        )


@router.post("/image", response_model=InputResponse)
async def process_image_input(
        file: UploadFile = File(...),
        project_name: Optional[str] = None,
        analysis_type: Optional[str] = "basic"
):
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an image format"
            )

        image_analysis = await image_processor.analyze(
            image_data=await file.read(),
            analysis_type=analysis_type
        )

        return ProcessedInput(
            input_type="image",
            content=image_analysis.description,
            project_name=project_name,
            metadata={
                "original_filename": file.filename,
                "analysis_type": analysis_type,
                "image_metadata": image_analysis.metadata
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image processing error: {str(e)}"
        )
