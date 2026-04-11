const express = require("express");
const { 
  updateProfile, 
  updateSecurity, 
  updateSystemSettings
} = require("../controllers/settingsController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// All settings routes are protected
router.use(authMiddleware);

router.put("/profile", updateProfile);
router.put("/security", updateSecurity);
router.put("/system", updateSystemSettings);

module.exports = router;
