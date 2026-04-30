const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../model/Admins");
const crypto = require("crypto");
const { sendEmailChangeVerification, sendEmailChangeNotification } = require("../utils/mailer");

// @desc    Request Admin Email Change
// @route   POST /api/admin/auth/request-email-change
exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    console.log(`📩 [AUTH] Request Email Change started for Admin ID: ${req.admin?.id} to New Email: ${newEmail}`);
    
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      console.warn("❌ [AUTH] Admin not found during email change request");
      return res.status(404).json({ message: "Admin not found" });
    }


    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Check if same as current
    if (newEmail.toLowerCase() === admin.email.toLowerCase()) {
      return res.status(400).json({ message: "New email must be different from the current one" });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    admin.pendingEmail = newEmail.toLowerCase();
    admin.emailChangeToken = token;
    admin.emailChangeTokenExpiry = expiry;

    console.log("💾 [AUTH] Saving admin with pending email change...");
    await admin.save();
    console.log("✅ [AUTH] Admin record updated successfully");


    // Send verification email
    try {
      console.log(`📧 [MAILER] Attempting to send verification to: ${newEmail}`);
      const mailResult = await sendEmailChangeVerification(newEmail, token);
      if (mailResult && mailResult.loggedToConsole) {
        console.log("⚠️ [MAILER] Email configuration is missing. Link logged to console.");
      } else {
        console.log("✅ [MAILER] Verification email successfully sent");
      }
    } catch (mailError) {
      console.error("❌ [MAILER] Failed to send verification email:", mailError.message);
      // In production, we still return success but maybe with a note if it's a known issue
      // However, usually we want to know if it failed.
    }



    res.json({ 
      success: true, 
      message: "Verification link has been sent to your new email address. Please confirm it within 15 minutes." 
    });
  } catch (error) {
    console.error("Request Email Change Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Confirm Admin Email Change
// @route   GET /api/admin/auth/confirm-email-change
exports.confirmEmailChange = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const admin = await Admin.findOne({
      emailChangeToken: token,
      emailChangeTokenExpiry: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    const oldEmail = admin.email;
    const newEmail = admin.pendingEmail;

    // Update email
    admin.email = newEmail;
    admin.pendingEmail = null;
    admin.emailChangeToken = null;
    admin.emailChangeTokenExpiry = null;
    admin.isFirstLogin = false;

    await admin.save();

    // Notify old email
    try {
      await sendEmailChangeNotification(oldEmail, newEmail);
    } catch (mailError) {
      console.error("Notification Mail Error:", mailError);
    }

    res.json({ 
      success: true, 
      message: "Your email has been successfully updated. Please log in again with your new email." 
    });
  } catch (error) {
    console.error("Confirm Email Change Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        isFirstLogin: admin.isFirstLogin,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const adminId = req.admin.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Hash is handled by pre-save middleware in model, but we can also set it directly if we want.
    // In the model we have: adminSchema.pre("save", ... bcrypt.hash ...)
    admin.password = newPassword;
    admin.isFirstLogin = false;
    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.initialSetup = async (req, res) => {
  try {
    const { newEmail, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.password = newPassword;

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000;

    admin.pendingEmail = newEmail.toLowerCase();
    admin.emailChangeToken = token;
    admin.emailChangeTokenExpiry = expiry;

    await admin.save();

    try {
      const mailResult = await sendEmailChangeVerification(newEmail, token);
      if (mailResult && mailResult.loggedToConsole) {
        console.log("⚠️ [MAILER] Email configuration is missing. Link logged above.");
      } else {
        console.log("✅ [MAILER] Verification email sent to:", newEmail);
      }
    } catch (mailError) {
      console.error("❌ [MAILER] Failed to send verification email:", mailError.message);
      if (process.env.NODE_ENV !== "production") {
         return res.status(500).json({ 
           message: "Email could not be sent. Check server logs.", 
           error: mailError.message 
         });
      }
    }


    res.json({
      success: true,
      message: "Password updated successfully. A verification link has been sent to your new email. Please verify it to complete setup.",
    });
  } catch (error) {
    console.error("Initial Setup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
