import { GemDiscoveryClient } from "@/components/gems/gem-discovery-client";
import { PageHeader } from "@/components/page-header";

export default function GemDiscoveryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI-Powered Gem Discovery"
        description="Identify promising, low-market-cap cryptocurrencies by analyzing on-chain and off-chain data."
      />
      <GemDiscoveryClient />
    </div>
  );
}
