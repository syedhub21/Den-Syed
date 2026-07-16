import { NextResponse } from "next/server";
import { ensureSeeded } from "@/lib/portfolio";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * GET /api/setup
 * Initializes the database — seeds default data if empty.
 * Call this once after deploying to Vercel if the site appears empty.
 * Safe to call multiple times (idempotent).
 */
export async function GET() {
  try {
    await ensureSeeded();
    return NextResponse.json({
      ok: true,
      message: "Database initialized and seeded successfully.",
    });
  } catch (err) {
    console.error("[setup] error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Database setup failed. Ensure DATABASE_URL is set correctly.",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
