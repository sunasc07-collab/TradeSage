"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { assetDistributionData } from "@/lib/data"
import { Pie, PieChart, ResponsiveContainer } from "recharts"

const chartConfig = {
  value: {
    label: "Assets",
  },
  btc: {
    label: "Bitcoin",
    color: "hsl(var(--chart-1))",
  },
  eth: {
    label: "Ethereum",
    color: "hsl(var(--chart-2))",
  },
  sol: {
    label: "Solana",
    color: "hsl(var(--chart-3))",
  },
  others: {
    label: "Others",
    color: "hsl(var(--muted))",
  },
}

export function AssetDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Distribution</CardTitle>
        <CardDescription>
          Here is the breakdown of your portfolio assets.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80 w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <ResponsiveContainer>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={assetDistributionData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            />
          </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
