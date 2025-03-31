from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class InputType(str, Enum):
    TEXT = "text"
    VOICE = "voice"
    IMAGE = "image"


class ProcessedInput(BaseModel):
    input_type: InputType = Field(..., description="Type of input")
    content: str = Field(..., description="Processed content")
    raw_content: Optional[str] = Field(None, description="Original unprocessed content")
    metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float = Field(default=1.0, ge=0.0, le=1.0)
    processed_at: datetime = Field(default_factory=datetime.now)
    project_name: Optional[str] = None
    language: str = Field(default="en")
    processing_duration: float = Field(default=0.0, ge=0.0)


class NLPEntity(BaseModel):
    text: str = Field(..., min_length=1)
    entity_type: str = Field(..., min_length=1)
    start_pos: int = Field(..., ge=0)
    end_pos: int = Field(..., ge=0)
    confidence: float = Field(..., ge=0.0, le=1.0)

    @field_validator('end_pos')
    @classmethod
    def validate_positions(cls, v, values):
        if 'start_pos' in values and v <= values['start_pos']:
            raise ValueError("end_pos must be greater than start_pos")
        return v


class NLPAnalysis(BaseModel):
    entities: List[NLPEntity] = Field(default_factory=list)
    intent: str = Field(..., min_length=1)
    sentiment: float = Field(..., ge=-1.0, le=1.0)
    processed_input: ProcessedInput
    analysis_timestamp: datetime = Field(default_factory=datetime.now)
