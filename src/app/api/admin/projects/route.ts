import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

function splitList(v: unknown): string {
  if (Array.isArray(v)) return v.map(String).join(",");
  if (typeof v === "string") return v;
  return "";
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  const items = await db.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const body = await req.json();
    const created = await db.project.create({
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
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[admin/projects] POST error:", err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
