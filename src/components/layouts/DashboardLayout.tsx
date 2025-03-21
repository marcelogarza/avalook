import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import DashboardHeader from "../dashboard/DashboardHeader";
import DashboardNavigation from "../dashboard/DashboardNavigation";
import SettingsModal from "../dashboard/SettingsModal";
import { getCurrentTheme } from "@/lib/theme";
import ChatBot from "../chat/ChatBot";

const DashboardLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [walletAddress, setWalletAddress] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Use official Web3Modal hooks
  const { isConnected, address } = useWeb3ModalAccount();

  // Set up theme detection
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

  // Format address when connected
  useEffect(() => {
    if (isConnected && address) {
      // Format address to show first 6 and last 4 characters
      setWalletAddress(address.slice(0, 6) + "..." + address.slice(-4));
    }
  }, [isConnected, address]);

  const handleSectionChange = (section: string) => {
    // Navigation is handled by the Links in DashboardNavigation component
    // This is just for additional actions if needed
  };

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-100 text-base-content flex flex-col"
    >
      <DashboardHeader
        onSettingsClick={handleSettingsClick}
        username={walletAddress || address || "Connected Wallet"}
        className="sticky top-0 z-10"
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="fixed top-20 left-0 h-[calc(100vh-5rem)] z-10">
          <DashboardNavigation
            onSectionChange={handleSectionChange}
            className="h-full overflow-y-auto overscroll-none"
          />
        </div>

        <main className="flex-1 p-6 overflow-y-auto overscroll-none ml-[250px]">
          <div className="max-w-7xl mx-auto">
            {/* This is where the page content will be rendered */}
            <Outlet />
          </div>
        </main>
      </div>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />

      <ChatBot />
    </motion.div>
  );
};

export default DashboardLayout;
