import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";
import { DBProduct } from "@/lib/db/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();
    const original = db.products.find((p) => p.id === id);

    if (!original) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newName = `${original.name} (Copy)`;
    let newSlug = `${original.slug}-copy`;

    let counter = 1;
    while (db.products.some((p) => p.slug === newSlug)) {
      newSlug = `${original.slug}-copy-${counter++}`;
    }

    const cloned: DBProduct = {
      ...original,
      id: newId,
      name: newName,
      slug: newSlug,
      views_count: 0,
      display_order: db.products.length + 1,
      weight_options: original.weight_options.map((w, idx) => ({
        ...w,
        id: `w-${newId}-${idx + 1}`,
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.products.push(cloned);
    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("DUPLICATE", "PRODUCT", newId, newName, `Duplicated product from ${original.name}`);

    return NextResponse.json({ success: true, product: cloned });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to duplicate product" }, { status: 500 });
  }
}
