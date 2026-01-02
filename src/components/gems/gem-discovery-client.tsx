"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Gem, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  IdentifyCryptoGemsOutput,
  identifyCryptoGems,
} from "@/ai/flows/identify-crypto-gems";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const blockchains = [
  { id: "solana", label: "Solana" },
  { id: "ethereum", label: "Ethereum" },
  { id: "base", label: "Base" },
  { id: "polygon", label: "Polygon" },
  { id: "bsc", label: "BSC" },
  { id: "avalanche", label: "Avalanche" },
];

const FormSchema = z.object({
  marketCap: z.array(z.number()).min(2),
  tradingVolume: z.array(z.number()).min(2),
  inflow: z.array(z.number()).min(2),
  blockchains: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one blockchain.",
  }),
});

// Helper to format large numbers
const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export function GemDiscoveryClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyCryptoGemsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      marketCap: [1000, 50000000],
      tradingVolume: [50000, 10000000],
      inflow: [10000, 10000000],
      blockchains: ["solana", "base"],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);

    // Construct a detailed prompt from the form data
    const prompt = `
      Find me crypto gems with the following criteria:
      - Market Cap between $${formatNumber(data.marketCap[0])} and $${formatNumber(data.marketCap[1])}.
      - 24h Trading Volume between $${formatNumber(data.tradingVolume[0])} and $${formatNumber(data.tradingVolume[1])}.
      - 24h Inflow between $${formatNumber(data.inflow[0])} and $${formatNumber(data.inflow[1])}.
      - The tokens must be on one of the following blockchains: ${data.blockchains.join(", ")}.
      - Prioritize tokens with strong community engagement on Twitter/X and recent developer activity on GitHub.
    `;

    try {
      const gemsResult = await identifyCryptoGems({ prompt });
      setResult(gemsResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Discovery Failed",
        description: "There was an error discovering crypto gems.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Discovery Criteria</CardTitle>
          <CardDescription>
            Use the controls below to define your criteria for the next 100x crypto gem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="marketCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Cap (USD)</FormLabel>
                    <FormControl>
                       <Slider
                        min={1000}
                        max={100000000}
                        step={1000}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${formatNumber(field.value[0])}</span>
                      <span>${formatNumber(field.value[1])}</span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradingVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>24h Trading Volume (USD)</FormLabel>
                     <FormControl>
                      <Slider
                        min={10000}
                        max={10000000}
                        step={10000}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${formatNumber(field.value[0])}</span>
                      <span>${formatNumber(field.value[1])}</span>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inflow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>24h Inflow (USD)</FormLabel>
                    <FormControl>
                       <Slider
                        min={1000}
                        max={10000000}
                        step={1000}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                     <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${formatNumber(field.value[0])}</span>
                      <span>${formatNumber(field.value[1])}</span>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="blockchains"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Blockchains</FormLabel>
                      <FormDescription>
                        Select the blockchains to search for gems on.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {blockchains.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="blockchains"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Gem />
                )}
                Find Gems
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Discovered Gems & Analysis</CardTitle>
          <CardDescription>
            Potential gems identified by the AI. DYOR.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
             <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card-foreground/5 p-8 text-center">
              <Gem className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Discovered gems will appear here.
              </p>
            </div>
          )}
          {result && (
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="analysis">
                  <AccordionTrigger className="font-headline text-lg">
                    Detailed Analysis
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-invert max-w-none text-muted-foreground">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {result.gems.map((gem, index) => (
                            <Badge key={index} variant="secondary">{gem}</Badge>
                        ))}
                    </div>
                    <p>{result.analysis}</p>
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    