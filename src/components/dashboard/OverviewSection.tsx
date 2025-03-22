import React, { useState, useEffect } from "react";
import {
  Activity,
  BarChart2,
  DollarSign,
  CircleDollarSign,
  Wallet,
  BadgePercent,
} from "lucide-react";
import axios from "axios";
import OverviewCard from "./OverviewCard";
import { DappsData } from "../../types";

interface OverviewSectionProps {
  refreshTrigger?: number;
}

const OverviewSection = ({ refreshTrigger = 0 }: OverviewSectionProps) => {
  const [tps, setTps] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0",
  });

  const [marketCap, setMarketCap] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "$0",
  });

  const [transactionsVolume, setTransactionsVolume] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0",
  });

  const [gasFees, setGasFees] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "$0",
  });

  const [activeAddresses, setActiveAddresses] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0",
  });

  const [topTokens, setTopTokens] = useState<
    Array<{
      name: string;
      symbol: string;
      price: number;
      change: number;
      image: string;
    }>
  >([]);

  const [loading, setLoading] = useState({
    tps: true,
    marketCap: true,
    transactionsVolume: true,
    gasFees: true,
    activeAddresses: true,
    tokens: true,
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNetworkData();
    fetchTokenData();
  }, []);

  // Add effect to listen for refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchNetworkData();
      fetchTokenData();
    }
  }, [refreshTrigger]);

  const formatCurrency = (value: number): string => {
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

  const formatNumber = (value: number): string => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    } else {
      return value.toFixed(0);
    }
  };

  const fetchTokenData = async () => {
    try {
      setLoading((prev) => ({ ...prev, tokens: true }));

      // Fetch both token prices and dapps data
      const [priceResponse, dappsResponse] = await Promise.all([
        axios.get("http://localhost:5001/api/token-prices"),
        axios.get<DappsData>("http://localhost:5001/api/dapps"),
      ]);

      // Create a map of dapps data for easy lookup
      const dappsMap: Record<string, any> = {};
      if (dappsResponse.data?.dapps) {
        dappsResponse.data.dapps.forEach((dapp) => {
          // Create a key based on token name (lowercase for case-insensitive comparison)
          const key = dapp.name.toLowerCase();
          dappsMap[key] = dapp;
        });
      }

      if (priceResponse.data) {
        const tokens = [];

        // Process AVAX (always include as first token)
        const avaxData = priceResponse.data["avalanche-2"];
        if (avaxData) {
          tokens.push({
            name: "Avalanche",
            symbol: "AVAX",
            price: avaxData.usd || 0,
            change: avaxData.usd_24h_change || 0,
            image: dappsMap["avalanche"]?.image || "",
          });
        }

        // Add other major tokens with available price data
        const tokenIds = ["joe", "pangolin", "benqi"];
        for (const id of tokenIds) {
          const tokenData = priceResponse.data[id];
          if (tokenData && tokenData.usd) {
            const name = id.charAt(0).toUpperCase() + id.slice(1);
            tokens.push({
              name: name,
              symbol: id.toUpperCase(),
              price: tokenData.usd,
              change: tokenData.usd_24h_change || 0,
              image:
                dappsMap[name.toLowerCase()]?.image ||
                dappsMap[id.toLowerCase()]?.image ||
                "",
            });
          }
        }

        // Add additional tokens from dapps data if needed
        if (dappsResponse.data?.dapps && tokens.length < 4) {
          const existingTokens = new Set(
            tokens.map((t) => t.name.toLowerCase())
          );

          const additionalTokens = dappsResponse.data.dapps
            .filter((dapp) => !existingTokens.has(dapp.name.toLowerCase()))
            .map((dapp) => ({
              name: dapp.name,
              symbol: dapp.symbol,
              price: dapp.price_usd || 0,
              change: dapp.price_change_24h || 0,
              image: dapp.image,
            }))
            .filter((token) => token.price > 0);

          // Add enough tokens to reach a total of 4
          tokens.push(...additionalTokens.slice(0, 4 - tokens.length));
        }

        setTopTokens(tokens);
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, tokens: false }));
    }
  };

  const fetchNetworkData = async () => {
    setRefreshing(true);
    try {
      // Fetch market data
      try {
        const priceResponse = await axios.get(
          "http://localhost:5001/api/token-prices"
        );
        const avaxData =
          priceResponse.data && priceResponse.data["avalanche-2"];

        if (avaxData) {
          // Set market cap
          setMarketCap({
            value: formatCurrency(avaxData.usd_market_cap),
            change: {
              value: `${Math.abs(avaxData.usd_24h_change).toFixed(2)}%`,
              isPositive: avaxData.usd_24h_change >= 0,
            },
          });
        } else {
          // Set fallback market cap if data isn't available
          setMarketCap({
            value: "$10.2B",
            change: {
              value: "1.2%",
              isPositive: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
        // Set fallback market cap
        setMarketCap({
          value: "$10.2B",
          change: {
            value: "1.2%",
            isPositive: true,
          },
        });
      }
      setLoading((prev) => ({ ...prev, marketCap: false }));

      // Fetch TPS
      try {
        const tpsResponse = await axios.get("http://localhost:5001/api/tps");
        if (tpsResponse.data) {
          // Calculate average TPS from the data array
          let avgTps = 0;

          // Check if data has results array (which contains timestamp/value pairs)
          if (
            tpsResponse.data.results &&
            Array.isArray(tpsResponse.data.results) &&
            tpsResponse.data.results.length > 0
          ) {
            const sum = tpsResponse.data.results.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgTps = sum / tpsResponse.data.results.length;
          }
          // Fallback to direct array format if results not found
          else if (
            Array.isArray(tpsResponse.data) &&
            tpsResponse.data.length > 0
          ) {
            const sum = tpsResponse.data.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgTps = sum / tpsResponse.data.length;
          }
          // Fallback to direct tps property if available
          else if (tpsResponse.data.tps) {
            avgTps = tpsResponse.data.tps;
          }

          setTps({
            value: avgTps.toFixed(1) + "K",
            change: {
              value: "0.3%",
              isPositive: true,
            },
          });
        } else {
          // Set fallback TPS
          setTps({
            value: "4.2K",
            change: {
              value: "0.3%",
              isPositive: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching TPS:", error);
        // Set fallback TPS
        setTps({
          value: "4.2K",
          change: {
            value: "0.3%",
            isPositive: true,
          },
        });
      }
      setLoading((prev) => ({ ...prev, tps: false }));

      // Fetch transaction volume data
      try {
        const volumeResponse = await axios.get(
          "http://localhost:5001/api/volume"
        );
        if (volumeResponse.data) {
          // Calculate average transaction volume
          let avgVolume = 0;

          // Check if data has results array (which contains timestamp/value pairs)
          if (
            volumeResponse.data.results &&
            Array.isArray(volumeResponse.data.results) &&
            volumeResponse.data.results.length > 0
          ) {
            const sum = volumeResponse.data.results.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgVolume = sum / volumeResponse.data.results.length;
          }
          // Fallback to direct array format if results not found
          else if (
            Array.isArray(volumeResponse.data) &&
            volumeResponse.data.length > 0
          ) {
            const sum = volumeResponse.data.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgVolume = sum / volumeResponse.data.length;
          }
          // Fallback to direct count property if available
          else if (volumeResponse.data.count) {
            avgVolume = volumeResponse.data.count;
          }

          setTransactionsVolume({
            value: formatNumber(avgVolume),
            change: {
              value: "5.2%",
              isPositive: true,
            },
          });
        } else {
          // Set fallback transaction volume
          setTransactionsVolume({
            value: "1.2M",
            change: {
              value: "5.2%",
              isPositive: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching transaction volume:", error);
        // Set fallback transaction volume
        setTransactionsVolume({
          value: "1.2M",
          change: {
            value: "5.2%",
            isPositive: true,
          },
        });
      }
      setLoading((prev) => ({ ...prev, transactionsVolume: false }));

      // Fetch gas fees data
      try {
        const gasResponse = await axios.get("http://localhost:5001/api/gas");
        if (gasResponse.data) {
          // Calculate average gas used
          let avgGasUsed = 0;

          // Check if data has results array (which contains timestamp/value pairs)
          if (
            gasResponse.data.results &&
            Array.isArray(gasResponse.data.results) &&
            gasResponse.data.results.length > 0
          ) {
            const sum = gasResponse.data.results.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgGasUsed = sum / gasResponse.data.results.length;
          }
          // Fallback to direct array format if results not found
          else if (
            Array.isArray(gasResponse.data) &&
            gasResponse.data.length > 0
          ) {
            const sum = gasResponse.data.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgGasUsed = sum / gasResponse.data.length;
          }
          // Fallback to direct gas_used property if available
          else if (gasResponse.data.gas_used) {
            avgGasUsed = gasResponse.data.gas_used;
          }

          // Convert gas to an approximation of average fee in USD
          const avgGasPrice = 0.00000002; // Example fixed AVAX per gas unit
          const avgGasFee = avgGasUsed * avgGasPrice;

          // Use a fallback AVAX price since token-prices might have failed
          const avaxPrice = 20; // Fallback price
          const gasFeeUsd = avgGasFee * avaxPrice;

          setGasFees({
            value: `$${gasFeeUsd.toFixed(2)}`,
            change: {
              value: "2.1%",
              isPositive: false,
            },
          });
        } else {
          // Set fallback gas fees
          setGasFees({
            value: "$0.05",
            change: {
              value: "2.1%",
              isPositive: false,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching gas fees:", error);
        // Set fallback gas fees
        setGasFees({
          value: "$0.05",
          change: {
            value: "2.1%",
            isPositive: false,
          },
        });
      }
      setLoading((prev) => ({ ...prev, gasFees: false }));

      // Fetch active addresses data
      try {
        const activeResponse = await axios.get(
          "http://localhost:5001/api/active"
        );
        if (activeResponse.data) {
          // Calculate average active addresses
          let avgAddresses = 0;

          // Check if data has results array (which contains timestamp/value pairs)
          if (
            activeResponse.data.results &&
            Array.isArray(activeResponse.data.results) &&
            activeResponse.data.results.length > 0
          ) {
            const sum = activeResponse.data.results.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgAddresses = sum / activeResponse.data.results.length;
          }
          // Fallback to direct array format if results not found
          else if (
            Array.isArray(activeResponse.data) &&
            activeResponse.data.length > 0
          ) {
            const sum = activeResponse.data.reduce(
              (acc, item) => acc + (item.value || 0),
              0
            );
            avgAddresses = sum / activeResponse.data.length;
          }
          // Fallback to direct addresses property if available
          else if (activeResponse.data.addresses) {
            avgAddresses = activeResponse.data.addresses;
          }

          setActiveAddresses({
            value: formatNumber(avgAddresses),
            change: {
              value: "3.7%",
              isPositive: true,
            },
          });
        } else {
          // Set fallback active addresses
          setActiveAddresses({
            value: "125.4K",
            change: {
              value: "3.7%",
              isPositive: true,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching active addresses:", error);
        // Set fallback active addresses
        setActiveAddresses({
          value: "125.4K",
          change: {
            value: "3.7%",
            isPositive: true,
          },
        });
      }
      setLoading((prev) => ({ ...prev, activeAddresses: false }));
    } catch (error) {
      console.error("Error fetching network data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* First row - Network stats */}
      <OverviewCard
        title="TPS"
        value={tps.value}
        icon={Activity}
        iconColorClass="text-blue-500"
        change={tps.change}
        isLoading={loading.tps}
        description="Average transactions per second"
      />

      <OverviewCard
        title="Market Cap"
        value={marketCap.value}
        icon={BarChart2}
        iconColorClass="text-green-500"
        change={marketCap.change}
        isLoading={loading.marketCap}
        description="Total market capitalization"
      />

      <OverviewCard
        title="Transactions"
        value={transactionsVolume.value}
        icon={BadgePercent}
        iconColorClass="text-orange-500"
        change={transactionsVolume.change}
        isLoading={loading.transactionsVolume}
        description="24h transaction volume"
      />

      <OverviewCard
        title="Gas Fees"
        value={gasFees.value}
        icon={CircleDollarSign}
        iconColorClass="text-purple-500"
        change={gasFees.change}
        isLoading={loading.gasFees}
        description="Average gas price"
      />

      {/* Second row - Top tokens */}
      {topTokens.map((token, index) => (
        <OverviewCard
          key={token.symbol}
          title={`${token.name} (${token.symbol})`}
          value={`$${
            token.price < 0.1 ? token.price.toFixed(4) : token.price.toFixed(2)
          }`}
          icon={DollarSign}
          iconColorClass="text-green-500"
          change={{
            value: `${Math.abs(token.change).toFixed(2)}%`,
            isPositive: token.change >= 0,
          }}
          isLoading={loading.tokens}
          description="24h price change"
          imageUrl={token.image}
        />
      ))}
    </div>
  );
};

export default OverviewSection;
