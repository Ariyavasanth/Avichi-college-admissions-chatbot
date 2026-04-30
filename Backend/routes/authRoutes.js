const express = require("express");
const { 
  loginAdmin, 
  changePassword, 
  initialSetup,
  requestEmailChange, 
  confirmEmailChange 
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/change-password", authMiddleware, changePassword);
router.post("/initial-setup", authMiddleware, initialSetup);

// Email Change Flow
router.post("/request-email-change", authMiddleware, requestEmailChange);
router.get("/confirm-email-change", confirmEmailChange); // Public, token-based verification

module.exports = router;
