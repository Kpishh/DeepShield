from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "DeepShield"
    DEBUG: bool = True
    MODEL_PATH: str = "../ml/models/saved/efficientnet_b4_best.pth"
    MAX_FILE_SIZE_MB: int = 10
    DATABASE_URL: str = "sqlite+aiosqlite:///./deepshield.db"
    ALLOWED_ORIGINS: str = "http://localhost:5173"
    UPLOAD_DIR: str = "static/uploads"
    HEATMAP_DIR: str = "static/heatmaps"

    class Config:
        env_file = ".env"

settings = Settings()