const Course = require("../model/Course");
const detectIntent = require("../ai/intentDetector");
const generateResponse = require("../ai/responseGenerator");

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User:", message);

    /* ======================================================
       1️⃣ Validate Input
    ====================================================== */
    if (!message || message.trim() === "") {
      return res.json({ reply: "Please enter a valid question." });
    }

    /* ======================================================
       2️⃣ Detect Intent + Entities
    ====================================================== */
    const { intent, subIntent, courseNames } = await detectIntent(message);

    console.log("Intent:", intent);
    console.log("SubIntent:", subIntent);
    console.log("Courses:", courseNames);

    /* ======================================================
       3️⃣ Unknown / Unsupported Queries
    ====================================================== */
    if (intent === "unknown") {
      return res.json({
        reply:
          "I can help with course details like fees, eligibility, duration, and admission deadlines.",
      });
    }

    /* ======================================================
       4️⃣ Admission Queries (STRICT BLOCK)
    ====================================================== */
    if (intent === "admission") {
      return res.json({
        reply:
          "For admission-related queries, please contact the college admission office directly.",
      });
    }

    /* ======================================================
       5️⃣ Validate Course Mention
    ====================================================== */
    if (!courseNames || courseNames.length === 0) {
      return res.json({
        reply:
          "Please mention the course name you are asking about (e.g., BCA, BBA, BSc Visual Communication).",
      });
    }

    /* ======================================================
       6️⃣ Fetch Courses (Case-insensitive, partial-safe)
    ====================================================== */
    const courses = await Course.find({
      isActive: true,
      courseName: {
        $in: courseNames.map((name) => new RegExp(`^${name}$`, "i")),
      },
    });

    if (!courses || courses.length === 0) {
      return res.json({
        reply:
          "Sorry, I couldn’t find details for the mentioned course(s). Please check the course name.",
      });
    }

    /* ======================================================
       7️⃣ Generate Answer (DB → Rules → AI)
    ====================================================== */
    const reply = await generateResponse({
      courses,
      intent,
      subIntent,
      userMessage: message,
    });

    /* ======================================================
       8️⃣ Send Response
    ====================================================== */
    res.json({ reply });
  } catch (error) {
    console.error("CHATBOT ERROR:", error);
    res.status(500).json({
      reply: "Something went wrong. Please try again later.",
    });
  }
};
