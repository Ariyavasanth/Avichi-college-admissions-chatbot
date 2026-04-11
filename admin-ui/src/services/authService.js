const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/admin/auth`
  : "http://localhost:5000/api/admin/auth";

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

export const updateProfile = async (name, email, oldPassword, newPassword) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, oldPassword, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};

export const getToken = () => localStorage.getItem("adminToken");

export const isAuthenticated = () => Boolean(getToken());
