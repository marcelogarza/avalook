import React, { useState } from "react";
import OverviewSection from "../components/dashboard/OverviewSection";
import ChartsSection from "../components/dashboard/ChartsSection";
import NewsFeedSection from "../components/dashboard/NewsFeedSection";
import TokenPriceSection from "../components/dashboard/TokenPriceSection";
import WatchlistSection from "../components/dashboard/WatchlistSection";
import { RefreshCw } from "lucide-react";

const HomePage = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    // Increment refresh trigger to cause child components to refresh
    setRefreshTrigger((prev) => prev + 1);
    setLastUpdated(new Date());
    // Set a timeout to turn off the refreshing state for animation purposes
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
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
      </div>

      {/* Overview Section */}
      <OverviewSection refreshTrigger={refreshTrigger} />

      {/* Charts Section */}
      <ChartsSection refreshTrigger={refreshTrigger} />

      {/* News and Token Prices (side by side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsFeedSection refreshTrigger={refreshTrigger} />
        <TokenPriceSection refreshTrigger={refreshTrigger} />
      </div>

      {/* Watchlist Section */}
      <WatchlistSection refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default HomePage;
