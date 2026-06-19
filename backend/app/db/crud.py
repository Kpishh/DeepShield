from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Prediction

async def save_prediction(db: AsyncSession, filename: str, media_type: str,
                          prediction: str, confidence: float, heatmap_path: str = None):
    record = Prediction(
        filename=filename,
        media_type=media_type,
        prediction=prediction,
        confidence=confidence,
        heatmap_path=heatmap_path,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record

async def get_predictions(db: AsyncSession, limit: int = 20):
    result = await db.execute(
        select(Prediction).order_by(Prediction.created_at.desc()).limit(limit)
    )
    return result.scalars().all()