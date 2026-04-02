import React from "react";

const TypingIndicator = () => {
  return (
    <div className="message-row bot" style={{ marginTop: "10px" }}>
      <div className="avatar">A</div>
      <div className="message-bubble typing-bubble">
        <span className="dot-bounce" style={{ animationDelay: "0s" }}></span>
        <span className="dot-bounce" style={{ animationDelay: "0.2s" }}></span>
        <span className="dot-bounce" style={{ animationDelay: "0.4s" }}></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
