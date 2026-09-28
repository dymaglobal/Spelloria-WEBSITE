import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();
    const category = db.categories.find((c) => c.id === id || c.slug === id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const products = db.products.filter((p) => p.category_id === category.id && !p.is_archived);
    return NextResponse.json({ category, products, productCount: products.length });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const existing = db.categories[index];

    let finalSlug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      finalSlug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      if (db.categories.some((c) => c.slug === finalSlug && c.id !== id)) {
        return NextResponse.json({ error: "A category with this slug already exists." }, { status: 400 });
      }
    }

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      slug: finalSlug,
      display_order: body.display_order !== undefined ? parseInt(body.display_order, 10) : existing.display_order,
      updated_at: new Date().toISOString(),
    };

    db.categories[index] = updated;
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("UPDATE", "CATEGORY", id, updated.name, `Updated category details for ${updated.name}`);

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();

    const category = db.categories.find((c) => c.id === id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if category has products
    const productCount = db.products.filter((p) => p.category_id === id).length;
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${productCount} assigned products. Reassign or delete the products first.` },
        { status: 400 }
      );
    }

    db.categories = db.categories.filter((c) => c.id !== id);
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("DELETE", "CATEGORY", id, category.name, `Deleted category: ${category.name}`);

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete category" }, { status: 500 });
  }
}
