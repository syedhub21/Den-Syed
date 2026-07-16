import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  const settings = await db.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const body = await req.json();
    const updated = await db.siteSettings.upsert({
      where: { id: "settings" },
      update: {
        availabilityText: String(body.availabilityText ?? ""),
      },
      create: {
        id: "settings",
        availabilityText: String(body.availabilityText ?? ""),
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/settings] PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
