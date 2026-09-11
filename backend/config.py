from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Skill Sutra - AI Skill Intelligence Platform"
    API_V1_STR: str = "/api"
    DATABASE_URL: Optional[str] = "sqlite:///./skillsutra.db"
    GROQ_API_KEY: Optional[str] = None
    SECRET_KEY: str = "skill-sutra-national-cadre-secret-key-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
