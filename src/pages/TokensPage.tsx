import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Info,
} from "lucide-react";
import axios from "axios";
import { TokenData, DappsData } from "@/types";

// Instead of using static data, we'll fetch it from the API
const TokensPage = () => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch token data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // First get token prices
        const tokenResponse = await axios.get(
          "http://localhost:5001/api/token-prices",
          { timeout: 10000 }
        );

        // Then get dapps data for enriched information
        const dappsResponse = await axios.get<DappsData>(
          "http://localhost:5001/api/dapps",
          { timeout: 10000 }
        );

        if (tokenResponse.data && dappsResponse.data) {
          // Process the token data
          const tokenIds = Object.keys(tokenResponse.data);

          // Create a lookup map for dapps data
          const dappsMap: Record<string, any> = {};
          if (dappsResponse.data.dapps) {
            dappsResponse.data.dapps.forEach((dapp) => {
              const key = dapp.name.toLowerCase();
              dappsMap[key] = dapp;
            });
          }

          // Combine token price data with dapps data
          const processedTokens: TokenData[] = tokenIds
            .map((id) => {
              const tokenData = tokenResponse.data[id];
              const name =
                id === "avalanche-2"
                  ? "Avalanche"
                  : id.charAt(0).toUpperCase() + id.slice(1);

              // Look for matching dapp data
              const dappData =
                dappsMap[name.toLowerCase()] || dappsMap[id.toLowerCase()];

              return {
                name: name,
                symbol: id === "avalanche-2" ? "AVAX" : id.toUpperCase(),
                price: tokenData.usd || 0,
                change24h: tokenData.usd_24h_change || 0,
                marketCap: tokenData.usd_market_cap || 0,
                volume24h: tokenData.usd_24h_vol || 0,
                chart: Array.from(
                  { length: 7 },
                  (_, i) => tokenData.usd * (0.95 + Math.random() * 0.1)
                ),
                // Add data from dapps endpoint if available
                image: dappData?.image || "",
                url:
                  dappData?.url || `https://www.coingecko.com/en/coins/${id}`,
                description:
                  dappData?.description ||
                  `${name} is a token on the Avalanche blockchain.`,
                category: dappData?.category || "Token",
                chain: dappData?.chain || "Avalanche",
              };
            })
            .filter((token) => token.price > 0);

          // Add any tokens from dapps that aren't in the token prices
          if (dappsResponse.data.dapps) {
            const existingTokens = new Set(
              processedTokens.map((t) => t.name.toLowerCase())
            );

            const additionalTokens = dappsResponse.data.dapps
              .filter((dapp) => !existingTokens.has(dapp.name.toLowerCase()))
              .map((dapp) => ({
                name: dapp.name,
                symbol: dapp.symbol,
                price: dapp.price_usd || 0,
                change24h: dapp.price_change_24h || 0,
                marketCap: dapp.market_cap || 0,
                volume24h: 0, // Volume data might not be available
                chart: Array.from(
                  { length: 7 },
                  (_, i) => dapp.price_usd * (0.95 + Math.random() * 0.1)
                ),
                url: dapp.url,
                image: dapp.image,
                description: dapp.description,
                category: dapp.category,
                chain: dapp.chain,
              }));

            processedTokens.push(...additionalTokens);
          }

          // Sort by market cap (descending)
          const sortedTokens = processedTokens.sort((a, b) => {
            const marketCapA =
              typeof a.marketCap === "string"
                ? parseFloat(a.marketCap.replace(/[^0-9.]/g, ""))
                : a.marketCap;
            const marketCapB =
              typeof b.marketCap === "string"
                ? parseFloat(b.marketCap.replace(/[^0-9.]/g, ""))
                : b.marketCap;
            return marketCapB - marketCapA;
          });

          setTokens(sortedTokens);
          // Set the first token as selected
          if (sortedTokens.length > 0) {
            setSelectedToken(sortedTokens[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching token data:", error);
        setError("Failed to load token data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter tokens based on search term
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Format market cap and volume for display
  const formatCurrency = (value: string | number): string => {
    if (typeof value === "string") {
      return value;
    }

    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!selectedToken) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No token data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Token Prices</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {selectedToken.image && (
                      <img
                        src={selectedToken.image}
                        alt={selectedToken.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <CardTitle>{selectedToken.name}</CardTitle>
                  </div>
                  <Badge variant="outline">{selectedToken.symbol}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    $
                    {selectedToken.price.toFixed(
                      selectedToken.price < 0.1 ? 4 : 2
                    )}
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
                Market Cap: {formatCurrency(selectedToken.marketCap)}• 24h
                Volume: {formatCurrency(selectedToken.volume24h)}
                {selectedToken.url && (
                  <a
                    href={selectedToken.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </a>
                )}
              </CardDescription>
              {selectedToken.description && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedToken.description}
                </div>
              )}
              {selectedToken.category && (
                <div className="mt-2">
                  <Badge variant="secondary" className="mr-2">
                    {selectedToken.category}
                  </Badge>
                  <Badge variant="outline">{selectedToken.chain}</Badge>
                </div>
              )}
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
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedToken.chart.map((price, index) => ({
                        time: `Day ${index + 1}`,
                        price,
                      }))}
                    >
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
                {filteredTokens.map((token) => (
                  <div
                    key={token.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted ${
                      selectedToken.name === token.name ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 overflow-hidden">
                        {token.image ? (
                          <img
                            src={token.image}
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          token.symbol.charAt(0)
                        )}
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
                        ${token.price.toFixed(token.price < 0.1 ? 4 : 2)}
                      </div>
                      <div
                        className={`text-xs ${
                          token.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h.toFixed(2)}%
                      </div>
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
