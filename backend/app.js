const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5001;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Enable CORS for frontend
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Cache mechanism to avoid rate limits
const cache = {
  tokenPrices: {
    data: null,
    timestamp: 0,
    expiryTime: 60000, // 1 minute cache
  },
  tps: {
    data: null,
    timestamp: 0,
    expiryTime: 300000, // 5 minutes cache
  },
  volume: {
    data: null,
    timestamp: 0,
    expiryTime: 300000, // 5 minutes cache
  },
  gas: {
    data: null,
    timestamp: 0,
    expiryTime: 300000, // 5 minutes cache
  },
  active: {
    data: null,
    timestamp: 0,
    expiryTime: 300000, // 5 minutes cache
  },
  news: {
    data: null,
    timestamp: 0,
    expiryTime: 600000, // 10 minutes cache
  },
};

// Helper function to check if cache is valid
const isCacheValid = (cacheKey) => {
  return (
    cache[cacheKey].data &&
    Date.now() - cache[cacheKey].timestamp < cache[cacheKey].expiryTime
  );
};

// Simple route to test server is working
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// API endpoint to get AVAX price from CoinGecko
app.get("/api/avax-price", async (req, res) => {
  try {
    if (isCacheValid("tokenPrices") && cache.tokenPrices.data["avalanche-2"]) {
      return res.json({ "avalanche-2": cache.tokenPrices.data["avalanche-2"] });
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching AVAX price:", error.message);
    res.status(500).json({ message: "Error fetching AVAX price" });
  }
});

// API endpoint to get multiple token prices
app.get("/api/token-prices", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("tokenPrices")) {
      return res.json(cache.tokenPrices.data);
    }

    const tokens = req.query.tokens || "avalanche-2,joe,pangolin,benqi";

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,joe,pangolin,benqi,aave,frax,sushi,yield-yak,lydia-finance,spookyswap&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "AvaLook Dashboard Application",
        },
      }
    );

    // Update cache
    cache.tokenPrices.data = response.data;
    cache.tokenPrices.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token prices:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.tokenPrices.data) {
      console.log("Returning stale cache data for token prices");
      return res.json(cache.tokenPrices.data);
    }

    res.status(500).json({ message: "Error fetching token prices" });
  }
});

// API endpoint for TPS with timestamp (for average TPS over the last 43114 blocks and chart data)
app.get("/api/tps", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("tps")) {
      return res.json(cache.tps.data);
    }

    const response = await axios.get(
      "https://metrics.avax.network/v1/avg_tps/43114"
    );

    // Update cache
    cache.tps.data = response.data;
    cache.tps.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching TPS:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.tps.data) {
      console.log("Returning stale cache data for TPS");
      return res.json(cache.tps.data);
    }

    res.status(500).json({ message: "Error fetching TPS" });
  }
});

// API endpoint for gas used
app.get("/api/gas", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("gas")) {
      return res.json(cache.gas.data);
    }

    const response = await axios.get(
      "https://metrics.avax.network/v1/gas_used/43114"
    );

    // Update cache
    cache.gas.data = response.data;
    cache.gas.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching gas used:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.gas.data) {
      console.log("Returning stale cache data for gas");
      return res.json(cache.gas.data);
    }

    res.status(500).json({ message: "Error fetching gas used" });
  }
});

// API endpoint for transaction volume
app.get("/api/volume", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("volume")) {
      return res.json(cache.volume.data);
    }

    const response = await axios.get(
      "https://metrics.avax.network/v1/tx_count/43114"
    );

    // Update cache
    cache.volume.data = response.data;
    cache.volume.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching transaction volume:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.volume.data) {
      console.log("Returning stale cache data for volume");
      return res.json(cache.volume.data);
    }

    res.status(500).json({ message: "Error fetching transaction volume" });
  }
});

// API endpoint for active addresses
app.get("/api/active", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("active")) {
      return res.json(cache.active.data);
    }

    const response = await axios.get(
      "https://metrics.avax.network/v1/active_addresses/43114"
    );

    // Update cache
    cache.active.data = response.data;
    cache.active.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching active addresses:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.active.data) {
      console.log("Returning stale cache data for active addresses");
      return res.json(cache.active.data);
    }

    res.status(500).json({ message: "Error fetching active addresses" });
  }
});

// Chat completion API using OpenAI
app.post("/api/chat-completion", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ message: "Error with OpenAI API" });
  }
});

// API endpoint for news
app.get("/api/news", async (req, res) => {
  try {
    // Check if we have valid cached data
    if (isCacheValid("news")) {
      return res.json(cache.news.data);
    }

    const response = await axios.get(
      "https://cryptopanic.com/api/free/v1/posts/?auth_token=87b0dbc04754d3dbae6930568b86d810236a3ccf&filter=hot"
    );

    // Update cache
    cache.news.data = response.data;
    cache.news.timestamp = Date.now();

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.news.data) {
      console.log("Returning stale cache data for news");
      return res.json(cache.news.data);
    }

    res.status(500).json({ message: "Error fetching news" });
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
