import { TypewriterEffect } from "./ui/typewriter-effect";
import { motion } from "framer-motion";
import Web3Connect from "../hooks/Web3Connect";
import React, { useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

const HeroPre = () => {
  const { isConnected } = useWeb3ModalAccount();

  useEffect(() => {
    console.log("HeroPre: Wallet connection status:", isConnected);
  }, [isConnected]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <TypewriterEffect
          words={[
            {
              text: "Welcome to Avalook",
            },
          ]}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-lg mb-8 text-base-content/80 max-w-xl"
      >
        Your comprehensive dashboard for tracking and managing digital assets.
        Connect your wallet to access your personalized dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
      >
        <Web3Connect />
      </motion.div>
    </div>
  );
};

export default HeroPre;
