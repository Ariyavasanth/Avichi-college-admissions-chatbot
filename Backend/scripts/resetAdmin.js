const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Admin = require("../model/Admins");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@college.com";
    const newPassword = "Admin@123";

    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log("Creating new admin...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
        isFirstLogin: true,
        role: "admin"
      });
      await newAdmin.save();
    } else {
      console.log("Resetting existing admin...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      admin.password = hashedPassword;
      admin.isFirstLogin = true;
      await admin.save();
    }

    console.log(`✅ Success! Admin ${email} is now set to Admin@123 with isFirstLogin: true`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetAdmin();
