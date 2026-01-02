import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { walletAssets } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";

export default function WalletPage() {
  const totalBalance = walletAssets.reduce((acc, asset) => {
    return acc + parseFloat(asset.value.replace(/[^0-9.-]+/g, ""));
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Wallet">
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDown className="mr-2 h-4 w-4" /> Receive
          </Button>
          <Button>
            <ArrowUp className="mr-2 h-4 w-4" /> Send
          </Button>
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
              {totalBalance.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>24h Performance</CardTitle>
            <CardDescription>Your portfolio's performance over the last day.</CardDescription>
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
          <CardDescription>
            A list of all assets in your wallet.
          </CardDescription>
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
                         <AvatarImage src={asset.icon} alt={asset.asset}/>
                        <AvatarFallback>{asset.ticker.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{asset.asset}</div>
                        <div className="text-sm text-muted-foreground">{asset.ticker}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-code">{asset.balance}</TableCell>
                  <TableCell className="text-right font-code">{asset.value}</TableCell>
                  <TableCell className={cn("text-right font-code", asset.changeType === 'increase' ? 'text-green-400' : 'text-red-400')}>
                    {asset.change}
                  </TableCell>
                  <TableCell className="text-right">{asset.allocation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
