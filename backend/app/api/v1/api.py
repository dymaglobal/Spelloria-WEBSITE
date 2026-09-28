from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    categories,
    products,
    media,
    settings,
    orders,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(media.router, prefix="/media", tags=["Media Library"])
api_router.include_router(settings.router, prefix="/settings", tags=["Website Settings"])
api_router.include_router(orders.router, prefix="/orders", tags=["WhatsApp Orders"])
