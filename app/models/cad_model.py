from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DesignType(str, Enum):
    MODEL_3D = "3D_MODEL"
    DRAWING_2D = "2D_DRAWING"
    ASSEMBLY = "ASSEMBLY"
    PROTOTYPE = "PROTOTYPE"


class CADParameters(BaseModel):
    dimensions: Dict[str, float] = Field(..., description="Design dimensions")
    material: str = Field(..., description="Material specification")
    specifications: Dict[str, str] = Field(..., description="Additional specifications")

    @field_validator('dimensions')
    @classmethod
    def validate_dimensions(cls, v):
        required_dims = {'height', 'width', 'length'}
        if not all(dim in v for dim in required_dims):
            raise ValueError(f"Missing required dimensions: {required_dims - v.keys()}")
        return v


class CADInstruction(BaseModel):
    design_type: DesignType = Field(..., description="Type of CAD design")
    instructions: List[str] = Field(..., description="List of design instructions")
    parameters: Optional[CADParameters] = Field(None, description="Design parameters")
    project_name: Optional[str] = Field(None, description="Project identifier")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None
    status: str = Field(default="pending")
    version: str = Field(default="1.0.0")
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_schema_extra = {
            "example": {
                "design_type": "3D_MODEL",
                "instructions": [
                    "Create base cylinder",
                    "Add fillet to edges",
                    "Drill holes at coordinates"
                ],
                "parameters": {
                    "dimensions": {
                        "height": 100,
                        "width": 50,
                        "length": 75
                    },
                    "material": "aluminum",
                    "specifications": {
                        "tolerance": "0.1mm",
                        "surface_finish": "polished"
                    }
                },
                "project_name": "Engine Block",
                "status": "pending",
                "version": "1.0.0",
                "metadata": {}
            }
        }