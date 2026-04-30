import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAdmin } from "../../context/AdminContext";
import { updateProfile } from "../../services/settingsService";

const ProfileSettings = () => {
  const { adminData, updateAdmin } = useAdmin();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminData) {
      setName(adminData.name || "");
      setEmail(adminData.email || "");
      setPhone(adminData.phone || "");
      setProfileImage(adminData.profileImage || "");
    }
  }, [adminData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image must be less than 2MB");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateProfile({ name, email, phone, profileImage });
      updateAdmin(data.admin);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setPhone("");
    setProfileImage("");
    toast.success("Form cleared");
  };

  const displayTextName = name || "Admin";

  return (
    <div>
      <div className="settings-header">
        <h2>Profile Information</h2>
        <p>Update your account's profile information and email address.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-form-group">
          <label>Profile Image</label>
          <div className="image-upload-area">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-avatar-preview" />
            ) : (
              <div className="profile-avatar-placeholder">
                <span style={{ fontSize: "24px" }}>{displayTextName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <label className="upload-btn-label">
                <Upload size={14} style={{ display: "inline", marginBottom: "-2px", marginRight: "4px" }} />
                Upload New
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#94a3b8" }}>JPG, GIF or PNG. Max size of 2MB</p>
            </div>
          </div>
        </div>

        <div className="settings-form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            className="settings-input" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            placeholder="System Admin"
          />
        </div>

        <div className="settings-form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            className="settings-input" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="admin@avichicollege.edu"
          />
        </div>

        <div className="settings-form-group">
          <label>Phone Number (Optional)</label>
          <input 
            type="tel" 
            className="settings-input" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="settings-actions">
          <button type="submit" className="settings-save-btn" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : null}
            {loading ? "Saving..." : "Save Profile"}
          </button>
          
          <button 
            type="button" 
            className="settings-clear-btn" 
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
