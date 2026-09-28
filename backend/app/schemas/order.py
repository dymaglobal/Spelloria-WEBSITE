import uuid
from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field
from app.models.whatsapp_order import OrderStatus

class WhatsAppOrderTrackRequest(BaseModel):
    product_id: Optional[uuid.UUID] = None
    product_name: str
    unit_price: Decimal = Field(ge=0)
    weight_label: Optional[str] = None
    quantity: int = Field(default=1, ge=1)
    product_slug: Optional[str] = None
    referrer: Optional[str] = None

class WhatsAppOrderTrackResponse(BaseModel):
    order_id: uuid.UUID
    whatsapp_url: str

class WhatsAppOrderUpdateStatus(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None

class WhatsAppOrderResponse(BaseModel):
    id: uuid.UUID
    product_id: Optional[uuid.UUID] = None
    product_name: str
    unit_price: Decimal
    weight_label: Optional[str] = None
    quantity: int
    generated_payload: str
    client_ip: Optional[str] = None
    status: OrderStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
