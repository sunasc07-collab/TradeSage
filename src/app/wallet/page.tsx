'use client';

import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { walletAssets } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Clipboard,
  ClipboardCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function WalletPage() {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);
  const receiveAddress = '0x1aB2c3d4e5f6A7B8C9d0E1F2a3B4c5D6e7F8g9H0';

  const totalBalance = walletAssets.reduce((acc, asset) => {
    return acc + parseFloat(asset.value.replace(/[^0-9.-]+/g, ''));
  }, 0);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receiveAddress).then(() => {
      setHasCopied(true);
      toast({ title: 'Address Copied!', description: 'USDT address has been copied to your clipboard.' });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };
  
  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const address = formData.get('address');
    const amount = formData.get('amount');
    toast({
      title: 'Transaction Sent!',
      description: `You sent ${amount} USDT to ${address}.`,
    });
    // Close dialog after submission - requires managing dialog open state
  };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Wallet">
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowDown className="mr-2 h-4 w-4" /> Receive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Receive USDT</DialogTitle>
                <DialogDescription>
                  Scan the QR code or copy the address below to receive USDT
                  (BSC Network).
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 py-4">
                <div className="rounded-lg bg-white p-2">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${receiveAddress}`}
                    alt="USDT Receive QR Code"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="address"
                    value={receiveAddress}
                    readOnly
                    className="font-code"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={copyToClipboard}
                  >
                    {hasCopied ? (
                      <ClipboardCheck className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <ArrowUp className="mr-2 h-4 w-4" /> Send
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send USDT</DialogTitle>
                <DialogDescription>
                  Enter the recipient address and amount to send.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSend}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue="0x9hG8fE7d6C5b4A3F2e1D0c9B8a7F6e5D4c3b2a1"
                      className="col-span-3 font-code"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send Funds</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>
              The total value of all assets in your wallet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-headline">
              {totalBalance.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>24h Performance</CardTitle>
            <CardDescription>
              Your portfolio&apos;s performance over the last day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 text-4xl font-bold font-headline text-green-400">
              +$1,204.58
              <span className="flex items-center gap-1 text-lg text-green-400">
                <ArrowUpRight className="h-5 w-5" />
                +1.8%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>A list of all assets in your wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Value (USD)</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletAssets.map((asset) => (
                <TableRow key={asset.ticker}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={asset.icon} alt={asset.asset} />
                        <AvatarFallback>
                          {asset.ticker.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{asset.asset}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.ticker}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-code">{asset.balance}</TableCell>
                  <TableCell className="text-right font-code">
                    {asset.value}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-code',
                      asset.changeType === 'increase'
                        ? 'text-green-400'
                        : 'text-red-400'
                    )}
                  >
                    {asset.change}
                  </TableCell>
                  <TableCell className="text-right">
                    {asset.allocation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
