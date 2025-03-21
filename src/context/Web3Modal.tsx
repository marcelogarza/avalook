"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { ReactNode } from "react";

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
  themeMode: "auto",
  themeVariables: {
    "--w3m-z-index": "1000",
  },
});

interface Web3ModalProps {
  children: ReactNode;
}

export function Web3Modal({ children }: Web3ModalProps) {
  return children;
}
