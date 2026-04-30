const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/Db");
const Admin = require("../model/Admins");

connectDB()


async function createAdmin() {
  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    console.log("Admin account(s) already exist. Skipping seed.");
    process.exit(0);
  }

  const initialEmail = process.env.ADMIN_EMAIL || "admin@college.com";
  const initialPassword = process.env.ADMIN_PASSWORD || "AvichiAdmin@2026!";

  // Pre('save') hook in Admin schema hashes the password, so we just pass plain text here
  await Admin.create({
    name: "System Admin",
    email: initialEmail,
    password: initialPassword,
    role: "superadmin",
    isFirstLogin: true
  });

  console.log(`Admin created successfully with email: ${initialEmail}`);
  process.exit();
}

createAdmin();
