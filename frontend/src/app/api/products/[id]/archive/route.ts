import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();
    const product = db.products.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newArchivedState = !product.is_archived;
    product.is_archived = newArchivedState;
    product.updated_at = new Date().toISOString();

    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    const action = newArchivedState ? "ARCHIVE" : "RESTORE";
    logActivity(
      action,
      "PRODUCT",
      id,
      product.name,
      `${action === "ARCHIVE" ? "Archived" : "Restored"} product: ${product.name}`
    );

    return NextResponse.json({
      success: true,
      is_archived: newArchivedState,
      message: `Product successfully ${newArchivedState ? "archived" : "restored"}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to toggle archive state" }, { status: 500 });
  }
}
