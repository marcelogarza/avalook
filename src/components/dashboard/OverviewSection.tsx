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
}

const OverviewCard = ({
  title = "Metric",
  value = "$0.00",
  change,
  icon = <Activity className="h-4 w-4" />,
  isLoading,
}: OverviewCardProps) => {
  return (
    <Card className="bg-base-100 border border-base-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-base-content">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-base-content/70">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-base-content">
          {isLoading ? "Loading..." : value}
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
        "http://localhost:5001/api/avalanche/overview",
        { timeout: 12000 } // 12 second timeout
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

      // Show a user-friendly error message
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setError(
          "Request timed out. The server might be busy. Please try again later."
        );
      } else if (axios.isAxiosError(error) && error.response) {
        setError(
          `Server error (${error.response.status}). The backend service might be unavailable.`
        );
      } else {
        setError(
          "Unable to fetch network data. Will retry automatically. Using cached data if available."
        );
      }

      // Only retry a limited number of times with increasing delay
      if (retryCount < 3) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${retryDelay}ms (attempt ${retryCount + 1})`);

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
    const intervalId = setInterval(fetchNetworkData, 120000);

    return () => clearInterval(intervalId);
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
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-base-content/70 hover:text-primary disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error p-3 rounded-md mb-4">
          {error}
        </div>
      )}

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
          icon={<Activity className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Market Cap"
          value={networkData?.marketCap.formatted || ""}
          change={
            networkData?.marketCap
              ? {
                  value: `${2.31}% (24h)`,
                  isPositive: networkData.marketCap.isPositive,
                }
              : undefined
          }
          icon={<Database className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Transactions Per Second"
          value={networkData?.tps.formatted || ""}
          icon={<Clock className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Active Validators"
          value={networkData?.activeValidators.formatted || ""}
          icon={<Users className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};

export default OverviewSection;
