from typing import Dict, Any
from PIL import Image
import io


class ImageAnalysis:
    def __init__(self, description: str, metadata: Dict[str, Any]):
        self.description = description
        self.metadata = metadata


class ImageProcessor:
    async def analyze(
            self,
            image_data: bytes,
            analysis_type: str = "basic"
    ) -> ImageAnalysis:
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))

            # Extract basic image metadata
            metadata = {
                "format": image.format,
                "size": image.size,
                "mode": image.mode,
                "analysis_type": analysis_type
            }

            # Generate basic description
            description = f"Image of type {image.format} with dimensions {image.size}"

            return ImageAnalysis(
                description=description,
                metadata=metadata
            )
        except Exception as e:
            raise Exception(f"Image processing error: {str(e)}")