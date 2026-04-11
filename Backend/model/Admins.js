const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    profileImage: {
      type: String, // Store base64 or URL
      default: ""
    },
    systemSettings: {
      siteName: { type: String, default: "Avichi College Admins" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      isMaintenanceMode: { type: Boolean, default: false }
    },
    notificationSettings: {
      emailNotifications: { type: Boolean, default: true },
      newUserAlerts: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("Admin", adminSchema);
