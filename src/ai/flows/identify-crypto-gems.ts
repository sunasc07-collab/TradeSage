'use server';

/**
 * @fileOverview This flow identifies promising, low-market-cap cryptocurrencies ('gems') based on a prompt.
 *
 * - identifyCryptoGems - A function that initiates the identification process.
 * - IdentifyCryptoGemsInput - The input type for the identifyCryptoGems function.
 * - IdentifyCryptoGemsOutput - The return type for the identifyCryptoGems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCryptoGemsInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A prompt describing the desired characteristics of the cryptocurrency gems to identify, including market cap, blockchain data, social media activity, and project fundamentals.'
    ),
});
export type IdentifyCryptoGemsInput = z.infer<typeof IdentifyCryptoGemsInputSchema>;

const IdentifyCryptoGemsOutputSchema = z.object({
  gems: z
    .array(z.string())
    .describe(
      'An array of cryptocurrency gems that match the criteria specified in the prompt.'
    ),
  analysis: z
    .string()
    .describe(
      'A detailed analysis of each identified gem, including blockchain data, social media activity, project fundamentals, and risk assessment.'
    ),
});
export type IdentifyCryptoGemsOutput = z.infer<typeof IdentifyCryptoGemsOutputSchema>;

export async function identifyCryptoGems(input: IdentifyCryptoGemsInput): Promise<IdentifyCryptoGemsOutput> {
  return identifyCryptoGemsFlow(input);
}

const identifyCryptoGemsPrompt = ai.definePrompt({
  name: 'identifyCryptoGemsPrompt',
  input: {schema: IdentifyCryptoGemsInputSchema},
  output: {schema: IdentifyCryptoGemsOutputSchema},
  prompt: `You are an expert in identifying promising, low-market-cap cryptocurrencies (gems).

  Based on the following criteria, identify potential cryptocurrency gems and provide a detailed analysis of each.

  Criteria: {{{prompt}}}

  Present your findings in a well-structured format, including the cryptocurrency name, ticker symbol, market cap, blockchain data analysis, social media activity analysis, project fundamentals assessment, and a risk assessment for each gem.

  Ensure that the analysis is thorough and provides actionable insights for potential investors.
  `,
});

const identifyCryptoGemsFlow = ai.defineFlow(
  {
    name: 'identifyCryptoGemsFlow',
    inputSchema: IdentifyCryptoGemsInputSchema,
    outputSchema: IdentifyCryptoGemsOutputSchema,
  },
  async input => {
    const {output} = await identifyCryptoGemsPrompt(input);
    return output!;
  }
);
