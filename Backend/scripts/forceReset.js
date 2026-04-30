const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Admin = require("../model/Admins");

const forceCreateAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("Connecting to:", mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log("Database Name:", mongoose.connection.name);
    
    const email = "admin@college.com";
    const password = "Admin@123";
    
    // Hash manually just to be 100% sure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Delete existing if any (even if finding failed before)
    await mongoose.connection.db.collection("admins").deleteMany({ email });
    
    // Insert directly into collection to bypass any model issues
    await mongoose.connection.db.collection("admins").insertOne({
      email: email,
      password: hashedPassword,
      role: "admin",
      isFirstLogin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log("✅ Admin inserted directly into 'admins' collection.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

forceCreateAdmin();
