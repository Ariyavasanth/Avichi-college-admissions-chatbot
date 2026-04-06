import React, { useState, useRef, useEffect } from "react";

const SUGGESTIONS = [
  "What courses are available?",
  "Tell me about fees",
  "Admission eligibility?",
  "Scholarship details"
];

const ChatInput = ({ onSend, onStop, loading, messages }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

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
    <div className="input-area-wrapper">
      {!loading && messages?.length < 2 && (
        <div className="suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion-chip" onClick={() => onSend(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="input-area">
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder={loading ? "Avith is thinking..." : "Message Avith..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          autoFocus
          autoComplete="off"
        />
        {loading ? (
          <button
            onClick={onStop}
            className="stop-btn"
            aria-label="Stop generating"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
          </button>
        )}
      </div>
      <p className="input-footer">AI can make mistakes. Check important info.</p>
    </div>
  );
};

export default ChatInput;
