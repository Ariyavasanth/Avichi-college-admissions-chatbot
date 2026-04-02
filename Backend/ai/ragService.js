const VectorContent = require("../model/VectorContent");
const embeddingService = require("./embeddingService");
const callAI = require("./openrouter");

/**
 * RAG Service
 * Handles User Query Embedding -> Vector Search -> Grounded Response
 */
class RAGService {
  /**
   * Perform RAG to answer user query
   * @param {string} userQuery - The user's question
   * @param {Array} history - Conversation history
   * @returns {Promise<string>} - AI generated grounded response
   */
  async answerQuery(userQuery, history = []) {
    try {
      // 1️⃣ Generate Embedding for User Query
      const queryEmbedding = await embeddingService.generateEmbedding(userQuery);

      // 2️⃣ Perform Vector Search in MongoDB Atlas
      // Note: This requires the "vector_index" to be created in Atlas
      const searchResults = await VectorContent.aggregate([
        {
          $vectorSearch: {
            index: "vector_index", // Name of your Atlas Vector Search index
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: 5, // Retrieve top 5 relevant chunks
          },
        },
        {
          $project: {
            text: 1,
            type: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      if (!searchResults || searchResults.length === 0) {
        console.log("No relevant documents found in vector search.");
        // We still let Gemini handle it, it will say "I don't know" based on instructions
      }

      // 3️⃣ Construct Context from results
      const contextText = searchResults
        .map((res) => `[Source: ${res.type}] ${res.text}`)
        .join("\n\n");

      // 4️⃣ Define Strict Prompt
      const systemMessage = `
You are an expert AI Admission Assistant for Avichi College. 
Your goal is to provide accurate information based ONLY on the provided context.

STRICT RULES:
1. Answer the question using ONLY the provided DATA.
2. If the answer is not in the data, strictly say: "I'm sorry, but I don't have that specific information in my records. Please contact the college office for further details."
3. Do NOT use outside knowledge or hallucinate.
4. Keep the tone professional, helpful, and friendly.
5. If the user greets you, greet them back and ask how you can help.

PROVIDED DATA:
${contextText || "No specific data found for this query."}
`;

      // 5️⃣ Call OpenRouter LLM with grounded context
      const reply = await callAI({
        prompt: userQuery,
        systemMessage,
        history,
        temperature: 0.1, // Low temperature for factual accuracy
      });

      return reply;
    } catch (error) {
      console.error("RAG Service Error:", error);
      throw error;
    }
  }
}

module.exports = new RAGService();
