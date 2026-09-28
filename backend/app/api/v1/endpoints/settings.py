from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, get_current_active_admin, get_current_super_admin
from app.models.website_settings import WebsiteSettings
from app.schemas.settings import (
    WebsiteSettingsPublicResponse,
    WebsiteSettingsAdminResponse,
    WebsiteSettingsUpdate,
)

router = APIRouter()

async def get_or_create_settings(db: AsyncSession) -> WebsiteSettings:
    result = await db.execute(
        select(WebsiteSettings)
        .options(
            selectinload(WebsiteSettings.logo),
            selectinload(WebsiteSettings.favicon)
        )
        .where(WebsiteSettings.id == 1)
    )
    settings_obj = result.scalar_one_or_none()
    if not settings_obj:
        settings_obj = WebsiteSettings(id=1)
        db.add(settings_obj)
        await db.commit()
        await db.refresh(settings_obj)
    return settings_obj

@router.get("/public", response_model=WebsiteSettingsPublicResponse)
async def get_public_settings(db: AsyncSession = Depends(get_db)):
    return await get_or_create_settings(db)

@router.get("/admin", response_model=WebsiteSettingsAdminResponse)
async def get_admin_settings(
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return await get_or_create_settings(db)

@router.put("/admin", response_model=WebsiteSettingsAdminResponse)
async def update_settings(
    settings_in: WebsiteSettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_super_admin),
):
    settings_obj = await get_or_create_settings(db)
    update_data = settings_in.model_dump(exclude_unset=True)

    for field, val in update_data.items():
        setattr(settings_obj, field, val)

    await db.commit()
    return await get_or_create_settings(db)
