import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/chatbot.service";

const WELCOME = {
  sender: "bot",
  text: "Hi! I'm the Avichi College Admission Assistant. Ask me about courses, fees, eligibility, or duration! 🎓",
};

export const useChat = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    // a. Append user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);

    // b. Show loading
    setLoading(true);

    try {
      // c. Prepare history (last 6 messages)
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "bot" ? "bot" : "user",
        text: m.text,
      }));

      // d. Call API with history
      const data = await sendChatMessage(trimmed, history);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Sorry, I couldn't understand that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      // e. Stop loading
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setLoading(false);
  };

  return { messages, sendMessage, loading, resetChat };
};
