const callGemini = require("./gemini");

module.exports = async function generateResponse({
  courses,
  intent,
  userMessage,
  subIntent,
}) {
  // ✅ Normalize courses
  if (!Array.isArray(courses)) {
    courses = [courses];
  }

  // ✅ Admission fallback
  if (intent === "admission") {
    return "Kindly contact the college admission office for the latest updates.";
  }

  let response = "";

  for (const c of courses) {
    if (!c) continue;

    let info = `Course Name: ${c.courseName}\n`;

    // ✅ FEES (with subIntent)
    if (intent === "fees") {
      if (subIntent === "perSemester") {
        info += `Fees per Semester: ${c.fees?.perSemester ?? "Not available"} ${c.fees?.currency ?? ""}\n`;
      } else if (subIntent === "total") {
        info += `Total Course Fee: ${c.fees?.totalCourse ?? "Not available"} ${c.fees?.currency ?? ""}\n`;
      } else {
        info += `Fees per Year: ${c.fees?.perYear ?? "Not available"} ${c.fees?.currency ?? ""}\n`;
      }
    }

    // ✅ DURATION
    if (intent === "duration") {
      if (subIntent === "semesters") {
        info += `Total Semesters: ${c.duration?.semesters ?? "?"}\n`;
      } else {
        info += `Duration: ${c.duration?.years ?? "?"} years\n`;
      }
    }

    // ✅ ELIGIBILITY
    if (intent === "eligibility") {
      info += `Qualification: ${c.eligibility?.qualification ?? "Not available"}\n`;
      info += `Minimum Percentage: ${c.eligibility?.minimumPercentage ?? "Not available"}%\n`;
    }

    // ✅ DEADLINE
    if (intent === "deadline") {
      info += `Admission Deadline: ${
        c.admissionDeadline
          ? new Date(c.admissionDeadline).toDateString()
          : "Not announced"
      }\n`;
    }

    response += info + "\n";
  }

  // ✅ If DB has data → return directly (NO AI call)
  if (response.trim()) {
    return response.trim();
  }

  // ❌ If no data → fallback to AI
  const prompt = `
You are a college assistant.

Answer the question clearly:
"${userMessage}"

If unsure, say:
"Kindly contact the college admission office for the latest updates."
`;

  return callGemini({
    prompt,
    temperature: 0.3,
    max_tokens: 150,
  });
};