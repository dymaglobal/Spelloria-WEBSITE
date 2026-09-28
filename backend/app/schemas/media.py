import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class MediaBase(BaseModel):
    alt_text: Optional[str] = None

class MediaCreate(MediaBase):
    pass

class MediaResponse(BaseModel):
    id: uuid.UUID
    filename: str
    stored_name: str
    mime_type: str
    file_size_bytes: int
    width_px: Optional[int] = None
    height_px: Optional[int] = None
    storage_provider: str
    public_url: str
    alt_text: Optional[str] = None
    uploader_id: Optional[uuid.UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None
