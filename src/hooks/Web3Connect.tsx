"use client";
import {
  useWeb3Modal,
  useWeb3ModalState,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";
import { Button } from "../components/ui/button";
import { useEffect } from "react";

export default function Web3Connect() {
  const { open } = useWeb3Modal();
  const { open: isModalOpen } = useWeb3ModalState();
  const { isConnected } = useWeb3ModalAccount();

  // Debug connection state changes
  useEffect(() => {
    console.log("Web3Connect: Modal state:", { isModalOpen, isConnected });
  }, [isModalOpen, isConnected]);

  return (
    <>
      <Button
        onClick={() => {
          console.log("Opening Web3Modal");
          open();
        }}
        className="px-6 py-3 text-base"
      >
        {isConnected ? "Manage Wallet" : "Connect Wallet"}
      </Button>
      {/* Hidden debugging element */}
      <div style={{ display: "none" }}>Modal open: {String(isModalOpen)}</div>
    </>
  );
}
