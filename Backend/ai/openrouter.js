const axios = require("axios");

async function callAI({
  prompt,
  temperature = 0.1,
  max_tokens = 512,
  systemMessage = "",
  history = [],
}) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("⚠️ Missing OPENROUTER_API_KEY in .env");
    return "AI service temporarily unavailable. Please try again later.";
  }

  try {
    // 1️⃣ Initialize messages with the system prompt
    const messages = [
      { role: "system", content: systemMessage }
    ];

    // 2️⃣ Append the last 6 messages from conversation history
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text || ""
      });
    }

    // 3️⃣ Append the current user prompt
    messages.push({ role: "user", content: prompt });

    console.log("🔄 Calling OpenRouter API...");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error("Empty response received from OpenRouter");
    }

    console.log("✅ Success: mistralai/mistral-7b-instruct:free");
    return generatedText.trim();

  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("❌ OpenRouter Error:", errorDetails);

    // Return safe fallback message on failure
    return "AI service temporarily unavailable. Please try again later.";
  }
}

module.exports = callAI;
