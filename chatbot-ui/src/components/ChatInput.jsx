import React, { useState } from "react";

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder={loading ? "Avichi is thinking..." : "Ask me anything about Avichi College..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        autoFocus
        autoComplete="off"
      />
      <button 
        onClick={handleSend} 
        disabled={loading || !input.trim()}
        className="send-btn"
      >
        {loading ? "..." : "➤"}
      </button>
    </div>
  );
};

export default ChatInput;
