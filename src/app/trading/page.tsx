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

export default function TradingPage() {
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
              <CardTitle>Exchange Integration</CardTitle>
              <CardDescription>
                Connect to your favorite exchanges to enable automated trading.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row">
              <Select>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binance">Binance</SelectItem>
                  <SelectItem value="coinbase">Coinbase</SelectItem>
                  <SelectItem value="kraken">Kraken</SelectItem>
                </SelectContent>
              </Select>
              <Button>Connect</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
