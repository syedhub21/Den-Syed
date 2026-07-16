import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.journalEntry.update({
      where: { id },
      data: {
        slug: String(body.slug ?? ""),
        title: String(body.title ?? ""),
        excerpt: String(body.excerpt ?? ""),
        coverImage: String(body.coverImage ?? ""),
        readTime: String(body.readTime ?? "5 min"),
        date: String(body.date ?? ""),
        content: String(body.content ?? ""),
        order: Number(body.order ?? 0) || 0,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/journal/[id]] PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const { id } = await params;
    await db.journalEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/journal/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
