import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.crud import save_prediction
from app.core.predictor import predict_image as run_predict
from app.utils.file_handler import validate_image, save_upload
from app.config import settings

router = APIRouter()

@router.post("/predict-image")
async def predict_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload an image and get AI vs Real prediction with heatmap.
    """
    # ── Validate ────────────────────────────────────────────
    validate_image(file)

    # ── Save uploaded file ──────────────────────────────────
    filepath, filename = await save_upload(file, settings.UPLOAD_DIR)

    try:
        # ── Run inference + Grad-CAM ────────────────────────
        result = run_predict(filepath)

        # ── Save to database ────────────────────────────────
        record = await save_prediction(
            db=db,
            filename=file.filename,
            media_type="image",
            prediction=result["prediction"],
            confidence=result["confidence"],
            heatmap_path=None   # we return base64 directly
        )

        return {
            "id"         : record.id,
            "filename"   : file.filename,
            "prediction" : result["prediction"],
            "confidence" : result["confidence"],
            "all_probs"  : result["all_probs"],
            "heatmap"    : result["heatmap"],  # base64 string
            "message"    : f"This image is {result['prediction']} "
                           f"with {result['confidence']*100:.1f}% confidence"
        }

    except Exception as e:
        # Clean up uploaded file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict-video")
async def predict_video(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a video — extracts frames and predicts on each.
    """
    from app.utils.video_processor import extract_frames, predict_video_frames
    from app.utils.file_handler import validate_video

    validate_video(file)
    filepath, filename = await save_upload(file, settings.UPLOAD_DIR)

    try:
        result = predict_video_frames(filepath)

        record = await save_prediction(
            db=db,
            filename=file.filename,
            media_type="video",
            prediction=result["prediction"],
            confidence=result["confidence"],
        )

        return {
            "id"            : record.id,
            "filename"      : file.filename,
            "prediction"    : result["prediction"],
            "confidence"    : result["confidence"],
            "frames_analyzed": result["frames_analyzed"],
            "message"       : f"Video is {result['prediction']} "
                              f"with {result['confidence']*100:.1f}% confidence"
        }

    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=str(e))