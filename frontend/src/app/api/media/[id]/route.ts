import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";
import path from "path";
import fs from "fs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const db = getDb();
    const item = db.media.find((m) => m.id === id);

    if (!item) {
      return NextResponse.json({ error: "Media item not found" }, { status: 404 });
    }

    // Try deleting physical file if it exists in uploads
    if (item.public_url.startsWith("/images/uploads/")) {
      const filename = path.basename(item.public_url);
      const filePath = path.join(process.cwd(), "public", "images", "uploads", filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Could not remove file from disk:", e);
        }
      }
    }

    db.media = db.media.filter((m) => m.id !== id);
    saveDb(db);

    logActivity("DELETE", "MEDIA", id, item.filename, `Deleted media item: ${item.filename}`);

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to delete media item" }, { status: 500 });
  }
}
