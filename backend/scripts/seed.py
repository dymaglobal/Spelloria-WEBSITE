import asyncio
import uuid
from decimal import Decimal
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.product import Product
from app.models.website_settings import WebsiteSettings

DEFAULT_CATEGORIES = [
    {
        "name": "Cakes",
        "slug": "cakes",
        "description": "Celebration masterpieces and tiered signature creations infused with Parisian elegance.",
        "display_order": 1,
    },
    {
        "name": "Pastries",
        "slug": "pastries",
        "description": "Flaky French viennoiserie, fruit tarts, mille-feuille, and decadent éclairs.",
        "display_order": 2,
    },
    {
        "name": "Cookies",
        "slug": "cookies",
        "description": "Artisanal double chocolate, oat & cranberry, and sablé biscuits baked fresh daily.",
        "display_order": 3,
    },
    {
        "name": "Desserts",
        "slug": "desserts",
        "description": "Velvety mousses, panna cotta, macarons, and artisanal layered dessert cups.",
        "display_order": 4,
    },
    {
        "name": "Cappuccino",
        "slug": "cappuccino",
        "description": "Specialty roast espresso, velvety textured micro-foam, and barista crafted warm pairings.",
        "display_order": 5,
    },
]

SAMPLE_PRODUCTS = [
    {
        "name": "Chocolate Éclair Cake",
        "slug": "chocolate-eclair-cake",
        "short_description": "Rich Belgian chocolate ganache layered with French choux pastry and chantilly cream.",
        "full_description": "Our signature Chocolate Éclair Cake captures the soul of traditional Parisian choux confectionery. Layered with delicate pastry cream infused with Madagascar bourbon vanilla, encased in dark Belgian chocolate mirror glaze.",
        "price": Decimal("28.00"),
        "discount_price": Decimal("25.00"),
        "weight_grams": 750,
        "category_slug": "cakes",
        "featured": True,
        "best_seller": True,
        "ingredients": ["Belgian Dark Chocolate 70%", "French Butter AOP", "Madagascar Vanilla Bean", "Organic Eggs", "Farm Fresh Cream"],
        "allergens": ["Gluten", "Dairy", "Eggs"],
        "display_order": 1,
    },
    {
        "name": "Strawberry Shortcake",
        "slug": "strawberry-shortcake",
        "short_description": "Airy sponge cake layered with fresh alpine strawberries and light vanilla cream.",
        "full_description": "A burst of summery elegance. Light-as-air chiffon sponge soaked in natural strawberry syrup, folded with fresh hand-selected strawberries and whipped double cream.",
        "price": Decimal("32.00"),
        "discount_price": None,
        "weight_grams": 800,
        "category_slug": "cakes",
        "featured": True,
        "best_seller": True,
        "ingredients": ["Alpine Strawberries", "Organic Sponge Flour", "Fresh Vanilla Bean Cream", "Raw Cane Sugar"],
        "allergens": ["Gluten", "Dairy", "Eggs"],
        "display_order": 2,
    },
    {
        "name": "Parisian Tiramisu",
        "slug": "parisian-tiramisu",
        "short_description": "Espresso-soaked ladyfingers folded with rich mascarpone and dusting of Dutch cocoa.",
        "full_description": "Crafted with house-pulled espresso shots and whipped Italian mascarpone, dusted with single-origin Valrhona cocoa powder. Velvety, balanced, and unforgettable.",
        "price": Decimal("22.00"),
        "discount_price": None,
        "weight_grams": 500,
        "category_slug": "desserts",
        "featured": True,
        "best_seller": False,
        "ingredients": ["Artisanal Espresso", "Mascarpone Cream", "Savoiardi Ladyfingers", "Valrhona Cocoa Powder"],
        "allergens": ["Gluten", "Dairy", "Eggs"],
        "display_order": 3,
    },
    {
        "name": "Artisanal Double Chocolate Cookie",
        "slug": "artisanal-double-chocolate-cookie",
        "short_description": "Decadent cookie loaded with melted dark chocolate chunks and a pinch of fleur de sel.",
        "full_description": "Crispy on the edges, molten in the centre. Baked with browned French butter and generous shards of 70% dark chocolate, finished with hand-harvested sea salt flakes.",
        "price": Decimal("4.50"),
        "discount_price": None,
        "weight_grams": 110,
        "category_slug": "cookies",
        "featured": False,
        "best_seller": True,
        "ingredients": ["Browned French Butter", "Belgian Dark Chocolate Chunks", "Organic Cane Sugar", "Fleur de Sel"],
        "allergens": ["Gluten", "Dairy", "Eggs"],
        "display_order": 4,
    },
    {
        "name": "Signature Spelloria Cappuccino",
        "slug": "signature-spelloria-cappuccino",
        "short_description": "Double espresso extraction paired with micro-textured steamed whole milk and cocoa dust.",
        "full_description": "Our house roast espresso blend of Ethiopian and Colombian beans extracted to perfection, topped with silky micro-foam and a dusting of dark cocoa.",
        "price": Decimal("5.00"),
        "discount_price": None,
        "weight_grams": 250,
        "category_slug": "cappuccino",
        "featured": False,
        "best_seller": False,
        "ingredients": ["Specialty Arabica Coffee Beans", "Steamed Whole Milk", "Cocoa Powder"],
        "allergens": ["Dairy"],
        "display_order": 5,
    },
]

async def seed():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with async_session() as session:
        print("🌱 Seeding Database for Spelloria Patisserie...")

        # 1. Super Admin User
        admin_res = await session.execute(
            select(User).where(User.email == settings.FIRST_SUPERUSER_EMAIL)
        )
        if not admin_res.scalar_one_or_none():
            admin_user = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name=settings.FIRST_SUPERUSER_FULLNAME,
                role=UserRole.SUPER_ADMIN,
                is_active=True,
            )
            session.add(admin_user)
            print(f"✅ Created Super Admin: {settings.FIRST_SUPERUSER_EMAIL}")

        # 2. Website Settings Singleton
        settings_res = await session.execute(select(WebsiteSettings).where(WebsiteSettings.id == 1))
        if not settings_res.scalar_one_or_none():
            site_settings = WebsiteSettings(
                id=1,
                brand_name="Spelloria Patisserie",
                email="hello@spelloria.in",
                phone="+91 98765 43210",
                whatsapp_number="+919876543210",
                whatsapp_template="Hello Spelloria,\n\nI would like to order:\n\nProduct: {{product_name}}\nWeight: {{weight}}\nPrice: {{price}}\nQuantity: {{quantity}}\nProduct Link: {{url}}\n\nPlease assist me.",
                address="Kozhikode, Kerala, India",
                instagram_url="https://instagram.com/spelloria",
                meta_title="Spelloria Patisserie | Artisanal French Bakery & Luxury Desserts",
                meta_description="Artisanal cakes, pastries, and French sweet treats crafted with love. Order freshly baked luxury creations on WhatsApp.",
            )
            session.add(site_settings)
            print("✅ Created Website Settings Singleton")

        # 3. Default Categories
        category_map = {}
        for cat_data in DEFAULT_CATEGORIES:
            res = await session.execute(select(Category).where(Category.slug == cat_data["slug"]))
            cat = res.scalar_one_or_none()
            if not cat:
                cat = Category(**cat_data, is_active=True)
                session.add(cat)
                await session.flush()
                print(f"✅ Created Category: {cat.name}")
            category_map[cat.slug] = cat.id

        # 4. Sample Products
        for prod_data in SAMPLE_PRODUCTS:
            cat_slug = prod_data.pop("category_slug")
            cat_id = category_map.get(cat_slug)
            if cat_id:
                res = await session.execute(select(Product).where(Product.slug == prod_data["slug"]))
                if not res.scalar_one_or_none():
                    product = Product(**prod_data, category_id=cat_id, available=True)
                    session.add(product)
                    print(f"✅ Created Product: {product.name}")

        await session.commit()
        print("🎉 Database seeding completed successfully!")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
