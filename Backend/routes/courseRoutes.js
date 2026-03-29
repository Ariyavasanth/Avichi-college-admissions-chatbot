const express = require("express");
const {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔓 Public routes (Chatbot / Website)
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// 🔐 Admin routes
router.post("/", authMiddleware, createCourse);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

module.exports = router;
