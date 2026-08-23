import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/images/[id]
 * Serves an admin-uploaded image from the DB with immutable caching —
 * the browser only fetches it once.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const img = await db.uploadedImage.findUnique({ where: { id } });
  if (!img) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const bytes = new Uint8Array(Buffer.from(img.data, "base64"));
  return new Response(bytes, {
    headers: {
      "Content-Type": img.mime,
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
