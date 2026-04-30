import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

/**
 * Wraps any route element and redirects to /admin/login if no token is found.
 * Also forces password change if isFirstLogin is true.
 */
const ProtectedRoute = ({ children, checkFirstLogin = true }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  if (checkFirstLogin && admin.isFirstLogin) {
    return <Navigate to="/admin/setup" replace />;
  }

  return children;
};

export default ProtectedRoute;
