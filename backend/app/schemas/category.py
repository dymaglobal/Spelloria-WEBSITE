import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.media import MediaResponse

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int = 0
    is_active: bool = True

class CategoryCreate(CategoryBase):
    banner_image_id: Optional[uuid.UUID] = None
    thumbnail_id: Optional[uuid.UUID] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    banner_image_id: Optional[uuid.UUID] = None
    thumbnail_id: Optional[uuid.UUID] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class CategoryResponse(CategoryBase):
    id: uuid.UUID
    banner_image_id: Optional[uuid.UUID] = None
    thumbnail_id: Optional[uuid.UUID] = None
    banner_image: Optional[MediaResponse] = None
    thumbnail: Optional[MediaResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
