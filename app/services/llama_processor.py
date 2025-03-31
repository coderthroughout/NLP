from typing import Dict, Optional, Any
from datetime import datetime
import aiohttp
from app.core.config import settings


class LLaMAProcessor:
    def __init__(self):
        self.api_key = settings.LLAMA_API_KEY
        self.base_url = "https://api.llama.ai/v1"
        self.model = "llama-2-70b"
        self.supported_models = ["llama-2-70b", "llama-2-13b", "llama-2-7b"]

    async def process_query(
            self,
            text: str,
            context: Optional[Dict] = None,
            max_tokens: int = 1000,
            temperature: float = 0.7
    ) -> Dict[str, Any]:
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.model,
                "prompt": text,
                "context": context,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "timestamp": datetime.now().isoformat()
            }

            async with aiohttp.ClientSession() as session:
                async with session.post(
                        f"{self.base_url}/completions",
                        headers=headers,
                        json=payload
                ) as response:
                    if response.status != 200:
                        raise Exception(f"API Error: {response.status}")
                    return await response.json()

        except Exception as e:
            raise Exception(f"LLaMA Processing Error: {str(e)}")

    async def analyze_cad_requirements(
            self,
            text: str,
            detailed: bool = False
    ) -> Dict[str, Any]:
        try:
            prompt = self._build_cad_prompt(text, detailed)
            response = await self.process_query(prompt)
            return self._process_cad_analysis(response)
        except Exception as e:
            raise Exception(f"CAD Analysis Error: {str(e)}")

    def _build_cad_prompt(self, text: str, detailed: bool) -> str:
        base_prompt = f"Analyze the following CAD design requirements: {text}"
        if detailed:
            base_prompt += "\nProvide detailed analysis including measurements, materials, and constraints."
        return base_prompt

    def _process_cad_analysis(self, response: Dict[str, Any]) -> Dict[str, Any]:
        # Process and structure the response
        return {
            "analysis": response.get("choices", [{}])[0].get("text", ""),
            "confidence": response.get("confidence", 0.0),
            "processed_at": datetime.now().isoformat()
        }