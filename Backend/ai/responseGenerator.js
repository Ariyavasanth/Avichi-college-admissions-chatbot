const callAI = require("./openrouter");

/**
 * Generates a professional, conversational, and context-aware response
 */
module.exports = async function generateResponse({
  courses = [],
  institution = null,
  intent,
  userMessage,
  history = [],
}) {
  // Normalize input
  if (!Array.isArray(courses)) {
    courses = [courses];
  }

  // 1️⃣ Build DB Context
  let contextBlock = "DATABASE REAL-TIME FACTS:\n";

  if (institution) {
    contextBlock += `- Institution: ${institution.collegeName}\n`;
    contextBlock += `- Contact: Phone: ${institution.contactDetails?.phone || "N/A"}, Email: ${institution.contactDetails?.email || "N/A"}\n`;
    contextBlock += `- Location: ${institution.contactDetails?.address?.text || "N/A"}\n`;
    contextBlock += `- Website: ${institution.contactDetails?.website || "N/A"}\n`;
    contextBlock += `- Timings: Morning: ${institution.timings?.morningShift || "N/A"}, Evening: ${institution.timings?.eveningShift || "N/A"}, General: ${institution.timings?.general || "09:00 AM - 04:00 PM"}\n`;
  }

  if (courses.length > 0) {
    contextBlock += "\nCOURSE SPECIFIC DATA:\n";

    for (const c of courses) {
      if (!c) continue;

      contextBlock += `- Course: ${c.courseName}\n`;
      contextBlock += `  - Dept: ${c.department}\n`;
      contextBlock += `  - Fees: Per Year: ₹${c.fees?.perYear || "N/A"}, Per Sem: ₹${c.fees?.perSemester || "N/A"}, Total: ₹${c.fees?.totalCourse || "N/A"}\n`;
      contextBlock += `  - Duration: ${c.duration?.years || "?"} yrs (${c.duration?.semesters || "?"} sem)\n`;
      contextBlock += `  - Eligibility: ${c.eligibility?.qualification || "N/A"}, ${c.eligibility?.minimumPercentage || "N/A"}%\n\n`;
    }
  }

  // 2️⃣ 🔥 POWERFUL SYSTEM PROMPT (ANTIGRAVITY)
  const systemMessage = `
You are Avichi AI, a highly intelligent and conversational assistant for Avichi College.

${contextBlock}

CORE BEHAVIOR:
- Maintain natural, human-like conversation.
- Always remember previous context and continue the discussion.
- Resolve pronouns like "it", "they", "that", "this", "its" using conversation history.
- Never ask the user to repeat previously mentioned information.

INTELLIGENCE RULES:
- If the user refers indirectly (e.g., "its fees"), infer the correct course.
- Combine database facts with conversation context.
- Do not lose track of the topic unless user changes it clearly.

RESPONSE STYLE:
- Friendly, professional, and clear.
- Use simple English.
- Keep answers concise but informative.
- Highlight important values using **bold** (course names, fees, eligibility).

STRICT RULE:
- ONLY use information from DATABASE.
- If data is missing → say politely it's unavailable.

PRIORITY ORDER:
1. Conversation history
2. Latest user message
3. Database facts

Be smart, natural, and context-aware like ChatGPT.
`;

  // 3️⃣ Call Gemini with MEMORY (IMPORTANT FIX)
  try {
    const reply = await callAI({
      prompt: userMessage,
      systemMessage,
      history, // 🔥 THIS ENABLES CONTEXT MEMORY
      temperature: 0.3,
      max_tokens: 400,
    });

    return reply;
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);

    return "I’m having trouble accessing the information right now. Please contact the admission office for assistance.";
  }
};