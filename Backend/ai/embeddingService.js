/**
 * TEMPORARY FALLBACK EMBEDDING SERVICE
 * 
 * ⚠️ WARNING: This is a dummy implementation for development and testing ONLY.
 * It does not use any AI APIs to avoid 429 Quota Exceeded and 404 errors.
 * Instead, it generates pseudo-consistent 1536-dimensional mock vectors.
 * 
 * Replace this file with a real OpenAI/Gemini implementation before production.
 */

class EmbeddingService {
  constructor() {
    console.warn("⚠️ INITIALIZING MOCK EMBEDDING SERVICE ⚠️");
    console.warn("This bypasses all external APIs for local testing purposes.");
  }

  /**
   * Generate a dummy embedding for a single text string.
   * Produces slightly consistent results based on math operations on the text
   * so that similar texts might have similar vectors (very roughly).
   * 
   * @param {string} text - The content to vectorize.
   * @returns {Promise<number[]>} - 1536-dim array of numbers.
   */
  async generateEmbedding(text) {
    try {
      const dimensions = 1536; // OpenAI text-embedding-3-small dimension size
      
      // Safety check just in case
      if (!text || typeof text !== "string") {
        text = "default";
      }

      // Generate a simple deterministic seed based on text content
      let seed = 0;
      for (let i = 0; i < text.length; i++) {
        seed += text.charCodeAt(i);
      }

      // Create a 1536-dimensional vector
      // Using Math.sin with our seed and index ensures the range is [-1, 1]
      // and produces a deterministic but "random-looking" vector.
      const embedding = new Array(dimensions).fill(0).map((_, index) => {
        return Math.sin(seed + index) * 0.1; // * 0.1 to keep values small and manageable
      });

      return embedding;

    } catch (error) {
      console.error("❌ MOCK EMBEDDING ERROR:", error);
      throw new Error(`Failed to generate mock embedding: ${error.message}`);
    }
  }

  /**
   * Batch Embedding (Mock)
   * @param {string[]} texts - Array of strings to vectorize.
   * @returns {Promise<number[][]>}
   */
  async generateBatchEmbeddings(texts) {
    try {
      const embeddings = [];
      for (const t of texts) {
        // await inside loop is fine here since it's an immediate local call
        const e = await this.generateEmbedding(t);
        embeddings.push(e);
      }
      return embeddings;
    } catch (error) {
      console.error("❌ MOCK BATCH EMBEDDING ERROR:", error.message);
      throw error;
    }
  }
}

module.exports = new EmbeddingService();
