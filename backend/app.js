const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5001;

// Enable CORS for frontend
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Simple route to test server is working
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// API endpoint to interact with OpenAI's chat API
app.post("/api/chat-completion", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Update the model as needed
        messages: [{
          role: "user",
          content: "Write a one-sentence bedtime story about a unicorn.",
        }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Log the full response for debugging purposes
    console.log(response.data);

    res.json({
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Error with OpenAI API",
      error: error.response ? error.response.data : error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
