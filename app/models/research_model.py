from pydantic import BaseModel, Field, field_validator, validator
from typing import List, Optional, Dict, Any
from datetime import datetime

from pydantic.v1 import root_validator


class ResearchSource(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=10)
    url: Optional[str] = Field(None, pattern=r'^https?://')
    relevance_score: float = Field(default=1.0, ge=0.0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.now)
    citation_count: Optional[int] = Field(default=0, ge=0)
    author: Optional[str] = None
    publication_date: Optional[datetime] = None


class ResearchResult(BaseModel):
    query: str = Field(..., description="Original research query", min_length=3)
    results: List[ResearchSource] = Field(..., min_items=1)
    project_name: Optional[str] = None
    summary: Optional[str] = Field(None, min_length=50)
    keywords: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    total_sources: int = Field(default=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    @classmethod
    def set_total_sources(cls, v, values):
        if 'results' in values:
            return len(values['results'])
        return v


class ResearchAnalytics(BaseModel):
    total_queries: int = Field(default=0, ge=0)
    average_relevance: float = Field(default=0.0, ge=0.0, le=1.0)
    top_keywords: List[str] = Field(default_factory=list)
    research_results: List[ResearchResult]
    analysis_date: datetime = Field(default_factory=datetime.now)