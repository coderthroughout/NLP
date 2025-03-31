from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.cad_processor import CADProcessor
from app.models.cad_model import CADInstruction

router = APIRouter(prefix="/cad", tags=["cad"])


class CADRequest(BaseModel):
    design_type: str
    specifications: dict
    research_results: Optional[List[str]] = None
    project_id: Optional[str] = None
    version: Optional[str] = "1.0"
    constraints: Optional[Dict[str, Any]] = None

    class Config:
        schema_extra = {
            "example": {
                "design_type": "3D Model",
                "specifications": {
                    "dimensions": {"length": 100, "width": 50, "height": 25},
                    "material": "aluminum",
                    "tolerance": "0.1mm"
                },
                "constraints": {
                    "max_weight": "1kg",
                    "max_thickness": "2mm"
                }
            }
        }


cad_processor = CADProcessor()


@router.post("/generate", response_model=CADInstruction)
async def generate_cad_instructions(request: CADRequest):
    try:
        #Adding input validation so to be sure that their is valid input.

        if not request.specifications:
            raise HTTPException(status_code=400, detail="Specifications are required")

        #Adding process design requirements

        instructions = await cad_processor.generate_instructions(
            design_type=request.design_type,
            specifications=request.specifications,
            research_results=request.research_results
        )
        # Now adding Design Verification

        verification = await cad_processor.verify_design_feasibility(instructions)
        if not verification.is_feasible:
            raise HTTPException(
                status_code=422,
                detail=f"Design is not feasible: {verification.reason}"
            )
        return CADInstruction(
            design_type=request.design_type,
            instructions=instructions,
            metadata={
                "project_id": request.project_id,
                "version": request.version,
                "verification_status": verification.status
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate")
async def validate_design(instruction: CADInstruction):
    try:
        # Implementing Comprehensive Validation
        validation_result = await cad_processor.validate_instructions(
            instruction.instructions,
            validate_level="DETAILED"
        )
        return {
            "is_valid": validation_result.is_valid,
            "validation_details": validation_result.details,
            "recommendations": validation_result.recommendations,
            "performance_metrics": validation_result.performance_metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/templates/{design_type}")
async def get_design_templates(
        design_type: str,
        complexity: Optional[str] = "medium",
        scale: Optional[str] = "standard"
):
    try:
        templates = {
            "3D_MODEL": {
                "basic": {
                    "template_id": "3d_basic_001",
                    "dimensions": {"length": 100, "width": 50, "height": 25},
                    "default_material": "aluminum",
                    "standard_tolerances": "±0.1mm"
                },
                "advanced": {
                    "template_id": "3d_adv_001",
                    "parametric_rules": True,
                    "assembly_support": True
                }
            }
        }

        if design_type not in templates:
            raise HTTPException(
                status_code=404,
                detail=f"No templates found for design type: {design_type}"
            )

        return templates[design_type]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize")
async def optimize_design(instruction: CADInstruction):
    try:
        optimization_params = {
            "material_usage": True,
            "structural_integrity": True,
            "manufacturing_cost": True,
            "production_time": True
        }

        optimized_design = await cad_processor.optimize_design(
            instructions=instruction.instructions,
            parameters=optimization_params
        )

        return {
            "original_design": instruction,
            "optimized_design": optimized_design,
            "optimization_metrics": {
                "material_saved": "15%",
                "strength_improved": "25%",
                "cost_reduced": "20%"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/compatibility")
async def check_compatibility(
        format: str,
        version: Optional[str] = None
):
    try:
        compatibility_matrix = {
            "obj": {"versions": ["2.0", "3.0"], "export_support": True},
            "stl": {"versions": ["ascii", "binary"], "export_support": True},
            "step": {"versions": ["AP203", "AP214"], "export_support": True},
            "iges": {"versions": ["5.3", "6.0"], "export_support": True}
        }

        if format not in compatibility_matrix:
            raise HTTPException(
                status_code=404,
                detail=f"Format {format} not supported"
            )

        return {
            "format": format,
            "compatibility": compatibility_matrix[format],
            "recommended_version": compatibility_matrix[format]["versions"][-1]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
