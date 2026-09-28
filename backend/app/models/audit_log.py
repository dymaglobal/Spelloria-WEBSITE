import uuid
from typing import Optional, Any
from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class AuditLog(Base, TimestampMixin):
    __tablename__ = "audit_logs"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    action: Mapped[str] = mapped_column(String(50), nullable=False) # CREATE, UPDATE, DELETE, LOGIN
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # PRODUCT, CATEGORY, MEDIA, SETTINGS
    resource_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    changes: Mapped[Optional[Any]] = mapped_column(JSONB, nullable=True) # {"before": {...}, "after": {...}}
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Relationships
    user = relationship("User", back_populates="audit_logs")
