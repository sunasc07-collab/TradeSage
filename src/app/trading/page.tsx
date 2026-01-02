import { PageHeader } from "@/components/page-header";
import { TradeSuggestionsClient } from "@/components/trading/trade-suggestions-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function TradingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Trade Suggestions"
        description="Execute trades automatically based on the AI's market analysis and forecasts."
      />
      <Suspense fallback={<TradeSuggestionsSkeleton />}>
        <TradeSuggestionsClient />
      </Suspense>
    </div>
  );
}

function TradeSuggestionsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-3 space-y-4">
                <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="lg:col-span-3">
                <Skeleton className="h-[150px] w-full" />
            </div>
        </div>
    )
}
