import uuid
from typing import Optional
from sqlalchemy import String, Integer, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class MediaLibrary(Base, TimestampMixin):
    __tablename__ = "media_library"

    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    width_px: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height_px: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    storage_provider: Mapped[str] = mapped_column(String(50), default="local", nullable=False)
    public_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    uploader_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    # Relationships
    uploader = relationship("User", foreign_keys=[uploader_id])
    product_images = relationship("ProductImage", back_populates="media", cascade="all, delete-orphan")
