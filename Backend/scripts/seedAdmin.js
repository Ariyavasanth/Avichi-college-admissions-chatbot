const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("../model/Admins");
const path = require("path");

// Load env from Backend directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 2. Admin Details
    const adminEmail = "admin@college.com";
    const plainPassword = "Admin@123";

    // 3. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️ Admin ${adminEmail} already exists. Skipping...`);
      process.exit(0);
    }

    // 4. Create new admin
    // Note: The Admin model has a pre-save hook to hash the password, 
    // but just to be safe and explicit as per instructions:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newAdmin = new Admin({
      email: adminEmail,
      password: hashedPassword,
      isFirstLogin: true,
      role: "admin"
    });

    await newAdmin.save();
    
    console.log("──────────────────────────────────────────────────");
    console.log("🚀 ADMIN ACCOUNT CREATED SUCCESSFULLY");
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${plainPassword}`);
    console.log("──────────────────────────────────────────────────");
    console.log("PLEASE DELETE THIS SCRIPT AFTER RUNNING IN PRODUCTION");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
