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
  }, [isModalOpen, isConnected]);

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
        onClick={() => {
          console.log("Opening Web3Modal");
          open();
        }}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base"
      >
        {isConnected ? "Manage Wallet" : "Connect Wallet"}
      </Button>
      {/* Hidden debugging element */}
      <div style={{ display: "none" }}>Modal open: {String(isModalOpen)}</div>
    </div>
  );
}
