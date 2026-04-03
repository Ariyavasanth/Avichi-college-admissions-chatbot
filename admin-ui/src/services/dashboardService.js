const API_URL = "https://avichi-college-admissions-chatbot.onrender.com/api/admin/dashboard";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export const getDashboardStats = async () => {
  const res = await fetch(`${API_URL}/stats`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch dashboard stats");
  }
  return res.json();
};
