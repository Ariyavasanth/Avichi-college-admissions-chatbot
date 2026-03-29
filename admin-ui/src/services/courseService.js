const API_URL = "http://localhost:3000/api/admin/courses";

const getToken = () => localStorage.getItem("adminToken");

// GET all courses - No auth needed
export const getCourses = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch courses");
  }
  return await res.json();
};

// CREATE course - POST with auth
export const createCourse = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create course");
  }
  return await res.json();
};

// UPDATE course - PUT with auth
export const updateCourse = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update course");
  }
  return await res.json();
};

// DELETE course - DELETE with auth
export const deleteCourse = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Request failed");
  }
  return await res.json();
};