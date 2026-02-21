import { Home, BookOpen, GraduationCap, ClipboardList } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="logo">Academic Chatbot</h1>

      <nav>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <Home size={18} /> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/courses" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <BookOpen size={18} /> Course Management
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/scholarships" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <GraduationCap size={18} /> Scholarships
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/admission" 
              className={({ isActive }) => isActive ? "active" : ""}
            >
              <ClipboardList size={18} /> Admission Process
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;