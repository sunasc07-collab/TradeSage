'use client';

import { GenerateTradeSuggestionsOutput } from '@/ai/flows/generate-trade-suggestions';
import { demoWalletAssets, realWalletAssets } from '@/lib/data';
import { createContext, useState, ReactNode } from 'react';

// This is a simplified conversion. A real app would need a more robust mapping.
const tradeToAsset = (trade: TradeSuggestion, amount: number): WalletAsset => {
    const [ticker] = trade.asset.split('/');
    const entryPrice = parseFloat(trade.entry.replace('$', ''));
    // Simulate buying 'amount' USD worth of the asset
    const balance = (amount / entryPrice).toFixed(4);

    return {
        asset: ticker,
        ticker: ticker,
        icon: trade.iconUrl,
        balance: balance,
        value: amount.toFixed(2), // The value of the holding is the amount invested
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
  addAsset: (accountType: 'demo' | 'real', trade: TradeSuggestion, amount: number) => void;
};

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [demoAssets, setDemoAssets] = useState<WalletAsset[]>(demoWalletAssets);
  const [realAssets, setRealAssets] = useState<WalletAsset[]>(realWalletAssets);

  const addAsset = (accountType: 'demo' | 'real', trade: TradeSuggestion, amount: number) => {
    const newAsset = tradeToAsset(trade, amount);
    const updateAssets = (prevAssets: WalletAsset[]) => {
      const existingAssetIndex = prevAssets.findIndex(asset => asset.ticker === newAsset.ticker);
      if (existingAssetIndex > -1) {
        // Asset exists, update its balance and value
        const updatedAssets = [...prevAssets];
        const existingAsset = updatedAssets[existingAssetIndex];
        const updatedBalance = parseFloat(existingAsset.balance) + parseFloat(newAsset.balance);
        const updatedValue = parseFloat(existingAsset.value) + parseFloat(newAsset.value);
        updatedAssets[existingAssetIndex] = {
          ...existingAsset,
          balance: updatedBalance.toFixed(4),
          value: updatedValue.toFixed(2),
        };
        return updatedAssets;
      } else {
        // Asset does not exist, add it
        return [...prevAssets, newAsset];
      }
    };

    if (accountType === 'demo') {
      setDemoAssets(updateAssets);
    } else {
      setRealAssets(updateAssets);
    }
  };

  return (
    <WalletContext.Provider value={{ demoAssets, realAssets, addAsset }}>
      {children}
    </WalletContext.Provider>
  );
};
