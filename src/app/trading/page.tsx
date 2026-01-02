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

export default function TradingPage() {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = () => {
    if (selectedWallet) {
      setConnectedWallet(selectedWallet);
      toast({
        title: "Wallet Connected",
        description: `You are now connected with ${selectedWallet}.`,
      });
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
                      <SelectItem value="MetaMask">MetaMask</SelectItem>
                      <SelectItem value="Trust Wallet">Trust Wallet</SelectItem>
                      <SelectItem value="WalletConnect">WalletConnect</SelectItem>
                      <SelectItem value="Coinbase Wallet">Coinbase Wallet</SelectItem>
                      <SelectItem value="Ledger">Ledger</SelectItem>
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
