import { getDb } from "./json-db";
import { DBProduct, DBCategory, DBSiteSettings, DBMediaItem } from "./types";

/**
 * Single Source of Truth Queries for Frontend & API
 */

export function getStoreSettings(): DBSiteSettings {
  const db = getDb();
  return db.settings;
}

export function getPublicCategories(): DBCategory[] {
  const db = getDb();
  return [...db.categories]
    .filter((c) => c.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function getAllCategories(): DBCategory[] {
  const db = getDb();
  return [...db.categories].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function getCategoryBySlug(slugOrId: string): DBCategory | null {
  const db = getDb();
  return db.categories.find((c) => c.slug === slugOrId || c.id === slugOrId) || null;
}

export function getPublicProducts(includeSoldOut: boolean = true): DBProduct[] {
  const db = getDb();
  return db.products.filter((p) => {
    if (p.is_archived) return false;
    if (!includeSoldOut && !p.available) return false;
    return true;
  });
}

export function getProductBySlug(slugOrId: string): DBProduct | null {
  const db = getDb();
  return db.products.find((p) => (p.slug === slugOrId || p.id === slugOrId) && !p.is_archived) || null;
}

export function getProductsByCategory(categoryIdOrSlug: string): DBProduct[] {
  const db = getDb();
  const cat = db.categories.find((c) => c.id === categoryIdOrSlug || c.slug === categoryIdOrSlug);
  if (!cat) return [];
  return db.products.filter((p) => p.category_id === cat.id && !p.is_archived);
}

export function getFeaturedProducts(limit: number = 8): DBProduct[] {
  const db = getDb();
  const list = db.products.filter((p) => p.featured && !p.is_archived);
  if (list.length >= limit) return list.slice(0, limit);
  // Fallback to top products if few are marked featured
  const remaining = db.products.filter((p) => !p.featured && !p.is_archived);
  return [...list, ...remaining].slice(0, limit);
}

export function getBestSellerProducts(limit: number = 6): DBProduct[] {
  const db = getDb();
  return db.products.filter((p) => p.best_seller && !p.is_archived).slice(0, limit);
}

export function getRelatedProducts(productId: string, categoryId: string, limit: number = 4): DBProduct[] {
  const db = getDb();
  const sameCat = db.products.filter((p) => p.category_id === categoryId && p.id !== productId && !p.is_archived);
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  const others = db.products.filter((p) => p.category_id !== categoryId && p.id !== productId && !p.is_archived);
  return [...sameCat, ...others].slice(0, limit);
}

export interface SyncHealthReport {
  timestamp: string;
  totalProductsDb: number;
  totalProductsActive: number;
  totalProductsArchived: number;
  totalCategoriesDb: number;
  totalCategoriesActive: number;
  totalMediaAssets: number;
  orphanedProducts: number; // products with invalid category_id
  duplicateProductSlugs: string[];
  duplicateCategorySlugs: string[];
  missingImages: string[];
  isHealthy: boolean;
  status: "SYNCHRONIZED" | "WARNING" | "OUT_OF_SYNC";
}

export function getSyncHealthReport(): SyncHealthReport {
  const db = getDb();

  const totalProductsDb = db.products.length;
  const totalProductsActive = db.products.filter((p) => !p.is_archived).length;
  const totalProductsArchived = db.products.filter((p) => p.is_archived).length;

  const totalCategoriesDb = db.categories.length;
  const totalCategoriesActive = db.categories.filter((c) => c.is_active !== false).length;

  const totalMediaAssets = db.media.length;

  // Check orphaned products (products whose category_id does not exist in categories)
  const categoryIds = new Set(db.categories.map((c) => c.id));
  const orphanedProducts = db.products.filter((p) => !categoryIds.has(p.category_id)).length;

  // Check duplicate product slugs
  const productSlugCounts: Record<string, number> = {};
  db.products.forEach((p) => {
    productSlugCounts[p.slug] = (productSlugCounts[p.slug] || 0) + 1;
  });
  const duplicateProductSlugs = Object.keys(productSlugCounts).filter((s) => productSlugCounts[s] > 1);

  // Check duplicate category slugs
  const catSlugCounts: Record<string, number> = {};
  db.categories.forEach((c) => {
    catSlugCounts[c.slug] = (catSlugCounts[c.slug] || 0) + 1;
  });
  const duplicateCategorySlugs = Object.keys(catSlugCounts).filter((s) => catSlugCounts[s] > 1);

  const isHealthy =
    orphanedProducts === 0 &&
    duplicateProductSlugs.length === 0 &&
    duplicateCategorySlugs.length === 0;

  return {
    timestamp: new Date().toISOString(),
    totalProductsDb,
    totalProductsActive,
    totalProductsArchived,
    totalCategoriesDb,
    totalCategoriesActive,
    totalMediaAssets,
    orphanedProducts,
    duplicateProductSlugs,
    duplicateCategorySlugs,
    missingImages: [],
    isHealthy,
    status: isHealthy ? "SYNCHRONIZED" : "WARNING",
  };
}
