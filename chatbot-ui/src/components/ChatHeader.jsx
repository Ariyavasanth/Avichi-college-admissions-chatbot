const ChatHeader = ({ onNewChat }) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <h2>
          Chat with Avith <span className="beta">Beta</span>
        </h2>
        <p>Avichi College AI Assistant</p>
      </div>
      <div className="header-right">
        <button className="new-chat-btn" onClick={onNewChat} title="New Chat">
          + New Chat
        </button>
        <div className="status">
          <span className="dot"></span> Online
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
