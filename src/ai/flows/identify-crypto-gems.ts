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

const getAltfinsAnalysis = ai.defineTool(
    {
        name: 'getAltfinsAnalysis',
        description: 'Analyzes cryptocurrency charts for patterns and technical indicators, simulating Altfins.',
        inputSchema: z.object({
            coin: z.string().describe('The cryptocurrency to analyze.'),
        }),
        outputSchema: z.object({
            pattern: z.string().describe('The identified chart pattern, e.g., "Bullish Flag", "Head and Shoulders".'),
            trend: z.enum(['bullish', 'bearish', 'neutral']).describe('The current price trend.'),
        }),
    },
    async ({ coin }) => {
        const patterns = ['Bullish Flag', 'Bearish Pennant', 'Double Bottom', 'Head and Shoulders'];
        return {
            pattern: patterns[Math.floor(Math.random() * patterns.length)],
            trend: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)] as 'bullish' | 'bearish' | 'neutral',
        };
    }
);

const getCoinGeckoData = ai.defineTool(
    {
        name: 'getCoinGeckoData',
        description: 'Retrieves detailed token information and metrics from a source simulating CoinGecko.',
        inputSchema: z.object({
            coin: z.string().describe('The cryptocurrency to get data for.'),
        }),
        outputSchema: z.object({
            socialScore: z.number().describe('A score representing social media presence.'),
            developerScore: z.number().describe('A score representing developer activity.'),
            communityScore: z.number().describe('A score representing community engagement.'),
        }),
    },
    async ({ coin }) => {
        return {
            socialScore: Math.random() * 100,
            developerScore: Math.random() * 100,
            communityScore: Math.random() * 100,
        };
    }
);

const getTradingViewSignal = ai.defineTool(
    {
        name: 'getTradingViewSignal',
        description: 'Gets a real-time trading signal from a source simulating TradingView.',
        inputSchema: z.object({
            coin: z.string().describe('The cryptocurrency to get a signal for.'),
            timeframe: z.string().describe('The chart timeframe, e.g., "1h", "4h", "1D".'),
        }),
        outputSchema: z.object({
            signal: z.enum(['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell']),
        }),
    },
    async ({ coin, timeframe }) => {
        const signals = ['Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];
        return {
            signal: signals[Math.floor(Math.random() * signals.length)] as 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell',
        };
    }
);

const getDeFiLlamaTVL = ai.defineTool(
    {
        name: 'getDeFiLlamaTVL',
        description: 'Retrieves the Total Value Locked (TVL) for a token or protocol from a source simulating DeFiLlama.',
        inputSchema: z.object({
            coin: z.string().describe('The cryptocurrency or protocol to get TVL for.'),
        }),
        outputSchema: z.object({
            tvl: z.number().describe('The Total Value Locked in USD.'),
            tvlChange24h: z.number().describe('The percentage change in TVL over the last 24 hours.'),
        }),
    },
    async ({ coin }) => {
        return {
            tvl: Math.random() * 1e9,
            tvlChange24h: (Math.random() - 0.5) * 10, // Random change between -5% and +5%
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
  tools: [getOnChainData, getProjectFundamentals, getCommunityEngagement, getAltfinsAnalysis, getCoinGeckoData, getTradingViewSignal, getDeFiLlamaTVL],
  prompt: `You are an expert in identifying promising, low-market-cap cryptocurrencies (gems) across all available blockchains. Your analysis must be of the highest caliber, simulating insights from top-tier platforms.

  Based on the user's criteria, you must perform a comprehensive, multi-faceted analysis using the specialized tools provided. For each potential gem you find:
  1.  Use the getOnChainData tool to fetch its on-chain metrics.
  2.  Use the getProjectFundamentals tool to analyze its whitepaper, team, and tokenomics.
  3.  Use the getCommunityEngagement tool to gauge social media sentiment and buzz.
  4.  Use getAltfinsAnalysis to identify technical chart patterns.
  5.  Use getCoinGeckoData to assess social, developer, and community scores.
  6.  Use getTradingViewSignal to get a real-time trading signal.
  7.  If it's a DeFi project, use getDeFiLlamaTVL to check its Total Value Locked.

  Synthesize the information from ALL tools to provide a detailed analysis and risk assessment for each gem you identify. If no gems are found that meet the criteria, return an empty gems array and an analysis stating that no gems were found.

  User Criteria: {{{prompt}}}

  Present your findings in a well-structured format. Your analysis must be thorough, critical, and provide actionable insights. Do not just list the data; interpret it.
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
