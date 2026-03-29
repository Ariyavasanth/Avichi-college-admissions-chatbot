const Course = require("../model/Course");
const Institution = require("../model/Institution");
const detectIntent = require("../ai/intentDetector");
const generateResponse = require("../ai/responseGenerator");

/**
 * Main Chat API Controller
 * Orchestrates: Intent Detection -> Data Fetching -> AI Response Generation
 */
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // 1️⃣ Validate Input
    const userMessage = message?.trim();
    if (!userMessage) {
      return res.json({ reply: "Hello! How can I assist you with Avichi College's admission process today?" });
    }

    // 2️⃣ Prepare Context for Intent Detection (to resolve pronouns like "that", "it")
    const lastHistory = (history || []).slice(-4);
    const contextString = lastHistory.length > 0
      ? `PREVIOUS CONVERSATION:\n${lastHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`).join("\n")}\nLATEST USER MESSAGE: ${userMessage}`
      : `LATEST USER MESSAGE: ${userMessage}`;

    // 3️⃣ Detect Intent & Entities using AI
    const { intent, subIntent, courseNames = [] } = await detectIntent(contextString);
    console.log(`[AI-INTENT] Intent: ${intent} | Course Entity: ${courseNames}`);

    // 4️⃣ Unified Data Fetching: Institution & Courses
    // Always fetch institution details to provide context for AI (location, contact info, timing)
    const institution = await Institution.findOne();

    // Fetch courses if specific ones are mentioned (either directly or via pronoun resolution)
    let courses = [];
    if (courseNames && courseNames.length > 0) {
      // Use $in with case-insensitive regex for robust matching
      courses = await Course.find({
        courseName: {
          $in: courseNames.map(name => new RegExp(`${name.trim()}`, "i")),
        },
      });
    }

    // 5️⃣ Generate Professional Response (Cohesive AI-driven flow)
    const reply = await generateResponse({
      courses,
      institution,
      intent,
      subIntent,
      userMessage,
      history,
    });

    // 6️⃣ Send Final Answer
    res.json({ reply });
  } catch (error) {
    console.error("CHATBOT FATAL ERROR:", error);
    res.status(500).json({
      reply: "I apologize, but I'm having some technical difficulty accessing our records right now. Please reach out to the Avichi College office directly.",
    });
  }
};
