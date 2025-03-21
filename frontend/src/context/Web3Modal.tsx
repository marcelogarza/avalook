"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { ReactNode, useEffect, useState } from "react";
import { getCurrentTheme } from "../lib/theme";

// IMPORTANT: Using the provided projectId, but you should get your own from WalletConnect Cloud
// Go to: https://cloud.walletconnect.com/ to get one
export const projectId = "79d799e3e9861f3f6070f33a945ee605";

// Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// Create metadata - Update with your actual app information
const metadata = {
  name: "Avalook",
  description: "Web3 Dashboard Application",
  url: "https://avalook.io", // Should match your actual domain
  icons: ["https://avalook.io/icon.png"],
};

// Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  defaultChainId: 1,
});

// Create Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: "light",
});

interface Web3ModalProps {
  children: ReactNode;
}

// Define window types for our custom properties
declare global {
  interface Window {
    web3Modal?: {
      setThemeMode?: (mode: "dark" | "light") => void;
    };
  }
}

export function Web3Modal({ children }: Web3ModalProps) {
  const [mounted, setMounted] = useState(false);

  // This effect ensures theme syncing between your app and Web3Modal
  useEffect(() => {
    setMounted(true);

    // Function to sync theme with Web3Modal
    const syncThemeWithModal = () => {
      const theme = getCurrentTheme();
      const w3mThemeMode = theme === "dark" ? "dark" : "light";

      // Get the Web3Modal instance to update theme
      try {
        if (window.web3Modal && window.web3Modal.setThemeMode) {
          window.web3Modal.setThemeMode(w3mThemeMode);
        }
      } catch (error) {
        console.error("Failed to sync theme with Web3Modal:", error);
      }
    };

    // Initial sync
    syncThemeWithModal();

    // Set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          syncThemeWithModal();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Only render children when mounted to avoid hydration issues
  if (!mounted) return null;

  return children;
}
