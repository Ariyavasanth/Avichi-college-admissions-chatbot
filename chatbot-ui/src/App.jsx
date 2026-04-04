import React, { useRef, useEffect } from "react";
import ChatHeader from "./components/ChatHeader";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";
import TypingIndicator from "./components/TypingIndicator";
import { useChat } from "./hooks/useChat";
import "./styles/chat.css";

function App() {
  const { messages, sendMessage, loading, resetChat } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-container">
      <ChatHeader onNewChat={resetChat} />
      <div className="messages-viewport" id="messages-list">
        <div className="messages-content">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput onSend={sendMessage} loading={loading} messages={messages} />
    </div>
  );
}

export default App;
