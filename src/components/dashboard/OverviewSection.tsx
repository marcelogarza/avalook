import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Database,
  Users,
  Clock,
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
  isLoading?: boolean;
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

interface OverviewSectionProps {
  marketCap?: string;
  marketCapChange?: {
    value: string;
    isPositive: boolean;
  };
  tps?: string;
  activeValidators?: string;
}

const OverviewSection = ({
  marketCap = "$8.2B",
  marketCapChange = { value: "1.8% (24h)", isPositive: true },
  tps = "4,521",
  activeValidators = "1,234",
}: OverviewSectionProps) => {
  const [avaxPrice, setAvaxPrice] = useState<string | null>(null);
  const [avaxChange, setAvaxChange] = useState<{
    value: string;
    isPositive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const fetchAvaxPrice = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5001/api/avax-price");
      const avaxPriceData = response.data["avalanche-2"].usd;

      // Format the price as currency
      const formattedPrice = `$${avaxPriceData.toFixed(2)}`;
      setAvaxPrice(formattedPrice);

      // Update price history
      setPriceHistory((prev) => [...prev, avaxPriceData].slice(-10));

      // Calculate change if we have at least 2 prices
      if (priceHistory.length > 0) {
        const previousPrice = priceHistory[priceHistory.length - 1];
        const changePercent =
          ((avaxPriceData - previousPrice) / previousPrice) * 100;
        setAvaxChange({
          value: `${Math.abs(changePercent).toFixed(2)}% (24h)`,
          isPositive: changePercent >= 0,
        });
      }
    } catch (error) {
      console.error("Error fetching AVAX price:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchAvaxPrice();

    // Set up a timer to fetch data every minute
    const intervalId = setInterval(fetchAvaxPrice, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="w-full bg-base-200 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-base-content">
        Avalanche Network Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="AVAX Price"
          value={avaxPrice || ""}
          change={avaxChange || undefined}
          icon={<Activity className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Market Cap"
          value={marketCap}
          change={marketCapChange}
          icon={<Database className="h-4 w-4" />}
        />
        <OverviewCard
          title="Transactions Per Second"
          value={tps}
          icon={<Clock className="h-4 w-4" />}
        />
        <OverviewCard
          title="Active Validators"
          value={activeValidators}
          icon={<Users className="h-4 w-4" />}
        />
      </div>
    </section>
  );
};

export default OverviewSection;
