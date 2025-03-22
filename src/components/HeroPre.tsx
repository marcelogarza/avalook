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
      <div className="mb-8 flex items-center justify-center">
        <img src="/logo.png" alt="AvaLook Logo" className="h-12 w-12 mr-2" />
        <TypewriterEffect
          words={[
            {
              text: "AvaLook",
              className: "text-primary",
            },
          ]}
        />
      </div>

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
