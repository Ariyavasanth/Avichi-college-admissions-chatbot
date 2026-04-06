import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../services/chatbot.service";

const WELCOME = {
  sender: "bot",
  text: "Hi! I'm the Avichi College Admission Assistant. Ask me about courses, fees, eligibility, or duration! 🎓",
};

export const useChat = () => {
  const [messages, setMessages] = useState([WELCOME]);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const sendMessage = async (text) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    // a. Append user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);

    // b. Show loading
    setLoading(true);

    // c. Create AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // d. Prepare history (last 6 messages)
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "bot" ? "bot" : "user",
        text: m.text,
      }));

      // e. Call API with history and AbortSignal
      const data = await sendChatMessage(trimmed, history, controller.signal);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Sorry, I couldn't understand that." },
      ]);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Chat generation stopped by user.");
        return; // Don't append error message if manually stopped
      }
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      // f. Stop loading
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setLoading(false);
  };

  return { messages, sendMessage, loading, resetChat, stopChat };
};
