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


const getOnChainData = ai.defineTool(
  {
    name: 'getOnChainData',
    description: 'Retrieves on-chain data for a given token on a specific blockchain, simulating tools like DEX Screener or Nansen.',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to get on-chain data for.'),
      blockchain: z.string().describe('The blockchain the coin is on (e.g., Ethereum, Solana, Base).'),
    }),
    outputSchema: z.object({
      transactionVolume: z.number(),
      holderCount: z.number(),
      recentActivity: z.string(),
    }),
  },
  async ({ coin, blockchain }) => {
    // In a real app, you'd use a blockchain analytics service
    return {
      transactionVolume: Math.random() * 1e6,
      holderCount: Math.floor(Math.random() * 10000),
      recentActivity: `High volume of trades for ${coin} on ${blockchain} in the last 24h.`,
    };
  }
);

const getProjectFundamentals = ai.defineTool(
  {
    name: 'getProjectFundamentals',
    description: 'Analyzes project fundamentals like whitepaper, team, and tokenomics.',
    inputSchema: z.object({
      coin: z.string().describe('The cryptocurrency to analyze.'),
    }),
    outputSchema: z.object({
      whitepaperSummary: z.string(),
      teamReputation: z.enum(['strong', 'average', 'weak']),
      tokenomics: z.string(),
    }),
  },
  async ({ coin }) => {
    // In a real app, this would involve scraping/parsing documents.
    return {
      whitepaperSummary: `The whitepaper for ${coin} outlines a novel approach to decentralized AI.`,
      teamReputation: ['strong', 'average', 'weak'][Math.floor(Math.random() * 3)] as 'strong' | 'average' | 'weak',
      tokenomics: '50% of tokens allocated to community, 20% to team, 30% to ecosystem fund.',
    };
  }
);

const getCommunityEngagement = ai.defineTool(
    {
      name: 'getCommunityEngagement',
      description: 'Gauges community engagement and sentiment from social media platforms like Twitter/X and Telegram.',
      inputSchema: z.object({
        coin: z.string().describe('The cryptocurrency to get community engagement for.'),
      }),
      outputSchema: z.object({
        sentiment: z.enum(['positive', 'neutral', 'negative']),
        buzz: z.number().describe('A score from 0 to 100 representing social media buzz.'),
        keyTopics: z.array(z.string()),
      }),
    },
    async ({ coin }) => {
      // In a real app, you'd use a social media API
      return {
        sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
        buzz: Math.random() * 100,
        keyTopics: [`Upcoming partnership for $${coin}`, `Speculation on ${coin} utility`, `Airdrop rumors`],
      };
    }
);


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
  tools: [getOnChainData, getProjectFundamentals, getCommunityEngagement],
  prompt: `You are an expert in identifying promising, low-market-cap cryptocurrencies (gems) across all available blockchains.

  Based on the user's criteria, you must perform a comprehensive analysis using the specialized tools provided. For each potential gem you find:
  1.  Use the getOnChainData tool to fetch its on-chain metrics for its specific blockchain.
  2.  Use the getProjectFundamentals tool to analyze its whitepaper, team, and tokenomics.
  3.  Use the getCommunityEngagement tool to gauge social media sentiment and buzz.

  Synthesize the information from all tools to provide a detailed analysis and risk assessment for each gem you identify. If no gems are found, return an empty gems array and an analysis stating that no gems were found.

  User Criteria: {{{prompt}}}

  Present your findings in a well-structured format. Ensure the analysis is thorough and provides actionable insights.
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
    if (!output) {
      return {
        gems: [],
        analysis: "The AI model did not return a valid analysis. This may be a temporary issue. Please try again.",
      };
    }
    return output;
  }
);
