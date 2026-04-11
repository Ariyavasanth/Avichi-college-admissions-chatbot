const express = require("express");
const { loginAdmin, updateProfile } = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/update-profile", authMiddleware, updateProfile);

module.exports = router;
