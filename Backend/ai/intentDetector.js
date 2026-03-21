const callGemini = require("./gemini");

// ✅ safer JSON extractor
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

module.exports = async function detectIntent(userMessage) {
  const prompt = `
Return ONLY valid JSON.

Allowed intents:
fees, eligibility, duration, deadline, course, admission,
college_name, college_timing, shifts, contact, email, address, location, website,
unknown

Allowed subIntents:
- fees: perYear, perSemester, total
- duration: years, semesters
- others: null

Rules:
- If semester fees → "perSemester"
- If total fees → "total"
- Else default → "perYear"
- If semesters mentioned → "semesters"
- Institution-level intents do NOT require courseNames
- If no course → return empty array

JSON format:
{
  "intent": "",
  "subIntent": null,
  "courseNames": []
}

User Question:
"${userMessage}"
`;

  const raw = await callGemini({
    prompt,
    temperature: 0,
    max_tokens: 150,
    systemMessage:
      "You are a strict intent classification engine. Output JSON only.",
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
};