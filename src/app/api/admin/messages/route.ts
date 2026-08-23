import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/messages — list contact messages
 */
export async function GET() {
  const guard = await requireAdmin();
  if (guard !== true) return guard;
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json(messages);
}
