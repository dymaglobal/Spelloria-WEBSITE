import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, get_current_active_admin, get_current_super_admin
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.core.exceptions import EntityNotFoundException, EntityAlreadyExistsException

router = APIRouter()

@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    include_inactive: bool = Query(False, description="Include inactive categories"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Category).options(
        selectinload(Category.banner_image),
        selectinload(Category.thumbnail)
    ).order_by(Category.display_order.asc(), Category.name.asc())

    if not include_inactive:
        query = query.where(Category.is_active == True)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/slug/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category)
        .options(
            selectinload(Category.banner_image),
            selectinload(Category.thumbnail)
        )
        .where(Category.slug == slug)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise EntityNotFoundException("Category", slug)
    return category

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_in: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    # Check slug collision
    existing = await db.execute(select(Category).where(Category.slug == category_in.slug))
    if existing.scalar_one_or_none():
        raise EntityAlreadyExistsException("Category", "slug", category_in.slug)

    category = Category(**category_in.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)

    # Re-fetch with relationships
    return await get_category_by_slug(category.slug, db)

@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: uuid.UUID,
    category_in: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise EntityNotFoundException("Category", str(category_id))

    update_data = category_in.model_dump(exclude_unset=True)
    if "slug" in update_data and update_data["slug"] != category.slug:
        existing = await db.execute(
            select(Category).where(Category.slug == update_data["slug"], Category.id != category_id)
        )
        if existing.scalar_one_or_none():
            raise EntityAlreadyExistsException("Category", "slug", update_data["slug"])

    for field, val in update_data.items():
        setattr(category, field, val)

    await db.commit()
    return await get_category_by_slug(category.slug, db)

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_super_admin),
):
    # Check if products exist in category
    prod_check = await db.execute(
        select(func.count(Product.id)).where(Product.category_id == category_id)
    )
    product_count = prod_check.scalar_one()
    if product_count > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete category: {product_count} products are currently assigned to it."
        )

    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise EntityNotFoundException("Category", str(category_id))

    await db.delete(category)
    await db.commit()
