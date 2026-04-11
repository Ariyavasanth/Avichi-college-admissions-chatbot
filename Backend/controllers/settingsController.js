const bcrypt = require("bcryptjs");
const Admin = require("../model/Admins");

// @desc    Update Admin Profile (Name, Email, Phone, Profile Image)
// @route   PUT /api/admin/settings/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, profileImage } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (name) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (profileImage !== undefined) admin.profileImage = profileImage;

    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email });
      if (existing) return res.status(400).json({ message: "Email already in use" });
      admin.email = email;
    }

    await admin.save();
    res.json({ success: true, message: "Profile updated successfully", admin });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update Admin Security (Password)
// @route   PUT /api/admin/settings/security
exports.updateSecurity = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Security Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update System Settings
// @route   PUT /api/admin/settings/system
exports.updateSystemSettings = async (req, res) => {
  try {
    const { siteName, theme, isMaintenanceMode } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (siteName !== undefined) admin.systemSettings.siteName = siteName;
    if (theme !== undefined) admin.systemSettings.theme = theme;
    if (isMaintenanceMode !== undefined) admin.systemSettings.isMaintenanceMode = isMaintenanceMode;

    await admin.save();
    res.json({ success: true, message: "System settings updated successfully", systemSettings: admin.systemSettings });
  } catch (error) {
    console.error("Update System Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


