import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useChatMessages } from "../../hooks/useChatMessages";
import axios from "axios";

interface ChatBotProps {
  title?: string;
}

interface DashboardContext {
  tokenPrices?: Record<string, any>;
  networkStats?: {
    tps?: { value: number };
    gas?: { value: string };
    volume?: { value: string };
    activeUsers?: { value: number };
  };
  news?: Array<{ title: string }>;
}

const ChatBot = ({ title = "AvaLook Assistant" }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage } = useChatMessages();
  const [dashboardContext, setDashboardContext] = useState<DashboardContext>({});

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Fetch dashboard context data (token prices, network stats)
  const fetchDashboardContext = async () => {
    try {
      // Use the new combined endpoint to fetch all data at once
      const response = await axios.get("http://localhost:5001/api/avalanche/dashboard-data");
      const data = response.data;
      
      console.log("Raw dashboard data:", data);
      
      // Format the data for the chatbot context
      setDashboardContext({
        tokenPrices: data.tokenPrices,
        networkStats: {
          tps: data.tps || { value: 0 },
          gas: data.gas || { value: "0" },
          volume: data.volume || { value: "0" },
          activeUsers: data.activeUsers || { value: 0 }
        },
        news: data.news?.results
      });
      
      console.log("Dashboard data formatted for chatbot context:", {
        tokenPrices: !!data.tokenPrices,
        networkStats: {
          tps: !!data.tps,
          gas: !!data.gas,
          volume: !!data.volume,
          activeUsers: !!data.activeUsers
        },
        news: !!data.news?.results
      });
    } catch (error) {
      console.error("Error fetching dashboard context:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    // Add user message
    addMessage({ role: "user", content: message });
    setMessage("");

    // Set loading state
    setIsLoading(true);

    try {
      // Make API call to OpenAI
      const response = await fetch("http://localhost:5001/api/chat-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          messageHistory: messages,
          context: dashboardContext
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      console.log(data)

      // Add AI response
      addMessage({ role: "assistant", content: data.message });
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch dashboard context when chat is opened
  useEffect(() => {
    if (isOpen) {
      fetchDashboardContext();
    }
  }, [isOpen]);

  // Welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage({
        role: "assistant",
        content:
          "Hello! I'm your Avalanche blockchain assistant. How can I help you today?",
      });
    }
  }, [isOpen, messages.length, addMessage]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E84142] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 bg-[#1a1b26] rounded-lg shadow-xl border border-gray-800 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="px-4 py-3 bg-[#E84142] text-white flex justify-between items-center">
            <h3 className="font-medium">{title}</h3>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#1e1f2e]">
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.content}
                isUser={msg.role === "user"}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center my-2">
                <div className="loader">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-800 bg-[#1a1b26] flex"
          >
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 py-2 px-3 bg-[#2a2b36] text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#E84142]"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#E84142] text-white rounded-r-md hover:opacity-90 disabled:opacity-50"
              disabled={!message.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
