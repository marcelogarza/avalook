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

// Avalanche Metrics API base URL
const METRICS_API_BASE_URL = "https://api.avax.network/v1/metrics";
// Avalanche Primary Network API base URL
const AVAX_API_BASE_URL = "https://api.avax.network";
// Avalanche public stats API
const AVAX_STATS_API_BASE_URL =
  "https://avascan-api.avax.network/v2/statistics";
// CoinGecko API base URL
const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

// Mock API response flag - set to true if APIs don't exist or are not accessible
const USE_MOCK_DATA = false;

// CoinGecko rate limit handling
const COINGECKO_RATE_LIMIT_DELAY = 60000; // 1 minute delay when rate limited
let lastCoinGeckoCallTime = 0;
const MIN_CALL_INTERVAL = 6000; // At least 6 seconds between calls

// Custom API data - This would normally come from a database
const customApiData = {
  tps: {
    current: 22.7,
    history: Array(24)
      .fill()
      .map((_, i) => ({
        timestamp: new Date(
          Date.now() - (23 - i) * 60 * 60 * 1000
        ).toISOString(),
        value: 15 + Math.sin(i / 3) * 10 + Math.random() * 5,
      })),
  },
  validators: {
    current: 1203,
    history: Array(30)
      .fill()
      .map((_, i) => ({
        timestamp: new Date(
          Date.now() - (29 - i) * 24 * 60 * 60 * 1000
        ).toISOString(),
        value: 1190 + Math.floor(Math.random() * 20),
      })),
  },
  transactions: {
    daily: Array(7)
      .fill()
      .map((_, i) => ({
        timestamp: new Date(
          Date.now() - (6 - i) * 24 * 60 * 60 * 1000
        ).toISOString(),
        value: 320000 + Math.floor(Math.random() * 50000),
      })),
  },
  tokens: {
    "avalanche-2": {
      usd: 27.85,
      usd_24h_change: 2.1,
      usd_market_cap: 9927000000,
      usd_24h_vol: 176500000,
      history: generatePriceHistory(28, 26, 30, 30),
    },
    joe: {
      usd: 0.68,
      usd_24h_change: -1.8,
      usd_market_cap: 233400000,
      usd_24h_vol: 14700000,
      history: generatePriceHistory(0.65, 0.61, 0.72, 30),
    },
    pangolin: {
      usd: 0.12,
      usd_24h_change: 5.4,
      usd_market_cap: 34200000,
      usd_24h_vol: 2100000,
      history: generatePriceHistory(0.11, 0.09, 0.13, 30),
    },
    benqi: {
      usd: 0.023,
      usd_24h_change: 1.2,
      usd_market_cap: 76500000,
      usd_24h_vol: 3100000,
      history: generatePriceHistory(0.021, 0.019, 0.024, 30),
    },
  },
};

// Cache to store API responses and reduce API calls
const cache = {
  avaxPrice: null,
  avaxPriceLastUpdated: null,
  tps: null,
  tpsLastUpdated: null,
  validatorCount: null,
  validatorCountLastUpdated: null,
  tokenPrices: null,
  tokenPricesLastUpdated: null,
  tokenPriceHistory: {},
  tokenPriceHistoryLastUpdated: {},
  avaxMetrics: null,
  avaxMetricsLastUpdated: null,
};

// Check if cache is still valid (less than 5 minutes old)
const isCacheValid = (lastUpdated) => {
  if (!lastUpdated) return false;
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  return lastUpdated > fiveMinutesAgo;
};

// Fallback data in case APIs fail
const fallbackData = {
  avaxPrice: {
    "avalanche-2": {
      usd: 27.42,
      usd_24h_change: 1.94,
      usd_market_cap: 9812000000,
      usd_24h_vol: 172400000,
    },
  },
  tps: 20.3,
  validatorCount: 1198,
};

// Simple route to test server is working
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// Helper function to manage CoinGecko API call timing
async function callCoinGeckoAPI(url, options = {}) {
  try {
    // Check if we need to wait due to rate limiting
    const now = Date.now();
    const timeSinceLastCall = now - lastCoinGeckoCallTime;

    if (timeSinceLastCall < MIN_CALL_INTERVAL) {
      const waitTime = MIN_CALL_INTERVAL - timeSinceLastCall;
      console.log(`Waiting ${waitTime}ms before next CoinGecko API call`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // Update last call time
    lastCoinGeckoCallTime = Date.now();

    // Make the API call
    return await axios.get(url, { timeout: 10000, ...options });
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log("CoinGecko rate limit hit, will retry after delay");
      lastCoinGeckoCallTime = Date.now() + COINGECKO_RATE_LIMIT_DELAY;
      throw new Error("Rate limited by CoinGecko API");
    }
    throw error;
  }
}

// Helper function to fetch AVAX price from CoinGecko with caching
async function fetchAvaxPrice() {
  try {
    // Check if we have valid cached data
    if (isCacheValid(cache.avaxPriceLastUpdated)) {
      return cache.avaxPrice;
    }

    try {
      // If no valid cache, fetch from CoinGecko with rate limit handling
      const response = await callCoinGeckoAPI(
        `${COINGECKO_API_BASE_URL}/simple/price?ids=avalanche-2&vs_currencies=usd&include_market_cap=true&include_24h_vol=true&include_24h_change=true`
      );

      // Update cache
      cache.avaxPrice = response.data;
      cache.avaxPriceLastUpdated = new Date();

      return response.data;
    } catch (coinGeckoError) {
      if (coinGeckoError.message === "Rate limited by CoinGecko API") {
        console.log("Using cached or fallback data due to rate limits");

        // Return cache if it exists (even if expired)
        if (cache.avaxPrice) {
          return cache.avaxPrice;
        }

        throw coinGeckoError;
      }
      throw coinGeckoError;
    }
  } catch (error) {
    console.error("Error fetching AVAX price from CoinGecko:", error.message);

    // Return cache if it exists (even if expired)
    if (cache.avaxPrice) {
      return cache.avaxPrice;
    }

    // Otherwise use fallback data
    return fallbackData.avaxPrice;
  }
}

// API endpoint to get AVAX price from CoinGecko
app.get("/api/avax-price", async (req, res) => {
  try {
    const data = await fetchAvaxPrice();
    res.json(data);
  } catch (error) {
    console.error("Error handling AVAX price request:", error.message);
    res.status(500).json({ error: "Failed to fetch AVAX price" });
  }
});

// Helper function to fetch TPS data from Metrics API with caching
async function fetchTPS() {
  try {
    // Check if we have valid cached data
    if (isCacheValid(cache.tpsLastUpdated)) {
      return cache.tps;
    }

    if (USE_MOCK_DATA) {
      // Use our custom API data
      console.log("Using custom TPS data");
      cache.tps = customApiData.tps.current;
      cache.tpsLastUpdated = new Date();
      return customApiData.tps.current;
    }

    // Fetch from Avascan statistics API
    const response = await axios.get(`${AVAX_STATS_API_BASE_URL}/c-chain/tps`, {
      timeout: 8000,
    });

    if (response.data && response.data.data) {
      cache.tps = parseFloat(response.data.data);
      cache.tpsLastUpdated = new Date();
      return parseFloat(response.data.data);
    } else {
      throw new Error("Invalid TPS data format");
    }
  } catch (error) {
    console.error("Error fetching TPS data:", error.message);

    // Return cache if it exists (even if expired)
    if (cache.tps !== null) {
      return cache.tps;
    }

    return fallbackData.tps; // Fallback value
  }
}

// Helper function to fetch validator count from Metrics API with caching
async function fetchValidatorCount() {
  try {
    // Check if we have valid cached data
    if (isCacheValid(cache.validatorCountLastUpdated)) {
      return cache.validatorCount;
    }

    if (USE_MOCK_DATA) {
      // Use our custom API data
      console.log("Using custom validator data");
      cache.validatorCount = customApiData.validators.current;
      cache.validatorCountLastUpdated = new Date();
      return customApiData.validators.current;
    }

    // Fetch from Avalanche P-Chain API
    const response = await axios.post(
      `${AVAX_API_BASE_URL}/ext/bc/P`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "platform.getCurrentValidators",
        params: {},
      },
      { timeout: 8000 }
    );

    if (
      response.data &&
      response.data.result &&
      response.data.result.validators
    ) {
      cache.validatorCount = response.data.result.validators.length;
      cache.validatorCountLastUpdated = new Date();
      return response.data.result.validators.length;
    } else {
      throw new Error("Invalid validator data format");
    }
  } catch (error) {
    console.error("Error fetching validator count:", error.message);

    // Return cache if it exists (even if expired)
    if (cache.validatorCount !== null) {
      return cache.validatorCount;
    }

    return fallbackData.validatorCount; // Fallback value
  }
}

// API endpoint to get combined network metrics with both APIs
app.get("/api/avalanche/overview", async (req, res) => {
  try {
    // Fetch data from both APIs in parallel
    const [avaxPriceData, tps, validatorCount] = await Promise.all([
      fetchAvaxPrice(),
      fetchTPS(),
      fetchValidatorCount(),
    ]);

    // Check if avaxPriceData has the expected structure
    if (!avaxPriceData || !avaxPriceData["avalanche-2"]) {
      console.error("Invalid AVAX price data:", avaxPriceData);
      throw new Error("Invalid AVAX price data structure");
    }

    const avaxData = avaxPriceData["avalanche-2"];

    // Ensure all required fields exist, otherwise use fallback values
    const price =
      typeof avaxData.usd === "number"
        ? avaxData.usd
        : fallbackData.avaxPrice["avalanche-2"].usd;
    const priceChange =
      typeof avaxData.usd_24h_change === "number"
        ? avaxData.usd_24h_change
        : fallbackData.avaxPrice["avalanche-2"].usd_24h_change;
    const marketCap =
      typeof avaxData.usd_market_cap === "number"
        ? avaxData.usd_market_cap
        : fallbackData.avaxPrice["avalanche-2"].usd_market_cap;

    // Format the data
    const networkOverview = {
      price: {
        value: price,
        formatted: `$${price.toFixed(2)}`,
        change: priceChange.toFixed(2),
        isPositive: priceChange >= 0,
      },
      marketCap: {
        value: marketCap,
        formatted: `$${(marketCap / 1e9).toFixed(2)}B`,
        change: priceChange.toFixed(2),
        isPositive: priceChange >= 0,
      },
      tps: {
        value: tps,
        formatted: tps.toLocaleString(),
      },
      activeValidators: {
        value: validatorCount,
        formatted: validatorCount.toLocaleString(),
      },
    };

    res.json(networkOverview);
  } catch (error) {
    console.error("Error fetching network overview:", error.message);

    // Provide fallback data when an error occurs
    const avaxData = fallbackData.avaxPrice["avalanche-2"];
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
        value: fallbackData.tps,
        formatted: fallbackData.tps.toLocaleString(),
      },
      activeValidators: {
        value: fallbackData.validatorCount,
        formatted: fallbackData.validatorCount.toLocaleString(),
      },
    };

    res.json(networkOverview);
  }
});

// Helper function to fetch token prices from CoinGecko with caching
async function fetchTokenPrices() {
  try {
    // Check if we have valid cached data
    if (isCacheValid(cache.tokenPricesLastUpdated)) {
      return cache.tokenPrices;
    }

    const tokens = "avalanche-2,joe,pangolin,benqi";

    try {
      const response = await callCoinGeckoAPI(
        `${COINGECKO_API_BASE_URL}/simple/price?ids=${tokens}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`
      );

      // Update cache
      cache.tokenPrices = response.data;
      cache.tokenPricesLastUpdated = new Date();

      return response.data;
    } catch (coinGeckoError) {
      if (coinGeckoError.message === "Rate limited by CoinGecko API") {
        console.log("Using cached or fallback data due to rate limits");

        // Return cache if it exists (even if expired)
        if (cache.tokenPrices) {
          return cache.tokenPrices;
        }

        throw coinGeckoError;
      }
      throw coinGeckoError;
    }
  } catch (error) {
    console.error("Error fetching token prices from CoinGecko:", error.message);

    // Return cache if it exists (even if expired)
    if (cache.tokenPrices) {
      return cache.tokenPrices;
    }

    // Return fallback data for tokens
    return {
      "avalanche-2": fallbackData.avaxPrice["avalanche-2"],
      joe: {
        usd: 0.66,
        usd_24h_change: -2.1,
        usd_market_cap: 231000000,
        usd_24h_vol: 14200000,
      },
      pangolin: {
        usd: 0.11,
        usd_24h_change: 4.8,
        usd_market_cap: 33500000,
        usd_24h_vol: 2000000,
      },
      benqi: {
        usd: 0.022,
        usd_24h_change: 0.9,
        usd_market_cap: 75800000,
        usd_24h_vol: 2900000,
      },
    };
  }
}

// API endpoint to get multiple token prices from CoinGecko
app.get("/api/token-prices", async (req, res) => {
  try {
    const data = await fetchTokenPrices();
    res.json(data);
  } catch (error) {
    console.error("Error handling token prices request:", error.message);
    res.status(500).json({ error: "Failed to fetch token prices" });
  }
});

// Helper function to fetch transaction history from Avalanche API
async function fetchTransactionHistory() {
  try {
    if (USE_MOCK_DATA) {
      return customApiData.transactions.daily;
    }

    // Fetch transaction data from Avalanche API - use metrics API if it exists
    const response = await axios.get(`${METRICS_API_BASE_URL}/transactions`, {
      timeout: 8000,
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((item) => ({
        timestamp: item.timestamp,
        value: item.transactions,
      }));
    } else {
      throw new Error("Invalid transaction data format");
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error.message);
    return customApiData.transactions.daily; // Fallback to mock data
  }
}

// Helper function to fetch AVAX network metrics
async function fetchAvaxMetrics() {
  try {
    // Check if we have valid cached data
    if (isCacheValid(cache.avaxMetricsLastUpdated)) {
      return cache.avaxMetrics;
    }

    if (USE_MOCK_DATA) {
      return null;
    }

    // Get various metrics from different endpoints
    const [tps, validatorCount, priceData] = await Promise.all([
      fetchTPS(),
      fetchValidatorCount(),
      fetchAvaxPrice(),
    ]);

    // Build a metrics object from combined data
    const metrics = {
      tps: tps,
      validators: validatorCount,
      totalTransactions: 0, // We'll estimate this
      avgBlockTime: 2.0, // Avalanche has ~2s block time
      price: priceData["avalanche-2"]?.usd || 0,
      priceChange24h: priceData["avalanche-2"]?.usd_24h_change || 0,
    };

    // Update cache
    cache.avaxMetrics = metrics;
    cache.avaxMetricsLastUpdated = new Date();

    return metrics;
  } catch (error) {
    console.error("Error fetching AVAX network metrics:", error.message);

    // Return a basic metrics object with cached values where possible
    return {
      tps: cache.tps || fallbackData.tps,
      validators: cache.validatorCount || fallbackData.validatorCount,
      totalTransactions: 0,
      avgBlockTime: 2.0,
      price:
        cache.avaxPrice?.["avalanche-2"]?.usd ||
        fallbackData.avaxPrice["avalanche-2"].usd,
      priceChange24h:
        cache.avaxPrice?.["avalanche-2"]?.usd_24h_change ||
        fallbackData.avaxPrice["avalanche-2"].usd_24h_change,
    };
  }
}

// New API endpoint to get all Avalanche network metrics
app.get("/api/avalanche/metrics", async (req, res) => {
  try {
    const metrics = await fetchAvaxMetrics();
    if (metrics) {
      res.json(metrics);
    } else {
      res.status(404).json({ error: "No metrics data available" });
    }
  } catch (error) {
    console.error("Error handling AVAX metrics request:", error.message);
    res.status(500).json({ error: "Failed to fetch AVAX metrics" });
  }
});

// API endpoint to fetch transaction count from Metrics API
app.get("/api/avalanche/transactions", async (req, res) => {
  try {
    const transactionData = await fetchTransactionHistory();
    res.json(transactionData);
  } catch (error) {
    console.error("Error fetching transaction data:", error.message);
    res.status(500).json({ error: "Failed to fetch transaction data" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Helper function to fetch TPS history data
async function fetchTPSHistory() {
  try {
    if (USE_MOCK_DATA) {
      return customApiData.tps.history;
    }

    // Fetch from Avascan statistics API
    const response = await axios.get(
      `${AVAX_STATS_API_BASE_URL}/c-chain/tps/history`,
      { timeout: 8000 }
    );

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((item) => ({
        timestamp: new Date(item.timestamp).toISOString(),
        value: parseFloat(item.value),
      }));
    } else {
      throw new Error("Invalid TPS history data format");
    }
  } catch (error) {
    console.error("Error fetching TPS history:", error.message);
    return customApiData.tps.history; // Fallback to mock data
  }
}

// API endpoint to get TPS data
app.get("/api/avalanche/tps", async (req, res) => {
  try {
    if (req.query.history === "true") {
      const tpsHistory = await fetchTPSHistory();
      res.json(tpsHistory);
    } else {
      const tps = await fetchTPS();
      res.json({ value: tps });
    }
  } catch (error) {
    console.error("Error handling TPS request:", error.message);
    res.status(500).json({ error: "Failed to fetch TPS data" });
  }
});

// Helper function to fetch validator history data
async function fetchValidatorHistory() {
  try {
    if (USE_MOCK_DATA) {
      return customApiData.validators.history;
    }

    // Use our custom API data for now since validator history
    // isn't easily available through public APIs
    return customApiData.validators.history;
  } catch (error) {
    console.error("Error fetching validator history:", error.message);
    return customApiData.validators.history; // Fallback to mock data
  }
}

// API endpoint to get validator count
app.get("/api/avalanche/validators", async (req, res) => {
  try {
    if (req.query.history === "true") {
      const validatorHistory = await fetchValidatorHistory();
      res.json(validatorHistory);
    } else {
      const validatorCount = await fetchValidatorCount();
      res.json({ value: validatorCount });
    }
  } catch (error) {
    console.error("Error handling validator count request:", error.message);
    res.status(500).json({ error: "Failed to fetch validator count" });
  }
});

// Helper function to fetch token price history from CoinGecko with caching
async function fetchTokenPriceHistory(id) {
  try {
    // Check if we have valid cached data for this token
    if (
      cache.tokenPriceHistory[id] &&
      isCacheValid(cache.tokenPriceHistoryLastUpdated[id])
    ) {
      return cache.tokenPriceHistory[id];
    }

    // If USE_MOCK_DATA is true, return the mock data
    if (USE_MOCK_DATA) {
      return customApiData.tokens[id].history;
    }

    // Try to get AVAX specific data from our metrics API if the token is AVAX
    if (id === "avalanche-2") {
      try {
        // Get price data from combined metrics
        const metrics = await fetchAvaxMetrics();
        if (metrics) {
          // We'll use cache for now as we're not getting historical data directly
          const mockPriceHistory = Array(30)
            .fill()
            .map((_, i) => ({
              timestamp: new Date(
                Date.now() - (29 - i) * 24 * 60 * 60 * 1000
              ).toISOString(),
              price: metrics.price * (0.95 + 0.1 * Math.random()), // Simulate small price changes
            }));

          // Update cache
          cache.tokenPriceHistory[id] = mockPriceHistory;
          cache.tokenPriceHistoryLastUpdated[id] = new Date();

          return mockPriceHistory;
        }
      } catch (avaxError) {
        console.log(
          "No Avalanche-specific price data found, falling back to CoinGecko"
        );
        // Continue to CoinGecko if Avalanche API fails
      }
    }

    // Otherwise fetch from CoinGecko with rate limit handling
    try {
      const response = await callCoinGeckoAPI(
        `${COINGECKO_API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`
      );

      // Format the data to match our expected structure
      const formattedData = response.data.prices.map(([timestamp, price]) => ({
        timestamp: new Date(timestamp).toISOString(),
        price,
      }));

      // Update cache
      cache.tokenPriceHistory[id] = formattedData;
      cache.tokenPriceHistoryLastUpdated[id] = new Date();

      return formattedData;
    } catch (coinGeckoError) {
      if (coinGeckoError.message === "Rate limited by CoinGecko API") {
        console.log("Using cached or fallback data due to rate limits");

        // Return cache if it exists (even if expired)
        if (cache.tokenPriceHistory[id]) {
          return cache.tokenPriceHistory[id];
        }

        // Otherwise use fallback data
        return customApiData.tokens[id]?.history || [];
      }
      throw coinGeckoError;
    }
  } catch (error) {
    console.error(`Error fetching price history for ${id}:`, error.message);

    // Return cache if it exists (even if expired)
    if (cache.tokenPriceHistory[id]) {
      return cache.tokenPriceHistory[id];
    }

    // Otherwise use fallback data
    return customApiData.tokens[id]?.history || [];
  }
}

// API endpoint to get token price history
app.get("/api/token-price-history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const priceHistory = await fetchTokenPriceHistory(id);
    res.json(priceHistory);
  } catch (error) {
    console.error(
      `Error handling token price history for ${id}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch token price history" });
  }
});

// Helper function to generate realistic price history
function generatePriceHistory(currentPrice, minPrice, maxPrice, days) {
  // Generate a price trend with some randomness but following realistic patterns
  let price = currentPrice;
  const trend = Math.random() > 0.5 ? 0.001 : -0.001; // Small overall trend
  const volatility = (maxPrice - minPrice) / 15;

  return Array(days)
    .fill()
    .map((_, i) => {
      // Move backward in time
      const dayIndex = days - 1 - i;

      // Create a more realistic price series:
      // 1. Small random walk with trend
      // 2. Some mean reversion properties
      // 3. Occasional small jumps

      // Mean reversion factor (pull toward middle of range)
      const meanReversionFactor = 0.05;
      const meanLevel = (minPrice + maxPrice) / 2;
      const meanReversion = (meanLevel - price) * meanReversionFactor;

      // Random component (daily volatility)
      const randomComponent = (Math.random() - 0.5) * volatility;

      // Occasional small jumps (about 10% of the time)
      const jumpComponent =
        Math.random() > 0.9 ? (Math.random() - 0.5) * volatility * 3 : 0;

      // Update price with all components
      price += trend + meanReversion + randomComponent + jumpComponent;

      // Ensure price stays within min-max range
      price = Math.max(minPrice, Math.min(maxPrice, price));

      return {
        timestamp: new Date(
          Date.now() - dayIndex * 24 * 60 * 60 * 1000
        ).toISOString(),
        price,
      };
    });
}

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
