import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    return NextResponse.json({ settings: db.settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    db.settings = {
      ...db.settings,
      ...body,
    };

    saveDb(db);

    try {
      revalidatePath("/", "layout");
      revalidatePath("/menu");
      revalidatePath("/category/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    logActivity("UPDATE", "SETTINGS", "settings-1", "Site Settings", "Updated brand, WhatsApp, content, or SEO configurations");

    return NextResponse.json({
      success: true,
      settings: db.settings,
      message: "Settings saved successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to update settings" }, { status: 500 });
  }
}
