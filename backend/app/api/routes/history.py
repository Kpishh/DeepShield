from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.crud import get_predictions

router = APIRouter()

@router.get("/history")
async def get_history(
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get recent prediction history."""
    records = await get_predictions(db, limit=limit)
    return {
        "total"  : len(records),
        "history": [
            {
                "id"         : r.id,
                "filename"   : r.filename,
                "media_type" : r.media_type,
                "prediction" : r.prediction,
                "confidence" : r.confidence,
                "created_at" : r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]
    }