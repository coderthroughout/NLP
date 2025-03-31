from typing import List, Optional, Dict, Any, Tuple
import re
from pathlib import Path


class Validator:
    @staticmethod
    def validate_file_type(filename: str, allowed_extensions: List[str]) -> Dict[str, Any]:
        extension = Path(filename).suffix.lower()[1:]
        is_valid = extension in allowed_extensions
        return {
            "is_valid": is_valid,
            "extension": extension,
            "allowed": allowed_extensions,
            "message": f"Invalid file type: {extension}" if not is_valid else "Valid file type"
        }

    @staticmethod
    def validate_file_size(file_size: int, max_size: int) -> Dict[str, Any]:
        is_valid = file_size <= max_size
        return {
            "is_valid": is_valid,
            "size": file_size,
            "max_size": max_size,
            "message": f"File size exceeds {max_size} bytes" if not is_valid else "Valid file size"
        }

    @staticmethod
    def validate_email(email: str) -> Dict[str, Any]:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        is_valid = bool(re.match(pattern, email))
        return {
            "is_valid": is_valid,
            "email": email,
            "message": "Invalid email format" if not is_valid else "Valid email"
        }

    @staticmethod
    def validate_api_key(api_key: str, min_length: int = 32) -> Dict[str, Any]:
        is_valid = bool(api_key and len(api_key) >= min_length)
        return {
            "is_valid": is_valid,
            "length": len(api_key) if api_key else 0,
            "min_length": min_length,
            "message": f"API key must be at least {min_length} characters" if not is_valid else "Valid API key"
        }

    @staticmethod
    def validate_cad_parameters(parameters: dict) -> Dict[str, Any]:
        required_fields = ['dimensions', 'material']
        missing_fields = [field for field in required_fields if field not in parameters]

        if missing_fields:
            return {
                "is_valid": False,
                "missing_fields": missing_fields,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }

        if not isinstance(parameters['dimensions'], dict):
            return {
                "is_valid": False,
                "message": "Dimensions must be a dictionary"
            }

        return {
            "is_valid": True,
            "message": "Valid CAD parameters"
        }