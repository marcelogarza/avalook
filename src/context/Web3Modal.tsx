"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import React, { ReactNode, useEffect, useState } from "react";
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
try {
  createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true,
    enableOnramp: true,
    themeMode: "light",
  });
} catch (error) {
  console.error("Failed to create Web3Modal:", error);
}

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

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Web3Modal error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-4">
          <h2>Something went wrong with Web3Modal.</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Web3Modal({ children }: Web3ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [themeError, setThemeError] = useState<Error | null>(null);

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
        setThemeError(error instanceof Error ? error : new Error(String(error)));
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

  return (
    <ErrorBoundary>
      {themeError ? (
        <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
          <div>
            <p>Failed to initialize Web3Modal: {themeError.message}</p>
            <button 
              onClick={() => setThemeError(null)}
              className="bg-blue-500 text-white p-2 rounded mt-2"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </ErrorBoundary>
  );
}
