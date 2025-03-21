import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  DollarSign,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  title?: string;
}

const TokenPriceSection = ({
  title = "Token Prices",
}: TokenPriceSectionProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTokenPrices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/token-prices"
      );

      if (response.data) {
        const tokenData: TokenData[] = [
          {
            name: "Avalanche",
            symbol: "AVAX",
            price: response.data["avalanche-2"].usd,
            change24h: response.data["avalanche-2"].usd_24h_change,
            marketCap: `$${(
              response.data["avalanche-2"].usd_market_cap / 1e9
            ).toFixed(2)}B`,
            volume24h: `$${(
              response.data["avalanche-2"].usd_24h_vol / 1e6
            ).toFixed(0)}M`,
            chart: [22, 19, 21, 24, 20, 25, response.data["avalanche-2"].usd],
          },
          {
            name: "Trader Joe",
            symbol: "JOE",
            price: response.data["joe"].usd,
            change24h: response.data["joe"].usd_24h_change,
            marketCap: `$${(response.data["joe"].usd_market_cap / 1e6).toFixed(
              0
            )}M`,
            volume24h: `$${(response.data["joe"].usd_24h_vol / 1e6).toFixed(
              0
            )}M`,
            chart: [
              0.68,
              0.72,
              0.69,
              0.67,
              0.64,
              0.63,
              response.data["joe"].usd,
            ],
          },
          {
            name: "Pangolin",
            symbol: "PNG",
            price: response.data["pangolin"].usd,
            change24h: response.data["pangolin"].usd_24h_change,
            marketCap: `$${(
              response.data["pangolin"].usd_market_cap / 1e6
            ).toFixed(0)}M`,
            volume24h: `$${(
              response.data["pangolin"].usd_24h_vol / 1e6
            ).toFixed(0)}M`,
            chart: [
              0.1,
              0.09,
              0.11,
              0.13,
              0.12,
              0.11,
              response.data["pangolin"].usd,
            ],
          },
          {
            name: "Benqi",
            symbol: "QI",
            price: response.data["benqi"].usd,
            change24h: response.data["benqi"].usd_24h_change,
            marketCap: `$${(
              response.data["benqi"].usd_market_cap / 1e6
            ).toFixed(0)}M`,
            volume24h: `$${(response.data["benqi"].usd_24h_vol / 1e6).toFixed(
              0
            )}M`,
            chart: [
              0.021,
              0.022,
              0.024,
              0.023,
              0.022,
              0.023,
              response.data["benqi"].usd,
            ],
          },
        ];

        setTokens(tokenData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching token prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTokenPrices();
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchTokenPrices();

    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(fetchTokenPrices, 120000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="w-full h-full bg-base-100 border border-base-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          {title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {lastUpdated && (
            <p className="text-xs text-base-content/60">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-base-content/70 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
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
                      const max = Math.max(...token.chart.filter((v) => v > 0));
                      const height = max > 0 ? `${(value / max) * 100}%` : "0%";
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
                  {isLoading
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
                  {Math.abs(token.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-base-300">
          <Link to="/tokens" className="block w-full">
            <button className="w-full h-10 py-2 text-center text-sm text-primary hover:text-primary-focus font-medium">
              View All Tokens
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPriceSection;
