import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();

    const activeProducts = db.products.filter((p) => !p.is_archived);
    const totalProducts = activeProducts.length;
    const totalCategories = db.categories.length;

    // Status breakdown
    const statusCounts = {
      available: activeProducts.filter((p) => p.status === "Available").length,
      outOfStock: activeProducts.filter((p) => p.status === "Out of Stock").length,
      seasonal: activeProducts.filter((p) => p.status === "Seasonal").length,
      limitedEdition: activeProducts.filter((p) => p.status === "Limited Edition").length,
      bestSeller: activeProducts.filter((p) => p.status === "Best Seller" || p.best_seller).length,
      newArrival: activeProducts.filter((p) => p.status === "New Arrival").length,
      archived: db.products.filter((p) => p.is_archived).length,
    };

    // Latest products (sorted by created_at desc)
    const latestProducts = [...activeProducts]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    // Most viewed products (sorted by views_count desc)
    const mostViewedProducts = [...activeProducts]
      .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
      .slice(0, 5);

    // Recently updated products
    const recentlyUpdatedProducts = [...activeProducts]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);

    // Storage calculation
    const totalBytes = db.media.reduce((acc, m) => acc + (m.file_size_bytes || 0), 0);
    const storageUsage = {
      totalBytes,
      totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
      mediaCount: db.media.length,
    };

    // Recent activity logs
    const recentLogs = db.activity_logs.slice(0, 8);

    return NextResponse.json({
      metrics: {
        totalProducts,
        totalCategories,
        statusCounts,
        storageUsage,
      },
      latestProducts,
      mostViewedProducts,
      recentlyUpdatedProducts,
      recentLogs,
      settings: {
        brandName: db.settings.brand_name,
        whatsappNumber: db.settings.whatsapp_number,
        whatsappEnabled: db.settings.whatsapp_enabled,
      },
    });
  } catch (error: any) {
    console.error("Dashboard overview API error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load dashboard overview" }, { status: 500 });
  }
}
