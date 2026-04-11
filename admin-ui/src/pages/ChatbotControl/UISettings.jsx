import { useState } from "react";
import { Loader2, Upload, RotateCcw, Save, Palette, Type, Smartphone, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updateSettings } from "../../services/chatbotConfigService";

const ThemeColorCard = ({ label, description, name, value, onChange }) => (
  <div className="theme-card">
    <div className="color-preview-circle" style={{ backgroundColor: value }}>
      <input 
        type="color" 
        name={name} 
        value={value || "#000000"} 
        onChange={onChange} 
        className="hidden-color-input"
      />
    </div>
    <label>{label}</label>
    <p>{description}</p>
    <div className="hex-display">{value?.toUpperCase()}</div>
  </div>
);

const UISettings = ({ settings, setSettings }) => {
  const [loading, setLoading] = useState(false);

  const defaults = {
    name: "Avichi AI Admissions",
    subtitle: "Ask me anything about Avichi College!",
    welcomeMessage: "Hello! I'm the Avichi College virtual assistant. How can I help you today?",
    avatar: "",
    backgroundImage: "",
    primaryColor: "#0B1F3A",
    secondaryColor: "#D4AF37"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBGChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, backgroundImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSettings(settings);
      toast.success("Design settings applied globally!");
    } catch (err) {
      toast.error("Failed to save design.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset to institutional brand colors?")) {
      setSettings(prev => ({ ...prev, ...defaults }));
      toast.success("Branding reset");
    }
  };

  return (
    <div className="chatbot-form-content">
      {/* 1. BRAND COLORS */}
      <div className="settings-section">
        <h3><Palette size={18} /> Institutional Branding</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Simplified 2-color brand engine. Online indicators are locked to institutional green.
        </p>
        <div className="theme-grid">
          <ThemeColorCard 
            label="Primary Brand Color" 
            description="Header, Send Button & User Bubbles" 
            name="primaryColor" 
            value={settings.primaryColor} 
            onChange={handleChange}
          />
          <ThemeColorCard 
            label="Secondary Brand Color" 
            description="AI Response Bubbles & Accent Highlights" 
            name="secondaryColor" 
            value={settings.secondaryColor} 
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 2. IDENTITY */}
      <div className="settings-section">
        <h3><Type size={18} /> Chatbot Identity</h3>
        <div className="settings-grid">
          <div className="settings-group">
            <label>Bot Name</label>
            <input 
              type="text" 
              name="name" 
              value={settings.name || ""} 
              onChange={handleChange} 
              className="chatbot-textarea"
              style={{ minHeight: 'auto', padding: '10px' }}
            />
          </div>
          <div className="settings-group">
            <label>Subtitle / Status</label>
            <input 
              type="text" 
              name="subtitle" 
              value={settings.subtitle || ""} 
              onChange={handleChange} 
              className="chatbot-textarea"
              style={{ minHeight: 'auto', padding: '10px' }}
            />
          </div>
          <div className="settings-group" style={{ gridColumn: 'span 2' }}>
            <label>Opening Greeting</label>
            <textarea 
              name="welcomeMessage" 
              value={settings.welcomeMessage || ""} 
              onChange={handleChange} 
              className="chatbot-textarea"
            />
          </div>
        </div>
      </div>

      {/* 3. ASSETS */}
      <div className="settings-section">
        <h3><Smartphone size={18} /> Brand Assets</h3>
        <div className="settings-grid">
          <div className="settings-group">
            <label>Bot Profile Icon</label>
            <div className="avatar-upload-zone" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f8fafc', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {settings.avatar ? <img src={settings.avatar} alt="Bot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Palette size={20} color="#94a3b8" />}
              </div>
              <label className="upload-placeholder" style={{ cursor: 'pointer', fontSize: '12px', padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                Upload Image
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
              </label>
            </div>
          </div>

          <div className="settings-group">
            <label>Background Texture</label>
            <div className="avatar-upload-zone" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: 44, height: 44, borderRadius: '6px', background: '#f8fafc', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {settings.backgroundImage ? <img src={settings.backgroundImage} alt="BG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="#94a3b8" />}
              </div>
              <label className="upload-placeholder" style={{ cursor: 'pointer', fontSize: '12px', padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                Upload BG
                <input type="file" accept="image/*" onChange={handleBGChange} hidden />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="reset-btn" onClick={handleReset}>
          <RotateCcw size={16} /> Reset Institutional Design
        </button>
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {loading ? "Saving Brand..." : "Apply Design Settings"}
        </button>
      </div>
    </div>
  );
};

export default UISettings;
