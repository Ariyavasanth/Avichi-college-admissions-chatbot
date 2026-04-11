import { useState } from "react";
import { User, Shield, Monitor as SystemIcon } from "lucide-react";
import "../../styles/settings.css";

import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import SystemSettings from "./SystemSettings";

const SettingsLayout = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "system":
        return <SystemSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div>
      <h1 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "24px", marginTop: 0 }}>
        Admin Settings
      </h1>
      <div className="settings-container">
        {/* Settings Left Sidebar */}
        <div className="settings-sidebar">
          <button 
            className={`settings-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} /> Profile
          </button>
          <button 
            className={`settings-nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield size={18} /> Security
          </button>
          <button 
            className={`settings-nav-item ${activeTab === "system" ? "active" : ""}`}
            onClick={() => setActiveTab("system")}
          >
            <SystemIcon size={18} /> System
          </button>
        </div>

        {/* Dynamic Content Details */}
        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
