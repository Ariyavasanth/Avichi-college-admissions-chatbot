import { useState } from "react";
import { Home, BookOpen, Building2, GraduationCap, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Hamburger Toggle - Visible only on mobile via CSS */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay - Closes sidebar on click */}
      <div 
        className={`sidebar-overlay ${isOpen ? "open" : ""}`} 
        onClick={closeSidebar}
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
                onClick={closeSidebar}
              >
                <Home size={17} /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeSidebar}
              >
                <BookOpen size={17} /> Course Management
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/institution"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeSidebar}
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