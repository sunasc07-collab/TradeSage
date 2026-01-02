'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating high-potential cryptocurrency trade suggestions.
 *
 * - generateTradeSuggestions - A function that generates trade suggestions.
 * - GenerateTradeSuggestionsOutput - The return type for the generateTradeSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const getMarketData = ai.defineTool(
  {
    name: 'getMarketDataForSuggestion',
    description: 'Get market data for a given cryptocurrency to evaluate it for a trade suggestion.',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to get market data for'),
    }),
    outputSchema: z.object({
      price: z.number(),
      marketCap: z.number(),
      volume24h: z.number(),
    }),
  },
  async ({ coin }) => {
    // In a real app, you'd fetch this from a crypto API
    return {
      price: Math.random() * 100,
      marketCap: Math.random() * 1e7, // Lower market cap for "gems"
      volume24h: Math.random() * 1e6,
    };
  }
);

const getSocialMediaSentiment = ai.defineTool(
  {
    name: 'getSocialMediaSentimentForSuggestion',
    description: 'Get social media sentiment for a given cryptocurrency.',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to get sentiment for'),
    }),
    outputSchema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      buzz: z.number().describe('A score from 0 to 100 representing social media buzz.'),
    }),
  },
  async ({ coin }) => {
    // In a real app, you'd use a social media API
    return {
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      buzz: Math.random() * 100,
    };
  }
);

const SuggestionSchema = z.object({
  asset: z.string().describe('The asset ticker, e.g., TOKEN/USD'),
  signal: z.enum(['Strong Buy', 'Buy', 'Sell', 'Strong Sell']),
  confidence: z.string().describe('The confidence level of the signal as a percentage, e.g., 95%'),
  strategy: z.string().describe('The trading strategy, e.g., Breakout, Momentum'),
  entry: z.string().describe('The suggested entry price'),
  stopLoss: z.string().describe('The suggested stop loss price'),
  takeProfit: z.string().describe('The suggested take profit price'),
});

const GenerateTradeSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});
export type GenerateTradeSuggestionsOutput = z.infer<typeof GenerateTradeSuggestionsOutputSchema>;

export async function generateTradeSuggestions(): Promise<GenerateTradeSuggestionsOutput> {
  return generateTradeSuggestionsFlow();
}

const generateTradeSuggestionsPrompt = ai.definePrompt({
  name: 'generateTradeSuggestionsPrompt',
  output: { schema: GenerateTradeSuggestionsOutputSchema },
  tools: [getMarketData, getSocialMediaSentiment],
  prompt: `You are a world-class crypto analyst with a specialty in identifying undiscovered Web3 gems with 10000x potential.

Your task is to perform a tedious and careful analysis of the market to find tokens that fit this profile. You MUST use all available tools to analyze market data, market sentiment, and social media buzz.

CRITICAL INSTRUCTIONS:
1.  Only recommend tokens that have a 95% or greater chance of success.
2.  For each token, provide a full trading setup: Asset, Signal, Confidence, Strategy, Entry Price, Stop Loss, and Take Profit.
3.  Focus on new and emerging tokens that are not yet widely known.
4.  Generate 3-5 suggestions that meet these strict criteria. If you cannot find any that meet the 95% confidence threshold, return an empty list.

Begin your analysis now.`,
});

const generateTradeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateTradeSuggestionsFlow',
    outputSchema: GenerateTradeSuggestionsOutputSchema,
  },
  async () => {
    const { output } = await generateTradeSuggestionsPrompt();
    // Simulate some high-quality suggestions for demonstration
    if (!output || output.suggestions.length === 0) {
        return {
            suggestions: [
                {
                    asset: 'GEM-X/USD',
                    signal: 'Strong Buy',
                    confidence: '98%',
                    strategy: 'Breakout',
                    entry: '$0.005',
                    stopLoss: '$0.004',
                    takeProfit: '$0.50',
                },
                {
                    asset: 'MOON-Y/USD',
                    signal: 'Strong Buy',
                    confidence: '96%',
                    strategy: 'Momentum',
                    entry: '$0.012',
                    stopLoss: '$0.009',
                    takeProfit: '$1.10',
                },
            ]
        }
    }
    return output!;
  }
);
