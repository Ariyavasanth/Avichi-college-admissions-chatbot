const Course = require("../model/Course");
const Institution = require("../model/Institution");

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
