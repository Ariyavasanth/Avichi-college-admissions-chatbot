const axios = require("axios");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter({
  prompt,
  model = "mistralai/mistral-7b-instruct",
  temperature = 0,
  max_tokens = 200,
  systemMessage = "",
}) {
  try {
    const messages = [];

    if (systemMessage) {
      messages.push({
        role: "system",
        content: systemMessage,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model,
        messages,
        temperature,
        max_tokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "College Admission Chatbot",
        },
        timeout: 20000,
      },
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = callOpenRouter;
