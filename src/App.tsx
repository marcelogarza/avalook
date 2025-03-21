import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Web3Modal } from "./context/Web3Modal";

function App() {
  // Add an effect to check for wallet connection at app startup
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.ethereum &&
      typeof window.ethereum.request === "function"
    ) {
      try {
        // Request accounts to trigger wallet status check
        window.ethereum.request({ method: "eth_accounts" });
      } catch (error) {
        console.error("Error checking for wallet connection:", error);
      }
    }
  }, []);

  return (
    <Web3Modal>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </Web3Modal>
  );
}

export default App;
