import { useState, useEffect } from "react";
import { Palette, ListPlus, Send } from "lucide-react";
import { getSettings, getSuggestions } from "../../services/chatbotConfigService";
import "../../styles/chatbotControl.css";

import UISettings from "./UISettings";
import SuggestionsManager from "./SuggestionsManager";
import ChatbotUI from "../../../../chatbot-ui/src/components/chatbot/ChatbotUI";

const ChatbotControl = () => {
  const [activeTab, setActiveTab] = useState("ui");
  const [settings, setSettings] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsData, suggestionsData] = await Promise.all([
          getSettings(),
          getSuggestions()
        ]);
        setSettings(settingsData);
        setSuggestions(suggestionsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      <h1 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "24px", marginTop: 0 }}>
        Chatbot Control Panel
      </h1>

      <div className="chatbot-control-container">
        {/* Left Side: Dynamic Forms */}
        <div className="chatbot-forms-wrapper">
          <div className="chatbot-tabs">
            <button 
              className={`chatbot-tab ${activeTab === "ui" ? "active" : ""}`}
              onClick={() => setActiveTab("ui")}
            >
              <Palette size={16} /> UI Settings
            </button>
            <button 
              className={`chatbot-tab ${activeTab === "suggestions" ? "active" : ""}`}
              onClick={() => setActiveTab("suggestions")}
            >
              <ListPlus size={16} /> Suggestions
            </button>
          </div>
          
          <div className="chatbot-form-content">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Loading configuration...</div>
            ) : (
              activeTab === "ui" 
                ? <UISettings settings={settings} setSettings={setSettings} />
                : <SuggestionsManager suggestions={suggestions} setSuggestions={setSuggestions} />
            )}
          </div>
        </div>

        {/* Right Side: Desktop Visual Preview */}
        <div className="chatbot-preview-wrapper desktop">
          <div className="preview-title">
            <span className="live-dot"></span>
            Desktop UI Preview
          </div>

          <div className="desktop-preview-frame">
            <div className="desktop-browser-header">
              <div className="browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="browser-address">localhost:5173/chatbot</div>
            </div>
            <div className="desktop-preview-content">
              <ChatbotUI 
                settings={settings} 
                suggestions={suggestions.map(s => s.text)} 
                isPreviewMode={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotControl;
