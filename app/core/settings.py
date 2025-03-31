from typing import Dict, Any, Optional
from pydantic import BaseModel


class LogConfig(BaseModel):
    LOGGER_NAME: str = "nlp_cad"
    LOG_FORMAT: str = "%(levelprefix)s | %(asctime)s | %(message)s"
    LOG_LEVEL: str = "DEBUG"

    version: int = 1
    disable_existing_loggers: bool = False

    formatters: Dict[str, Any] = {
        "default": {
            "()": "uvicorn.logging.DefaultFormatter",
            "fmt": LOG_FORMAT,
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    }

    handlers: Dict[str, Any] = {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stderr",
        },
        "file": {
            "formatter": "default",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": "nlp_cad.log",
            "maxBytes": 10000000,  # 10MB
            "backupCount": 5,
        }
    }

    loggers: Dict[str, Any] = {
        LOGGER_NAME: {
            "handlers": ["default", "file"],
            "level": LOG_LEVEL,
            "propagate": False
        }
    }


class APISettings(BaseModel):
    RATE_LIMIT: int = 100
    RATE_LIMIT_PERIOD: int = 3600  # 1 hour
    MAX_REQUEST_SIZE: int = 10 * 1024 * 1024  # 10MB
    TIMEOUT: int = 60  # seconds

    # CAD Processing Settings
    MAX_CAD_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    SUPPORTED_CAD_FORMATS: list = ["obj", "stl", "step", "iges"]

    # Voice Processing Settings
    MAX_AUDIO_LENGTH: int = 300  # seconds
    SUPPORTED_AUDIO_FORMATS: list = ["wav", "mp3", "ogg"]


class GlobalSettings(BaseModel):
    log_config: LogConfig = LogConfig()
    api_settings: APISettings = APISettings()