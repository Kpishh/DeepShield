from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    media_type = Column(String, nullable=False)  # "image" or "video"
    prediction = Column(String, nullable=False)   # "AI-Generated" or "Real"
    confidence = Column(Float, nullable=False)
    heatmap_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())