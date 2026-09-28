import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://spelloria.com";

    // Build dynamic sitemap URLs
    const staticPages = ["", "/about", "/contact", "/menu", "/privacy-policy", "/terms"];
    const categoryPages = db.categories.map((c) => `/category/${c.slug}`);
    const productPages = db.products.filter((p) => !p.is_archived).map((p) => `/product/${p.slug}`);

    const allUrls = [
      ...staticPages.map((p) => ({ url: `${baseUrl}${p}`, lastMod: new Date().toISOString(), priority: p === "" ? 1.0 : 0.8 })),
      ...categoryPages.map((p) => ({ url: `${baseUrl}${p}`, lastMod: new Date().toISOString(), priority: 0.8 })),
      ...productPages.map((p) => ({ url: `${baseUrl}${p}`, lastMod: new Date().toISOString(), priority: 0.9 })),
    ];

    const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml`;

    return NextResponse.json({
      settings: {
        meta_title: db.settings.meta_title,
        meta_description: db.settings.meta_description,
        og_image_url: db.settings.og_image_url,
        canonical_url: db.settings.canonical_url,
        schema_markup: db.settings.schema_markup || JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Bakery",
          "name": db.settings.brand_name,
          "url": baseUrl,
          "logo": `${baseUrl}${db.settings.logo_url}`,
          "telephone": db.settings.phone,
          "address": db.settings.address,
        }, null, 2),
      },
      sitemap: {
        totalUrls: allUrls.length,
        urls: allUrls,
      },
      robotsTxt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load SEO data" }, { status: 500 });
  }
}
