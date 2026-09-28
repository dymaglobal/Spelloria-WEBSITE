import urllib.parse
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.api.deps import get_db, get_current_active_admin
from app.models.whatsapp_order import WhatsAppOrder, OrderStatus
from app.models.website_settings import WebsiteSettings
from app.schemas.order import (
    WhatsAppOrderTrackRequest,
    WhatsAppOrderTrackResponse,
    WhatsAppOrderResponse,
    WhatsAppOrderUpdateStatus,
)
from app.schemas.common import PaginatedResponse
from app.core.exceptions import EntityNotFoundException

router = APIRouter()

@router.post("/track", response_model=WhatsAppOrderTrackResponse)
async def track_order_intent(
    order_in: WhatsAppOrderTrackRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    # Fetch website settings for WhatsApp number and template
    settings_res = await db.execute(select(WebsiteSettings).where(WebsiteSettings.id == 1))
    site_settings = settings_res.scalar_one_or_none()
    
    whatsapp_number = site_settings.whatsapp_number if site_settings else "+919876543210"
    whatsapp_template = site_settings.whatsapp_template if site_settings else (
        "Hello Spelloria,\n\nI would like to order:\n\nProduct: {{product_name}}\nWeight: {{weight}}\nPrice: {{price}}\nQuantity: {{quantity}}\nProduct Link: {{url}}\n\nPlease assist me."
    )

    clean_number = "".join(filter(str.isdigit, whatsapp_number))
    weight = order_in.weight_label if order_in.weight_label else "Standard Portion"
    product_url = f"{request.headers.get('origin', 'https://spelloria.com')}/product/{order_in.product_slug or ''}"

    # Interpolate template
    message_text = whatsapp_template
    message_text = message_text.replace("{{product_name}}", order_in.product_name)
    message_text = message_text.replace("{{weight}}", weight)
    formatted_price = f"₹{int(order_in.unit_price):,}" if float(order_in.unit_price).is_integer() else f"₹{order_in.unit_price:,.2f}"
    message_text = message_text.replace("{{price}}", formatted_price)
    message_text = message_text.replace("{{quantity}}", str(order_in.quantity))
    message_text = message_text.replace("{{url}}", product_url)

    # Record lead in database
    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    order_record = WhatsAppOrder(
        product_id=order_in.product_id,
        product_name=order_in.product_name,
        unit_price=order_in.unit_price,
        weight_label=order_in.weight_label,
        quantity=order_in.quantity,
        generated_payload=message_text,
        client_ip=client_ip,
        user_agent=user_agent,
        referrer=order_in.referrer,
        status=OrderStatus.INITIATED,
    )
    db.add(order_record)
    await db.commit()
    await db.refresh(order_record)

    encoded_text = urllib.parse.quote(message_text)
    whatsapp_url = f"https://wa.me/{clean_number}?text={encoded_text}"

    return WhatsAppOrderTrackResponse(
        order_id=order_record.id,
        whatsapp_url=whatsapp_url
    )

@router.get("", response_model=PaginatedResponse[WhatsAppOrderResponse])
async def list_orders(
    status_filter: Optional[OrderStatus] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    query = select(WhatsAppOrder).order_by(WhatsAppOrder.created_at.desc())
    if status_filter:
        query = query.where(WhatsAppOrder.status == status_filter)

    count_query = select(func.count(WhatsAppOrder.id))
    if status_filter:
        count_query = count_query.where(WhatsAppOrder.status == status_filter)
    total = (await db.execute(count_query)).scalar_one()

    query = query.offset((page - 1) * page_size).limit(page_size)
    items = (await db.execute(query)).scalars().all()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.patch("/{order_id}/status", response_model=WhatsAppOrderResponse)
async def update_order_status(
    order_id: str,
    status_in: WhatsAppOrderUpdateStatus,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    result = await db.execute(select(WhatsAppOrder).where(WhatsAppOrder.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise EntityNotFoundException("Order", order_id)

    order.status = status_in.status
    if status_in.notes is not None:
        order.notes = status_in.notes

    await db.commit()
    await db.refresh(order)
    return order
