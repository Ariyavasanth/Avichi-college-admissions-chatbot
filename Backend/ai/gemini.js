const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini({
  prompt,
  temperature = 0.7,
  max_tokens = 200,
  systemMessage = "",
  history = [], // 🔥 NEW
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    // 🔥 Build conversation history (KEY FEATURE)
    const historyText = history
      .slice(-6) // last 6 messages
      .map((m) =>
        `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`
      )
      .join("\n");

    // 🔥 FINAL PROMPT (ChatGPT-style)
    const fullPrompt = `
${systemMessage}

CONVERSATION HISTORY:
${historyText || "No previous conversation"}

CURRENT USER MESSAGE:
${prompt}

INSTRUCTIONS:
- Continue the conversation naturally
- Use previous context if available
- Resolve pronouns like "it", "that", "they"
- Give clear and helpful answers

RESPONSE:
`;

    // ✅ Simplified stable call
    const result = await model.generateContent(fullPrompt);

    const text = result.response.text();

    if (!text) throw new Error("Empty response from Gemini");

    return text.trim();

  } catch (error) {
    let msg = error.message;

    if (msg.includes("400") || msg.includes("403")) {
      msg = "Gemini API key invalid or quota exceeded";
    } else if (msg. includes("404")) {
      msg = "Model not found (check model name or SDK)";
    }

    console.error("Gemini Error:", msg);
    throw new Error(msg);
  }
}

module.exports = callGemini;