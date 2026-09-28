import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.media import MediaResponse

class WebsiteSettingsBase(BaseModel):
    brand_name: str = "Spelloria Patisserie"
    email: EmailStr = "hello@spelloria.in"
    phone: str = "+91 98765 43210"
    whatsapp_number: str = "+919876543210"
    whatsapp_template: str
    address: str = "Kozhikode, Kerala, India"
    instagram_url: Optional[str] = "https://instagram.com/spelloria"
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    meta_title: str = "Spelloria Patisserie | Artisanal French Bakery & Luxury Desserts"
    meta_description: str = "Artisanal cakes, pastries, and French sweet treats crafted with love. Order freshly baked luxury creations on WhatsApp."

class WebsiteSettingsPublicResponse(WebsiteSettingsBase):
    logo_media_id: Optional[uuid.UUID] = None
    favicon_media_id: Optional[uuid.UUID] = None
    logo: Optional[MediaResponse] = None
    favicon: Optional[MediaResponse] = None

    class Config:
        from_attributes = True

class WebsiteSettingsAdminResponse(WebsiteSettingsPublicResponse):
    google_analytics_id: Optional[str] = None
    meta_pixel_id: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class WebsiteSettingsUpdate(BaseModel):
    brand_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    whatsapp_template: Optional[str] = None
    address: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    youtube_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    google_analytics_id: Optional[str] = None
    meta_pixel_id: Optional[str] = None
    logo_media_id: Optional[uuid.UUID] = None
    favicon_media_id: Optional[uuid.UUID] = None
