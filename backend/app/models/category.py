import uuid
from typing import Optional, List
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    banner_image_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    thumbnail_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    banner_image = relationship("MediaLibrary", foreign_keys=[banner_image_id])
    thumbnail = relationship("MediaLibrary", foreign_keys=[thumbnail_id])
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")
