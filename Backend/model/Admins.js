const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      default: "Admin",
    },
    phone: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String, // Base64
      default: "",
    },
    systemSettings: {
      siteName: { type: String, default: "Avichi Admin" },
      isMaintenanceMode: { type: Boolean, default: false },
    },
    role: {
      type: String,
      default: "admin",
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    pendingEmail: {
      type: String,
      default: null,
    },
    emailChangeToken: {
      type: String,
      default: null,
    },
    emailChangeTokenExpiry: {
      type: Date,
      default: null,
    },
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
