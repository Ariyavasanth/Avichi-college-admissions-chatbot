const API_URL = "http://localhost:3000/api/admin/courses";

// GET all courses
export const getCourses = async () => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return await res.json();
};

// CREATE course
export const createCourse = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create course");
  }

  return await res.json();
};