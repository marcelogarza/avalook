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

    const tokens = req.query.tokens || "bitcoin,avalanche-2,joe,pangolin,benqi";

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,avalanche-2,joe,pangolin,benqi,aave,frax,sushi,yield-yak,lydia-finance,spookyswap&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`,
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

    // Format the response to ensure consistent structure
    const formattedData = { value: response.data.value || 0 };

    // Update cache
    cache.tps.data = formattedData;
    cache.tps.timestamp = Date.now();

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching TPS:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.tps.data) {
      console.log("Returning stale cache data for TPS");
      return res.json(cache.tps.data);
    }

    // Return a default value if all else fails
    res.json({ value: 0 });
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

    // Format the response to ensure consistent structure
    const formattedData = { value: response.data.value || "0" };

    // Update cache
    cache.gas.data = formattedData;
    cache.gas.timestamp = Date.now();

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching gas used:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.gas.data) {
      console.log("Returning stale cache data for gas");
      return res.json(cache.gas.data);
    }

    // Return a default value if all else fails
    res.json({ value: "0" });
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

    // Format the response to ensure consistent structure
    const formattedData = { value: response.data.value || "0" };

    // Update cache
    cache.volume.data = formattedData;
    cache.volume.timestamp = Date.now();

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching transaction volume:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.volume.data) {
      console.log("Returning stale cache data for volume");
      return res.json(cache.volume.data);
    }

    // Return a default value if all else fails
    res.json({ value: "0" });
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

    // Format the response to ensure consistent structure
    const formattedData = { value: response.data.value || 0 };

    // Update cache
    cache.active.data = formattedData;
    cache.active.timestamp = Date.now();

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching active addresses:", error.message);

    // If we have any cached data, return it even if expired
    if (cache.active.data) {
      console.log("Returning stale cache data for active addresses");
      return res.json(cache.active.data);
    }

    // Return a default value if all else fails
    res.json({ value: 0 });
  }
});

// Chat completion API using OpenAI a
app.post("/api/chat-completion", async (req, res) => {
  try {
    const { message, context, messageHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Format token prices for better readability
    let tokenPricesFormatted = '';
    if (context?.tokenPrices) {
      tokenPricesFormatted = `TOKEN PRICES:
      ${Object.entries(context.tokenPrices)
        .map(([token, data]) => {
          const price = data?.usd ? `$${data.usd.toLocaleString()}` : 'N/A';
          const change = data?.usd_24h_change 
            ? `${data.usd_24h_change.toFixed(2)}%` 
            : 'N/A';
          const marketCap = data?.usd_market_cap
            ? `$${(data.usd_market_cap / 1e9).toFixed(2)}B`
            : 'N/A';
          const volume = data?.usd_24h_vol
            ? `$${(data.usd_24h_vol / 1e6).toFixed(2)}M`
            : 'N/A';
            
          return `- ${token}: Price: ${price} (24h change: ${change}), Market Cap: ${marketCap}, 24h Volume: ${volume}`;
        })
        .join('\n')}`;
    }

    // Format network stats for better readability
    let networkStatsFormatted = '';
    if (context?.networkStats) {
      networkStatsFormatted = `NETWORK PERFORMANCE:
      - TPS (Transactions Per Second): ${context.networkStats.tps?.value !== undefined ? context.networkStats.tps.value : 'N/A'}
      - Gas Price: ${context.networkStats.gas?.value || 'N/A'}
      - Trading Volume: ${context.networkStats.volume?.value || 'N/A'}
      - Active Users: ${context.networkStats.activeUsers?.value !== undefined ? context.networkStats.activeUsers.value : 'N/A'}`;
      
      console.log("Network stats formatted:", {
        tps: context.networkStats.tps?.value,
        gas: context.networkStats.gas?.value,
        volume: context.networkStats.volume?.value,
        activeUsers: context.networkStats.activeUsers?.value
      });
    }

    // Format news for better readability
    let newsFormatted = '';
    if (context?.news && Array.isArray(context.news)) {
      newsFormatted = `RECENT NEWS:
      ${(context.news.slice(0, 3) || []).map(article => `- ${article.title || 'N/A'}`).join('\n')}`;
    }

    // Create a system message with website context data
    const systemMessage = {
      role: "system",
      content: `You are a helpful assistant for AvaLook, an Avalanche blockchain explorer dashboard. 
      You specialize in providing information about Avalanche blockchain, its ecosystem, subnets, and related technologies.
      
      WEBSITE CONTEXT:
      The following is current data from the AvaLook dashboard that you can reference in your responses:
      
      ${tokenPricesFormatted || ''}
      
      ${networkStatsFormatted || ''}
      
      ${newsFormatted || ''}
      
      AVALANCHE KNOWLEDGE:
      - Avalanche is a layer 1 blockchain platform for decentralized applications and custom blockchain networks
      - It uses a Proof-of-Stake consensus mechanism with high throughput and low fees
      - The native token is AVAX, used for transaction fees, staking, and governance
      - Avalanche has three built-in blockchains: X-Chain (asset exchange), C-Chain (smart contracts), and P-Chain (platform/validators)
      - Subnets are custom, application-specific blockchains built on Avalanche
      - Avalanche allows creation of custom virtual machines for specialized blockchain applications
      - X-Chain uses the Avalanche consensus protocol
      - C-Chain is EVM compatible and uses Snowman consensus (optimized for smart contracts)
      - P-Chain coordinates validators and allows creation of subnets
      - Avalanche achieves finality in under 2 seconds
      - Bitcoin (BTC) is the first and largest cryptocurrency by market cap, created by Satoshi Nakamoto
      - Avalanche's C-Chain is compatible with Ethereum tools and dApps
      
      INSTRUCTIONS:
      - When answering questions about token prices, market data, or network stats, use the above data from the WEBSITE CONTEXT section.
      - When answering general questions about Avalanche or Bitcoin, use the information from the AVALANCHE KNOWLEDGE section.
      - For questions about specific concepts (like subnets, validators, consensus, etc.), provide explanations based on Avalanche's documentation.
      - Keep responses concise and relevant to Avalanche blockchain and the data available.
      - Format currency values appropriately with $ symbol for USD.
      - Remember previous messages in the conversation to maintain context.
      - If asked about data that's not available in the provided context, explain that the data isn't currently available in the dashboard.
      `
    };

    // Build messages array with system prompt and message history
    const messages = [systemMessage];
    
    // Add message history if provided
    if (messageHistory && Array.isArray(messageHistory)) {
      // Add all previous messages
      messages.push(...messageHistory);
      
      // Add the current message if it's not already included in the history
      const isCurrentMessageInHistory = messageHistory.some(
        msg => msg.role === "user" && msg.content === message
      );
      
      if (!isCurrentMessageInHistory) {
        messages.push({ role: "user", content: message });
      }
    } else {
      // If no history, just add the current message
      messages.push({ role: "user", content: message });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
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

// Combined API endpoint for all data needed by chatbot
app.get("/api/avalanche/dashboard-data", async (req, res) => {
  try {
    // Create an object to hold all data
    const dashboardData = {};
    
    // Get token prices
    try {
      if (isCacheValid("tokenPrices")) {
        dashboardData.tokenPrices = cache.tokenPrices.data;
      } else {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,avalanche-2,joe,pangolin,benqi,aave,frax,sushi,yield-yak,lydia-finance,spookyswap&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent": "AvaLook Dashboard Application",
            },
          }
        );
        dashboardData.tokenPrices = response.data;
        cache.tokenPrices.data = response.data;
        cache.tokenPrices.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching token prices:", error.message);
      // If we have cached data, use it
      if (cache.tokenPrices.data) {
        dashboardData.tokenPrices = cache.tokenPrices.data;
      }
    }
    
    // Get TPS data
    try {
      if (isCacheValid("tps")) {
        dashboardData.tps = cache.tps.data;
      } else {
        const response = await axios.get("https://metrics.avax.network/v1/avg_tps/43114");
        dashboardData.tps = { value: response.data.value || 0 };
        cache.tps.data = { value: response.data.value || 0 };
        cache.tps.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching TPS:", error.message);
      if (cache.tps.data) {
        dashboardData.tps = cache.tps.data;
      } else {
        dashboardData.tps = { value: 0 };
      }
    }
    
    // Get gas data
    try {
      if (isCacheValid("gas")) {
        dashboardData.gas = cache.gas.data;
      } else {
        const response = await axios.get("https://metrics.avax.network/v1/gas_used/43114");
        dashboardData.gas = { value: response.data.value || "0" };
        cache.gas.data = { value: response.data.value || "0" };
        cache.gas.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching gas used:", error.message);
      if (cache.gas.data) {
        dashboardData.gas = cache.gas.data;
      } else {
        dashboardData.gas = { value: "0" };
      }
    }
    
    // Get volume data
    try {
      if (isCacheValid("volume")) {
        dashboardData.volume = cache.volume.data;
      } else {
        const response = await axios.get("https://metrics.avax.network/v1/tx_count/43114");
        dashboardData.volume = { value: response.data.value || "0" };
        cache.volume.data = { value: response.data.value || "0" };
        cache.volume.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching volume:", error.message);
      if (cache.volume.data) {
        dashboardData.volume = cache.volume.data;
      } else {
        dashboardData.volume = { value: "0" };
      }
    }
    
    // Get active addresses
    try {
      if (isCacheValid("active")) {
        dashboardData.activeUsers = cache.active.data;
      } else {
        const response = await axios.get("https://metrics.avax.network/v1/active_addresses/43114");
        dashboardData.activeUsers = { value: response.data.value || 0 };
        cache.active.data = { value: response.data.value || 0 };
        cache.active.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching active addresses:", error.message);
      if (cache.active.data) {
        dashboardData.activeUsers = cache.active.data;
      } else {
        dashboardData.activeUsers = { value: 0 };
      }
    }
    
    // Get news
    try {
      if (isCacheValid("news")) {
        dashboardData.news = cache.news.data;
      } else {
        const response = await axios.get("https://cryptopanic.com/api/free/v1/posts/?auth_token=87b0dbc04754d3dbae6930568b86d810236a3ccf&filter=hot");
        dashboardData.news = response.data;
        cache.news.data = response.data;
        cache.news.timestamp = Date.now();
      }
    } catch (error) {
      console.error("Error fetching news:", error.message);
      if (cache.news.data) {
        dashboardData.news = cache.news.data;
      }
    }
    
    console.log("Returning dashboard data with:", {
      hasTokenPrices: !!dashboardData.tokenPrices,
      hasTps: !!dashboardData.tps,
      hasGas: !!dashboardData.gas,
      hasVolume: !!dashboardData.volume,
      hasActiveUsers: !!dashboardData.activeUsers,
      hasNews: !!dashboardData.news
    });
    
    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// API endpoint for troubleshooting - shows status of all API data
app.get("/api/status", async (req, res) => {
  try {
    // Get fresh data for testing
    const status = {
      cache: {
        tokenPrices: {
          exists: !!cache.tokenPrices.data,
          lastUpdated: cache.tokenPrices.timestamp ? new Date(cache.tokenPrices.timestamp).toISOString() : null,
          isValid: isCacheValid("tokenPrices")
        },
        tps: {
          exists: !!cache.tps.data,
          lastUpdated: cache.tps.timestamp ? new Date(cache.tps.timestamp).toISOString() : null,
          isValid: isCacheValid("tps"),
          value: cache.tps.data?.value
        },
        gas: {
          exists: !!cache.gas.data,
          lastUpdated: cache.gas.timestamp ? new Date(cache.gas.timestamp).toISOString() : null,
          isValid: isCacheValid("gas"),
          value: cache.gas.data?.value
        },
        volume: {
          exists: !!cache.volume.data,
          lastUpdated: cache.volume.timestamp ? new Date(cache.volume.timestamp).toISOString() : null,
          isValid: isCacheValid("volume"),
          value: cache.volume.data?.value
        },
        active: {
          exists: !!cache.active.data,
          lastUpdated: cache.active.timestamp ? new Date(cache.active.timestamp).toISOString() : null,
          isValid: isCacheValid("active"),
          value: cache.active.data?.value
        },
        news: {
          exists: !!cache.news.data,
          lastUpdated: cache.news.timestamp ? new Date(cache.news.timestamp).toISOString() : null,
          isValid: isCacheValid("news")
        }
      }
    };
    
    // Attempt live API calls to verify connectivity
    const apiTests = {};
    
    try {
      const tpsResponse = await axios.get("https://metrics.avax.network/v1/avg_tps/43114", { timeout: 3000 });
      apiTests.tps = { success: true, value: tpsResponse.data.value };
    } catch (error) {
      apiTests.tps = { success: false, error: error.message };
    }
    
    try {
      const gasResponse = await axios.get("https://metrics.avax.network/v1/gas_used/43114", { timeout: 3000 });
      apiTests.gas = { success: true, value: gasResponse.data.value };
    } catch (error) {
      apiTests.gas = { success: false, error: error.message };
    }
    
    try {
      const volumeResponse = await axios.get("https://metrics.avax.network/v1/tx_count/43114", { timeout: 3000 });
      apiTests.volume = { success: true, value: volumeResponse.data.value };
    } catch (error) {
      apiTests.volume = { success: false, error: error.message };
    }
    
    try {
      const activeResponse = await axios.get("https://metrics.avax.network/v1/active_addresses/43114", { timeout: 3000 });
      apiTests.active = { success: true, value: activeResponse.data.value };
    } catch (error) {
      apiTests.active = { success: false, error: error.message };
    }
    
    status.apiTests = apiTests;
    res.json(status);
  } catch (error) {
    console.error("Error in status endpoint:", error.message);
    res.status(500).json({ error: "Failed to get status" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
