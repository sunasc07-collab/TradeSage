import { AssetDistribution } from "@/components/dashboard/asset-distribution";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { RecentTrades } from "@/components/dashboard/recent-trades";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" />
      <div className="space-y-6">
        <StatsCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <AssetDistribution />
        </div>
        <RecentTrades />
      </div>
    </div>
  );
}
