import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.routes import predict, history
from app.db.database import create_tables
from app.core.model_loader import load_model

os.makedirs("static/heatmaps", exist_ok=True)
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("ml/models/saved", exist_ok=True)



app = FastAPI(
    title="DeepShield API",
    description="AI-Generated Media Detection System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://deepshield-nine.vercel.app/",
    "https://huggingface.co",
    "https://your-username-deepshield.hf.space",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def startup():
    # Download model if not present
    from download_model import download_if_needed
    download_if_needed()
    await create_tables()
    load_model()
    print("✅ DeepShield API ready!")

app.include_router(predict.router, prefix="/api/v1", tags=["Prediction"])
app.include_router(history.router, prefix="/api/v1", tags=["History"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "DeepShield"}