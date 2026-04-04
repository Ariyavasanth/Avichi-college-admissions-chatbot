import React from "react";

const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message-row ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <div className="avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>
      )}
      <div className="message-bubble-wrapper">
        <div className="message-bubble">
          {isBot ? (
            message.text.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))
          ) : (
            message.text
          )}
        </div>
        <span className="timestamp">{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
