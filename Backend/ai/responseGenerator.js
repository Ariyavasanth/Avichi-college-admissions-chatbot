const callOpenRouter = require("./openRouterClient");

module.exports = async function generateResponse({
  courses,
  intent,
  userMessage,
  subIntent,
}) {
  // ✅ Normalize courses to always be an array
  if (!Array.isArray(courses)) {
    courses = [courses];
  }

  if (intent === "admission") {
    return "Kindly contact the college admission office for the latest updates.";
  }

  const courseData = courses
    .map((c) => {
      let info = `Course Name: ${c.courseName}\n`;

      if (intent === "fees") {
        info += `
Fees per Year: ${c.fees?.perYear ?? "Not available"} ${c.fees?.currency ?? ""}
Fees per Semester: ${c.fees?.perSemester ?? "Not available"} ${c.fees?.currency ?? ""}
Total Course Fee: ${c.fees?.totalCourse ?? "Not available"} ${c.fees?.currency ?? ""}
`;
      }

      if (intent === "duration") {
        info += `
Duration: ${c.duration?.years ?? "?"} years
Total Semesters: ${c.duration?.semesters ?? "?"}
`;
      }

      if (intent === "eligibility") {
        info += `
Qualification: ${c.eligibility?.qualification ?? "Not available"}
Minimum Percentage: ${c.eligibility?.minimumPercentage ?? "Not available"}%
`;
      }

      if (intent === "deadline") {
        info += `
Admission Deadline: ${c.admissionDeadline ? new Date(c.admissionDeadline).toDateString() : "Not announced"}
`;
      }

      return info;
    })
    .join("\n");

  const prompt = `
You are a college admission assistant.

Rules:
- Answer ONLY about "${intent}"
- Use ONLY the data provided
- Do NOT guess
- If the exact data is missing, say:
"Kindly contact the college admission office for the latest updates."

DATA:
${courseData}

User Question:
"${userMessage}"
`;

  return callOpenRouter({
    prompt,
    temperature: 0,
    max_tokens: 150,
  });
};
