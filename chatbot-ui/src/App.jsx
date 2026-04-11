import React, { useState, useEffect } from "react";
import ChatbotUI from "./components/chatbot/ChatbotUI";
import "./styles/chat.css";

function App() {
  const [settings, setSettings] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchUI = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const [setRes, sugRes] = await Promise.all([
          fetch(`${apiUrl}/api/chatbot/settings`),
          fetch(`${apiUrl}/api/chatbot/suggestions`)
        ]);
        setSettings(await setRes.json());
        setSuggestions(await sugRes.json());
      } catch (err) {
        console.error("Failed to fetch UI settings", err);
      }
    };
    fetchUI();
  }, []);

  if (!settings) return null;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <ChatbotUI 
        settings={settings} 
        suggestions={suggestions.map(s => s.text)} 
        isPreviewMode={false} 
      />
    </div>
  );
}

export default App;
