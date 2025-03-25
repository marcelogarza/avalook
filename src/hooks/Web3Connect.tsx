"use client";
import React from "react";
import {
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { Button } from "../components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentTheme, toggleTheme } from "../lib/theme";

export default function Web3Connect() {
  const { open } = useWeb3Modal();
  const { open: isModalOpen } = useWeb3ModalState();
  const { isConnected } = useWeb3ModalAccount();
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  const [connectError, setConnectError] = useState<Error | null>(null);
  const [isAttempting, setIsAttempting] = useState(false);

  // Track theme changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());

    // Add observer for theme changes
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Debug connection state changes
  useEffect(() => {
    console.log("Web3Connect: Modal state:", { isModalOpen, isConnected });
    if (!isModalOpen && isAttempting) {
      setIsAttempting(false);
    }
  }, [isModalOpen, isConnected, isAttempting]);

  const handleOpenModal = async () => {
    try {
      setConnectError(null);
      setIsAttempting(true);
      console.log("Opening Web3Modal");
      await open();
    } catch (error) {
      console.error("Error opening Web3Modal:", error);
      setConnectError(error instanceof Error ? error : new Error(String(error)));
      setIsAttempting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => toggleTheme()}
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-label="Toggle theme"
      >
        {currentTheme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
      </Button>

      <Button
        onClick={handleOpenModal}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base"
        disabled={isAttempting}
      >
        {isConnected ? "Manage Wallet" : isAttempting ? "Connecting..." : "Connect Wallet"}
      </Button>
      {connectError && (
        <div className="text-red-500 text-sm mt-2">
          Failed to connect: {connectError.message}
        </div>
      )}
    </div>
  );
}
