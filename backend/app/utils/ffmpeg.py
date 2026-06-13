import subprocess
import json
import logging
import os
from typing import Dict, Any, Optional

logger = logging.getLogger("app.utils.ffmpeg")

def get_media_metadata(file_path: str) -> Optional[Dict[str, Any]]:
    """
    Runs ffprobe on the input file to extract format and stream metadata.
    Returns parsed dictionary or None if it fails.
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None

    cmd = [
        "ffprobe",
        "-v", "quiet",
        "-print_format", "json",
        "-show_format",
        "-show_streams",
        file_path
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        metadata = json.loads(result.stdout)
        return metadata
    except subprocess.CalledProcessError as e:
        logger.error(f"FFprobe command failed for {file_path}: {e.stderr}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse FFprobe JSON output: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error running ffprobe on {file_path}: {e}")
        return None

def validate_video_file(file_path: str) -> bool:
    """
    Checks that the file contains valid video metadata (Bitrate, Framerate, Duration).
    """
    metadata = get_media_metadata(file_path)
    if not metadata:
        return False

    # Check that it has a format and streams
    fmt = metadata.get("format", {})
    streams = metadata.get("streams", [])

    duration = float(fmt.get("duration", 0))
    bit_rate = float(fmt.get("bit_rate", 0))

    has_video = any(s.get("codec_type") == "video" for s in streams)

    if duration > 0 and bit_rate > 0 and has_video:
        logger.info(f"Video file {file_path} validated. Duration: {duration}s, Bitrate: {bit_rate}bps.")
        return True

    logger.warning(f"Video validation failed for {file_path}. Duration: {duration}, Bitrate: {bit_rate}, HasVideo: {has_video}")
    return False

def extract_audio(video_path: str, audio_output_path: str, bitrate_kbps: int = 128) -> bool:
    """
    Converts video file to lightweight MP3 audio at the specified bitrate.
    """
    if not os.path.exists(video_path):
        logger.error(f"Video source not found: {video_path}")
        return False

    # Create target directory if it doesn't exist
    os.makedirs(os.path.dirname(audio_output_path), exist_ok=True)

    # ffmpeg command to extract audio: -vn disables video, -y overwrites existing
    cmd = [
        "ffmpeg",
        "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "libmp3lame",
        "-ab", f"{bitrate_kbps}k",
        "-ar", "44100", # standard sample rate
        audio_output_path
    ]

    try:
        logger.info(f"Extracting audio from {video_path} to {audio_output_path}...")
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        logger.info(f"Audio extraction completed: {audio_output_path}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg audio extraction failed: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during audio extraction: {e}")
        return False
