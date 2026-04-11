const mongoose = require("mongoose");

const chatbotSettingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Avichi AI Admissions" },
    subtitle: { type: String, default: "Ask me anything about Avichi College!" },
    welcomeMessage: { type: String, default: "Hello! I'm the Avichi College virtual assistant. How can I help you today?" },
    avatar: { type: String, default: "" }, // Base64 string for avatar
    backgroundImage: { type: String, default: "" },
    
    // Core Minimalist Theme
    primaryColor: { type: String, default: "#0f172a" },   // Header, User Bubbles, Primary Logic
    secondaryColor: { type: String, default: "#3b82f6" }  // AI Bubbles, Accents
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotSettings", chatbotSettingsSchema);
