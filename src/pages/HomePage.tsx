import React from "react";
import OverviewSection from "../components/dashboard/OverviewSection";
import ChartsSection from "../components/dashboard/ChartsSection";
import NewsFeedSection from "../components/dashboard/NewsFeedSection";
import TokenPriceSection from "../components/dashboard/TokenPriceSection";
import WatchlistSection from "../components/dashboard/WatchlistSection";

const HomePage = () => {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <OverviewSection />

      {/* Charts Section */}
      <ChartsSection />

      {/* News and Token Prices (side by side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NewsFeedSection />
        <TokenPriceSection />
      </div>

      {/* Watchlist Section */}
      <WatchlistSection />
    </div>
  );
};

export default HomePage;
