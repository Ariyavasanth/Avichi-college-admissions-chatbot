const API_URL = "https://avichi-college-admissions-chatbot.onrender.com/api/admin/auth";

export const loginAdmin = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // { success, token, admin }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};

export const getToken = () => localStorage.getItem("adminToken");

export const isAuthenticated = () => Boolean(getToken());
