# Spelloria Patisserie — Luxury Artisanal Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Production Ready](https://img.shields.io/badge/Status-Production_Ready-success)](#deployment-ready)

**Spelloria Patisserie** is a luxury artisanal bakery and pastry platform featuring a Single-Source-of-Truth database architecture, real-time administrative synchronization, automated WhatsApp order dispatch, and a high-performance server-rendered storefront.

---

## 🏛 Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │    Hostinger Cloud Startup Platform   │
                      │        (Node.js 18+ / 20+ / 22+)      │
                      └──────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Next.js 16 Storefront   │                   │    Boutique Admin Engine  │
   │  • App Router (SSR/Turbopack)                  │  • Single Source Parity   │
   │  • 30 Production Routes   │                   │  • Real-time Sync Engine  │
   │  • INR (₹) Formatting     │                   │  • Media Asset Manager    │
   │  • WhatsApp Order Dispatch│                   │  • PBKDF2/HMAC Session Auth│
   └───────────────────────────┘                   └───────────────────────────┘
```

---

## ✨ Key Features & Highlights

1. **Single Source of Truth Database**:
   - Zero hardcoded mock arrays.
   - All product updates, creations, deletions, and categories instantly update the database and reflect across storefronts and admin views.
   - Built-in Sync Engine (`/admin/sync`) validating 100% parity across products, categories, slugs, and image assets.

2. **Indian Market Optimization (INR / ₹)**:
   - Full compliance with Indian Rupee formatting (`₹`).
   - Dynamic weight variants (250g, 500g, 750g, 1kg, etc.), product prices, order summaries, and WhatsApp messages formatted cleanly in INR.

3. **Performance & Security Hardened**:
   - Next.js 16 App Router with Turbopack, React 19, and Tailwind CSS v4.
   - Security Headers pre-configured (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`).
   - Custom luxury-styled Error Boundaries (`error.tsx`, `global-error.tsx`) and 404 Not Found handling.
   - Secure timing-safe authentication (`crypto.timingSafeEqual`) and PBKDF2 with SHA-512 password hashing.

4. **Brand Design System**:
   - Luxury bakery aesthetic with curated palette: Dark Purple (`#35063D`), Burgundy (`#6d2842`), Terracotta (`#D27D46`), and Warm Cream (`#faf8f5`).
   - Homepage: Cinematic transparent header with scroll transitions.
   - Inner Pages: High-contrast solid white header with crisp navigation and colored logo.

---

## 📁 Repository Structure

```text
├── package.json                # Root proxy scripts (build, dev, start, lint, postinstall)
├── .env.example                # Production environment template
├── .gitignore                  # Git hygiene (node_modules, build caches, secrets ignored)
├── README.md                   # Enterprise documentation & Hostinger deployment guide
├── docker-compose.yml          # Container orchestration (optional multi-service)
├── backend/                    # Optional FastAPI Python micro-service engine
│   ├── app/                    # FastAPI core, models, schemas, and endpoints
│   ├── alembic/                # Database migrations
│   ├── scripts/seed.py         # Initial database seeder
│   └── requirements.txt        # Python 3.11+ dependencies
└── frontend/                   # Full-stack Next.js 16 production application
    ├── package.json            # Next.js 16 + React 19 dependencies & scripts
    ├── next.config.ts          # Turbopack, security headers, standalone output
    ├── data/db.json            # Master JSON database (Single Source of Truth)
    ├── public/                 # Static assets, logos, and high-res photography
    └── src/
        ├── app/                # 30 production routes (Storefront & Admin)
        │   ├── admin/          # Products, Categories, Orders, Media, Settings, Sync
        │   ├── api/            # Complete internal API engine & sync routes
        │   ├── category/       # Dynamic category routes with Hero showcase
        │   ├── product/        # Dynamic product pages with weight selection
        │   ├── error.tsx       # Luxury error boundary
        │   ├── not-found.tsx   # Custom 404 handler
        │   ├── robots.ts       # Dynamic SEO crawlers configuration
        │   └── sitemap.ts      # Dynamic search engine sitemap
        ├── components/         # Modular UI components (cards, home, layout, product, etc.)
        ├── lib/                # Database manager, auth utils, currency formatters
        ├── store/              # Zustand global client state
        └── types/              # Full TypeScript domain definitions
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: `v18.18+` or `v20.x` or `v22.x`
- **npm**: `v9+` or `v10+`

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/dymaglobal/Spelloria-WEBSITE.git
cd Spelloria-WEBSITE
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🌐 Hostinger Cloud Startup Deployment Guide

The platform is optimized for **Hostinger Cloud Startup** using Hostinger's native **Node.js Web App** or **Git Deployment** feature.

### Step 1: Connect GitHub Repository
1. Log in to your **Hostinger hPanel**.
2. Navigate to **Websites** → Select your domain → **Git**.
3. Under **Repository URL**, enter:
   ```
   https://github.com/dymaglobal/Spelloria-WEBSITE.git
   ```
4. Branch: `main`
5. Directory: Leave as `/public_html` or root directory.

### Step 2: Configure Node.js Application
1. In hPanel, go to **Advanced** → **Node.js**.
2. Click **Create Application**:
   - **Node.js Version**: Select `20.x` (or `18.x` / `22.x`)
   - **Application Mode**: `Production`
   - **Application Root**: `/` (or `public_html`)
   - **Application Startup File**: `frontend/node_modules/next/dist/bin/next` (or run via npm script)
3. Set the build command:
   ```bash
   npm run build
   ```
4. Set the start command:
   ```bash
   npm start
   ```

### Step 3: Configure Environment Variables
In Hostinger hPanel under **Environment Variables** (or in `.env` inside your application root):
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
AUTH_SECRET=your_random_64_character_hex_secret_key
NEXT_PUBLIC_CURRENCY_SYMBOL=₹
NEXT_PUBLIC_CURRENCY_CODE=INR
PORT=3000
```

### Step 4: Run Initial Build and Start
Execute the deployment:
```bash
npm install
npm run build
npm start
```

---

## 🔐 Administrator Credentials

- **Login URL**: `https://yourdomain.com/admin/login` (or `http://localhost:3000/admin/login`)
- **Default Username / Email**: `Spelloria` or `admin@spelloria.com`
- **Default Password**: `ADMIN@462`
- **Session Duration**: 7-day persistent HMAC-SHA256 session token

> **Security Note:** You can change your administrator password and profile details at any time from the **Admin Dashboard** → **Settings** tab.

---

## 🧪 Verification & Health Checks

- **Storefront**: `http://localhost:3000` (HTTP 200 OK)
- **Production Build Test**: `npm run build` (30/30 routes compiled cleanly in ~800ms)
- **Codebase Lint Test**: `npm run lint` (0 errors)
- **Single Source Parity**: `http://localhost:3000/api/admin/sync` (`100% SYNCHRONIZED`)

---

## 📄 License

Proprietary & Confidential — © 2026 Spelloria Patisserie. All rights reserved.
