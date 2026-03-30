const ragService = require("../ai/ragService");

/**
 * Main Chat API Controller (RAG Version)
 * Orchestrates: User Query -> Embedding -> Atlas Vector Search -> Gemini Response
 */
exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // 1️⃣ Validate Input
    const userMessage = message?.trim();
    if (!userMessage) {
      return res.json({ reply: "Hello! How can I assist you with Avichi College admissions today?" });
    }

    // 2️⃣ Perform RAG-based search and response generation
    // This replaces manual Intent Detection + Entity Fetching
    const reply = await ragService.answerQuery(userMessage, history);

    // 3️⃣ Send Final Answer
    res.json({ reply });

  } catch (error) {
    console.error("CHATBOT RAG ERROR:", error);
    
    // Generic error handling
    let errorMessage = "I'm having difficulty accessing our admission records right now. Please try again or contact the Avichi College office.";
    
    // Check if error is related to Vector Search index not being created yet
    if (error.message.includes("$vectorSearch")) {
      errorMessage = "I'm currently being updated to a new brain! Please inform the admin that the 'vector_index' needs to be created in Atlas.";
    }

    res.status(500).json({ reply: errorMessage });
  }
};
