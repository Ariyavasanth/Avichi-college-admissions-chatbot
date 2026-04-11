const express = require("express");
const {
  getSettings,
  updateSettings,
  getSuggestions,
  createSuggestion,
  updateSuggestion,
  deleteSuggestion
} = require("../controllers/chatbotSettingsController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// ---- Public Routes (Read by chatbot frontend) ----
router.get("/settings", getSettings);
router.get("/suggestions", getSuggestions);

// ---- Protected Routes (Admin writes) ----
router.put("/settings", authMiddleware, updateSettings);
router.post("/suggestions", authMiddleware, createSuggestion);
router.put("/suggestions/:id", authMiddleware, updateSuggestion);
router.delete("/suggestions/:id", authMiddleware, deleteSuggestion);

module.exports = router;
