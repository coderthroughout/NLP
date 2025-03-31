import assemblyai as aai
from typing import Optional, Dict, Any
import asyncio
import tempfile
import os
from pydub import AudioSegment
from app.core.config import settings


class VoiceProcessor:
    def __init__(self):
        self.api_key = settings.ASSEMBLYAI_API_KEY
        aai.settings.api_key = self.api_key
        self.supported_formats = ["wav", "mp3", "ogg"]
        self.max_duration = 300  # 5 minutes in seconds
        self.max_file_size = 100 * 1024 * 1024  # 100MB

    async def transcribe(
            self,
            audio_data: bytes,
            language: str = "en",
            enhance_audio: bool = False
    ) -> Dict[str, Any]:
        try:
            # Validate audio before processing
            validation = await self.validate_audio(audio_data)
            if not validation["is_valid"]:
                raise ValueError(validation["message"])

            transcriber = aai.Transcriber()
            config = aai.TranscriptionConfig(
                language_code=language,
                punctuate=True,
                format_text=True,
                audio_enhancement=enhance_audio,
                disfluencies=False,
                sentiment_analysis=True
            )

            result = await self._process_audio(audio_data, transcriber, config)

            if not result:
                raise ValueError("Transcription failed")

            return {
                "text": result.text,
                "confidence": result.confidence,
                "words": result.words,
                "sentiment": result.sentiment_analysis,
                "language": language,
                "duration": result.audio_duration
            }

        except Exception as e:
            raise Exception(f"Voice Processing Error: {str(e)}")

    async def _process_audio(
            self,
            audio_data: bytes,
            transcriber: aai.Transcriber,
            config: aai.TranscriptionConfig
    ) -> Optional[aai.Transcript]:
        try:
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file.flush()

                # Convert audio to compatible format if needed
                audio = AudioSegment.from_file(temp_file.name)
                if audio.frame_rate != 44100:
                    audio = audio.set_frame_rate(44100)
                audio.export(temp_file.name, format='wav')

                # Process audio using AssemblyAI
                transcript = await asyncio.to_thread(
                    transcriber.transcribe,
                    temp_file.name,
                    config=config
                )

            os.unlink(temp_file.name)
            return transcript

        except Exception as e:
            raise Exception(f"Audio Processing Error: {str(e)}")

    async def validate_audio(self, audio_data: bytes) -> Dict[str, Any]:
        validation_result = {
            "is_valid": True,
            "message": "Audio file is valid",
            "details": {}
        }

        try:
            # Check file size
            if len(audio_data) > self.max_file_size:
                return {
                    "is_valid": False,
                    "message": f"File size exceeds {self.max_file_size / 1024 / 1024}MB limit",
                    "details": {"size": len(audio_data)}
                }

            # Check audio format and duration
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file.flush()

                audio = AudioSegment.from_file(temp_file.name)
                duration = len(audio) / 1000  # Convert to seconds

                validation_result["details"] = {
                    "duration": duration,
                    "channels": audio.channels,
                    "sample_width": audio.sample_width,
                    "frame_rate": audio.frame_rate
                }

                if duration > self.max_duration:
                    validation_result.update({
                        "is_valid": False,
                        "message": f"Audio duration exceeds {self.max_duration} seconds"
                    })

            os.unlink(temp_file.name)
            return validation_result

        except Exception as e:
            return {
                "is_valid": False,
                "message": f"Invalid audio file: {str(e)}",
                "details": {}
            }

    async def get_audio_info(self, audio_data: bytes) -> Dict[str, Any]:
        try:
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file.flush()

                audio = AudioSegment.from_file(temp_file.name)

                info = {
                    "duration": len(audio) / 1000,
                    "channels": audio.channels,
                    "sample_width": audio.sample_width,
                    "frame_rate": audio.frame_rate,
                    "max_amplitude": audio.max,
                    "rms": audio.rms
                }

            os.unlink(temp_file.name)
            return info

        except Exception as e:
            raise Exception(f"Error getting audio info: {str(e)}")