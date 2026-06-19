import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from app.config import settings

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/avi", "video/mov", "video/mkv"}

def validate_image(file: UploadFile):
    """Validate image file type and size."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: JPEG, PNG, WEBP"
        )

def validate_video(file: UploadFile):
    """Validate video file type."""
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: MP4, AVI, MOV"
        )

async def save_upload(file: UploadFile, folder: str) -> tuple[str, str]:
    """
    Save uploaded file to disk.
    Returns (file_path, unique_filename)
    """
    os.makedirs(folder, exist_ok=True)

    # Generate unique filename
    ext      = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(folder, filename)

    # Save file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return filepath, filename