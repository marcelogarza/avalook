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
      // Define all API endpoints
      const endpoints = {
        marketCap: "http://localhost:5001/api/token-prices",
        tps: "http://localhost:5001/api/tps",
        volume: "http://localhost:5001/api/volume",
        gas: "http://localhost:5001/api/gas",
        active: "http://localhost:5001/api/active"
      };

      // Fetch all data in parallel
      const [marketCapResponse, tpsResponse, volumeResponse, gasResponse, activeResponse] = 
        await Promise.all([
          axios.get(endpoints.marketCap).catch(err => ({ data: null, error: err })),
          axios.get(endpoints.tps).catch(err => ({ data: null, error: err })),
          axios.get(endpoints.volume).catch(err => ({ data: null, error: err })),
          axios.get(endpoints.gas).catch(err => ({ data: null, error: err })),
          axios.get(endpoints.active).catch(err => ({ data: null, error: err }))
        ]);

      // Process market cap data
      if (marketCapResponse.data && marketCapResponse.data["avalanche-2"]) {
        const avaxData = marketCapResponse.data["avalanche-2"];
        const changeValue = avaxData.usd_24h_change;
        const validChange = !isNaN(changeValue) && changeValue !== null && changeValue !== undefined;

        setMarketCap({
          value: formatCurrency(avaxData.usd_market_cap || 0),
          change: validChange
            ? {
                value: `${Math.abs(changeValue).toFixed(2)}%`,
                isPositive: changeValue >= 0,
              }
            : {
                value: "0.00%",
                isPositive: true,
              },
        });
      } else {
        setMarketCap({
          value: "N/A",
          change: { value: "N/A", isPositive: true },
        });
      }
      setLoading((prev) => ({ ...prev, marketCap: false }));

      // Process TPS data
      if (tpsResponse.data) {
        const tpsValue = parseFloat(tpsResponse.data.value) || 0;
        setTps({
          value: formatNumber(tpsValue),
          change: { value: "N/A", isPositive: true },
        });
      } else {
        setTps({
          value: "N/A",
          change: { value: "N/A", isPositive: true },
        });
      }
      setLoading((prev) => ({ ...prev, tps: false }));

      // Process transaction volume data
      if (volumeResponse.data) {
        const volumeValue = parseInt(volumeResponse.data.value) || 0;
        setTransactionsVolume({
          value: formatNumber(volumeValue),
          change: { value: "N/A", isPositive: true },
        });
      } else {
        setTransactionsVolume({
          value: "N/A",
          change: { value: "N/A", isPositive: true },
        });
      }
      setLoading((prev) => ({ ...prev, transactionsVolume: false }));

      // Process gas fees data
      if (gasResponse.data) {
        const gasValue = parseInt(gasResponse.data.value) || 0;
        setGasFees({
          value: formatNumber(gasValue),
          change: { value: "N/A", isPositive: true },
        });
      } else {
        setGasFees({
          value: "N/A",
          change: { value: "N/A", isPositive: true },
        });
      }
      setLoading((prev) => ({ ...prev, gasFees: false }));

      // Process active addresses data
      if (activeResponse.data) {
        const activeValue = parseInt(activeResponse.data.value) || 0;
        setActiveAddresses({
          value: formatNumber(activeValue),
          change: { value: "N/A", isPositive: true },
        });
      } else {
        setActiveAddresses({
          value: "N/A",
          change: { value: "N/A", isPositive: true },
        });
      }
      setLoading((prev) => ({ ...prev, activeAddresses: false }));

    } catch (error) {
      console.error("Error fetching network data:", error);
      // Set fallback values for all metrics
      setMarketCap({ value: "N/A", change: { value: "N/A", isPositive: true } });
      setTps({ value: "N/A", change: { value: "N/A", isPositive: true } });
      setTransactionsVolume({ value: "N/A", change: { value: "N/A", isPositive: true } });
      setGasFees({ value: "N/A", change: { value: "N/A", isPositive: true } });
      setActiveAddresses({ value: "N/A", change: { value: "N/A", isPositive: true } });
      
      // Mark all as loaded
      setLoading((prev) => ({ 
        ...prev, 
        marketCap: false,
        tps: false,
        transactionsVolume: false,
        gasFees: false,
        activeAddresses: false
      }));
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
          imageUrl={token.image}
        />
      ))}
    </div>
  );
};

export default OverviewSection;
