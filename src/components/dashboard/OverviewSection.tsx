import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Activity,
  BarChart2,
  DollarSign,
  RefreshCw,
  CircleDollarSign,
  Wallet,
  BadgePercent,
} from "lucide-react";
import axios from "axios";

interface OverviewCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  isLoading: boolean;
  tooltip?: string;
}

const OverviewCard = ({
  title = "Metric",
  value = "$0.00",
  change,
  icon = <Activity className="h-4 w-4" />,
  isLoading,
  tooltip,
}: OverviewCardProps) => {
  return (
    <Card className="bg-base-100 border border-base-300 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-base-content group relative">
          {title}
          {tooltip && (
            <span className="hidden group-hover:block absolute top-full left-0 z-10 bg-base-300 text-base-content p-2 rounded text-xs mt-1 max-w-[200px]">
              {tooltip}
            </span>
          )}
        </CardTitle>
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-base-200 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-1/2 animate-pulse bg-base-300 rounded"></div>
        ) : (
          <div className="text-2xl font-bold text-base-content">{value}</div>
        )}
        {change && (
          <p
            className={`mt-1 text-xs ${
              change.isPositive ? "text-success" : "text-error"
            }`}
          >
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const OverviewSection = () => {
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

  const [loading, setLoading] = useState({
    tps: true,
    marketCap: true,
    transactionsVolume: true,
    gasFees: true,
    activeAddresses: true,
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNetworkData();
  }, []);

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

  const fetchNetworkData = async () => {
    setRefreshing(true);
    try {
      // Fetch market data
      const priceResponse = await axios.get(
        "http://localhost:5001/api/token-prices"
      );
      const avaxData = priceResponse.data["avalanche-2"];

      if (avaxData) {
        // Set market cap
        setMarketCap({
          value: formatCurrency(avaxData.usd_market_cap),
          change: {
            value: `${Math.abs(avaxData.usd_24h_change).toFixed(2)}%`,
            isPositive: avaxData.usd_24h_change >= 0,
          },
        });
      }

      setLoading((prev) => ({ ...prev, marketCap: false }));

      // Fetch TPS
      const tpsResponse = await axios.get("http://localhost:5001/api/tps");
      if (tpsResponse.data) {
        setTps({
          value: tpsResponse.data.tps.toFixed(1),
          change: {
            value: "0.3%",
            isPositive: true,
          },
        });
      }
      setLoading((prev) => ({ ...prev, tps: false }));

      // Mock transaction volume data (in production this would be from a real API)
      setTransactionsVolume({
        value: "1.2M",
        change: {
          value: "5.2%",
          isPositive: true,
        },
      });
      setLoading((prev) => ({ ...prev, transactionsVolume: false }));

      // Mock gas fees data
      setGasFees({
        value: "$0.05",
        change: {
          value: "2.1%",
          isPositive: false,
        },
      });
      setLoading((prev) => ({ ...prev, gasFees: false }));

      // Mock active addresses data
      setActiveAddresses({
        value: "125.4K",
        change: {
          value: "3.7%",
          isPositive: true,
        },
      });
      setLoading((prev) => ({ ...prev, activeAddresses: false }));

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching network data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Overview</h2>
        <button
          onClick={fetchNetworkData}
          className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>
            {refreshing
              ? "Refreshing..."
              : lastUpdated
              ? `Updated: ${lastUpdated.toLocaleTimeString()}`
              : "Refresh"}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard
          title="TPS"
          value={tps.value}
          change={tps.change}
          icon={<Activity className="h-4 w-4" />}
          isLoading={loading.tps}
          tooltip="Transactions per second on the Avalanche network"
        />
        <OverviewCard
          title="Market Cap"
          value={marketCap.value}
          change={marketCap.change}
          icon={<BarChart2 className="h-4 w-4" />}
          isLoading={loading.marketCap}
          tooltip="Total market capitalization of AVAX tokens"
        />
        <OverviewCard
          title="Transactions Volume"
          value={transactionsVolume.value}
          change={transactionsVolume.change}
          icon={<CircleDollarSign className="h-4 w-4" />}
          isLoading={loading.transactionsVolume}
          tooltip="Total number of transactions on the network"
        />
        <OverviewCard
          title="Gas Fees"
          value={gasFees.value}
          change={gasFees.change}
          icon={<BadgePercent className="h-4 w-4" />}
          isLoading={loading.gasFees}
          tooltip="Average gas fee for transactions"
        />
        <OverviewCard
          title="Active Addresses"
          value={activeAddresses.value}
          change={activeAddresses.change}
          icon={<Wallet className="h-4 w-4" />}
          isLoading={loading.activeAddresses}
          tooltip="Number of unique active addresses on the network"
        />
      </div>
    </section>
  );
};

export default OverviewSection;
