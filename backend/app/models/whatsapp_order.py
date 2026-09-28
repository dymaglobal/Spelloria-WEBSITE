import uuid
import enum
from typing import Optional
from decimal import Decimal
from sqlalchemy import String, Text, Numeric, Integer, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class OrderStatus(str, enum.Enum):
    INITIATED = "INITIATED"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    FULFILLED = "FULFILLED"

class WhatsAppOrder(Base, TimestampMixin):
    __tablename__ = "whatsapp_orders"

    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    weight_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    generated_payload: Mapped[str] = mapped_column(Text, nullable=False)
    client_ip: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    user_agent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    referrer: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"),
        default=OrderStatus.INITIATED,
        nullable=False,
        index=True
    )
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    product = relationship("Product", back_populates="whatsapp_orders")
