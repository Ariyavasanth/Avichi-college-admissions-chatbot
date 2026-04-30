const ChatbotSettings = require("../model/ChatbotSettings");
const Suggestion = require("../model/Suggestions");
const Admin = require("../model/Admins");

// ======================= CHATBOT UI SETTINGS =======================

// @desc    Get Chatbot UI Settings (Public/Admin)
// @route   GET /api/chatbot/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await ChatbotSettings.findOne();
    if (!settings) {
      settings = await ChatbotSettings.create({});
    }

    // Get maintenance mode from system admin
    const admin = await Admin.findOne(); // Single admin system
    const isMaintenanceMode = admin?.systemSettings?.isMaintenanceMode || false;

    res.json({
      ...settings.toObject(),
      isMaintenanceMode
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update Chatbot UI Settings (Admin Only)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await ChatbotSettings.findOne();

    if (!settings) {
      settings = new ChatbotSettings();
    }

    // List of allowed fields to update (from Consolidated 2-Color Schema)
    const allowedFields = [
      "name", "subtitle", "welcomeMessage", "avatar", "backgroundImage",
      "primaryColor", "secondaryColor"
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();
    res.json({ success: true, message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================= SUGGESTIONS QUICK REPLIES =======================

// @desc    Get All Suggestions (Public/Admin)
// @route   GET /api/chatbot/suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ order: 1 });
    res.json(suggestions);
  } catch (error) {
    console.error("Get Suggestions Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a Suggestion
// @route   POST /api/chatbot/suggestions
exports.createSuggestion = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    // Calculate max order to append to the end
    const lastItem = await Suggestion.findOne().sort({ order: -1 });
    const order = lastItem ? lastItem.order + 1 : 0;

    const suggestion = await Suggestion.create({ text, order });
    res.status(201).json({ success: true, suggestion });
  } catch (error) {
    console.error("Create Suggestion Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a Suggestion text or order
// @route   PUT /api/chatbot/suggestions/:id
exports.updateSuggestion = async (req, res) => {
  try {
    const { text, order } = req.body;
    const suggestion = await Suggestion.findById(req.params.id);

    if (!suggestion) return res.status(404).json({ message: "Suggestion not found" });

    if (text) suggestion.text = text;
    if (order !== undefined) suggestion.order = order;

    await suggestion.save();
    res.json({ success: true, suggestion });
  } catch (error) {
    console.error("Update Suggestion Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a Suggestion
// @route   DELETE /api/chatbot/suggestions/:id
exports.deleteSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ message: "Suggestion not found" });

    res.json({ success: true, message: "Suggestion removed" });
  } catch (error) {
    console.error("Delete Suggestion Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
