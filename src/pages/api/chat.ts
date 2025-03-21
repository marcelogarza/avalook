import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Prepare system message with context about Avalanche
    const systemMessage = {
      role: "system",
      content: `You are a helpful assistant for AvaLook, an Avalanche blockchain explorer. 
      Provide concise, accurate information about Avalanche, its ecosystem, subnets, 
      and blockchain technology. Keep responses brief and relevant to Avalanche. 
      If asked about something unrelated to Avalanche or blockchain, politely steer 
      the conversation back to Avalanche topics.`,
    };

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 400,
    });

    // Extract the response message
    const assistantMessage = response.choices[0]?.message?.content?.trim();

    if (!assistantMessage) {
      throw new Error("No response from API");
    }

    // Return the response
    return res.status(200).json({ message: assistantMessage });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return res.status(500).json({
      error: "Failed to get response from OpenAI",
      message:
        "I encountered an error processing your request. Please try again later.",
    });
  }
}
