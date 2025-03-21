import { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Web3Modal } from "./context/Web3Modal";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

// Layout
import DashboardLayout from "./components/layouts/DashboardLayout";

// Pages
import HomePage from "./pages/HomePage";
import ChartsPage from "./pages/ChartsPage";
import NewsPage from "./pages/NewsPage";
import TokensPage from "./pages/TokensPage";
import NetworkPage from "./pages/NetworkPage";
import WatchlistPage from "./pages/WatchlistPage";
import HeroPre from "./components/HeroPre";

function App() {
  const { isConnected } = useWeb3ModalAccount();

  // Add an effect to check for wallet connection at app startup
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && typeof window.ethereum.request === "function") {
        try {
          // Request accounts to trigger the wallet connect dialog if not connected
          // This makes MetaMask show up if it was previously connected
          await window.ethereum.request({ method: "eth_accounts" });
        } catch (error) {
          console.error("Error checking for wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <Web3Modal>
      <Suspense fallback={<p>Loading...</p>}>
        {!isConnected ? (
          <div className="min-h-screen flex items-center justify-center bg-base-100 text-base-content">
            <HeroPre />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="charts" element={<ChartsPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="tokens" element={<TokensPage />} />
              <Route path="network" element={<NetworkPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              {/* Redirect any unmatched routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        )}
      </Suspense>
    </Web3Modal>
  );
}

export default App;
