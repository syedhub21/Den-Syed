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
  const profile = await db.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: { id: "profile" },
  });
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  try {
    const body = await req.json();
    const data = {
      name: String(body.name ?? ""),
      heroGreeting: String(body.heroGreeting ?? "Hi! I'm"),
      roles: splitList(body.roles),
      rotatingRoles: splitList(body.rotatingRoles),
      city: String(body.city ?? ""),
      bio: String(body.bio ?? ""),
      email: String(body.email ?? ""),
      phone: String(body.phone ?? ""),
      location: String(body.location ?? ""),
      heroImage: String(body.heroImage ?? ""),
      aboutImage: String(body.aboutImage ?? ""),
      github: String(body.github ?? ""),
      instagram: String(body.instagram ?? ""),
      linkedin: String(body.linkedin ?? ""),
      logoText: String(body.logoText ?? ""),
    };
    const updated = await db.profile.upsert({
      where: { id: "profile" },
      update: data,
      create: { id: "profile", ...data },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[admin/profile] PUT error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
