const ChatHeader = ({ onNewChat, name, subtitle, avatar }) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        <h2>
          {avatar ? (
            <img src={avatar} alt="Avatar" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ai-icon-color)" }}>
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
            </svg>
          )}
          {name}
        </h2>
        <p>{subtitle}</p>
      </div>
      <div className="header-right">
        <button className="new-chat-btn" onClick={onNewChat} title="New Chat">
          <span className="btn-icon">+</span>
          <span className="btn-text">New Chat</span>
        </button>
        <div className="status">
          <span className="dot"></span> <span className="status-text">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
