import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

function splitList(v: unknown): string {
  if (Array.isArray(v)) return v.map(String).join(",");
  if (typeof v === "string") return v;
  return "";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.project.update({
      where: { id },
      data: {
        slug: String(body.slug ?? ""),
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        technologies: splitList(body.technologies),
        githubUrl: String(body.githubUrl ?? ""),
        liveUrl: String(body.liveUrl ?? ""),
        coverImage: String(body.coverImage ?? ""),
        order: Number(body.order ?? 0) || 0,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/projects/[id]] PUT error:", err);
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
    await db.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/projects/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
