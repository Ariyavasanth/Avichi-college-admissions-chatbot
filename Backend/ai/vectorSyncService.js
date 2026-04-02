const VectorContent = require("../model/VectorContent");
const embeddingService = require("./embeddingService");

class VectorSyncService {
  /**
   * Syncs Institution details to VectorContent
   * @param {Object} institution 
   */
  async syncInstitution(institution) {
    try {
      console.log("📌 Syncing Institution to Vector DB...");
      const institutionText = `
College Name: ${institution.institutionName}
Location: ${institution.contactDetails?.address || ""}
Contact: ${institution.contactDetails?.phone || ""}, ${institution.contactDetails?.email || ""}
Website: ${institution.contactDetails?.website || ""}
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
      console.log("✅ Institution vector sync completed.");
    } catch (error) {
      console.error("❌ Failed to sync Institution to Vector DB:", error);
    }
  }

  /**
   * Syncs a Course details to VectorContent
   * @param {Object} course 
   */
  async syncCourse(course) {
    try {
      console.log(`📌 Syncing Course ${course.courseName} to Vector DB...`);
      const courseText = `
Course Name: ${course.courseName}
Department: ${course.department}
Duration: ${course.duration?.years || ""} years (${course.duration?.semesters || ""} semesters)
Eligibility: ${course.eligibility?.qualification || ""} with minimum ${course.eligibility?.minimumPercentage || ""}% marks.
Fees: ₹${course.fees?.perYear || ""} per year, ₹${course.fees?.perSemester || ""} per semester. Total course fee is ₹${course.fees?.totalCourse || ""}.
Available Seats: ${course.availableSeats !== undefined ? course.availableSeats : "Contact office"}
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
        { upsert: true, new: true }
      );
      console.log(`✅ Course Vector Sync: ${course.courseName} completed.`);
    } catch (error) {
       console.error(`❌ Failed to sync Course ${course?.courseName} to Vector DB:`, error);
    }
  }

  /**
   * Delete a course from VectorContent
   * @param {string} courseId 
   */
  async deleteCourse(courseId) {
     try {
        console.log(`📌 Deleting Course vector for ID: ${courseId}`);
        await VectorContent.findOneAndDelete({ "metadata.courseId": courseId });
        console.log(`✅ Course Vector deletion completed.`);
     } catch (error) {
        console.error(`❌ Failed to delete Course vector:`, error);
     }
  }
}

module.exports = new VectorSyncService();
