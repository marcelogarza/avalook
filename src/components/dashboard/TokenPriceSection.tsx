import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  DollarSign,
  BarChart2,
} from "lucide-react";
import axios from "axios";

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
  tokens: initialTokens = [
    {
      name: "Avalanche",
      symbol: "AVAX",
      price: 0,
      change24h: 0,
      marketCap: "$9.2B",
      volume24h: "$342M",
      chart: [0, 0, 0, 0, 0, 0, 0],
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
  const [tokens, setTokens] = useState(initialTokens);
  const [isLoading, setIsLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const fetchAvaxPrice = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5001/api/avax-price");
      const avaxPrice = response.data["avalanche-2"].usd;

      // Update price history
      setPriceHistory((prev) => [...prev, avaxPrice].slice(-7));

      // Calculate change if we have price history
      let change24h = 0;
      if (priceHistory.length > 0) {
        const previousPrice = priceHistory[priceHistory.length - 1];
        change24h = ((avaxPrice - previousPrice) / previousPrice) * 100;
      }

      // Update only the AVAX token in the tokens array
      setTokens((prevTokens) =>
        prevTokens.map((token) =>
          token.symbol === "AVAX"
            ? {
                ...token,
                price: avaxPrice,
                change24h: Number(change24h.toFixed(2)),
                // Add current price to chart history (limited to 7 points)
                chart: [
                  ...(token.chart.some((val) => val > 0)
                    ? token.chart.slice(-6)
                    : []),
                  avaxPrice,
                ],
              }
            : token
        )
      );
    } catch (error) {
      console.error("Error fetching AVAX price:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchAvaxPrice();

    // Set up a timer to fetch data every minute
    const intervalId = setInterval(fetchAvaxPrice, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
                  {token.symbol === "AVAX" && isLoading
                    ? "Loading..."
                    : `$${token.price.toFixed(token.price < 1 ? 4 : 2)}`}
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
