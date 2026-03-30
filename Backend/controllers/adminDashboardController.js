const Course = require("../model/Course");
const Institution = require("../model/Institution");
const VectorContent = require("../model/VectorContent");
const embeddingService = require("../ai/embeddingService");

exports.adminDashbord = async (req, res) => {
  try {
    // 1️⃣ Get total count of courses
    const totalCourses = await Course.countDocuments();

    // 2️⃣ Get the 5 most recently updated courses
    const recentCourses = await Course.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("courseName department fees updatedAt");

    // 3️⃣ Get general institution info
    const institution = await Institution.findOne()
      .select("institutionName contactDetails.address");

    // 4️⃣ Return consolidated stats
    res.json({
      totalCourses,
      institutionName: institution?.institutionName || "Not Set",
      recentCourses,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Add Vector Data for RAG
 * POST /api/admin/dashboard/add-vector-data
 */
exports.addVectorData = async (req, res) => {
  try {
    const { text, type = "general", metadata = {} } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ message: "Text content must be at least 10 characters long." });
    }

    // 1️⃣ Generate Embedding using Gemini
    const embedding = await embeddingService.generateEmbedding(text);

    // 2️⃣ Save to MongoDB
    const newVectorData = new VectorContent({
      text,
      embedding,
      type,
      metadata,
    });

    await newVectorData.save();

    res.status(201).json({
      message: "Data vectorized and stored successfully!",
      contentId: newVectorData._id,
    });
  } catch (error) {
    console.error("Vector Data Ingestion Error:", error);
    res.status(500).json({ message: `Failed to ingest vector data: ${error.message}` });
  }
};
