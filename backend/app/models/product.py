import uuid
from typing import Optional, List, Any
from decimal import Decimal
from sqlalchemy import String, Text, Numeric, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class Product(Base, TimestampMixin):
    __tablename__ = "products"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(250), unique=True, index=True, nullable=False)
    short_description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    full_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    discount_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    weight_grams: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    best_seller: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="Available", nullable=False, index=True) # Available, Out of Stock, Seasonal, Limited Edition, Best Seller, New Arrival
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    weight_options: Mapped[List[dict]] = mapped_column(JSONB, default=list, nullable=False) # [{"weight": "500g", "price": 26.0, "available": true}]
    thumbnail_image_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    cover_image_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("media_library.id", ondelete="SET NULL"),
        nullable=True
    )
    ingredients: Mapped[List[str]] = mapped_column(JSONB, default=list, nullable=False)
    allergens: Mapped[List[str]] = mapped_column(JSONB, default=list, nullable=False)
    tags: Mapped[List[str]] = mapped_column(JSONB, default=list, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    shelf_life: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    serving_info: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    views_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)

    # Relationships
    category = relationship("Category", back_populates="products")
    thumbnail_image = relationship("MediaLibrary", foreign_keys=[thumbnail_image_id])
    cover_image = relationship("MediaLibrary", foreign_keys=[cover_image_id])
    gallery_images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.display_order"
    )
    whatsapp_orders = relationship("WhatsAppOrder", back_populates="product")
