import uuid
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, Field
from app.schemas.media import MediaResponse
from app.schemas.category import CategoryResponse

class ProductImageItem(BaseModel):
    id: uuid.UUID
    media_id: uuid.UUID
    display_order: int
    is_featured: bool
    media: Optional[MediaResponse] = None

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    price: Decimal = Field(ge=0)
    discount_price: Optional[Decimal] = Field(default=None, ge=0)
    weight_grams: Optional[int] = Field(default=None, gt=0)
    category_id: uuid.UUID
    featured: bool = False
    best_seller: bool = False
    available: bool = True
    ingredients: List[str] = []
    allergens: List[str] = []
    display_order: int = 0

class ProductCreate(ProductBase):
    thumbnail_image_id: Optional[uuid.UUID] = None
    cover_image_id: Optional[uuid.UUID] = None
    gallery_media_ids: List[uuid.UUID] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    price: Optional[Decimal] = Field(default=None, ge=0)
    discount_price: Optional[Decimal] = Field(default=None, ge=0)
    weight_grams: Optional[int] = Field(default=None, gt=0)
    category_id: Optional[uuid.UUID] = None
    featured: Optional[bool] = None
    best_seller: Optional[bool] = None
    available: Optional[bool] = None
    thumbnail_image_id: Optional[uuid.UUID] = None
    cover_image_id: Optional[uuid.UUID] = None
    ingredients: Optional[List[str]] = None
    allergens: Optional[List[str]] = None
    display_order: Optional[int] = None
    gallery_media_ids: Optional[List[uuid.UUID]] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    thumbnail_image_id: Optional[uuid.UUID] = None
    cover_image_id: Optional[uuid.UUID] = None
    thumbnail_image: Optional[MediaResponse] = None
    cover_image: Optional[MediaResponse] = None
    gallery_images: List[ProductImageItem] = []
    category: Optional[CategoryResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
