import React from "react";

const MessageBubble = ({ message }) => {
  const isBot = message.sender === "bot";

  return (
    <div className={`message-row ${isBot ? "bot" : "user"}`}>
      {isBot && <div className="avatar">A</div>}
      <div className="message-bubble">
        {isBot ? (
          message.text.split("\n").map((line, index) => (
            <p key={index} style={{ margin: "2px 0", lineHeight: "1.6" }}>
              {line}
            </p>
          ))
        ) : (
          message.text
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
