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
    const product = db.products.find((p) => p.id === id || p.slug === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product, category: db.categories.find((c) => c.id === product.category_id) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = db.products[index];

    // If slug was changed, verify uniqueness
    let finalSlug = existing.slug;
    if (body.slug && body.slug !== existing.slug) {
      finalSlug = body.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      if (db.products.some((p) => p.slug === finalSlug && p.id !== id)) {
        return NextResponse.json({ error: "A product with this slug already exists." }, { status: 400 });
      }
    }

    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      slug: finalSlug,
      price: body.price !== undefined ? parseFloat(body.price) : existing.price,
      discount_price: body.discount_price !== undefined ? (body.discount_price ? parseFloat(body.discount_price) : null) : existing.discount_price,
      updated_at: new Date().toISOString(),
    };

    db.products[index] = updated;
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("UPDATE", "PRODUCT", id, updated.name, `Updated product details for ${updated.name}`);

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();

    const product = db.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    db.products = db.products.filter((p) => p.id !== id);
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("DELETE", "PRODUCT", id, product.name, `Permanently deleted product: ${product.name}`);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
  }
}
