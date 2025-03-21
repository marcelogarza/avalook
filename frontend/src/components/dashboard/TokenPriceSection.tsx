import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  DollarSign,
  BarChart2,
} from "lucide-react";

interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  chart: number[];
}

interface TokenPriceSectionProps {
  tokens?: TokenData[];
  title?: string;
}

const TokenPriceSection = ({
  tokens = [
    {
      name: "Avalanche",
      symbol: "AVAX",
      price: 28.45,
      change24h: 3.2,
      marketCap: "$9.2B",
      volume24h: "$342M",
      chart: [22, 19, 21, 24, 20, 25, 28],
    },
    {
      name: "Trader Joe",
      symbol: "JOE",
      price: 0.65,
      change24h: -1.8,
      marketCap: "$215M",
      volume24h: "$42M",
      chart: [0.68, 0.72, 0.69, 0.67, 0.64, 0.63, 0.65],
    },
    {
      name: "Pangolin",
      symbol: "PNG",
      price: 0.12,
      change24h: 5.4,
      marketCap: "$98M",
      volume24h: "$12M",
      chart: [0.1, 0.09, 0.11, 0.13, 0.12, 0.11, 0.12],
    },
    {
      name: "Benqi",
      symbol: "QI",
      price: 0.023,
      change24h: 1.2,
      marketCap: "$76M",
      volume24h: "$8M",
      chart: [0.021, 0.022, 0.024, 0.023, 0.022, 0.023, 0.023],
    },
  ],
  title = "Token Prices",
}: TokenPriceSectionProps) => {
  return (
    <Card className="w-full h-full bg-base-100 border border-base-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          {title}
        </CardTitle>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-base-content">
                    {token.name}
                  </h3>
                  <p className="text-sm text-base-content/60">{token.symbol}</p>
                </div>
              </div>

              <div className="flex-1 mx-4 hidden md:block">
                <div className="h-10 flex items-center">
                  {/* Simple sparkline chart */}
                  <div className="flex items-end h-8 space-x-1">
                    {token.chart.map((value, i) => {
                      const height = `${
                        (value / Math.max(...token.chart)) * 100
                      }%`;
                      return (
                        <div
                          key={i}
                          className={`w-1 ${
                            token.change24h >= 0 ? "bg-success" : "bg-error"
                          } rounded-t-sm`}
                          style={{ height }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-medium text-base-content">
                  ${token.price.toFixed(token.price < 1 ? 4 : 2)}
                </div>
                <div
                  className={`text-sm flex items-center justify-end ${
                    token.change24h >= 0 ? "text-success" : "text-error"
                  }`}
                >
                  {token.change24h >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(token.change24h)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-base-300">
          <button className="w-full text-center text-sm text-primary hover:text-primary-focus font-medium">
            View All Tokens
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPriceSection;
