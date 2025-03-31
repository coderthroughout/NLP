import re
from typing import Any, Dict, List, Optional
import json
from datetime import datetime
import uuid
import hashlib


class Helper:
    @staticmethod
    def generate_unique_id(prefix: str = "") -> str:
        unique_id = str(uuid.uuid4())
        return f"{prefix}_{unique_id}" if prefix else unique_id

    @staticmethod
    def format_timestamp(dt: Optional[datetime] = None, format: str = "iso") -> str:
        if not dt:
            dt = datetime.now()
        if format == "iso":
            return dt.isoformat()
        elif format == "unix":
            return str(int(dt.timestamp()))
        return dt.strftime(format)

    @staticmethod
    def parse_json_safely(json_str: str, default: Dict = None) -> Dict[str, Any]:
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            return default if default is not None else {}

    @staticmethod
    def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
        if chunk_size < 1:
            raise ValueError("Chunk size must be positive")
        return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

    @staticmethod
    def clean_text(text: str, remove_special_chars: bool = False) -> str:
        cleaned = text.strip().lower()
        if remove_special_chars:
            cleaned = re.sub(r'[^a-zA-Z0-9\s]', '', cleaned)
        return cleaned

    @staticmethod
    def format_file_size(size_bytes: int, precision: int = 2) -> str:
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size_bytes < 1024:
                return f"{size_bytes:.{precision}f}{unit}"
            size_bytes /= 1024
        return f"{size_bytes:.{precision}f}PB"

    @staticmethod
    def generate_hash(data: str, algorithm: str = 'sha256') -> str:
        hash_obj = hashlib.new(algorithm)
        hash_obj.update(data.encode())
        return hash_obj.hexdigest()
