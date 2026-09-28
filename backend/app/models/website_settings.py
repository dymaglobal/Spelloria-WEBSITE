import uuid
from typing import Optional
from sqlalchemy import SmallInteger, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class WebsiteSettings(Base, TimestampMixin):
    __tablename__ = "website_settings"

    # Enforce singleton pattern with fixed ID 1
    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True, default=1)
    brand_name: Mapped[str] = mapped_column(String(150), default="Spelloria Patisserie", nullable=False)
    logo_media_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    favicon_media_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    email: Mapped[str] = mapped_column(String(255), default="hello@spelloria.in", nullable=False)
    phone: Mapped[str] = mapped_column(String(50), default="+91 98765 43210", nullable=False)
    whatsapp_number: Mapped[str] = mapped_column(String(50), default="+919876543210", nullable=False)
    whatsapp_template: Mapped[str] = mapped_column(
        Text,
        default="Hello Spelloria,\n\nI would like to order:\n\nProduct: {{product_name}}\nWeight: {{weight}}\nPrice: {{price}}\nQuantity: {{quantity}}\nProduct Link: {{url}}\n\nPlease assist me.",
        nullable=False
    )
    address: Mapped[str] = mapped_column(Text, default="Kozhikode, Kerala, India", nullable=False)
    instagram_url: Mapped[Optional[str]] = mapped_column(String(500), default="https://instagram.com/spelloria", nullable=True)
    facebook_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    youtube_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    meta_title: Mapped[str] = mapped_column(
        String(200),
        default="Spelloria Patisserie | Artisanal French Bakery & Luxury Desserts",
        nullable=False
    )
    meta_description: Mapped[str] = mapped_column(
        Text,
        default="Artisanal cakes, pastries, and French sweet treats crafted with love. Order freshly baked luxury creations on WhatsApp.",
        nullable=False
    )
    google_analytics_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    meta_pixel_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Relationships
    logo = relationship("MediaLibrary", foreign_keys=[logo_media_id])
    favicon = relationship("MediaLibrary", foreign_keys=[favicon_media_id])
