import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Database,
  Users,
  Clock,
  RefreshCw,
  DollarSign,
  BarChart2,
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
        <div className="h-8 w-8 p-1.5 rounded-full bg-primary/10 text-primary">
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
          <p className="text-xs mt-1">
            <span
              className={
                change.isPositive
                  ? "text-success flex items-center"
                  : "text-error flex items-center"
              }
            >
              {change.isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {change.value} (24h)
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const OverviewSection = () => {
  const [avaxPrice, setAvaxPrice] = useState<{
    value: string;
    change: { value: string; isPositive: boolean };
  }>({
    value: "$0.00",
    change: { value: "0.0%", isPositive: true },
  });

  const [tps, setTps] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0",
  });

  const [validators, setValidators] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0",
  });

  const [blockTime, setBlockTime] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "0s",
  });

  const [marketCap, setMarketCap] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "$0",
  });

  const [tvl, setTVL] = useState<{
    value: string;
    change?: { value: string; isPositive: boolean };
  }>({
    value: "$0",
  });

  const [loading, setLoading] = useState({
    avaxPrice: true,
    tps: true,
    validators: true,
    blockTime: true,
    marketCap: true,
    tvl: true,
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

  const fetchNetworkData = async () => {
    setRefreshing(true);
    try {
      // Fetch AVAX price
      const priceResponse = await axios.get(
        "http://localhost:5001/api/token-prices"
      );
      const avaxData = priceResponse.data["avalanche-2"];
      
      if (avaxData) {
        setAvaxPrice({
          value: `$${avaxData.usd.toFixed(2)}`,
          change: {
            value: `${Math.abs(avaxData.usd_24h_change).toFixed(2)}%`,
            isPositive: avaxData.usd_24h_change >= 0,
          },
        });
        
        // Set market cap from the same data
        setMarketCap({
          value: formatCurrency(avaxData.usd_market_cap),
          change: {
            value: `${Math.abs(avaxData.usd_24h_change).toFixed(2)}%`,
            isPositive: avaxData.usd_24h_change >= 0,
          },
        });
      }
      
      setLoading((prev) => ({ ...prev, avaxPrice: false, marketCap: false }));

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

      // Fetch Validators
      const validatorsResponse = await axios.get(
        "http://localhost:5001/api/validators"
      );
      if (validatorsResponse.data) {
        setValidators({
          value: validatorsResponse.data.count.toLocaleString(),
        });
      }
      setLoading((prev) => ({ ...prev, validators: false }));

      // Set block time (mocked for now)
      setBlockTime({
        value: "2.3s",
      });
      setLoading((prev) => ({ ...prev, blockTime: false }));

      // Set TVL (mocked for now, would come from DeFi Llama API in production)
      setTVL({
        value: "$542.3M",
        change: {
          value: "2.1%",
          isPositive: true,
        },
      });
      setLoading((prev) => ({ ...prev, tvl: false }));

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching network data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchNetworkData();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-base-content">Network Overview</h2>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          {lastUpdated && (
            <span className="text-xs">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="p-1 rounded-full hover:bg-base-300 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard
          title="AVAX Price"
          value={avaxPrice.value}
          change={avaxPrice.change}
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={loading.avaxPrice}
          tooltip="Current AVAX token price in USD"
        />
        <OverviewCard
          title="Transactions Per Second"
          value={tps.value}
          change={tps.change}
          icon={<Activity className="h-4 w-4" />}
          isLoading={loading.tps}
          tooltip="Average number of transactions processed per second on the network"
        />
        <OverviewCard
          title="Active Validators"
          value={validators.value}
          icon={<Users className="h-4 w-4" />}
          isLoading={loading.validators}
          tooltip="Number of active validators securing the Avalanche network"
        />
        <OverviewCard
          title="Block Time"
          value={blockTime.value}
          icon={<Clock className="h-4 w-4" />}
          isLoading={loading.blockTime}
          tooltip="Average time between blocks on the C-Chain"
        />
        <OverviewCard
          title="Market Cap"
          value={marketCap.value}
          change={marketCap.change}
          icon={<BarChart2 className="h-4 w-4" />}
          isLoading={loading.marketCap}
          tooltip="Total market capitalization of AVAX token"
        />
        <OverviewCard
          title="Total Value Locked (TVL)"
          value={tvl.value}
          change={tvl.change}
          icon={<Database className="h-4 w-4" />}
          isLoading={loading.tvl}
          tooltip="Total value locked in Avalanche DeFi protocols"
        />
      </div>
    </div>
  );
};

export default OverviewSection;
