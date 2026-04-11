import { Home, BookOpen, Building2, GraduationCap, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import "../../styles/dashboard.css";

const Sidebar = ({ isOpen, onClose }) => {
  const { adminData } = useAdmin();
  const siteName = adminData?.systemSettings?.siteName || "Avichi Admin";

  return (
    <>
      {/* Sidebar Overlay - Closes sidebar on click */}
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
      />

      {/* Sidebar Navigation */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Top Branding Section */}
        <div className="logo">
          <GraduationCap size={20} color="white" />
          <span>{siteName}</span>
        </div>

        {/* Main Navigation */}
        <nav>
          <ul>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <Home size={17} /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <BookOpen size={17} /> Course Management
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/institution"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <Building2 size={17} /> Institution Details
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/chatbot-control"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Chatbot Control
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  padding: "12px 16px", 
                  color: isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.7)", 
                  textDecoration: "none", 
                  transition: "all 0.2s" 
                })}
              >
                <Settings size={17} /> Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Footer Section */}
        <div style={{
          marginTop: "auto",
          padding: "16px 12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.5)",
          textAlign: "center"
        }}>
          Avichi College © 2025
        </div>
      </div>
    </>
  );
};

export default Sidebar;