import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAdmin } from "../../context/AdminContext";
import { updateSystemSettings } from "../../services/settingsService";

const SystemSettings = () => {
  const { adminData, updateAdmin } = useAdmin();

  const [siteName, setSiteName] = useState("");
  const [theme, setTheme] = useState("light");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminData && adminData.systemSettings) {
      setSiteName(adminData.systemSettings.siteName || "Avichi College Admins");
      setTheme(adminData.systemSettings.theme || "light");
      setIsMaintenanceMode(adminData.systemSettings.isMaintenanceMode || false);
    }
  }, [adminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateSystemSettings({ siteName, theme, isMaintenanceMode });
      updateAdmin({ systemSettings: data.systemSettings });
      toast.success("System settings updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="settings-header">
        <h2>System Defaults</h2>
        <p>Manage site-wide variables and administrative modes.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-form-group">
          <label>Global Site Name</label>
          <input 
            type="text" 
            className="settings-input" 
            value={siteName} 
            onChange={e => setSiteName(e.target.value)} 
          />
        </div>

        <div className="settings-form-group">
          <label>Default Admin Theme</label>
          <select 
            className="settings-input" 
            value={theme} 
            onChange={e => setTheme(e.target.value)}
          >
            <option value="light">Light Theme (Default)</option>
            <option value="dark">Dark Theme (Preview)</option>
          </select>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "32px 0 24px" }} />

        <div className="settings-header" style={{ borderBottom: "none", paddingBottom: "0", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px" }}>Advanced Features</h2>
        </div>

        <div className="toggle-row">
          <div className="toggle-info">
            <h4>Maintenance Mode</h4>
            <p>Restrict public access. Visitors will see a "Site under maintenance" screen.</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isMaintenanceMode} 
              onChange={e => setIsMaintenanceMode(e.target.checked)} 
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        {isMaintenanceMode && (
          <div style={{ padding: "12px", background: "#fef2f2", color: "#b91c1c", borderRadius: "6px", fontSize: "13px", marginTop: "12px", fontWeight: "500", border: "1px solid #fca5a5" }}>
            ⚠️ Warning: Maintenance mode will block all non-admin traffic completely. Ensure to turn off after updates.
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <button type="submit" className="settings-save-btn" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : null}
            {loading ? "Saving..." : "Save System Config"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
