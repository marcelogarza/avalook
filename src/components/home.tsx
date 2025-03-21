import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardNavigation from "./dashboard/DashboardNavigation";
import OverviewSection from "./dashboard/OverviewSection";
import ChartsSection from "./dashboard/ChartsSection";
import NewsFeedSection from "./dashboard/NewsFeedSection";
import TokenPriceSection from "./dashboard/TokenPriceSection";
import WatchlistSection from "./dashboard/WatchlistSection";
import SettingsModal from "./dashboard/SettingsModal";
import HeroPre from "./HeroPre";

const Home = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Use official Web3Modal hooks
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  // Debug: log state changes
  useEffect(() => {
    console.log("Connection state changed:", { isConnected, address });

    // Listen for wallet connection events
    if (typeof window !== "undefined") {
      const handleConnectorSettled = () => {
        console.log("Connector settled");
      };

      window.addEventListener(
        "web3modal_connectorsettled",
        handleConnectorSettled
      );

      return () => {
        window.removeEventListener(
          "web3modal_connectorsettled",
          handleConnectorSettled
        );
      };
    }
  }, [isConnected, address]);

  // Format address when connected
  useEffect(() => {
    if (isConnected && address) {
      // Format address to show first 6 and last 4 characters
      setWalletAddress(address.slice(0, 6) + "..." + address.slice(-4));
    }
  }, [isConnected, address]);

  // Wallet provider effect
  useEffect(() => {
    const getWalletDetails = async () => {
      if (isConnected && walletProvider && address) {
        try {
          const provider = new ethers.providers.Web3Provider(walletProvider);
          console.log("Provider connected:", provider);
        } catch (error) {
          console.error("Error with provider:", error);
        }
      }
    };

    getWalletDetails();
  }, [isConnected, walletProvider, address]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  console.log("Wallet connection status:", isConnected);

  return (
    <AnimatePresence mode="wait">
      {!isConnected && (
        <motion.div
          key="hero-pre"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.75 }}
          className="min-h-screen flex items-center justify-center bg-slate-50"
        >
          <HeroPre />
        </motion.div>
      )}

      {isConnected && (
        <motion.div
          key="hero-post"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen bg-slate-50"
        >
          <DashboardHeader
            onSettingsClick={handleSettingsClick}
            username={walletAddress || address || "Connected Wallet"}
          />

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
