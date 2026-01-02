"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AnalyzeMarketOutput,
  analyzeMarket,
} from "@/ai/flows/generate-trade-analysis";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  prompt: z
    .string()
    .min(20, {
      message: "Prompt must be at least 20 characters.",
    })
    .max(5000, {
      message: "Prompt cannot be more than 5000 characters.",
    }),
});

export function MarketAnalysisClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeMarketOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt:
        "BTC is showing a bullish divergence on the 4H RSI. Volume is increasing. Twitter sentiment is positive. Key resistance at $70,000.",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeMarket({ prompt: data.prompt });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error generating the market analysis.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
          <CardDescription>
            Enter market data, indicators, or sentiment for analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Analysis Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'BTC price is consolidating above the 50-day MA...'"
                        className="min-h-[200px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detail you provide, the better the analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search />
                )}
                Analyze Market
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis & Recommendation</CardTitle>
          <CardDescription>
            The AI's assessment based on the data provided.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
          {!isLoading && !result && (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card-foreground/5 p-8 text-center">
              <Lightbulb className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Your analysis results will appear here.
              </p>
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-semibold">Analysis</h3>
                <p className="text-muted-foreground">{result.analysis}</p>
              </div>
              <div>
                <h3 className="font-headline text-lg font-semibold">
                  Recommendation
                </h3>
                <p className="text-muted-foreground">{result.recommendation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
