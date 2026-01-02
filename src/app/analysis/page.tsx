import { MarketAnalysisClient } from "@/components/analysis/market-analysis-client";
import { PageHeader } from "@/components/page-header";

export default function MarketAnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI-Powered Market Analysis"
        description="Analyze market trends, technical indicators, and sentiment data to predict potential trading opportunities."
      />
      <MarketAnalysisClient />
    </div>
  );
}
