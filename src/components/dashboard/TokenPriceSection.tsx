import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TokenData,
  NetworkMetrics,
  TokenPriceHistory,
  DappsData,
} from "../../types";

interface TokenPriceSectionProps {
  title?: string;
  refreshTrigger?: number;
}

const TokenPriceSection = ({
  title = "Token Prices",
  refreshTrigger = 0,
}: TokenPriceSectionProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [tokenHistories, setTokenHistories] = useState<
    Record<string, number[]>
  >({});
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(
    null
  );
  const [dappsData, setDappsData] = useState<DappsData | null>(null);

  const tokenIds = ["avalanche-2", "joe", "pangolin", "benqi"];

  // Fetch Avalanche network metrics
  const fetchNetworkMetrics = async () => {
    try {
      // First try to get from the metrics endpoint
      const response = await axios.get(
        "http://localhost:5001/api/avalanche/metrics",
        { timeout: 10000 }
      );

      if (response.data) {
        setNetworkMetrics(response.data);
        return;
      }
    } catch (metricsError) {
      console.error("Error fetching network metrics:", metricsError);

      // If metrics endpoint fails, try to construct metrics from other endpoints
      try {
        // Get TPS
        const tpsResponse = await axios.get(
          "http://localhost:5001/api/avalanche/tps",
          { timeout: 5000 }
        );

        // Get validator count
        const validatorsResponse = await axios.get(
          "http://localhost:5001/api/avalanche/validators",
          { timeout: 5000 }
        );

        // Get combined data
        const combinedMetrics: NetworkMetrics = {
          tps: tpsResponse.data?.value || 0,
          validators: validatorsResponse.data?.value || 0,
          totalTransactions: 0, // This isn't critical, so we'll skip if not available
          avgBlockTime: 2.0, // Default value for Avalanche
        };

        setNetworkMetrics(combinedMetrics);
      } catch (fallbackError) {
        console.error("Error fetching fallback metrics:", fallbackError);
        // Non-critical, so we'll just leave networkMetrics as null
      }
    }
  };

  const fetchTokenHistory = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/token-price-history/${id}`,
        { timeout: 10000 }
      );

      if (response.data && Array.isArray(response.data)) {
        // Get the last 7 days of data for the chart
        const prices = response.data
          .slice(-7)
          .map((item: TokenPriceHistory) => item.price);

        setTokenHistories((prev) => ({
          ...prev,
          [id]: prices,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error fetching history for ${id}:`, error);
      // If we fail to get history, we'll fall back to the default values in the chart
      return false;
    }
  };

  // Add function to fetch dapps data
  const fetchDappsData = async () => {
    try {
      const response = await axios.get<DappsData>(
        "http://localhost:5001/api/dapps",
        { timeout: 10000 }
      );
      if (response.data && response.data.dapps) {
        setDappsData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching dapps data:", error);
      return null;
    }
  };

  const fetchTokenPrices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get token prices with a longer timeout for real API data
      const tokenResponse = await axios.get(
        "http://localhost:5001/api/token-prices",
        { timeout: 20000 }
      );

      // Fetch dapps data
      const dappsResponse = await fetchDappsData();

      // Fetch network metrics separately - won't block token display
      fetchNetworkMetrics().catch((err) =>
        console.error("Network metrics fetch failed:", err)
      );

      if (tokenResponse.data) {
        // Check if we have the minimum required data
        const requiredTokens = tokenIds;
        const isMissingTokens = requiredTokens.some(
          (token) => !tokenResponse.data[token]
        );

        if (isMissingTokens) {
          console.warn("Some token data is missing:", tokenResponse.data);
        }

        // Fetch historical data for each token
        const historyPromises = tokenIds.map((tokenId) =>
          fetchTokenHistory(tokenId).catch((err) => {
            console.error(`Error fetching history for ${tokenId}:`, err);
            return false;
          })
        );

        await Promise.allSettled(historyPromises);

        // Create a map of dapps data for easy lookup
        const dappsMap: Record<string, any> = {};
        if (dappsResponse?.dapps) {
          dappsResponse.dapps.forEach((dapp) => {
            // Create a key based on token name (lowercase for case-insensitive comparison)
            const key = dapp.name.toLowerCase();
            dappsMap[key] = dapp;
          });
        }

        const tokenData: TokenData[] = [
          {
            name: "Avalanche",
            symbol: "AVAX",
            price: tokenResponse.data["avalanche-2"]?.usd || 0,
            change24h: tokenResponse.data["avalanche-2"]?.usd_24h_change || 0,
            marketCap: `$${(
              (tokenResponse.data["avalanche-2"]?.usd_market_cap || 0) / 1e9
            ).toFixed(2)}B`,
            volume24h: `$${(
              (tokenResponse.data["avalanche-2"]?.usd_24h_vol || 0) / 1e6
            ).toFixed(0)}M`,
            chart: tokenHistories["avalanche-2"] || [
              22,
              19,
              21,
              24,
              20,
              25,
              tokenResponse.data["avalanche-2"]?.usd || 27.5,
            ],
            // Add data from dapps endpoint if available
            url:
              dappsMap["avalanche"]?.url ||
              `https://www.coingecko.com/en/coins/avalanche-2`,
            image: dappsMap["avalanche"]?.image || "",
            description:
              dappsMap["avalanche"]?.description ||
              "Avalanche is a layer one blockchain that functions as a platform for decentralized applications and custom blockchain networks.",
            category: dappsMap["avalanche"]?.category || "DeFi",
            chain: dappsMap["avalanche"]?.chain || "Avalanche",
          },
          {
            name: "Trader Joe",
            symbol: "JOE",
            price: tokenResponse.data.joe?.usd || 0,
            change24h: tokenResponse.data.joe?.usd_24h_change || 0,
            marketCap: `$${(
              (tokenResponse.data.joe?.usd_market_cap || 0) / 1e6
            ).toFixed(0)}M`,
            volume24h: `$${(
              (tokenResponse.data.joe?.usd_24h_vol || 0) / 1e6
            ).toFixed(1)}M`,
            chart: tokenHistories.joe || [
              0.5, 0.48, 0.52, 0.51, 0.53, 0.55, 0.54,
            ],
            // Add data from dapps endpoint if available
            url:
              dappsMap["trader joe"]?.url ||
              dappsMap["joe"]?.url ||
              `https://www.coingecko.com/en/coins/joe`,
            image:
              dappsMap["trader joe"]?.image || dappsMap["joe"]?.image || "",
            description:
              dappsMap["trader joe"]?.description ||
              dappsMap["joe"]?.description ||
              "Trader Joe is a one-stop-shop decentralized trading platform on the Avalanche network.",
            category:
              dappsMap["trader joe"]?.category ||
              dappsMap["joe"]?.category ||
              "DeFi",
            chain:
              dappsMap["trader joe"]?.chain ||
              dappsMap["joe"]?.chain ||
              "Avalanche",
          },
          {
            name: "Pangolin",
            symbol: "PNG",
            price: tokenResponse.data.pangolin?.usd || 0,
            change24h: tokenResponse.data.pangolin?.usd_24h_change || 0,
            marketCap: `$${(
              (tokenResponse.data.pangolin?.usd_market_cap || 0) / 1e6
            ).toFixed(0)}M`,
            volume24h: `$${(
              (tokenResponse.data.pangolin?.usd_24h_vol || 0) / 1e6
            ).toFixed(1)}M`,
            chart: tokenHistories.pangolin || [
              0.1, 0.09, 0.11, 0.105, 0.12, 0.115, 0.11,
            ],
            // Add data from dapps endpoint if available
            url:
              dappsMap["pangolin"]?.url ||
              `https://www.coingecko.com/en/coins/pangolin`,
            image: dappsMap["pangolin"]?.image || "",
            description:
              dappsMap["pangolin"]?.description ||
              "Pangolin is a decentralized exchange (DEX) for Avalanche and Ethereum assets.",
            category: dappsMap["pangolin"]?.category || "DeFi",
            chain: dappsMap["pangolin"]?.chain || "Avalanche",
          },
          {
            name: "BENQI",
            symbol: "QI",
            price: tokenResponse.data.benqi?.usd || 0,
            change24h: tokenResponse.data.benqi?.usd_24h_change || 0,
            marketCap: `$${(
              (tokenResponse.data.benqi?.usd_market_cap || 0) / 1e6
            ).toFixed(0)}M`,
            volume24h: `$${(
              (tokenResponse.data.benqi?.usd_24h_vol || 0) / 1e6
            ).toFixed(1)}M`,
            chart: tokenHistories.benqi || [
              0.02, 0.019, 0.022, 0.021, 0.023, 0.022, 0.021,
            ],
            // Add data from dapps endpoint if available
            url:
              dappsMap["benqi"]?.url ||
              `https://www.coingecko.com/en/coins/benqi`,
            image: dappsMap["benqi"]?.image || "",
            description:
              dappsMap["benqi"]?.description ||
              "BENQI is a liquidity market protocol built on Avalanche.",
            category: dappsMap["benqi"]?.category || "DeFi",
            chain: dappsMap["benqi"]?.chain || "Avalanche",
          },
        ];

        // Add additional tokens from dapps data that aren't in the standard list
        if (dappsResponse?.dapps) {
          const existingTokens = new Set(
            tokenData.map((t) => t.name.toLowerCase())
          );

          const additionalTokens = dappsResponse.dapps
            .filter((dapp) => !existingTokens.has(dapp.name.toLowerCase()))
            .map((dapp) => ({
              name: dapp.name,
              symbol: dapp.symbol,
              price: dapp.price_usd || 0,
              change24h: dapp.price_change_24h || 0,
              marketCap: dapp.market_cap,
              volume24h: "N/A", // Volume data might not be available
              chart: [
                dapp.price_usd,
                dapp.price_usd * 0.98,
                dapp.price_usd * 1.01,
                dapp.price_usd * 0.99,
                dapp.price_usd,
              ], // Generate placeholder chart
              url: dapp.url,
              image: dapp.image,
              description: dapp.description,
              category: dapp.category,
              chain: dapp.chain,
            }));

          // Add up to 3 additional tokens to avoid overloading the UI
          if (additionalTokens.length > 0) {
            tokenData.push(...additionalTokens.slice(0, 3));
          }
        }

        // Filter out tokens with no price data
        const filteredTokens = tokenData.filter((token) => token.price > 0);

        setTokens(filteredTokens.length > 0 ? filteredTokens : tokenData);
        setLastUpdated(new Date());
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Error fetching token prices:", error);

      // Show a user-friendly error message
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setError(
            "Request timed out. The server might be busy. API calls to external services may take longer than expected."
          );
        } else if (error.response?.status === 429) {
          setError(
            "API rate limit reached. Please wait a minute before refreshing."
          );
        } else if (error.response) {
          setError(
            `Server error (${error.response.status}). The backend service might be unavailable or external APIs may be down.`
          );
        } else {
          setError(
            "Network error. Please check your connection and try again."
          );
        }
      } else {
        setError("Unable to fetch token prices. Will retry automatically.");
      }

      // Only retry a limited number of times with increasing delay
      if (retryCount < 3) {
        const retryDelay = Math.pow(2, retryCount) * 2000; // Longer exponential backoff for real APIs
        console.log(`Retrying in ${retryDelay}ms (attempt ${retryCount + 1})`);

        setRetryCount((prev) => prev + 1);
        setTimeout(fetchTokenPrices, retryDelay);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchTokenPrices();

    // Set up auto-refresh every 2 minutes
    const intervalId = setInterval(fetchTokenPrices, 120000);

    return () => clearInterval(intervalId);
  }, []);

  // Listen for refreshTrigger changes to refresh data
  useEffect(() => {
    if (refreshTrigger > 0) {
      // Reset retry count on manual refresh
      setRetryCount(0);
      fetchTokenPrices();
    }
  }, [refreshTrigger]);

  // Update tokens whenever tokenHistories changes
  useEffect(() => {
    if (tokens.length > 0 && Object.keys(tokenHistories).length > 0) {
      setTokens((prev) =>
        prev.map((token) => {
          const id =
            token.name === "Avalanche"
              ? "avalanche-2"
              : token.name === "Trader Joe"
              ? "joe"
              : token.name === "Pangolin"
              ? "pangolin"
              : "benqi";

          return {
            ...token,
            chart: tokenHistories[id] || token.chart,
          };
        })
      );
    }
  }, [tokenHistories]);

  return (
    <Card
      className="w-full bg-base-100 border border-base-300 flex flex-col"
      style={{ height: "500px" }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          {title}
        </CardTitle>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1 pb-0">
        <div>
          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ height: "265px" }}
          >
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
                    <p className="text-sm text-base-content/60">
                      {token.symbol}
                    </p>
                  </div>
                </div>

                <div className="flex-1 mx-4 hidden md:block">
                  <div className="h-10 flex items-center">
                    {/* Simple sparkline chart */}
                    <div className="flex items-end h-8 space-x-1">
                      {token.chart.map((value, i) => {
                        const max = Math.max(
                          ...token.chart.filter((v) => v > 0)
                        );
                        const height =
                          max > 0 ? `${(value / max) * 100}%` : "0%";
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
                    className={`text-sm ${
                      token.change24h >= 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {Math.abs(token.change24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Network Metrics Section - slightly reduced margins */}
          {networkMetrics && (
            <div className="mt-3 pt-3 border-t border-base-300">
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
                    <p className="text-xs text-base-content/60">
                      Avg Block Time
                    </p>
                    <p className="text-lg font-semibold">
                      {networkMetrics.avgBlockTime.toFixed(2)}s
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-base-300 mt-2 bg-base-100">
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
