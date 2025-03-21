const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for frontend
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Simple route to test server is working
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// API endpoint to get AVAX price from CoinGecko
app.get("/api/avax-price", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd&include_market_cap=true&include_24h_vol=true&include_24h_change=true"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching AVAX price:", error.message);
    res.status(500).json({ error: "Failed to fetch AVAX price" });
  }
});

// API endpoint to get combined network metrics with real AVAX price
app.get("/api/avalanche/overview", async (req, res) => {
  try {
    // Fetch real AVAX price from CoinGecko
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd&include_market_cap=true&include_24h_vol=true&include_24h_change=true"
    );

    const avaxData = response.data["avalanche-2"];

    // Format the data
    const networkOverview = {
      price: {
        value: avaxData.usd,
        formatted: `$${avaxData.usd.toFixed(2)}`,
        change: avaxData.usd_24h_change.toFixed(2),
        isPositive: avaxData.usd_24h_change >= 0,
      },
      marketCap: {
        value: avaxData.usd_market_cap,
        formatted: `$${(avaxData.usd_market_cap / 1e9).toFixed(2)}B`,
        change: avaxData.usd_24h_change.toFixed(2),
        isPositive: avaxData.usd_24h_change >= 0,
      },
      tps: {
        value: 4521,
        formatted: "4,521",
      },
      activeValidators: {
        value: 1234,
        formatted: "1,234",
      },
    };

    res.json(networkOverview);
  } catch (error) {
    console.error("Error fetching network overview:", error.message);
    res.status(500).json({ error: "Failed to fetch network overview" });
  }
});

// API endpoint to get multiple token prices from CoinGecko
app.get("/api/token-prices", async (req, res) => {
  try {
    const tokens = "avalanche-2,joe,pangolin,benqi";
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token prices:", error.message);
    res.status(500).json({ error: "Failed to fetch token prices" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
