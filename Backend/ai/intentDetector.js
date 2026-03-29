const callGemini = require("./gemini");

/**
 * Extract JSON safely
 */
function extractJSON(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) return null;

    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Advanced intent detection with memory + pronoun resolution
 */
module.exports = async function detectIntent({
  userMessage,
  history = [],
}) {
  // 🔥 Build structured conversation history
  const historyText = history
    .slice(-6)
    .map((m) =>
      `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`
    )
    .join("\n");

  const prompt = `
You are an intelligent intent classification engine.

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT add explanation.
- Do NOT add text outside JSON.

ALLOWED INTENTS:
admission, eligibility, duration, fees, course, deadline,
college_name, college_timing, contact, location, website,
greeting, thanks, unknown

ALLOWED SUBINTENTS:
- fees → perYear, perSemester, total
- duration → years, semesters
- others → null

INTELLIGENCE RULES:
1. Use conversation history to resolve references like:
   "it", "its", "that", "they", "this"
2. Always detect the FINAL user intent.
3. If user says:
   "What is its fee?" → map to previous course
4. If no course found → return empty array []

CONVERSATION HISTORY:
${historyText}

CURRENT USER MESSAGE:
${userMessage}

OUTPUT FORMAT:
{
  "intent": "...",
  "subIntent": "...",
  "courseNames": ["..."]
}
`;

  try {
    const raw = await callGemini({
      prompt,
      temperature: 0,
      max_tokens: 150,
      systemMessage:
        "You are a strict JSON-only intent classifier. Never output anything except JSON.",
      history, // 🔥 helps model consistency
    });

    const parsed = extractJSON(raw);

    if (!parsed) {
      return {
        intent: "unknown",
        subIntent: null,
        courseNames: [],
      };
    }

    return parsed;

  } catch (err) {
    console.error("Intent detection failed:", err.message);

    return {
      intent: "unknown",
      subIntent: null,
      courseNames: [],
    };
  }
};