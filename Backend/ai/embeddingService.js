const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

class EmbeddingService {
  constructor() {
    this.embeddingModels = ["gemini-embedding-001"];
    this.useFallback = false;
  }

  async generateEmbedding(text) {
    try {
      if (!text || typeof text !== "string") {
        text = "default";
      }

      for (const modelName of this.embeddingModels) {
        try {
          console.log(`🔄 Trying embedding model: ${modelName}`);

          const result = await ai.models.embedContent({
            model: modelName,
            contents: [{ text: text }],
            outputDimensionality: 768, // (may be ignored by API)
          });

          let values = result?.embeddings?.[0]?.values;

          console.log("📏 Original Embedding length:", values?.length);

          // ✅ 🔥 FORCE FIX: Convert 3072 → 768
          if (values && values.length > 768) {
            values = values.slice(0, 768);
            console.log("✂️ Trimmed to 768 dimensions");
          }

          if (values && values.length === 768) {
            console.log(`✅ Success with model: ${modelName} (dim: ${values.length})`);
            this.useFallback = false;
            return values;
          }

        } catch (err) {
          console.log(`⚠️ ${modelName} failed: ${err.message}`);
        }
      }

      console.warn("⚠️ Using fallback embedding");
      this.useFallback = true;
      return this._hashBasedEmbedding(text);

    } catch (error) {
      console.error("❌ EMBEDDING ERROR:", error);
      this.useFallback = true;
      return this._hashBasedEmbedding(text);
    }
  }

  _hashBasedEmbedding(text) {
    console.log("📌 Using fallback embedding");

    const vector = new Array(768).fill(0);

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const index = (code * (i + 1)) % 768;
      vector[index] += code / 255;
    }

    const mag = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
    return mag > 0 ? vector.map(v => v / mag) : vector;
  }

  async generateBatchEmbeddings(texts) {
    const results = [];

    for (let i = 0; i < texts.length; i++) {
      const emb = await this.generateEmbedding(texts[i]);
      results.push(emb);

      if ((i + 1) % 5 === 0) {
        console.log(`✅ ${i + 1}/${texts.length}`);
      }
    }

    return results;
  }

  isUsingFallback() {
    return this.useFallback;
  }

  getEmbeddingDimension() {
    return 768;
  }
}

module.exports = new EmbeddingService();