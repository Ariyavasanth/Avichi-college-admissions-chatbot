const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const connectDB = require("../config/Db");
const Admin = require("../model/Admins");

async function resetAdmin() {
    try {
        await connectDB();
        const admin = await Admin.findOne({ email: "admin@college.com" });
        if (admin) {
            admin.isFirstLogin = true;
            await admin.save();
            console.log("Admin isFirstLogin reset to true");
        } else {
            console.log("Admin not found. Creating default admin...");
            const bcrypt = require("bcryptjs");
            // The model hook will hash it
            await Admin.create({
                name: "System Admin",
                email: "admin@college.com",
                password: "AvichiAdmin@2026!",
                role: "superadmin",
                isFirstLogin: true
            });
            console.log("Default admin created: admin@college.com / AvichiAdmin@2026!");
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

resetAdmin();
