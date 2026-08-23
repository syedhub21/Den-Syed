import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  const items = await db.stat.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const body = await req.json();
    const created = await db.stat.create({
      data: {
        label: String(body.label ?? ""),
        value: Number(body.value ?? 0) || 0,
        suffix: String(body.suffix ?? "+"),
        order: Number(body.order ?? 0) || 0,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[admin/stats] POST error:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
