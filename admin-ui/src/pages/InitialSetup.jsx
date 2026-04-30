import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, Mail } from "lucide-react";
import { initialSetup, logout } from "../services/authService";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast";
import "../styles/login.css";

const InitialSetup = () => {
  const navigate = useNavigate();
  const { updateAdmin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await initialSetup(email, password);
      
      toast.success(res.message || "Setup initiated successfully!");
      setSuccess(true);
      
      // Log the user out so they have to login with the new credentials after verifying
      setTimeout(() => {
        logout();
        updateAdmin(null);
        navigate("/admin/login", { replace: true });
      }, 5000);

    } catch (err) {
      setError(err.message || "Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: "center", padding: "40px 30px" }}>
          <div className="security-icon-wrapper" style={{ margin: "0 auto 20px" }}>
            <Mail size={48} color="#10b981" strokeWidth={1.5} />
          </div>
          <h2 className="login-title">Check Your Email</h2>
          <p className="login-subtitle" style={{ fontSize: "16px", color: "#334155", lineHeight: "1.6" }}>
            We've sent a verification link to <strong>{email}</strong>. <br /><br />
            Please click the link in the email to verify your address and complete the setup process. You will be redirected to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo/Icon */}
        <div className="login-logo">
          <div className="security-icon-wrapper">
            <ShieldCheck size={48} color="#2563eb" strokeWidth={1.5} />
          </div>
          <span className="login-college-name">Initial Setup</span>
        </div>

        <h2 className="login-title">Secure Your Account</h2>
        <p className="login-subtitle">
          Welcome! For your security, you must update your admin email and set a new password before accessing the dashboard.
        </p>

        {/* Error Banner */}
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* New Email */}
          <div className="login-form-group">
            <label htmlFor="new-email">New Admin Email</label>
            <div className="password-wrapper">
              <input
                id="new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcollege.edu"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="login-form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-wrapper">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="login-form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Sending Verification...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>

        <p className="login-footer">Requirement: Minimum 6 characters</p>
      </div>
    </div>
  );
};

export default InitialSetup;
