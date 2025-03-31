from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.perplexity_client import PerplexityClient
from app.models.research_model import ResearchResult

router = APIRouter(prefix="/research", tags=["research"])


class ResearchRequest(BaseModel):
    query: str = Field(..., description="Research query string")
    context: Optional[str] = Field(None, description="Additional context for the research")
    max_results: Optional[int] = Field(5, ge=1, le=50)
    filter: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Search filters"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "query": "Modern CAD design optimization techniques",
                "context": "Focusing on automotive parts",
                "max_results": 10,
                "filter": {
                    "date_range": "last_year",
                    "source_type": ["academic", "industry"]
                }

            }
        }


perplexity_client = PerplexityClient()


@router.post("/query", response_model=ResearchResult)
async def perform_research(request: ResearchRequest):
    try:
        # Validating whether the query is valid
        if len(request.query.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="Query must be at least 3 characters long"
            )

        research_results = await perplexity_client.research_query(
            query=request.query,
            max_results=request.max_results,
            context=request.context,
            filter=request.filter
        )
        return ResearchResult(
            query=request.query,
            results=research_results,
            metadata={
                "timestamp": datetime.now(),
                "filters_applied": request.filter,
                "result_count": len(research_results)
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Research query error: {str(e)}"
        )


@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_research(research_result: ResearchResult):
    try:

        analyzed_data = await perplexity_client.analyze_results(
            research_result.results
        )
        return {
            "analysis_summary": analyzed_data,
            "key_findings": analyzed_data.get("key_findings", []),
            "relevance_scores": analyzed_data.get("relevance_scores", {}),
            "recommendations": analyzed_data.get("recommendations", [])
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis error: {str(e)}"
        )


@router.get("/trending")
async def get_trending_topics():
    try:
        trending = await perplexity_client.get_trending_topics()
        return {
            "topics": trending,
            "updated_at": datetime.now()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching trending topics: {str(e)}"
        )


@router.post("/summarize")
async def summarize_research(research_result: ResearchResult):
    try:
        summary = await perplexity_client.generate_summary(
            research_result.results
        )
        return {
            "summary": summary,
            "source_count": len(research_result.results),
            "generated_at": datetime.now()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summarization error: {str(e)}"
        )
