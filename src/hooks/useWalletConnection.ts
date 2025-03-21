import { useWeb3Modal } from "@web3modal/ethers5/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useWalletConnection() {
  const web3Modal = useWeb3Modal();
  const [connected, setConnected] = useState(false);
  const [walletProvider, setWalletProvider] = useState(null);

  // Function to check wallet connection status
  const checkConnection = async () => {
    try {
      // For ethers v5, check the connection status from ethereum object
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        const isConnected = accounts.length > 0;
        setConnected(isConnected);

        if (isConnected) {
          setWalletProvider(window.ethereum);
        } else {
          setWalletProvider(null);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setConnected(false);
    }
  };

  // Check connection on initial load
  useEffect(() => {
    checkConnection();

    // Add event listeners for wallet connection changes
    const handleAccountsChanged = (accounts) => {
      console.log("Accounts changed:", accounts);
      setConnected(accounts.length > 0);
      if (accounts.length > 0 && window.ethereum) {
        setWalletProvider(window.ethereum);
      } else {
        setWalletProvider(null);
      }
    };

    const handleChainChanged = () => {
      // When chain changes, refresh page to ensure state is consistent
      window.location.reload();
    };

    const handleConnect = () => {
      console.log("Wallet connected event fired");
      checkConnection();
    };

    const handleDisconnect = () => {
      console.log("Wallet disconnected event fired");
      setConnected(false);
      setWalletProvider(null);
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("connect", handleConnect);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("connect", handleConnect);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, []);

  const logout = async () => {
    if (web3Modal && web3Modal.close) {
      try {
        // Close the web3modal connection
        await web3Modal.close();
      } catch (error) {
        console.error("Error closing web3modal:", error);
      }
    }

    // Force disconnect by setting connected state to false
    setConnected(false);
    setWalletProvider(null);

    // If you're using MetaMask, you can't programmatically disconnect
    // The user has to disconnect manually from their wallet
    console.log("Logged out successfully");
  };

  const refreshConnectionStatus = () => {
    checkConnection();
  };

  return { connected, walletProvider, logout, refreshConnectionStatus };
}
