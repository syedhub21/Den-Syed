import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me — returns { authenticated: boolean }
 */
export async function GET() {
  const ok = await isAuthenticated();
  return NextResponse.json({ authenticated: ok });
}
