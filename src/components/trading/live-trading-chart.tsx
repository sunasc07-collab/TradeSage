'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';


// Generate initial random data
const generateInitialData = (numPoints = 60) => {
  let lastClose = Math.random() * 200 + 100;
  return Array.from({ length: numPoints }, (_, i) => {
    const open = lastClose * (1 + (Math.random() - 0.5) * 0.02);
    const close = open * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.random() * 1000 + 500;
    lastClose = close;
    return {
      time: new Date(Date.now() - (numPoints - i) * 60000).getTime(),
      open,
      high,
      low,
      close,
      volume,
    };
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
          <p className="font-bold">{new Date(label).toLocaleString()}</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <p>Open:</p><p className={cn("font-code text-right", data.open > data.close ? 'text-red-400' : 'text-green-400')}>{data.open.toFixed(2)}</p>
            <p>High:</p><p className="font-code text-right">{data.high.toFixed(2)}</p>
            <p>Low:</p><p className="font-code text-right">{data.low.toFixed(2)}</p>
            <p>Close:</p><p className={cn("font-code text-right", data.open > data.close ? 'text-red-400' : 'text-green-400')}>{data.close.toFixed(2)}</p>
            <p>Volume:</p><p className="font-code text-right">{data.volume.toFixed(0)}</p>
          </div>
        </div>
      );
    }
    return null;
};

// A custom shape for the candlestick
const CandlestickShape = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  const isRising = close > open;
  const color = isRising ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))';
  const wickColor = isRising ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))';

  const bodyHeight = Math.abs(y - props.y)
  const bodyY = isRising ? y + height: y;

  const bodyActualHeight = Math.max(1, bodyHeight);

  return (
    <g stroke={wickColor} strokeWidth="1" fill={color}>
      {/* Wick */}
      <path d={`M ${x + width / 2} ${props.y} L ${x + width / 2} ${y}`} />
      <path d={`M ${x + width / 2} ${y + height} L ${x + width / 2} ${props.y + props.height}`} />
      {/* Body */}
      <rect x={x} y={bodyY} width={width} height={bodyActualHeight} />
    </g>
  );
};


export function LiveTradingChart() {
  const [data, setData] = useState(generateInitialData());
  const [symbol, setSymbol] = useState('BTC');
  const [inputSymbol, setInputSymbol] = useState('BTC');

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastDataPoint = prevData[prevData.length - 1];
        const newTime = new Date().getTime();
        const open = lastDataPoint.close;
        const close = open * (1 + (Math.random() - 0.5) * 0.01);
        const high = Math.max(open, close) * (1 + Math.random() * 0.005);
        const low = Math.min(open, close) * (1 - Math.random() * 0.005);
        const volume = Math.random() * 1000 + 500;

        const newDataPoint = {
          time: newTime,
          open,
          high,
          low,
          close,
          volume,
        };

        return [...prevData.slice(1), newDataPoint];
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSymbolChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSymbol(inputSymbol.toUpperCase());
    // Reset data for new symbol
    setData(generateInitialData());
  };

  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = -Infinity;
    data.forEach(d => {
      minPrice = Math.min(minPrice, d.low);
      maxPrice = Math.max(maxPrice, d.high);
      maxVolume = Math.max(maxVolume, d.volume);
    });
    return { 
        minPrice: minPrice * 0.99, 
        maxPrice: maxPrice * 1.01,
        maxVolume: maxVolume * 2, // Double to give volume chart space
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-4 space-y-0 md:flex-row md:items-center md:space-y-0">
        <div className="flex-1">
          <CardTitle>Live Trading Chart: {symbol}/USDT</CardTitle>
          <CardDescription>Simulated real-time 1-minute candlestick data.</CardDescription>
        </div>
        <form onSubmit={handleSymbolChange} className="flex gap-2">
            <Input 
                placeholder="e.g., ETH"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                className="w-[120px]"
            />
            <Button type="submit">
                <Search />
                Load
            </Button>
        </form>
      </CardHeader>
      <CardContent className="h-[500px] w-full pr-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke="hsl(var(--muted-foreground))"
              tickCount={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={[minPrice, maxPrice]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(price) => `${price.toFixed(2)}`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="volume"
              orientation="left"
              domain={[0, maxVolume]}
              tickFormatter={(vol) => `${(vol / 1000).toFixed(1)}k`}
              stroke="hsl(var(--muted-foreground))"
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              yAxisId="price"
              dataKey="close"
              shape={<CandlestickShape />}
              isAnimationActive={false}
            >
               {data.map((entry, index) => (
                <Bar key={`candle-${index}`} fill={entry.open > entry.close ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))'} />
              ))}
            </Bar>
            
             <Line type="monotone" dataKey="close" stroke="hsl(var(--primary) / 0.5)" dot={false} yAxisId="price" isAnimationActive={false} />

            <Bar yAxisId="volume" dataKey="volume" barSize={20} isAnimationActive={false}>
                {data.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.open > entry.close ? 'hsl(var(--destructive) / 0.3)' : 'hsl(var(--chart-2) / 0.3)'} />
                ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
