import { useState, useCallback, useEffect } from "react";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function useChatMessages(storageKey = "avalook_chat_messages") {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages from localStorage on initial mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Failed to parse saved messages:", error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Add a new message to the chat
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    messages,
    addMessage,
    clearMessages,
  };
}
