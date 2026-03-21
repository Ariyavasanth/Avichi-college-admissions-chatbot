const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini({
  prompt,
  temperature = 0.7,
  max_tokens = 200,
  systemMessage = "",
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in .env");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // ✅ Clean prompt (no "User:" needed)
    const fullPrompt = `
${systemMessage ? systemMessage + "\n\n" : ""}
${prompt}
`;

    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      },
    });

    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error.message);
    throw new Error("Gemini API failed");
  }
}

module.exports = callGemini;