import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardNavigation from "./dashboard/DashboardNavigation";
import OverviewSection from "./dashboard/OverviewSection";
import ChartsSection from "./dashboard/ChartsSection";
import NewsFeedSection from "./dashboard/NewsFeedSection";
import TokenPriceSection from "./dashboard/TokenPriceSection";
import WatchlistSection from "./dashboard/WatchlistSection";
import SettingsModal from "./dashboard/SettingsModal";
import { getCurrentTheme } from "@/lib/theme";

const Home = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
    // Add event listener to update theme state when it changes
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <DashboardHeader onSettingsClick={handleSettingsClick} />

      <div className="flex">
        <DashboardNavigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
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
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Home;
