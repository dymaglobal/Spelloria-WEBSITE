import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";
import { DBCategory } from "@/lib/db/types";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const categoriesWithCount = db.categories
      .map((cat) => ({
        ...cat,
        productCount: db.products.filter((p) => p.category_id === cat.id && !p.is_archived).length,
      }))
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, banner_image_url, hero_image_url, display_order, is_active } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const db = getDb();

    let finalSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let counter = 1;
    const baseSlug = finalSlug;
    while (db.categories.some((c) => c.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const newId = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCategory: DBCategory = {
      id: newId,
      name,
      slug: finalSlug,
      description: description || "",
      banner_image_url: banner_image_url || "/images/collection-cakes.jpg",
      hero_image_url: hero_image_url || "/images/hero-cake-clean.png",
      display_order: display_order !== undefined ? parseInt(display_order, 10) : db.categories.length + 1,
      is_active: is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.categories.push(newCategory);
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("CREATE", "CATEGORY", newId, name, `Created new category: ${name}`);

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 });
  }
}
