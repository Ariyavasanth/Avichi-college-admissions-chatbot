import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";

const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to map current path to professional page titles
  const getPageTitle = (path) => {
    if (path === "/") return "Dashboard";
    if (path === "/courses") return "Course Management";
    if (path === "/institution") return "Institution Details";
    return "Admin Panel";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const adminName = localStorage.getItem("adminName") || "Admin";

  return (
    <div className="header">
      {/* Left side: Mobile Toggle + Dynamic Page Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button className="mobile-menu-btn" onClick={onSidebarToggle}>
          <Menu size={20} />
        </button>
        <div className="header-title">
          {getPageTitle(location.pathname)}
        </div>
      </div>

      {/* Right side: Admin Badge and Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "#e8edf7",
            color: "#1f3b73",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            fontSize: "13px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            A
          </div>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#0f172a" }}>
            {adminName}
          </span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
