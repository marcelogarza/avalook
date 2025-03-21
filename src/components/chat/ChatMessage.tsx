import React from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start gap-2 mb-3 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-gray-600 text-white" : "bg-[#E84142] text-white"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg ${
          isUser
            ? "bg-gray-700 text-white rounded-tr-none"
            : "bg-[#E84142]/10 text-gray-200 rounded-tl-none border border-[#E84142]/20"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
