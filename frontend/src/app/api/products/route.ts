import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";
import { DBProduct } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";
    const includeArchived = searchParams.get("include_archived") === "true";

    const db = getDb();
    let list = db.products;

    if (!includeArchived) {
      list = list.filter((p) => !p.is_archived);
    }

    if (category !== "all") {
      const catObj = db.categories.find((c) => c.slug === category || c.id === category);
      if (catObj) {
        list = list.filter((p) => p.category_id === catObj.id);
      }
    }

    if (status !== "all") {
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.short_description?.toLowerCase().includes(search) ||
          p.ingredients?.some((i) => i.toLowerCase().includes(search)) ||
          p.tags?.some((t) => t.toLowerCase().includes(search))
      );
    }

    // Sort by display order then created_at
    list = [...list].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return NextResponse.json({
      products: list,
      total: list.length,
      categories: db.categories,
    });
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: error?.message || "Failed to load products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      category_id,
      short_description,
      full_description,
      price,
      discount_price,
      weight_grams,
      weight_options,
      status,
      featured,
      best_seller,
      available,
      ingredients,
      allergens,
      tags,
      notes,
      shelf_life,
      serving_info,
      cover_image_url,
      gallery_images,
    } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: "Product name, price, and category are required." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Auto-generate or sanitize slug
    let finalSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Ensure unique slug
    let counter = 1;
    const baseSlug = finalSlug;
    while (db.products.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const parsedPrice = parseFloat(price);

    // Build default weights if not supplied
    const finalWeights =
      weight_options && weight_options.length > 0
        ? weight_options
        : [
            { id: `w-${newId}-1`, weight: "250g", price: Math.round(parsedPrice * 0.6), available: true },
            { id: `w-${newId}-2`, weight: "500g", price: parsedPrice, available: true },
            { id: `w-${newId}-3`, weight: "1kg", price: Math.round(parsedPrice * 1.8), available: true },
          ];

    const newProduct: DBProduct = {
      id: newId,
      name,
      slug: finalSlug,
      category_id,
      short_description: short_description || "",
      full_description: full_description || "",
      price: parsedPrice,
      discount_price: discount_price ? parseFloat(discount_price) : null,
      weight_grams: weight_grams ? parseInt(weight_grams, 10) : 500,
      weight_options: finalWeights,
      status: status || "Available",
      is_archived: false,
      featured: Boolean(featured),
      best_seller: Boolean(best_seller),
      available: available !== false,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      allergens: Array.isArray(allergens) ? allergens : [],
      tags: Array.isArray(tags) ? tags : ["Artisanal"],
      notes: notes || "",
      shelf_life: shelf_life || "Best enjoyed within 48 hours. Keep chilled.",
      serving_info: serving_info || "Serve at room temperature or slightly chilled.",
      views_count: 0,
      display_order: db.products.length + 1,
      cover_image_url: cover_image_url || "/images/collection-cakes.jpg",
      gallery_images: Array.isArray(gallery_images) ? gallery_images : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.products.push(newProduct);
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("CREATE", "PRODUCT", newId, name, `Created new product: ${name} (${finalSlug})`);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: error?.message || "Failed to create product" }, { status: 500 });
  }
}
