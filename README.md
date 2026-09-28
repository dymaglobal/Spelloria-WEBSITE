# Spelloria Patisserie — Enterprise Platform Documentation

**Spelloria Patisserie** is a luxury artisanal bakery and pastry e-commerce application featuring a Single-Source-of-Truth database architecture, real-time administrative synchronization, automated WhatsApp order dispatch, and high-performance server-rendered storefront.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │          PostgreSQL Database          │
                      │       (Single Source of Truth)        │
                      └──────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Next.js 15 Frontend    │                   │   FastAPI Python Backend  │
   │  • App Router (SSR/SSG)   │                   │  • Async SQLAlchemy 2.0   │
   │  • Admin Control Center   │                   │  • Alembic Migrations     │
   │  • 100% DB Synchronization│                   │  • Containerized Micro-API│
   │  • Direct WhatsApp Orders │                   │  • JWT Auth & PBKDF2/HMAC │
   └───────────────────────────┘                   └───────────────────────────┘
```

---

## Key Highlights & Enterprise Features

1. **Single Source of Truth Data Architecture**:
   - Zero hardcoded mock arrays.
   - All product edits, creations, deletions, and categories instantly update the database and reflect across storefronts and admin views.
   - Built-in Sync Engine (`/admin/sync`) validating 100% parity across products, categories, slugs, and image assets.

2. **Indian Market Optimization (INR / ₹)**:
   - 100% compliant with Indian Rupee formatting (`₹`).
   - All weight variants, product prices, order summaries, and WhatsApp messages formatted cleanly in INR.

3. **Performance & Security Hardened**:
   - Next.js 15 App Router with Turbopack, React 19, and Tailwind CSS v4.
   - Security Headers pre-configured (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`).
   - Custom luxury-styled Error Boundaries (`error.tsx`, `global-error.tsx`) and 404 Not Found handling.
   - Secure timing-safe authentication (`crypto.timingSafeEqual`) and PBKDF2 with SHA-512 password hashing.

4. **Brand Design System**:
   - Luxury bakery aesthetic with curated palette: Dark Purple (`#35063D`), Burgundy (`#6d2842`), Terracotta (`#D27D46`), and Warm Cream (`#faf8f5`).
   - Homepage: Cinematic transparent header with scroll transitions.
   - Inner Pages: High-contrast solid white header with crisp navigation and colored logo.

---

## Clean Folder Structure

```text
├── docker-compose.yml          # Turnkey full-stack container orchestration
├── backend/                    # FastAPI micro-service engine
│   ├── app/
│   │   ├── api/v1/endpoints/   # Auth, Categories, Products, Media, Settings, Orders
│   │   ├── core/               # App config, database session, security, exceptions
│   │   ├── models/             # SQLAlchemy 2.0 ORM models
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── main.py             # ASGI entrypoint with health check & CORS
│   ├── alembic/                # Database migrations
│   ├── scripts/seed.py         # Initial database seeder
│   └── requirements.txt        # Python 3.11+ dependencies
└── frontend/                   # Next.js 15 App Router application
    ├── data/db.json            # Master JSON database (Single Source of Truth)
    ├── public/                 # Optimized static assets & brand photography
    └── src/
        ├── app/                # 30 production routes (Storefront & Admin)
        │   ├── admin/          # Products, Categories, Orders, Media, Settings, Sync
        │   ├── api/            # Internal API engine & sync routes
        │   ├── category/       # Dynamic category routes with Hero showcase
        │   ├── product/        # Dynamic product pages with weight selection
        │   ├── error.tsx       # Luxury error boundary
        │   ├── not-found.tsx   # Custom 404 handler
        │   ├── robots.ts       # Dynamic SEO crawlers configuration
        │   └── sitemap.ts      # Dynamic search engine sitemap
        ├── components/         # Clean modular components (cards, home, layout, product, etc.)
        ├── lib/                # Database manager, auth utils, currency formatters
        ├── store/              # Zustand global client state
        └── types/              # Full TypeScript domain definitions
```

---

## Quick Start & Deployment

### Option 1: Docker Compose (Full-Stack Automated)

Run all services (PostgreSQL + FastAPI + Next.js):
```bash
docker compose up -d --build
```
- Storefront: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Backend API Docs: `http://localhost:8000/api/v1/docs`

### Option 2: Local Development

#### 1. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.

#### 2. Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/seed.py
uvicorn app.main:app --reload --port 8000
```
Runs at `http://localhost:8000`.

---

## Admin Credentials

- **Username / Email:** `Spelloria` or `admin@spelloria.com`
- **Password:** `ADMIN@462`
- **Session Duration:** 7 days with persistent tamper-proof HMAC tokens

---

## Verification & Health Check

- Frontend Production Build: `cd frontend && npm run build` (30/30 routes compiled cleanly)
- Backend Health Check: `curl http://localhost:8000/health` (HTTP 200 OK)
- Single Source Parity: `curl http://localhost:3000/api/admin/sync` (`100% SYNCHRONIZED`)
