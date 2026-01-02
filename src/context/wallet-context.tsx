'use client';

import { GenerateTradeSuggestionsOutput } from '@/ai/flows/generate-trade-suggestions';
import { demoWalletAssets, realWalletAssets } from '@/lib/data';
import { createContext, useState, ReactNode } from 'react';

// This is a simplified conversion. A real app would need a more robust mapping.
const tradeToAsset = (trade: TradeSuggestion): WalletAsset => {
    const [ticker] = trade.asset.split('/');
    const value = parseFloat(trade.entry.replace('$', ''));
    // Simulate buying 100 units of currency worth of the asset
    const balance = (100 / value).toFixed(3);

    return {
        asset: ticker,
        ticker: ticker,
        icon: trade.iconUrl,
        balance: balance,
        value: '100.00', // Each trade is simulated as a $100 purchase
        allocation: 'N/A', // Recalculating allocation is complex, omitting for now
        change: '+0.0%', // Static change for simplicity
        changeType: 'increase',
    }
}


export type WalletAsset = {
  asset: string;
  ticker: string;
  icon: string;
  balance: string;
  value: string;
  allocation: string;
  change: string;
  changeType: 'increase' | 'decrease';
};

type TradeSuggestion = GenerateTradeSuggestionsOutput['suggestions'][0];

type WalletContextType = {
  demoAssets: WalletAsset[];
  realAssets: WalletAsset[];
  addAsset: (accountType: 'demo' | 'real', trade: TradeSuggestion) => void;
};

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [demoAssets, setDemoAssets] = useState<WalletAsset[]>(demoWalletAssets);
  const [realAssets, setRealAssets] = useState<WalletAsset[]>(realWalletAssets);

  const addAsset = (accountType: 'demo' | 'real', trade: TradeSuggestion) => {
    const newAsset = tradeToAsset(trade);
    if (accountType === 'demo') {
      setDemoAssets((prevAssets) => {
        // Prevent adding duplicates
        if (prevAssets.some(asset => asset.ticker === newAsset.ticker)) {
            return prevAssets;
        }
        return [...prevAssets, newAsset]
      });
    } else {
      setRealAssets((prevAssets) => {
        if (prevAssets.some(asset => asset.ticker === newAssetticker)) {
            return prevAssets;
        }
        return [...prevAssets, newAsset]
      });
    }
  };

  return (
    <WalletContext.Provider value={{ demoAssets, realAssets, addAsset }}>
      {children}
    </WalletContext.Provider>
  );
};
