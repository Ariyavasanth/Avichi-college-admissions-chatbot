const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // Admin who created/updated the course
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Structured Fees (VERY IMPORTANT)
    fees: {
      perYear: {
        type: Number,
        required: true,
      },
      perSemester: {
        type: Number,
        required: true,
      },
      totalCourse: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    // ✅ Structured Duration
    duration: {
      years: {
        type: Number,
        required: true,
      },
      semesters: {
        type: Number,
        required: true,
      },
    },

    // ✅ Structured Eligibility
    eligibility: {
      qualification: {
        type: String,
        required: true,
      },
      minimumPercentage: {
        type: Number,
        required: true,
      },
    },

    admissionDeadline: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  },
);

module.exports = mongoose.model("Course", courseSchema);
