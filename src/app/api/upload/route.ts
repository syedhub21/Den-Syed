import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

/**
 * POST /api/upload  (admin only)
 * Body: multipart/form-data with a "file" field (an image).
 * Stores the image in the DB (base64) and returns { url: "/api/images/<id>" }.
 *
 * DB-backed storage keeps uploads working on serverless hosts (Vercel)
 * where the filesystem is read-only.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use PNG, JPEG, WebP, GIF or SVG." },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large (max 2MB)." },
        { status: 400 }
      );
    }

    const created = await db.uploadedImage.create({
      data: { mime: file.type, data: buf.toString("base64") },
    });

    return NextResponse.json(
      { url: `/api/images/${created.id}` },
      { status: 201 }
    );
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
