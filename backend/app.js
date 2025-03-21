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

// Simple route to test server is working
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// API endpoint to get AVAX price from CoinGecko
app.get("/api/avax-price", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AVAX price" });
  }
});

// API endpoint to get multiple token prices
app.get("/api/token-prices", async (req, res) => {
  try {
    const tokens = req.query.tokens || "avalanche-2,joe,pangolin,benqi";

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching token prices:", error);
    res.status(500).json({ message: "Error fetching token prices" });
  }
});

// API endpoint for TPS with timestamp (for average TPS over the last 43114 blocks and chart data)
app.get("/api/tps", async (req, res) => {
  try {
    const response = await axios.get(
      "https://metrics.avax.network/v1/avg_tps/43114"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching TPS:", error);
    res.status(500).json({ message: "Error fetching TPS" });
  }
});

// API endpoint for gas used
app.get("/api/gas", async (req, res) => {
  try {
    const response = await axios.get(
      "https://metrics.avax.network/v1/gas_used/43114"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching gas used:", error);
    res.status(500).json({ message: "Error fetching gas used" });
  }
});

// API endpoint for transaction volume
app.get("/api/volume", async (req, res) => {
  try {
    const response = await axios.get(
      "https://metrics.avax.network/v1/tx_count/43114"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching  transaction volume:", error);
    res.status(500).json({ message: "Error fetching transaction volume" });
  }
});

// API endpoint for active addresses
app.get("/api/active", async (req, res) => {
  try {
    const response = await axios.get(
      "https://metrics.avax.network/v1/active_addresses/43114"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching  active addresses:", error);
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
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ message: "Error with OpenAI API" });
  }
});

// API endpoint for news
app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get(
      "https://cryptopanic.com/api/free/v1/posts/?auth_token=87b0dbc04754d3dbae6930568b86d810236a3ccf&filter=hot"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error);
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
