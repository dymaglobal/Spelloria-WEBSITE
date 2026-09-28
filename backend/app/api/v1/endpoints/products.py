import uuid
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, get_current_active_admin, get_current_super_admin
from app.models.product import Product
from app.models.category import Category
from app.models.product_image import ProductImage
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.common import PaginatedResponse
from app.core.exceptions import EntityNotFoundException, EntityAlreadyExistsException

router = APIRouter()

def product_eager_loader():
    return (
        selectinload(Product.category).selectinload(Category.thumbnail),
        selectinload(Product.thumbnail_image),
        selectinload(Product.cover_image),
        selectinload(Product.gallery_images).selectinload(ProductImage.media),
    )

@router.get("", response_model=PaginatedResponse[ProductResponse])
async def list_products(
    category_slug: Optional[str] = None,
    featured: Optional[bool] = None,
    best_seller: Optional[bool] = None,
    available_only: bool = True,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("display_order", regex="^(display_order|price_asc|price_desc|newest|name)$"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Product).options(*product_eager_loader())

    filters = []
    if available_only:
        filters.append(Product.available == True)
    if featured is not None:
        filters.append(Product.featured == featured)
    if best_seller is not None:
        filters.append(Product.best_seller == best_seller)
    if category_slug:
        cat_result = await db.execute(select(Category.id).where(Category.slug == category_slug))
        cat_id = cat_result.scalar_one_or_none()
        if cat_id:
            filters.append(Product.category_id == cat_id)
        else:
            return PaginatedResponse(items=[], total=0, page=page, page_size=page_size, total_pages=0)
    if search:
        filters.append(or_(
            Product.name.ilike(f"%{search}%"),
            Product.short_description.ilike(f"%{search}%")
        ))

    if filters:
        query = query.where(and_(*filters))

    # Total Count
    count_query = select(func.count(Product.id))
    if filters:
        count_query = count_query.where(and_(*filters))
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Sorting
    if sort_by == "display_order":
        query = query.order_by(Product.display_order.asc(), Product.name.asc())
    elif sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort_by == "name":
        query = query.order_by(Product.name.asc())

    # Pagination
    query = query.offset((page - 1) * page_size).limit(page_size)
    items_result = await db.execute(query)
    items = items_result.scalars().all()

    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .options(*product_eager_loader())
        .where(Product.slug == slug)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise EntityNotFoundException("Product", slug)
    return product

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product_by_id(product_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product)
        .options(*product_eager_loader())
        .where(Product.id == product_id)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise EntityNotFoundException("Product", str(product_id))
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    # Check slug
    existing = await db.execute(select(Product).where(Product.slug == product_in.slug))
    if existing.scalar_one_or_none():
        raise EntityAlreadyExistsException("Product", "slug", product_in.slug)

    product_data = product_in.model_dump(exclude={"gallery_media_ids"})
    product = Product(**product_data)
    db.add(product)
    await db.flush()

    # Add gallery images
    for idx, media_id in enumerate(product_in.gallery_media_ids):
        prod_img = ProductImage(
            product_id=product.id,
            media_id=media_id,
            display_order=idx,
            is_featured=(idx == 0)
        )
        db.add(prod_img)

    await db.commit()
    return await get_product_by_id(product.id, db)

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise EntityNotFoundException("Product", str(product_id))

    update_data = product_in.model_dump(exclude_unset=True, exclude={"gallery_media_ids"})
    if "slug" in update_data and update_data["slug"] != product.slug:
        existing = await db.execute(
            select(Product).where(Product.slug == update_data["slug"], Product.id != product_id)
        )
        if existing.scalar_one_or_none():
            raise EntityAlreadyExistsException("Product", "slug", update_data["slug"])

    for field, val in update_data.items():
        setattr(product, field, val)

    # If gallery images are specified, update them
    if product_in.gallery_media_ids is not None:
        # Clear existing gallery associations
        del_query = select(ProductImage).where(ProductImage.product_id == product_id)
        existing_imgs = (await db.execute(del_query)).scalars().all()
        for img in existing_imgs:
            await db.delete(img)
        await db.flush()

        for idx, media_id in enumerate(product_in.gallery_media_ids):
            db.add(ProductImage(
                product_id=product.id,
                media_id=media_id,
                display_order=idx,
                is_featured=(idx == 0)
            ))

    await db.commit()
    return await get_product_by_id(product.id, db)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_super_admin),
):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise EntityNotFoundException("Product", str(product_id))

    await db.delete(product)
    await db.commit()
