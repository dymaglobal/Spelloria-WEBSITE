import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb, logActivity } from "@/lib/db/json-db";
import { DBMediaItem } from "@/lib/db/types";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const tag = searchParams.get("tag") || "all";

    const db = getDb();
    let list = db.media;

    if (tag !== "all") {
      list = list.filter((m) => m.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    if (search) {
      list = list.filter(
        (m) =>
          m.filename.toLowerCase().includes(search) ||
          m.alt_text?.toLowerCase().includes(search) ||
          m.tags?.some((t) => t.toLowerCase().includes(search))
      );
    }

    // Sort latest first
    list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Compute storage summary
    const totalBytes = db.media.reduce((acc, m) => acc + (m.file_size_bytes || 0), 0);

    return NextResponse.json({
      media: list,
      total: list.length,
      storage: {
        totalBytes,
        totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load media items" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const altText = (formData.get("alt_text") as string) || "";
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : ["uploads"];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let sharp: any;
    try {
      sharp = require("sharp");
    } catch {
      sharp = null;
    }

    const db = getDb();
    const uploadedItems: DBMediaItem[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const baseName = path
        .basename(file.name, path.extname(file.name))
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const outputFilename = `${baseName}_${uniqueSuffix}.webp`;
      const outputPath = path.join(uploadDir, outputFilename);
      const publicUrl = `/images/uploads/${outputFilename}`;

      let finalWidth: number | null = null;
      let finalHeight: number | null = null;
      let finalSize: number = buffer.length;

      if (sharp) {
        // Optimize to high-quality WebP with metadata extraction
        const processed = await sharp(buffer)
          .webp({ quality: 88, effort: 4 })
          .toBuffer({ resolveWithObject: true });

        fs.writeFileSync(outputPath, processed.data);
        finalWidth = processed.info.width;
        finalHeight = processed.info.height;
        finalSize = processed.info.size;
      } else {
        // Fallback without Sharp
        const fallbackName = `${baseName}_${uniqueSuffix}${path.extname(file.name)}`;
        const fallbackPath = path.join(uploadDir, fallbackName);
        fs.writeFileSync(fallbackPath, buffer);
      }

      const mediaItem: DBMediaItem = {
        id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        filename: file.name,
        stored_name: outputFilename,
        mime_type: "image/webp",
        file_size_bytes: finalSize,
        public_url: publicUrl,
        width_px: finalWidth,
        height_px: finalHeight,
        alt_text: altText || baseName.replace(/_/g, " "),
        tags,
        created_at: new Date().toISOString(),
      };

      db.media.unshift(mediaItem);
      uploadedItems.push(mediaItem);

      logActivity("UPLOAD", "MEDIA", mediaItem.id, mediaItem.filename, `Uploaded and optimized image: ${mediaItem.filename} (${(finalSize / 1024).toFixed(1)} KB)`);
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      items: uploadedItems,
      message: `Successfully uploaded and optimized ${uploadedItems.length} image(s).`,
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: error?.message || "Failed to upload image(s)" }, { status: 500 });
  }
}
