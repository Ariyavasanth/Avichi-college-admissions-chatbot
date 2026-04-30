import { useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { updateSecurity } from "../../services/settingsService";
import { requestEmailChange } from "../../services/authService";

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Basic client side password strength validation
  const getPasswordStrength = () => {
    if (!newPassword) return null;
    let strengthCount = 0;
    if (newPassword.length >= 8) strengthCount++;
    if (/[A-Z]/.test(newPassword)) strengthCount++;
    if (/[0-9]/.test(newPassword)) strengthCount++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strengthCount++;

    if (strengthCount < 2) return { text: "Weak", color: "#ef4444" };
    if (strengthCount < 4) return { text: "Medium", color: "#f59e0b" };
    return { text: "Strong", color: "#10b981" };
  };

  const strength = getPasswordStrength();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setPassLoading(true);
    try {
      await updateSecurity({ currentPassword, newPassword });
      toast.success("Password successfully updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPassLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      const data = await requestEmailChange(newEmail);
      toast.success(data.message);
      setNewEmail("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div>
      <div className="settings-header">
        <h2>Security Settings</h2>
        <p>Ensure your account is using a long, random password and a verified email to stay secure.</p>
      </div>

      {/* Password Change Section */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "16px", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={18} color="#1f3b73" /> Update Password
        </h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="settings-form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              className="settings-input" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="settings-form-group">
            <label>New Password</label>
            <input 
              type="password" 
              className="settings-input" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              required 
            />
            {strength && (
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: strength.color, fontWeight: "500" }}>
                Password Strength: {strength.text}
              </p>
            )}
          </div>

          <div className="settings-form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              className="settings-input" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="settings-save-btn" disabled={passLoading}>
            {passLoading ? <Loader2 size={16} className="spin" /> : null}
            {passLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "40px 0" }} />

      {/* Email Change Section */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "16px", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Mail size={18} color="#1f3b73" /> Change Admin Email
        </h3>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
          To change your email address, enter the new address below. We will send a verification link to the new address to confirm the change.
        </p>
        <form onSubmit={handleEmailSubmit}>
          <div className="settings-form-group">
            <label>New Email Address</label>
            <input 
              type="email" 
              className="settings-input" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)} 
              placeholder="new-admin@college.com"
              required 
            />
          </div>

          <button type="submit" className="settings-save-btn" disabled={emailLoading} style={{ background: "#10b981" }}>
            {emailLoading ? <Loader2 size={16} className="spin" /> : null}
            {emailLoading ? "Sending Link..." : "Request Email Change"}
          </button>
        </form>
      </div>

      {/* Advanced Section */}
      <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "32px 0" }} />
      <div className="settings-header" style={{ borderBottom: "none", paddingBottom: "0", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "18px" }}>Active Sessions</h2>
        <p>Manage your active authenticated sessions across devices.</p>
      </div>
      <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "#0f172a" }}>Windows 11 • Chrome M123</h4>
          <p style={{ margin: "0", fontSize: "12px", color: "#64748b" }}>Current Session • Last active just now</p>
        </div>
        <span style={{ fontSize: "12px", background: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: "20px", fontWeight: "600" }}>Active</span>
      </div>
    </div>
  );
};

export default SecuritySettings;
