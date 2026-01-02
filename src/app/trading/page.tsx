'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tradeSuggestions } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Wallet = {
  name: string;
  downloadUrl: string;
  isProvider: boolean;
};

const wallets: Record<string, Wallet> = {
  MetaMask: {
    name: 'MetaMask',
    downloadUrl: 'https://metamask.io/download/',
    isProvider: typeof window !== 'undefined' && !!(window as any).ethereum,
  },
  'Trust Wallet': {
    name: 'Trust Wallet',
    downloadUrl: 'https://trustwallet.com/download',
    isProvider: false, // More complex to detect, assuming not present for this simulation
  },
  WalletConnect: {
    name: 'WalletConnect',
    downloadUrl: 'https://walletconnect.com/explorer',
    isProvider: false, // This is a protocol, not a direct provider
  },
  'Coinbase Wallet': {
    name: 'Coinbase Wallet',
    downloadUrl: 'https://www.coinbase.com/wallet/downloads',
    isProvider: false, // Can also use window.ethereum
  },
  Ledger: {
    name: 'Ledger',
    downloadUrl: 'https://www.ledger.com/ledger-live',
    isProvider: false, // Hardware wallet, different integration
  },
};

export default function TradingPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedWallet) return;

    const walletInfo = wallets[selectedWallet];

    if (walletInfo) {
      if (walletInfo.name === 'MetaMask' && (window as any).ethereum) {
        // In a real app, you would initiate the connection request here.
        // For example: `await (window as any).ethereum.request({ method: 'eth_requestAccounts' });`
        setConnectedWallet(selectedWallet);
        toast({
          title: "Wallet Connected",
          description: `You are now connected with ${selectedWallet}.`,
        });
      } else {
        setConnectedWallet(null);
        toast({
          variant: "destructive",
          title: `${walletInfo.name} Not Found`,
          description: `Please install the ${walletInfo.name} extension to connect.`,
          action: (
            <a href={walletInfo.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">Download</Button>
            </a>
          ),
        });
      }
    }
  };

  const handleDisconnect = () => {
    toast({
      title: "Wallet Disconnected",
      description: `You have disconnected from ${connectedWallet}.`,
    });
    setConnectedWallet(null);
    setSelectedWallet('');
  };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Automated Trading"
        description="Execute trades automatically based on the AI's market analysis and forecasts."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Trade Suggestions</CardTitle>
              <CardDescription>
                High-probability trade setups identified by TradeSage AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Signal</TableHead>
                    <TableHead className="text-right">Confidence</TableHead>
                    <TableHead>Strategy</TableHead>
                    <TableHead className="text-right">Entry Price</TableHead>
                    <TableHead className="text-right">Stop Loss</TableHead>
                    <TableHead className="text-right">Take Profit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeSuggestions.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.asset}</TableCell>
                      <TableCell>
                        <Badge variant={trade.signal.includes('Buy') ? 'default' : 'destructive'} className={trade.signal.includes('Buy') ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                          {trade.signal}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{trade.confidence}</TableCell>
                      <TableCell>{trade.strategy}</TableCell>
                      <TableCell className="text-right font-code">{trade.entry}</TableCell>
                      <TableCell className="text-right font-code">{trade.stopLoss}</TableCell>
                      <TableCell className="text-right font-code">{trade.takeProfit}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                          <Button size="sm">Execute</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Integration</CardTitle>
              <CardDescription>
                Connect to your favorite Web3 wallets to enable automated trading.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row">
              {!connectedWallet ? (
                <>
                  <Select onValueChange={setSelectedWallet} value={selectedWallet}>
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Select Wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(wallets).map(wallet => (
                        <SelectItem key={wallet.name} value={wallet.name}>{wallet.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleConnect} disabled={!selectedWallet}>Connect</Button>
                </>
              ) : (
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm">Connected with <span className="font-semibold">{connectedWallet}</span></p>
                  <Button variant="destructive" onClick={handleDisconnect}>Disconnect</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
