import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Body: { password }
 * Sets a signed HTTP-only session cookie on success.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = String(body?.password ?? "");

    const token = verifyAdminPassword(password);
    if (!token) {
      // Slight delay to blunt brute force
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    await setSessionCookie(token);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[login] error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
