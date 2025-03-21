import React, { useState } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardNavigation from "./dashboard/DashboardNavigation";
import OverviewSection from "./dashboard/OverviewSection";
import ChartsSection from "./dashboard/ChartsSection";
import NewsFeedSection from "./dashboard/NewsFeedSection";
import TokenPriceSection from "./dashboard/TokenPriceSection";
import WatchlistSection from "./dashboard/WatchlistSection";
import SettingsModal from "./dashboard/SettingsModal";

const Home = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  console.log("Wallet connection status:", isConnected);

  return (
    <div className="min-h-screen bg-slate-50">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Home;
