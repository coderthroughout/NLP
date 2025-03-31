from typing import List, Optional, Dict, Any
import aiohttp
from app.core.config import settings
from app.models.research_model import ResearchResult, ResearchSource


class PerplexityClient:
    def __init__(self):
        self.api_key = settings.PERPLEXITY_API_KEY
        self.base_url = "https://api.perplexity.ai"

    async def research_query(
            self,
            query: str,
            max_results: int = 5,
            context: Optional[str] = None,
            filters: Optional[Dict[str, Any]] = None
    ) -> ResearchResult:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "query": query,
            "max_results": max_results,
            "context": context,
            "filters": filters
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.base_url}/research",
                    headers=headers,
                    json=payload
            ) as response:
                data = await response.json()
                return self._process_research_results(data, query)

    def _process_research_results(self, data: dict, query: str) -> ResearchResult:
        sources = [
            ResearchSource(
                title=item.get("title", ""),
                content=item.get("content", ""),
                url=item.get("url"),
                relevance_score=item.get("score", 1.0)
            )
            for item in data.get("results", [])
        ]

        return ResearchResult(
            query=query,
            results=sources,
            summary=data.get("summary"),
            keywords=data.get("keywords", [])
        )

    async def analyze_results(self, results: List[ResearchSource]) -> Dict[str, Any]:
        analysis = {
            "key_findings": [],
            "relevance_scores": {},
            "recommendations": []
        }

        for source in results:
            analysis["relevance_scores"][source.title] = source.relevance_score
            if source.relevance_score > 0.8:
                analysis["key_findings"].append(
                    f"High relevance finding from {source.title}"
                )

        return analysis

    async def get_trending_topics(self) -> List[Dict[str, Any]]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(
                    f"{self.base_url}/trending",
                    headers=headers
            ) as response:
                data = await response.json()
                return data.get("topics", [])

    async def generate_summary(self, results: List[ResearchSource]) -> str:
        combined_content = "\n".join(
            source.content for source in results
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "content": combined_content,
            "max_length": 500
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                    f"{self.base_url}/summarize",
                    headers=headers,
                    json=payload
            ) as response:
                data = await response.json()
                return data.get("summary", "")