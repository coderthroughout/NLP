from pydantic_settings import BaseSettings
from typing import Optional, Dict, Any, List
from functools import lru_cache


class Settings(BaseSettings):
    # Base Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NLP"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # API Keys
    PERPLEXITY_API_KEY: str
    LLAMA_API_KEY: str
    ASSEMBLYAI_API_KEY: str

    # Database
    MONGODB_URL: str
    DATABASE_NAME: str = "nlp_cad_db"

    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:8000",
        "http://localhost:8080"
    ]

    # File Upload Settings
    MAX_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [
        "wav", "mp3", "ogg", "obj", "stl"
    ]

    # Cache Settings
    CACHE_TTL: int = 3600
    CACHE_PREFIX: str = "nlp_cad"

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_origins(self) -> List[str]:
        return self.ALLOWED_ORIGINS


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
