import React, { useState, useRef, useEffect } from "react";
import ChatHeader from "../ChatHeader";
import MessageBubble from "../MessageBubble";
import ChatInput from "../ChatInput";
import TypingIndicator from "../TypingIndicator";
import { useChat } from "../../hooks/useChat";
import "../../styles/chat.css";

import MaintenanceScreen from "./MaintenanceScreen";

const ChatbotUI = ({ settings, suggestions, isPreviewMode }) => {
  const welcomeMessage = settings?.welcomeMessage || "Hi! I'm the Avichi College Admission Assistant. Ask me about courses, fees, eligibility, or duration! 🎓";
  
  // Real Chat hook logic
  const liveHooks = useChat(welcomeMessage);

  // Preview Mode Chat logic (Mocking responses)
  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (isPreviewMode) {
      setPreviewMessages([{ sender: "bot", text: welcomeMessage }]);
    }
  }, [isPreviewMode, welcomeMessage]);

  const messages = isPreviewMode ? previewMessages : liveHooks.messages;
  const loading = isPreviewMode ? previewLoading : liveHooks.loading;

  const sendMessage = (text) => {
    if (isPreviewMode) {
      setPreviewMessages((prev) => [...prev, { sender: "user", text }]);
      setPreviewLoading(true);
      // Simulate fake network reply
      setTimeout(() => {
        setPreviewMessages((prev) => [...prev, { sender: "bot", text: "Preview mode mock response showing your brand styling!" }]);
        setPreviewLoading(false);
      }, 1000);
    } else {
      liveHooks.sendMessage(text);
    }
  };

  const stopChat = isPreviewMode 
    ? () => setPreviewLoading(false) 
    : liveHooks.stopChat;

  const resetChat = isPreviewMode 
    ? () => setPreviewMessages([{ sender: "bot", text: welcomeMessage }]) 
    : liveHooks.resetChat;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!settings) return null;

  // Map 2 Consolidated Brand Colors to all UI System Variables
  const themeVars = {
    // Primary Brand - Institutional Identity
    "--header-bg": settings.primaryColor,
    "--btn-bg": settings.primaryColor,
    "--ai-avatar-bg": settings.primaryColor,
    "--user-bubble-bg": settings.primaryColor,
    "--user-bubble-text": "#FFFFFF",
    "--bot-name-color": "#FFFFFF",
    
    // Secondary Brand - Interaction Accents
    "--ai-bubble-bg": "#FFFFFF", // Reverted to previous clean white
    "--ai-bubble-text": "#1E293B", 
    "--send-icon-color": settings.secondaryColor,
    "--ai-icon-color": settings.secondaryColor, 
    "--widget-border": settings.secondaryColor,
    "--new-chat-btn": settings.secondaryColor,
    "--subtitle-text": settings.secondaryColor,
    
    // Fixed System Colors (Locked Defaults)
    "--chat-bg": "#FFFFFF",
    "--online-indicator": "#4ADE80", // Locked Institutional Green
    
    // Assets
    "--bg-image": settings.backgroundImage ? `url(${settings.backgroundImage})` : "none",
  };

  const isMaintenanceMode = settings.isMaintenanceMode && !isPreviewMode;

  return (
    <div 
      className="chat-container" 
      style={{ 
        ...themeVars,
        height: "100%", 
        borderRadius: "inherit", 
        overflow: "hidden", 
        position: "relative" 
      }}
    >
      {isMaintenanceMode ? (
        <MaintenanceScreen primaryColor={settings.primaryColor} />
      ) : (
        <>
          {isPreviewMode && (
            <div style={{ position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)", zIndex: 110, background: "#f59e0b", color: "#fff", padding: "4px 12px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", boxShadow: "0 2px 10px rgba(245, 158, 11, 0.3)" }}>
              EXACT UI PREVIEW MODE
            </div>
          )}
          <ChatHeader
            onNewChat={resetChat}
            name={settings.name}
            subtitle={settings.subtitle}
            headerColor={settings.headerColor}
            avatar={settings.avatar}
          />
          
          <div className="messages-viewport" id="messages-list" style={{ backgroundColor: settings.backgroundColor || '#f8fafc' }}>
            <div className="messages-content">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <ChatInput
            onSend={sendMessage}
            onStop={stopChat}
            loading={loading}
            messages={messages}
            suggestionsList={suggestions}
            buttonColor={settings.buttonColor}
            isPreviewMode={isPreviewMode}
          />
        </>
      )}
    </div>
  );
};

export default ChatbotUI;
