const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Admin = require("../model/Admins");

async function checkAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await Admin.findOne({ email: "admin@college.com" });
  if (admin) {
    console.log("Admin found:");
    console.log("Email:", admin.email);
    console.log("isFirstLogin:", admin.isFirstLogin);
    console.log("pendingEmail:", admin.pendingEmail);
    console.log("Has password (hashed):", !!admin.password);
    console.log("Password hash prefix:", admin.password.substring(0, 10));
  } else {
    console.log("Default admin not found by email admin@college.com");
    const anyAdmin = await Admin.findOne();
    if (anyAdmin) {
        console.log("Found another admin:", anyAdmin.email);
    }
  }
  process.exit();
}

checkAdmin();
