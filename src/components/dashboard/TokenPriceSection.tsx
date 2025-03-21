import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  DollarSign,
  BarChart2,
} from "lucide-react";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline?: number[];
  history?: { timestamp: string; price: number }[];
}

interface TokenPriceSectionProps {
  tokens?: TokenData[];
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-200 p-2 border border-base-300 shadow-md rounded-md">
        <p className="text-xs font-medium">{`${new Date(
          label
        ).toLocaleDateString()}`}</p>
        <p className="text-xs text-primary">{`Price: $${payload[0].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

// Token price card component
const TokenCard = ({ token }: { token: TokenData }) => {
  return (
    <div className="border border-base-300 rounded-lg p-4 hover:bg-base-200 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <img
            src={token.image}
            alt={token.name}
            className="w-8 h-8 mr-3 rounded-full"
          />
          <div>
            <h3 className="font-medium">{token.name}</h3>
            <span className="text-xs text-base-content/70">
              {token.symbol.toUpperCase()}
            </span>
          </div>
        </div>
        <Badge
          variant={
            token.price_change_percentage_24h >= 0 ? "default" : "destructive"
          }
          className="text-xs"
        >
          {token.price_change_percentage_24h >= 0 ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {Math.abs(token.price_change_percentage_24h).toFixed(2)}%
        </Badge>
      </div>
      <div className="text-xl font-bold mb-2">
        ${token.current_price.toFixed(2)}
      </div>

      {token.sparkline && token.sparkline.length > 0 && (
        <div className="h-12 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={token.sparkline.map((value, i) => ({
                timestamp: i,
                price: value,
              }))}
            >
              <Line
                type="monotone"
                dataKey="price"
                stroke={
                  token.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div>
          <p className="text-base-content/70">Market Cap</p>
          <p className="font-medium">${formatNumber(token.market_cap)}</p>
        </div>
        <div>
          <p className="text-base-content/70">24h Volume</p>
          <p className="font-medium">${formatNumber(token.total_volume)}</p>
        </div>
      </div>
    </div>
  );
};

// Format large numbers with abbreviations
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Main TokenPriceSection component
const TokenPriceSection = ({ tokens: propTokens }: TokenPriceSectionProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [activeTab, setActiveTab] = useState("avalanche-2");
  const [selectedTokenHistory, setSelectedTokenHistory] = useState<
    { timestamp: string; price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propTokens && propTokens.length > 0) {
      setTokens(propTokens);
      setLoading(false);
    } else {
      fetchTokenData();
    }
  }, [propTokens]);

  useEffect(() => {
    if (tokens.length > 0) {
      fetchTokenHistory(activeTab);
    }
  }, [activeTab, tokens]);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/token-prices"
      );

      const avaxToken = {
        id: "avalanche-2",
        name: "Avalanche",
        symbol: "avax",
        image:
          "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
        current_price: response.data["avalanche-2"].usd,
        price_change_percentage_24h:
          response.data["avalanche-2"].usd_24h_change,
        market_cap: response.data["avalanche-2"].usd_market_cap,
        total_volume: response.data["avalanche-2"].usd_24h_vol,
      };

      const joeToken = {
        id: "joe",
        name: "JOE",
        symbol: "joe",
        image:
          "https://assets.coingecko.com/coins/images/17569/small/traderjoe.jpg",
        current_price: response.data["joe"].usd,
        price_change_percentage_24h: response.data["joe"].usd_24h_change,
        market_cap: response.data["joe"].usd_market_cap,
        total_volume: response.data["joe"].usd_24h_vol,
      };

      const pangolinToken = {
        id: "pangolin",
        name: "Pangolin",
        symbol: "png",
        image:
          "https://assets.coingecko.com/coins/images/14023/small/pangolin.jpg",
        current_price: response.data["pangolin"].usd,
        price_change_percentage_24h: response.data["pangolin"].usd_24h_change,
        market_cap: response.data["pangolin"].usd_market_cap,
        total_volume: response.data["pangolin"].usd_24h_vol,
      };

      setTokens([avaxToken, joeToken, pangolinToken]);

      // Fetch history for the default token
      await fetchTokenHistory("avalanche-2");
    } catch (error) {
      console.error("Error fetching token data:", error);
      // Set some fallback data
      setTokens([
        {
          id: "avalanche-2",
          name: "Avalanche",
          symbol: "avax",
          image:
            "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
          current_price: 27.42,
          price_change_percentage_24h: 1.94,
          market_cap: 9812000000,
          total_volume: 172400000,
        },
        {
          id: "joe",
          name: "JOE",
          symbol: "joe",
          image:
            "https://assets.coingecko.com/coins/images/17569/small/traderjoe.jpg",
          current_price: 0.68,
          price_change_percentage_24h: -1.8,
          market_cap: 233400000,
          total_volume: 14700000,
        },
        {
          id: "pangolin",
          name: "Pangolin",
          symbol: "png",
          image:
            "https://assets.coingecko.com/coins/images/14023/small/pangolin.jpg",
          current_price: 0.12,
          price_change_percentage_24h: 5.4,
          market_cap: 34200000,
          total_volume: 2100000,
        },
      ]);

      // Generate mock history for the default token
      setSelectedTokenHistory(generateMockPriceHistory(27.42, 30));
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenHistory = async (tokenId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/token-history/${tokenId}`
      );

      if (response.data && Array.isArray(response.data)) {
        setSelectedTokenHistory(response.data);
      } else {
        // If the API returns unexpected data, use mock data
        const token = tokens.find((t) => t.id === tokenId);
        if (token) {
          setSelectedTokenHistory(
            generateMockPriceHistory(token.current_price, 30)
          );
        }
      }
    } catch (error) {
      console.error(`Error fetching history for ${tokenId}:`, error);
      // Generate mock data as fallback
      const token = tokens.find((t) => t.id === tokenId);
      if (token) {
        setSelectedTokenHistory(
          generateMockPriceHistory(token.current_price, 30)
        );
      }
    }
  };

  const generateMockPriceHistory = (currentPrice: number, days: number) => {
    const history = [];
    const now = new Date();

    // Create price variations around the current price
    const minPrice = currentPrice * 0.8;
    const maxPrice = currentPrice * 1.2;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      const randomFactor = 0.5 + Math.random(); // between 0.5 and 1.5
      const priceVariation = minPrice + (maxPrice - minPrice) * randomFactor;
      const limitedPrice = Math.max(
        minPrice,
        Math.min(maxPrice, priceVariation)
      );

      history.push({
        timestamp: date.toISOString(),
        price: limitedPrice,
      });
    }

    return history;
  };

  const getActiveToken = () => {
    return tokens.find((token) => token.id === activeTab) || tokens[0];
  };

  return (
    <Card
      className="w-full h-full bg-base-100 border border-base-300 flex flex-col"
      style={{ minHeight: "500px" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          {title}
        </CardTitle>
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

        {/* Network Metrics Section */}
        {networkMetrics && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <h3 className="text-md font-medium mb-2">
              Avalanche Network Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {networkMetrics.tps !== undefined && (
                <div className="bg-base-200 p-2 rounded-md">
                  <p className="text-xs text-base-content/60">Current TPS</p>
                  <p className="text-lg font-semibold">
                    {networkMetrics.tps.toFixed(2)}
                  </p>
                </div>
              )}
              {networkMetrics.validators !== undefined && (
                <div className="bg-base-200 p-2 rounded-md">
                  <p className="text-xs text-base-content/60">Validators</p>
                  <p className="text-lg font-semibold">
                    {networkMetrics.validators}
                  </p>
                </div>
              )}
              {networkMetrics.totalTransactions !== undefined && (
                <div className="bg-base-200 p-2 rounded-md">
                  <p className="text-xs text-base-content/60">
                    Total Transactions
                  </p>
                  <p className="text-lg font-semibold">
                    {networkMetrics.totalTransactions.toLocaleString()}
                  </p>
                </div>
              )}
              {networkMetrics.avgBlockTime !== undefined && (
                <div className="bg-base-200 p-2 rounded-md">
                  <p className="text-xs text-base-content/60">Avg Block Time</p>
                  <p className="text-lg font-semibold">
                    {networkMetrics.avgBlockTime.toFixed(2)}s
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-base-300 mt-4">
          <Link to="/tokens" className="block w-full">
            <button className="w-full text-center text-sm text-primary hover:text-primary-focus font-medium">
              View All Tokens
            </button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPriceSection;
