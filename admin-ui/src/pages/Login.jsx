import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin } from "../services/authService";
import { useAdmin } from "../context/AdminContext";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { updateAdmin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginAdmin(email.trim(), password);
      // Persist token + admin info
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      
      // Update global context
      updateAdmin(data.admin);
      
      if (data.admin.isFirstLogin) {
        navigate("/admin/change-password", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <GraduationCap size={48} color="#1f3b73" strokeWidth={1.8} />
          <span className="login-college-name">Avichi College</span>
        </div>

        <h2 className="login-title">Admin Portal</h2>
        <p className="login-subtitle">Sign in to manage your college dashboard</p>

        {/* Error Banner */}
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email */}
          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@avichicollege.edu"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword
                  ? <EyeOff size={18} color="#6b7280" />
                  : <Eye size={18} color="#6b7280" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="login-footer">
          © 2025 Avichi College — Admin Panel
        </p>
      </div>
    </div>
  );
};

export default Login;
