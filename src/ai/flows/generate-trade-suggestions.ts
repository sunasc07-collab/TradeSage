'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating high-potential cryptocurrency trade suggestions.
 *
 * - generateTradeSuggestions - A function that generates trade suggestions.
 * - GenerateTradeSuggestionsInput - The input type for the generateTradeSuggestions function.
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
  asset: z.string().describe('The asset ticker, e.g., TOKEN/USDT'),
  iconUrl: z.string().url().describe('The URL for the token icon.'),
  signal: z.enum(['Strong Buy', 'Buy', 'Sell', 'Strong Sell']),
  confidence: z.string().describe('The confidence level of the signal as a percentage, e.g., 95%'),
  strategy: z.string().describe('The trading strategy, e.g., Breakout, Momentum'),
  entry: z.string().describe('The suggested entry price in USDT'),
  stopLoss: z.string().describe('The suggested stop loss price in USDT'),
  takeProfit: z.string().describe('The suggested take profit price in USDT'),
  blockchain: z.string().describe('The blockchain the token is on, e.g., Ethereum, Solana'),
  timeframe: z.string().describe('The estimated timeframe to achieve growth, e.g., 1 Week'),
});

const GenerateTradeSuggestionsInputSchema = z.object({
  prompt: z.string().optional().describe('An optional prompt to focus the suggestions, e.g., on specific discovered gems.'),
});

export type GenerateTradeSuggestionsInput = z.infer<typeof GenerateTradeSuggestionsInputSchema>;

const GenerateTradeSuggestionsOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});
export type GenerateTradeSuggestionsOutput = z.infer<typeof GenerateTradeSuggestionsOutputSchema>;

export async function generateTradeSuggestions(input?: GenerateTradeSuggestionsInput): Promise<GenerateTradeSuggestionsOutput> {
  return generateTradeSuggestionsFlow(input || {});
}

const generateTradeSuggestionsPrompt = ai.definePrompt({
  name: 'generateTradeSuggestionsPrompt',
  input: {schema: GenerateTradeSuggestionsInputSchema},
  output: { schema: GenerateTradeSuggestionsOutputSchema },
  tools: [getMarketData, getSocialMediaSentiment],
  prompt: `You are a world-class crypto analyst with a specialty in identifying undiscovered Web3 gems with 10000x potential within a very short timeframe.

Your task is to perform a tedious and careful analysis of the market to find tokens that fit this profile. You MUST use all available tools to analyze market data, market sentiment, and social media buzz.
Your analysis must be comprehensive, simulating data aggregation from sources like DEX Screener, Binance Web3, Trust Wallet, and other on-chain analysis platforms to find emerging tokens before they are widely known.

{{#if prompt}}
The user has provided the following context. Focus your analysis on this:
"{{{prompt}}}"
{{/if}}

CRITICAL INSTRUCTIONS:
1.  Only recommend tokens that have a 95% or greater chance of success.
2.  For each token, provide a full trading setup: Asset (as TOKEN/USDT), a URL for its icon, Signal, Confidence, Strategy, Entry Price, Stop Loss, Take Profit (all in USDT), Blockchain, and the estimated Timeframe for growth.
3.  The growth Timeframe MUST be within '1 Week'.
4.  Focus on new and emerging tokens that are not yet widely known, unless specified by the user prompt.
5.  Generate up to 5 suggestions that meet these strict criteria. If you cannot find any that meet the 95% confidence threshold, return an empty list.

Begin your analysis now.`,
});

const generateTradeSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateTradeSuggestionsFlow',
    inputSchema: GenerateTradeSuggestionsInputSchema,
    outputSchema: GenerateTradeSuggestionsOutputSchema,
  },
  async (input) => {
    if (input.prompt) {
         // Simulate a targeted response for a specific gem
         const gemSymbol = input.prompt.match(/\b([A-Z]{2,5})\b/)?.[1] || 'GEM';
         return {
             suggestions: [
                 {
                     asset: `${gemSymbol}/USDT`,
                     iconUrl: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/${gemSymbol.toLowerCase()}.svg`,
                     signal: 'Strong Buy',
                     confidence: '99%',
                     strategy: 'Targeted Breakout',
                     entry: '0.002',
                     stopLoss: '0.0015',
                     takeProfit: '0.45',
                     blockchain: 'Solana',
                     timeframe: '1 Week'
                 },
             ]
         };
    }
    // NOTE: To prevent rate-limiting errors during development, this flow
    // returns hardcoded data instead of making a live call to the AI model.
    return {
        suggestions: [
            {
                asset: 'GEM-X/USDT',
                iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/gem.svg',
                signal: 'Strong Buy',
                confidence: '98%',
                strategy: 'Breakout',
                entry: '0.005',
                stopLoss: '0.004',
                takeProfit: '0.50',
                blockchain: 'Solana',
                timeframe: '1 Week'
            },
            {
                asset: 'MOON-Y/USDT',
                iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/moon.svg',
                signal: 'Strong Buy',
                confidence: '96%',
                strategy: 'Momentum',
                entry: '0.012',
                stopLoss: '0.009',
                takeProfit: '1.10',
                blockchain: 'Ethereum',
                timeframe: '1 Week'
            },
             {
                asset: 'WEB3-Z/USDT',
                iconUrl: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/web.svg',
                signal: 'Strong Buy',
                confidence: '95%',
                strategy: 'DeFi Yield',
                entry: '0.025',
                stopLoss: '0.018',
                takeProfit: '2.50',
                blockchain: 'Base',
                timeframe: '1 Week'
            },
        ]
    };
  }
);
