const API_URL = "https://avichi-college-admissions-chatbot.onrender.com/api/institution";

const getToken = () => localStorage.getItem("adminToken");

// GET institution details - No auth needed for public, but admin needs it for management
export const getInstitution = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch institution details");
  }
  return await res.json();
};

// SAVE/UPDATE institution details - POST with auth
export const saveInstitution = async (data) => {
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
    throw new Error(err.message || "Failed to save details");
  }
  return await res.json();
};
