const mongoose = require("mongoose");

const vectorContentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
      // 1536 dimensions for OpenAI text-embedding-3-small
      validate: {
        validator: function (v) {
          return v.length === 1536;
        },
        message: "Embedding must be 1536 dimensions",
      },
    },
    type: {
      type: String,
      enum: ["course", "institution", "general", "faq"],
      default: "general",
    },
    metadata: {
      type: Object, // for any extra info like courseId or institutionId
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Optional: specific index for faster metadata filtering if needed
// vectorContentSchema.index({ type: 1 });

module.exports = mongoose.model("VectorContent", vectorContentSchema);
