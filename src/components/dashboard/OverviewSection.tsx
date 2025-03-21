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
        <div className="h-4 w-4 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-base-content transition-opacity duration-300">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-pulse bg-base-300 h-8 w-28 rounded"></div>
            </div>
          ) : (
            value || "-"
          )}
        </div>
        {change && (
          <p
            className={`mt-1 flex items-center text-xs ${
              change.isPositive ? "text-success" : "text-error"
            }`}
          >
            {change.isPositive ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface NetworkData {
  price: {
    value: number;
    formatted: string;
    change: string;
    isPositive: boolean;
  };
  marketCap: {
    value: number;
    formatted: string;
    change: string;
    isPositive: boolean;
  };
  tps: {
    value: number;
    formatted: string;
  };
  activeValidators: {
    value: number;
    formatted: string;
  };
}

// Mock data for fallback
const mockNetworkData: NetworkData = {
  price: {
    value: 27.42,
    formatted: "$27.42",
    change: "1.94",
    isPositive: true,
  },
  marketCap: {
    value: 9812000000,
    formatted: "$9.81B",
    change: "2.31",
    isPositive: true,
  },
  tps: {
    value: 20.3,
    formatted: "20.3",
  },
  activeValidators: {
    value: 1198,
    formatted: "1,198",
  },
};

// API base URL - use environment variable if available
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

interface OverviewSectionProps {}

const OverviewSection = ({}: OverviewSectionProps) => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNetworkData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_BASE_URL}/api/avalanche/overview`,
        {
          timeout: 30000,
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );

      // Verify the response has all required fields
      if (
        response.data &&
        response.data.price &&
        response.data.marketCap &&
        response.data.tps &&
        response.data.activeValidators
      ) {
        setNetworkData(response.data);
        setLastUpdated(new Date());
        setRetryCount(0); // Reset retry count on success
      } else {
        console.warn("Invalid response data format:", response.data);
        throw new Error("Invalid response data format");
      }
    } catch (error) {
      console.error("Error fetching network data:", error);

      // If we already have data, keep using it instead of replacing with mock data
      if (!networkData) {
        console.log("No existing data, using mock data");
        setNetworkData(mockNetworkData);
      } else {
        console.log(
          "Keeping existing data instead of replacing with mock data"
        );
      }

      setLastUpdated(new Date());

      // Only log error in console, don't display to user
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        console.log("Request timed out. Using existing or mock data.");
      } else if (axios.isAxiosError(error) && error.response) {
        console.log(
          `Server error (${error.response.status}). Using existing or mock data.`
        );
      } else {
        console.log(
          "Unable to fetch network data. Using existing or mock data."
        );
      }

      // Only retry once with a short delay
      if (retryCount < 1) {
        const retryDelay = 2000; // Just retry once after 2 seconds
        console.log(`Retrying in ${retryDelay}ms`);

        setRetryCount((prev) => prev + 1);
        setTimeout(fetchNetworkData, retryDelay);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Reset retry count on manual refresh
    setRetryCount(0);
    fetchNetworkData();
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchNetworkData();

    // Set up auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      fetchNetworkData();
    }, 120000); // 120000 ms = 2 minutes

    return () => {
      // Clean up interval on unmount
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <section className="w-full bg-base-200 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-base-content">
          Avalanche Network Overview
        </h2>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <p className="text-xs text-base-content/60">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-base-content/70 hover:text-primary disabled:opacity-50 p-1 rounded-full hover:bg-base-300 transition-colors duration-200"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="AVAX Price"
          value={networkData?.price.formatted || ""}
          change={
            networkData?.price
              ? {
                  value: `${networkData.price.change}% (24h)`,
                  isPositive: networkData.price.isPositive,
                }
              : undefined
          }
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Current AVAX token price in USD with 24-hour price change"
        />
        <OverviewCard
          title="Market Cap"
          value={networkData?.marketCap.formatted || ""}
          change={
            networkData?.marketCap
              ? {
                  value: `${networkData.marketCap.change}% (24h)`,
                  isPositive: networkData.marketCap.isPositive,
                }
              : undefined
          }
          icon={<BarChart2 className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Total AVAX market capitalization in USD"
        />
        <OverviewCard
          title="Transactions Per Second"
          value={networkData?.tps.formatted || ""}
          icon={<Activity className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Average number of transactions processed per second"
        />
        <OverviewCard
          title="Active Validators"
          value={networkData?.activeValidators.formatted || ""}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
          tooltip="Number of active validators securing the Avalanche network"
        />
      </div>
    </section>
  );
};

export default OverviewSection;
