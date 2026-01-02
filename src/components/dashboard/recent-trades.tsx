import { Trade, tradeHistory } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

export function RecentTrades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>
          A log of your most recent automated trades.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeHistory.map((trade: Trade) => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.asset}</TableCell>
                <TableCell>
                  <Badge variant={trade.type === "Buy" ? "default" : "secondary"}>
                    {trade.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {trade.status === "Closed" ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-400" />
                    )}
                    {trade.status}
                  </div>
                </TableCell>
                <TableCell>
                  {trade.result !== "N/A" ? (
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        trade.result === "Win"
                          ? "text-green-400"
                          : "text-red-400"
                      )}
                    >
                      {trade.result === "Win" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {trade.result}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>{trade.date}</TableCell>
                <TableCell
                  className={cn("text-right font-code",
                    trade.pnl.startsWith('+') && 'text-green-400',
                    trade.pnl.startsWith('-') && 'text-red-400'
                  )}
                >
                  {trade.pnl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
