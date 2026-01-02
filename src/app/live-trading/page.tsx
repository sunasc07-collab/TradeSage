import { PageHeader } from "@/components/page-header";
import { LiveTradingChart } from "@/components/trading/live-trading-chart";

export default function LiveTradingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Live Trading"
        description="Visualize real-time market data with interactive charts."
      />
      <LiveTradingChart />
    </div>
  );
}
