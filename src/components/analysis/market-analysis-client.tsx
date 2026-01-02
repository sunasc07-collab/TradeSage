"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Gem, Loader2, Search } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "../ui/badge";

const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, {
      message: "Prompt must be at least 10 characters.",
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
        "Analyze emerging AI and meme coins like PEPE, WIF, and RNDR.",
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Criteria</CardTitle>
            <CardDescription>
              Enter the types of gems you want to analyze.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gems to Analyze</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Analyze emerging AI and meme coins like...'"
                          className="min-h-[150px] font-code"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mention specific coins or categories.
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
                  Analyze
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Gem Analysis</CardTitle>
            <CardDescription>
              AI-driven insights on emerging crypto gems.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card-foreground/5 p-8 text-center">
                <Gem className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  Your gem analysis will appear here.
                </p>
              </div>
            )}
            {result && result.gems && (
              <Accordion type="single" collapsible className="w-full" defaultValue={`gem-0`}>
                {result.gems.map((gem, index) => (
                  <AccordionItem value={`gem-${index}`} key={index}>
                    <AccordionTrigger className="font-headline text-lg">
                      {gem.name}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-muted-foreground">{gem.analysis}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="font-medium">Growth Potential</p>
                          <Badge variant="secondary">{gem.growthPercentage}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Success/Failure Rate</p>
                          <Badge variant="secondary">{gem.successRate} / {gem.failureRate}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Trend Duration</p>
                          <Badge variant="secondary">{gem.trendDuration}</Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Sentiment</p>
                          <Badge
                            variant={gem.sentiment === 'positive' ? 'default' : gem.sentiment === 'negative' ? 'destructive' : 'secondary'}
                            className={gem.sentiment === 'positive' ? 'bg-green-500/20 text-green-400 border-green-500/30' : gem.sentiment === 'negative' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                          >
                            {gem.sentiment}
                          </Badge>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
