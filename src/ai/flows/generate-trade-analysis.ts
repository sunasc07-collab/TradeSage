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

const AnalyzeMarketInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt containing information to be used in the market analysis.'
    ),
});
export type AnalyzeMarketInput = z.infer<typeof AnalyzeMarketInputSchema>;

const AnalyzeMarketOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the market data.'),
  recommendation: z.string().describe('A recommendation based on the analysis.'),
});
export type AnalyzeMarketOutput = z.infer<typeof AnalyzeMarketOutputSchema>;

export async function analyzeMarket(input: AnalyzeMarketInput): Promise<AnalyzeMarketOutput> {
  return analyzeMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMarketPrompt',
  input: {schema: AnalyzeMarketInputSchema},
  output: {schema: AnalyzeMarketOutputSchema},
  prompt: `You are an AI trading assistant. Analyze the following market data and provide a recommendation.

Market Data: {{{prompt}}}

Analysis:
Recommendation:`,
});

const analyzeMarketFlow = ai.defineFlow(
  {
    name: 'analyzeMarketFlow',
    inputSchema: AnalyzeMarketInputSchema,
    outputSchema: AnalyzeMarketOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
