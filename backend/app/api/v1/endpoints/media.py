import os
import uuid
import aiofiles
from typing import Optional
from PIL import Image
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.api.deps import get_db, get_current_active_admin
from app.core.config import settings
from app.models.media_library import MediaLibrary
from app.schemas.media import MediaResponse, MediaUpdate
from app.schemas.common import PaginatedResponse
from app.core.exceptions import EntityNotFoundException

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/gif",
}

@router.get("", response_model=PaginatedResponse[MediaResponse])
async def list_media(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    query = select(MediaLibrary).order_by(MediaLibrary.created_at.desc())
    if search:
        query = query.where(or_(
            MediaLibrary.filename.ilike(f"%{search}%"),
            MediaLibrary.alt_text.ilike(f"%{search}%")
        ))

    # Total count
    count_query = select(func.count(MediaLibrary.id))
    if search:
        count_query = count_query.where(or_(
            MediaLibrary.filename.ilike(f"%{search}%"),
            MediaLibrary.alt_text.ilike(f"%{search}%")
        ))
    total = (await db.execute(count_query)).scalar_one()

    # Pagination
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

@router.post("/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    alt_text: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed types: JPEG, PNG, WebP, SVG, GIF."
        )

    ext = os.path.splitext(file.filename or "")[1].lower()
    if not ext:
        ext = ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(settings.UPLOAD_DIR, "original", unique_filename)

    file_bytes = await file.read()
    file_size = len(file_bytes)

    # Save to disk
    async with aiofiles.open(target_path, "wb") as f:
        await f.write(file_bytes)

    # Detect dimensions
    width_px = None
    height_px = None
    if file.content_type != "image/svg+xml":
        try:
            with Image.open(target_path) as img:
                width_px, height_px = img.size
        except Exception:
            pass

    public_url = f"{settings.STATIC_URL_PREFIX}/original/{unique_filename}"

    media_record = MediaLibrary(
        filename=file.filename or unique_filename,
        stored_name=unique_filename,
        mime_type=file.content_type or "application/octet-stream",
        file_size_bytes=file_size,
        width_px=width_px,
        height_px=height_px,
        storage_provider="local",
        public_url=public_url,
        alt_text=alt_text or file.filename,
        uploader_id=current_admin.id,
    )
    db.add(media_record)
    await db.commit()
    await db.refresh(media_record)

    return media_record

@router.put("/{media_id}", response_model=MediaResponse)
async def update_media(
    media_id: uuid.UUID,
    media_in: MediaUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    result = await db.execute(select(MediaLibrary).where(MediaLibrary.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise EntityNotFoundException("Media", str(media_id))

    if media_in.alt_text is not None:
        media.alt_text = media_in.alt_text
    await db.commit()
    await db.refresh(media)
    return media

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    result = await db.execute(select(MediaLibrary).where(MediaLibrary.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise EntityNotFoundException("Media", str(media_id))

    # Remove file from disk
    file_path = os.path.join(settings.UPLOAD_DIR, "original", media.stored_name)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
        except OSError:
            pass

    await db.delete(media)
    await db.commit()
