import fs from "fs";
import path from "path";
import { DatabaseSchema, DBProduct, DBCategory, DBMediaItem, DBSiteSettings, DBActivityLog, DBUser } from "./types";
import { hashPassword } from "./auth-utils";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "../constants/initial-data";

export function getDbFilePath(): string {
  if (process.env.DB_FILE_PATH) {
    return process.env.DB_FILE_PATH;
  }
  const rootFrontendPath = path.join(process.cwd(), "frontend", "data", "db.json");
  if (fs.existsSync(rootFrontendPath)) {
    return rootFrontendPath;
  }
  return path.join(process.cwd(), "data", "db.json");
}

export function getUploadDir(): string {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }
  const rootFrontendPublic = path.join(process.cwd(), "frontend", "public");
  if (fs.existsSync(rootFrontendPublic)) {
    return path.join(rootFrontendPublic, "images", "uploads");
  }
  return path.join(process.cwd(), "public", "images", "uploads");
}

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  const { hash, salt } = hashPassword("ADMIN@462");

  const initialUser: DBUser = {
    id: "user-admin-1",
    username: "Spelloria",
    email: "admin@spelloria.com",
    password_hash: hash,
    salt,
    full_name: "Spelloria Executive Chef",
    role: "SUPER_ADMIN",
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const initialCategories: DBCategory[] = INITIAL_CATEGORIES.map((cat, idx) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    hero_image_url:
      cat.slug === "cakes"
        ? "/images/hero-cake-clean.png"
        : cat.slug === "pastries"
        ? "/images/hero-croissant.png"
        : cat.slug === "cookies"
        ? "/images/hero-cookies.png"
        : cat.slug === "desserts"
        ? "/images/hero-dessert.png"
        : cat.slug === "cappuccino"
        ? "/images/hero-cappuccino.png"
        : "/images/hero-gift-box.png",
    banner_image_url: "/images/collection-cakes.jpg",
    display_order: cat.display_order ?? idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const initialProducts: DBProduct[] = INITIAL_PRODUCTS.map((prod, idx) => {
    const basePrice = prod.price;
    return {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      category_id: prod.category_id,
      short_description: prod.short_description || "",
      full_description: prod.full_description || "",
      price: basePrice,
      discount_price: prod.discount_price ?? null,
      weight_grams: prod.weight_grams || 500,
      weight_options: [
        { id: `w-${prod.id}-1`, weight: "250g", price: Math.round(basePrice * 0.6), available: true },
        { id: `w-${prod.id}-2`, weight: "500g", price: basePrice, available: true },
        { id: `w-${prod.id}-3`, weight: "750g", price: Math.round(basePrice * 1.4), available: true },
        { id: `w-${prod.id}-4`, weight: "1kg", price: Math.round(basePrice * 1.8), available: true },
      ],
      status: prod.best_seller ? "Best Seller" : prod.featured ? "Seasonal" : "Available",
      is_archived: false,
      featured: prod.featured || false,
      best_seller: prod.best_seller || false,
      available: prod.available !== false,
      ingredients: prod.ingredients || ["French Butter AOP", "Single-Origin Vanilla"],
      allergens: prod.allergens || ["Dairy", "Gluten"],
      tags: [prod.category_id === "cat-1" ? "Celebration" : "Artisanal", "Boutique"],
      notes: "Prepared fresh each morning in small batches by our pastry chefs.",
      shelf_life: "Best enjoyed within 48 hours. Keep refrigerated at 4°C.",
      serving_info: "Serve slightly chilled or at room temperature.",
      views_count: Math.floor(Math.random() * 240) + 40,
      display_order: idx + 1,
      cover_image_url: prod.cover_image?.public_url || "/images/collection-cakes.jpg",
      gallery_images: [
        {
          id: `img-${prod.id}-1`,
          media_id: `m-${prod.id}-1`,
          public_url: prod.cover_image?.public_url || "/images/collection-cakes.jpg",
          display_order: 1,
          is_featured: true,
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  const initialMedia: DBMediaItem[] = [
    {
      id: "med-1",
      filename: "hero-cake-clean.png",
      stored_name: "hero-cake-clean.png",
      mime_type: "image/png",
      file_size_bytes: 146526,
      public_url: "/images/hero-cake-clean.png",
      width_px: 688,
      height_px: 370,
      alt_text: "Signature Celebration Cake",
      tags: ["cakes", "hero", "transparent"],
      created_at: new Date().toISOString(),
    },
    {
      id: "med-2",
      filename: "hero-croissant.png",
      stored_name: "hero-croissant.png",
      mime_type: "image/png",
      file_size_bytes: 106387,
      public_url: "/images/hero-croissant.png",
      width_px: 600,
      height_px: 400,
      alt_text: "Golden French Butter Croissant",
      tags: ["pastries", "croissant"],
      created_at: new Date().toISOString(),
    },
    {
      id: "med-3",
      filename: "croissant-macro-1.jpg",
      stored_name: "croissant-macro-1.jpg",
      mime_type: "image/jpeg",
      file_size_bytes: 245000,
      public_url: "/images/croissant-macro-1.jpg",
      width_px: 2000,
      height_px: 1333,
      alt_text: "Powdered sugar mist over croissants",
      tags: ["cta", "homepage", "flaky"],
      created_at: new Date().toISOString(),
    },
    {
      id: "med-4",
      filename: "collection-cakes.jpg",
      stored_name: "collection-cakes.jpg",
      mime_type: "image/jpeg",
      file_size_bytes: 829866,
      public_url: "/images/collection-cakes.jpg",
      width_px: 1600,
      height_px: 1067,
      alt_text: "Artisanal Celebration Cakes Collection",
      tags: ["banner", "cakes"],
      created_at: new Date().toISOString(),
    },
  ];

  const initialSettings: DBSiteSettings = {
    brand_name: "Spelloria Patisserie",
    brand_color: "#35063D",
    accent_color: "#D27D46",
    logo_url: "/images/logo-transparent.png",
    favicon_url: "/favicon.ico",
    email: "hello@spelloria.in",
    phone: "+91 98765 43210",
    whatsapp_number: "+919876543210",
    whatsapp_enabled: true,
    whatsapp_template:
      "Hello Spelloria,\n\nI would like to order:\n\nProduct: {{product_name}}\nWeight: {{weight}}\nPrice: {{price}}\nQuantity: {{quantity}}\nCustomer Name: {{customer_name}}\nProduct Link: {{url}}\n\nPlease confirm availability.",
    address: "Spelloria House, 14 Rue de Royale, Kozhikode, Kerala, India",
    instagram_url: "https://www.instagram.com/spelloria_patisserie?obrf=MXI0dXQyMTIzOXNhZQ==",
    facebook_url: "https://facebook.com/spelloria",
    youtube_url: "https://youtube.com/@spelloria",
    pinterest_url: "https://pinterest.com/spelloria",
    meta_title: "Spelloria Patisserie | Artisanal French Bakery & Luxury Desserts",
    meta_description:
      "Handcrafted artisanal cakes, French viennoiserie, cookies, and luxury desserts crafted with authentic French techniques. Order on WhatsApp.",
    og_image_url: "/images/collection-cakes.jpg",
    canonical_url: "https://spelloria.com",
    hero_headline: "Purely ————— Handcrafted",
    hero_subtitle: "Artisanal French patisserie and cakes crafted for moments of pure celebration.",
    hero_bg_image: "/images/hero-pastries.jpg",
    cta_label: "FRESHLY BAKED DAILY",
    cta_heading: "Ready to Taste Perfection?",
    cta_description: "Experience the crunch of our golden layers and the richness of premium French butter.",
    cta_bg_image: "/images/croissant-macro-1.jpg",
    about_title: "The Art of Slow Viennoiserie",
    about_text: "Every morning before dawn, our master bakers fold pure Normandy butter into fermented dough, honoring traditional French pastry methods.",
    story_text: "Born from a devotion to classic European confectionery and modern culinary aesthetics, Spelloria transforms everyday gatherings into memorable tastings.",
    footer_text: "Handcrafted cakes, viennoiserie, and confectionery baked daily with French butter and passion.",
    footer_copyright: "© 2026 Spelloria Patisserie. All rights reserved.",
  };

  const initialLogs: DBActivityLog[] = [
    {
      id: "log-1",
      user_name: "Spelloria",
      action: "LOGIN",
      resource_type: "AUTH",
      details: "Initial system initialization and administrator setup",
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    },
  ];

  return {
    users: [initialUser],
    categories: initialCategories,
    products: initialProducts,
    media: initialMedia,
    settings: initialSettings,
    activity_logs: initialLogs,
  };
}

export function getDb(): DatabaseSchema {
  const dbFile = getDbFilePath();
  ensureDirectoryExistence(dbFile);
  if (!fs.existsSync(/*turbopackIgnore: true*/ dbFile)) {
    const data = getInitialData();
    fs.writeFileSync(/*turbopackIgnore: true*/ dbFile, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const raw = fs.readFileSync(/*turbopackIgnore: true*/ dbFile, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading database file, reinitializing:", e);
    const data = getInitialData();
    fs.writeFileSync(/*turbopackIgnore: true*/ dbFile, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

export function saveDb(data: DatabaseSchema): void {
  const dbFile = getDbFilePath();
  ensureDirectoryExistence(dbFile);
  fs.writeFileSync(/*turbopackIgnore: true*/ dbFile, JSON.stringify(data, null, 2), "utf-8");
}

export function logActivity(
  action: DBActivityLog["action"],
  resource_type: DBActivityLog["resource_type"],
  resource_id?: string,
  resource_name?: string,
  details?: string,
  user_name: string = "Spelloria",
  ip_address: string = "127.0.0.1"
): void {
  const db = getDb();
  const log: DBActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_name,
    action,
    resource_type,
    resource_id,
    resource_name,
    details,
    ip_address,
    created_at: new Date().toISOString(),
  };
  db.activity_logs.unshift(log);
  // Keep last 300 logs
  if (db.activity_logs.length > 300) {
    db.activity_logs = db.activity_logs.slice(0, 300);
  }
  saveDb(db);
}
