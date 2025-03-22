import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const tokenData = [
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    price: 28.45,
    change24h: 5.67,
    marketCap: 10_234_567_890,
    volume24h: 567_890_123,
    circulatingSupply: 360_000_000,
    watchlisted: true,
    chart: [
      { time: "1d", price: 26.45 },
      { time: "2d", price: 27.12 },
      { time: "3d", price: 26.89 },
      { time: "4d", price: 27.45 },
      { time: "5d", price: 28.01 },
      { time: "6d", price: 27.65 },
      { time: "7d", price: 28.45 },
    ],
  },
  {
    id: "joe",
    name: "Trader Joe",
    symbol: "JOE",
    price: 0.65,
    change24h: -2.34,
    marketCap: 234_567_890,
    volume24h: 45_678_901,
    circulatingSupply: 350_000_000,
    watchlisted: false,
    chart: [
      { time: "1d", price: 0.67 },
      { time: "2d", price: 0.66 },
      { time: "3d", price: 0.64 },
      { time: "4d", price: 0.63 },
      { time: "5d", price: 0.64 },
      { time: "6d", price: 0.66 },
      { time: "7d", price: 0.65 },
    ],
  },
  {
    id: "png",
    name: "Pangolin",
    symbol: "PNG",
    price: 0.12,
    change24h: 1.23,
    marketCap: 45_678_901,
    volume24h: 5_678_901,
    circulatingSupply: 380_000_000,
    watchlisted: true,
    chart: [
      { time: "1d", price: 0.118 },
      { time: "2d", price: 0.119 },
      { time: "3d", price: 0.121 },
      { time: "4d", price: 0.12 },
      { time: "5d", price: 0.118 },
      { time: "6d", price: 0.119 },
      { time: "7d", price: 0.12 },
    ],
  },
  {
    id: "qi",
    name: "BENQI",
    symbol: "QI",
    price: 0.023,
    change24h: 7.89,
    marketCap: 23_456_789,
    volume24h: 3_456_789,
    circulatingSupply: 1_000_000_000,
    watchlisted: false,
    chart: [
      { time: "1d", price: 0.021 },
      { time: "2d", price: 0.022 },
      { time: "3d", price: 0.022 },
      { time: "4d", price: 0.021 },
      { time: "5d", price: 0.022 },
      { time: "6d", price: 0.023 },
      { time: "7d", price: 0.023 },
    ],
  },
  {
    id: "gmx",
    name: "GMX",
    symbol: "GMX",
    price: 45.67,
    change24h: -0.45,
    marketCap: 345_678_901,
    volume24h: 23_456_789,
    circulatingSupply: 8_000_000,
    watchlisted: true,
    chart: [
      { time: "1d", price: 45.89 },
      { time: "2d", price: 45.76 },
      { time: "3d", price: 45.45 },
      { time: "4d", price: 45.34 },
      { time: "5d", price: 45.56 },
      { time: "6d", price: 45.78 },
      { time: "7d", price: 45.67 },
    ],
  },
];

const TokensPage = () => {
  const [selectedToken, setSelectedToken] = useState(tokenData[0]);

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Token Prices</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tokens..." className="pl-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{selectedToken.name}</CardTitle>
                  <Badge variant="outline">{selectedToken.symbol}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${selectedToken.price.toFixed(2)}
                  </span>
                  <Badge
                    variant={
                      selectedToken.change24h >= 0 ? "default" : "destructive"
                    }
                    className="flex items-center gap-1"
                  >
                    {selectedToken.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(selectedToken.change24h).toFixed(2)}%
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Market Cap: ${(selectedToken.marketCap / 1_000_000).toFixed(2)}M
                • 24h Volume: $
                {(selectedToken.volume24h / 1_000_000).toFixed(2)}M
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="7d">
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="24h">24h</TabsTrigger>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                    <TabsTrigger value="90d">90d</TabsTrigger>
                    <TabsTrigger value="1y">1y</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                    <Star className="h-4 w-4" />
                    {selectedToken.watchlisted
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </button>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedToken.chart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke={
                          selectedToken.change24h >= 0 ? "#10b981" : "#ef4444"
                        }
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Tokens</CardTitle>
              <CardDescription>By market capitalization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {tokenData.map((token) => (
                  <div
                    key={token.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted ${
                      selectedToken.id === token.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${token.price.toFixed(token.price < 1 ? 4 : 2)}
                      </div>
                      <div
                        className={`text-xs flex items-center justify-end ${
                          token.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {token.change24h >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(token.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recently Viewed</CardTitle>
              <CardDescription>Your recently viewed tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tokenData.slice(0, 3).map((token) => (
                  <div
                    key={`recent-${token.id}`}
                    className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs">
                        {token.symbol.charAt(0)}
                      </div>
                      <div className="font-medium">{token.name}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>2h ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
