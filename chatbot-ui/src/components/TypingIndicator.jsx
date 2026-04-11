import React from "react";

const TypingIndicator = () => {
  return (
    <div className="message-row bot">
      <div className="avatar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ai-icon-color, currentColor)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <div className="message-bubble typing-bubble">
        <span className="dot-bounce" style={{ animationDelay: "0s" }}></span>
        <span className="dot-bounce" style={{ animationDelay: "0.2s" }}></span>
        <span className="dot-bounce" style={{ animationDelay: "0.4s" }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
