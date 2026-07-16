import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  const items = await db.exploration.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const body = await req.json();
    const created = await db.exploration.create({
      data: {
        title: String(body.title ?? ""),
        image: String(body.image ?? ""),
        span: Number(body.span ?? 1) || 1,
        order: Number(body.order ?? 0) || 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[admin/explorations] POST error:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
