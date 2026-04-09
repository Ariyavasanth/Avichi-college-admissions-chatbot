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

  const sendMessage = async (text, options = {}) => {
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

      const replyText = data.reply || "Sorry, I couldn't understand that.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: replyText },
      ]);

      // Voice Output
      if (options.isVoice && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(replyText);
        utterance.lang = "en-IN"; // Match the recognition language
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
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
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    setLoading(false);
  };

  return { messages, sendMessage, loading, resetChat, stopChat };
};
