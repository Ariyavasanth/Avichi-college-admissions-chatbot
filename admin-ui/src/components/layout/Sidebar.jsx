import { Home, BookOpen, Building2, GraduationCap } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css";

const Sidebar = ({ isOpen, onClose }) => {
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
          <span>Avichi Admin</span>
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