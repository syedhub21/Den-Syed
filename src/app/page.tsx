import { getPortfolioData } from "@/lib/portfolio";
import { PortfolioShell } from "@/components/portfolio-shell";

// Always fetch fresh so admin edits appear
export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();
  return <PortfolioShell data={data} />;
}
