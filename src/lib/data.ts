import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle,
  CircleDollarSign,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react";

export const stats = [
  {
    label: "Total Profit/Loss",
    value: "$4,805.00",
    change: "+2.5%",
    changeType: "increase" as const,
    icon: CircleDollarSign,
  },
  {
    label: "Success Rate",
    value: "82.3%",
    change: "-1.2%",
    changeType: "decrease" as const,
    icon: CheckCircle,
  },
  {
    label: "Win/Loss Ratio",
    value: "4.6 : 1",
    change: "+0.3",
    changeType: "increase" as const,
    icon: TrendingUp,
  },
  {
    label: "Max Drawdown",
    value: "15.2%",
    change: "+3.1%",
    changeType: "decrease" as const,
    icon: ArrowDownRight,
  },
];

export const performanceData = [
  { date: "2024-01-01", profit: 0 },
  { date: "2024-01-08", profit: 250 },
  { date: "2024-01-15", profit: 180 },
  { date: "2024-01-22", profit: 450 },
  { date: "2024-01-29", profit: 600 },
  { date: "2024-02-05", profit: 820 },
  { date: "2024-02-12", profit: 750 },
  { date: "2024-02-19", profit: 1100 },
  { date: "2024-02-26", profit: 980 },
  { date: "2024-03-04", profit: 1400 },
  { date: "2024-03-11", profit: 1650 },
  { date: "2024-03-18", profit: 1550 },
];

export const assetDistributionData = [
  { name: "Bitcoin", value: 45, fill: "var(--color-btc)" },
  { name: "Ethereum", value: 30, fill: "var(--color-eth)" },
  { name: "Solana", value: 15, fill: "var(--color-sol)" },
  { name: "Others", value: 10, fill: "var(--color-others)" },
];

export const tradeHistory = [
  {
    id: "TRD-001",
    asset: "BTC/USD",
    type: "Buy",
    status: "Closed",
    result: "Win",
    pnl: "+$250.75",
    date: "2024-03-18 10:30 AM",
  },
  {
    id: "TRD-002",
    asset: "ETH/USD",
    type: "Sell",
    status: "Closed",
    result: "Loss",
    pnl: "-$85.20",
    date: "2024-03-18 09:15 AM",
  },
  {
    id: "TRD-003",
    asset: "SOL/USD",
    type: "Buy",
    status: "Open",
    result: "N/A",
    pnl: "N/A",
    date: "2024-03-17 08:00 PM",
  },
  {
    id: "TRD-004",
    asset: "ADA/USD",
    type: "Buy",
    status: "Closed",
    result: "Win",
    pnl: "+$120.00",
    date: "2024-03-17 02:45 PM",
  },
  {
    id: "TRD-005",
    asset: "BTC/USD",
    type: "Sell",
    status: "Closed",
    result: "Win",
    pnl: "+$310.50",
    date: "2024-03-16 11:00 AM",
  },
];


export const demoWalletAssets = [
  {
    asset: "Bitcoin",
    ticker: "BTC",
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/btc.svg',
    balance: "0.057",
    value: "$4000.00",
    allocation: "40%",
    change: "+1.2%",
    changeType: "increase",
  },
  {
    asset: "Ethereum",
    ticker: "ETH",
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/eth.svg',
    balance: "0.88",
    value: "$3000.00",
    allocation: "30%",
    change: "-0.8%",
    changeType: "decrease",
  },
  {
    asset: "Solana",
    ticker: "SOL",
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/sol.svg',
    balance: "12.12",
    value: "$2000.00",
    allocation: "20%",
    change: "+3.5%",
    changeType: "increase",
  },
  {
    asset: "Cardano",
    ticker: "ADA",
    icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/ada.svg',
    balance: "1000",
    value: "$1000.00",
    allocation: "10%",
    change: "+0.5%",
    changeType: "increase",
  },
];

export const realWalletAssets = [
    {
      asset: "Bitcoin",
      ticker: "BTC",
      icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/btc.svg',
      balance: "0.15",
      value: "$10406.98",
      allocation: "70%",
      change: "+2.1%",
      changeType: "increase",
    },
    {
      asset: "Ethereum",
      ticker: "ETH",
      icon: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c258d5/svg/color/eth.svg',
      balance: "1.25",
      value: "$4251.22",
      allocation: "30%",
      change: "-1.2%",
      changeType: "decrease",
    },
  ];
