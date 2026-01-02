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
      message: "Criteria must be at least 20 characters.",
    })
    .max(5000, {
      message: "Criteria cannot be more than 5000 characters.",
    }),
});

export function GemDiscoveryClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyCryptoGemsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt:
        "Find me crypto gems in the AI or DePIN sector with a market cap below $50 million, strong community engagement on Twitter/X, and recent developer activity on GitHub.",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const gemsResult = await identifyCryptoGems({ prompt: data.prompt });
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
            Enter your criteria for finding the next 100x crypto gem.
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
                    <FormLabel>Gem Criteria</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Low market cap AI tokens with high social media velocity...'"
                        className="min-h-[200px] font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
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
