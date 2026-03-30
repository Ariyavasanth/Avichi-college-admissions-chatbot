const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/Db");
const Course = require("../model/Course");
const Institution = require("../model/Institution");
const VectorContent = require("../model/VectorContent");
const embeddingService = require("../ai/embeddingService");

/**
 * Migration Script: Course & Institution -> VectorContent
 * This script reads existing structured data and creates semantic chunks for RAG.
 */
async function migrate() {
  try {
    await connectDB();
    console.log("🚀 Starting Vector Migration...");

    // 1️⃣ Migrate Institution Info
    const institution = await Institution.findOne();
    if (institution) {
      console.log("📌 Vectorizing Institution Details...");
      const institutionText = `
College Name: ${institution.institutionName}
Location: ${institution.contactDetails.address}
Contact: ${institution.contactDetails.phone}, ${institution.contactDetails.email}
Website: ${institution.contactDetails.website}
Description: Avichi College of Arts and Science is a premier institution focused on excellence in education.
Office Hours: 9:00 AM to 5:00 PM, Monday to Saturday.
      `.trim();

      const embedding = await embeddingService.generateEmbedding(institutionText);
      await VectorContent.findOneAndUpdate(
        { type: "institution" },
        {
          text: institutionText,
          embedding,
          type: "institution",
          metadata: { institutionId: institution._id },
        },
        { upsert: true }
      );
      console.log("✅ Institution details vectorized.");
    }

    // 2️⃣ Migrate Courses
    const courses = await Course.find();
    console.log(`📌 Vectorizing ${courses.length} courses...`);

    for (const course of courses) {
      const courseText = `
Course Name: ${course.courseName}
Department: ${course.department}
Duration: ${course.duration.years} years (${course.duration.semesters} semesters)
Eligibility: ${course.eligibility.qualification} with minimum ${course.eligibility.minimumPercentage}% marks.
Fees: ₹${course.fees.perYear} per year, ₹${course.fees.perSemester} per semester. Total course fee is ₹${course.fees.totalCourse}.
Admission Deadline: ${course.admissionDeadline ? new Date(course.admissionDeadline).toLocaleDateString() : "To be announced"}
      `.trim();

      const embedding = await embeddingService.generateEmbedding(courseText);
      
      await VectorContent.findOneAndUpdate(
        { "metadata.courseId": course._id },
        {
          text: courseText,
          embedding,
          type: "course",
          metadata: { courseId: course._id, courseName: course.courseName },
        },
        { upsert: true }
      );
      console.log(`✅ Course: ${course.courseName} vectorized.`);
    }

    console.log("\n🎉 Migration Complete! All existing data is now ready for Vector Search.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
}

migrate();
