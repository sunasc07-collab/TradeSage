'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing market trends, technical indicators, and sentiment data to provide users with an overview of potential trading opportunities.
 *
 * - analyzeMarket - A function that analyzes market data from a given prompt.
 * - AnalyzeMarketInput - The input type for the analyzeMarket function.
 * - AnalyzeMarketOutput - The return type for the analyzeMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const getMarketData = ai.defineTool(
  {
    name: 'getMarketData',
    description: 'Get market data for a given cryptocurrency',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to get market data for'),
    }),
    outputSchema: z.object({
      price: z.number(),
      marketCap: z.number(),
      volume24h: z.number(),
    }),
  },
  async ({coin}) => {
    // In a real app, you'd fetch this from a crypto API
    return {
      price: Math.random() * 100,
      marketCap: Math.random() * 1e9,
      volume24h: Math.random() * 1e7,
    };
  }
);

const getSocialMediaSentiment = ai.defineTool(
  {
    name: 'getSocialMediaSentiment',
    description: 'Get social media sentiment for a given cryptocurrency',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to get sentiment for'),
    }),
    outputSchema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      recentPosts: z.array(z.string()),
    }),
  },
  async ({coin}) => {
    // In a real app, you'd use a social media API
    return {
      sentiment: ['positive', 'neutral', 'negative'][
        Math.floor(Math.random() * 3)
      ] as 'positive' | 'neutral' | 'negative',
      recentPosts: [
        `Just bought a bag of $${coin}! To the moon! 🚀`,
        `I'm not so sure about ${coin}, looks a bit shaky.`,
        `What does everyone think about the new ${coin} partnership?`,
      ],
    };
  }
);

const AnalyzeMarketInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt containing information to be used in the market analysis, including coins to analyze.'
    ),
});
export type AnalyzeMarketInput = z.infer<typeof AnalyzeMarketInputSchema>;

const AnalyzeMarketOutputSchema = z.object({
  gems: z.array(
    z.object({
      name: z.string().describe('The name of the cryptocurrency gem.'),
      growthPercentage: z
        .string()
        .describe('The potential growth percentage.'),
      successRate: z.string().describe('The estimated success rate.'),
      failureRate: z.string().describe('The estimated failure rate.'),
      trendDuration: z
        .string()
        .describe('How long the upward trend might last.'),
      analysis: z.string().describe('A detailed analysis of the gem.'),
      sentiment: z.string().describe('Social media sentiment.'),
    })
  ),
});
export type AnalyzeMarketOutput = z.infer<typeof AnalyzeMarketOutputSchema>;

export async function analyzeMarket(
  input: AnalyzeMarketInput
): Promise<AnalyzeMarketOutput> {
  return analyzeMarketFlow(input);
}

const analyzeMarketPrompt = ai.definePrompt({
  name: 'analyzeMarketPrompt',
  input: {schema: AnalyzeMarketInputSchema},
  output: {schema: AnalyzeMarketOutputSchema},
  tools: [getMarketData, getSocialMediaSentiment],
  prompt: `You are an expert crypto analyst. The user wants you to identify and analyze emerging crypto gems and meme coins.
  
  For each potential gem you identify from the user's prompt, you must:
  1. Use the getMarketData tool to get its market data.
  2. Use the getSocialMediaSentiment tool to get social media sentiment.
  3. Based on the provided data and your own knowledge, generate a detailed analysis.
  4. Estimate the potential growth percentage, success rate, failure rate, and the potential duration of any upward trend.
  
  User Prompt: {{{prompt}}}
  
  Provide a list of gems with the requested analysis.`,
});

const analyzeMarketFlow = ai.defineFlow(
  {
    name: 'analyzeMarketFlow',
    inputSchema: AnalyzeMarketInputSchema,
    outputSchema: AnalyzeMarketOutputSchema,
  },
  async input => {
    const {output} = await analyzeMarketPrompt(input);
    return output!;
  }
);
