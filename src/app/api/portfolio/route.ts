import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

/**
 * GET /api/portfolio
 * Returns all public portfolio data.
 */
export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
