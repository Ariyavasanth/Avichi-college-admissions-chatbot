const callOpenRouter = require("./openRouterClient");

module.exports = async function detectIntent(userMessage) {
  const prompt = `
Return ONLY valid JSON.
No explanation. No markdown. No extra text.

Allowed intents:
fees, eligibility, duration, deadline, course, admission, unknown

Allowed subIntents:
- fees: perYear, perSemester, total
- duration: years, semesters
- others: null

Rules:
- If the user asks about semester-wise fees, use subIntent "perSemester"
- If total or full course fees are asked, use subIntent "total"
- If nothing specific is mentioned for fees, use subIntent "perYear"
- If semesters are mentioned, use subIntent "semesters"
- If no course is mentioned, return an empty array
- Course names must be strings exactly as mentioned by the user

JSON format:
{
  "intent": "",
  "subIntent": null,
  "courseNames": []
}

User Question:
"${userMessage}"
`;

  const raw = await callOpenRouter({
    prompt,
    temperature: 0,
    max_tokens: 120,
    systemMessage:
      "You are a strict intent classification engine. Output JSON only.",
  });

  const jsonText = raw.match(/\{[\s\S]*\}/)?.[0];

  if (!jsonText) {
    return {
      intent: "unknown",
      subIntent: null,
      courseNames: [],
    };
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return {
      intent: "unknown",
      subIntent: null,
      courseNames: [],
    };
  }
};
