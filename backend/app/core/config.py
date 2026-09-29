import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "Spelloria Patisserie API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "change_this_to_a_super_secret_64_character_hex_string_for_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours in dev, 15m in prod
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALGORITHM: str = "HS256"

    # PostgreSQL Database URL
    DATABASE_URL: str = "postgresql+asyncpg://spelloria_user:change_me_in_production@localhost:5432/spelloria_db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://spelloria.com",
    ]

    # File Storage
    STORAGE_PROVIDER: str = "local" # "local" or "s3"
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "static", "uploads")
    STATIC_URL_PREFIX: str = "/static/uploads"

    # Initial Admin Seed
    FIRST_SUPERUSER_EMAIL: str = "admin@spelloria.com"
    FIRST_SUPERUSER_PASSWORD: str = "ChangeMeInProduction2026!"
    FIRST_SUPERUSER_FULLNAME: str = "Ameen Rahman"

settings = Settings()
