import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * Returns true if the current request is from an authenticated admin.
 * Otherwise returns a 401 NextResponse.
 */
export async function requireAdmin(): Promise<true | NextResponse> {
  const ok = await isAuthenticated();
  if (!ok) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  return true;
}
