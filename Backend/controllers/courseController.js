const Course = require("../model/Course");

/* ======================================================
   GET ALL ACTIVE COURSES
====================================================== */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ updatedAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
/* ======================================================
   GET SINGLE COURSE BY ID
====================================================== */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ======================================================
   CREATE COURSE (ADMIN)
====================================================== */
exports.createCourse = async (req, res) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Admin not authenticated" });
    }

    const {
      courseName,
      department,
      perYearFee,
      durationYears,
      eligibilityQualification,
      eligibilityPercentage,
      admissionDeadline,
    } = req.body;

    // ✅ Validation
    if (
      !courseName ||
      !department ||
      !perYearFee ||
      !durationYears ||
      !eligibilityQualification ||
      !eligibilityPercentage ||
      !admissionDeadline
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔥 Auto calculations
    const perSemesterFee = perYearFee / 2;
    const totalCourseFee = perYearFee * durationYears;
    const totalSemesters = durationYears * 2;

    const course = await Course.create({
      userId: req.admin.id,
      courseName,
      department,
      fees: {
        perYear: perYearFee,
        perSemester: perSemesterFee,
        totalCourse: totalCourseFee,
      },
      duration: {
        years: durationYears,
        semesters: totalSemesters,
      },
      eligibility: {
        qualification: eligibilityQualification,
        minimumPercentage: eligibilityPercentage,
      },
      admissionDeadline,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ======================================================
   UPDATE COURSE
====================================================== */
exports.updateCourse = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const {
      courseName,
      department,
      perYearFee,
      durationYears,
      eligibilityQualification,
      eligibilityPercentage,
      admissionDeadline,
    } = req.body;

    let updateData = {};

    if (courseName) updateData.courseName = courseName;
    if (department) updateData.department = department;
    if (admissionDeadline) updateData.admissionDeadline = admissionDeadline;

    // 🔁 Recalculate structured fields if needed
    if (perYearFee && durationYears) {
      updateData.fees = {
        perYear: perYearFee,
        perSemester: perYearFee / 2,
        totalCourse: perYearFee * durationYears,
      };

      updateData.duration = {
        years: durationYears,
        semesters: durationYears * 2,
      };
    }

    if (eligibilityQualification || eligibilityPercentage) {
      updateData.eligibility = {
        qualification: eligibilityQualification,
        minimumPercentage: eligibilityPercentage,
      };
    }

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE COURSE (PERMANENT)
====================================================== */
exports.deleteCourse = async (req, res) => {
  try {
    const id = req.params.id.trim();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course deleted permanently",
      deletedCourse: course,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
