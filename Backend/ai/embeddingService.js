const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client using the key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class EmbeddingService {
  /**
   * Generate an embedding for a single text using Google Gemini
   * @param {string} text - The content to vectorize.
   * @returns {Promise<number[]>} - 768-dimensional array
   */
  async generateEmbedding(text) {
    try {
      if (!text || typeof text !== "string") {
        text = "default";
      }

      // We use embedding-001 which generates 768 dimensions and has perfect compatibility
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const result = await model.embedContent(text);

      // The embedding vector
      return result.embedding.values;
    } catch (error) {
      console.error("❌ GEMINI EMBEDDING ERROR:", error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Batch Embedding
   * Used for embedding multiple documents at once.
   * @param {string[]} texts - Array of strings to vectorize.
   * @returns {Promise<number[][]>}
   */
  async generateBatchEmbeddings(texts) {
    try {
      // Ensure all texts are valid strings
      const safeTexts = texts.map((t) => (typeof t === "string" && t.trim() ? t : "default"));

      const embeddings = [];
      // To strictly avoid rate limit issues on the free tier, operate sequentially
      for (const text of safeTexts) {
        const embeddingBytes = await this.generateEmbedding(text);
        embeddings.push(embeddingBytes);
      }

      return embeddings;
    } catch (error) {
      console.error("❌ GEMINI BATCH EMBEDDING ERROR:", error.message);
      throw error;
    }
  }
}

module.exports = new EmbeddingService();
