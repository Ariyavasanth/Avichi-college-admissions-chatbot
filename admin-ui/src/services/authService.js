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

export const changePassword = async (newPassword) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to change password");
  }

  return data;
};

export const initialSetup = async (newEmail, newPassword) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/initial-setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail, newPassword }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to complete initial setup");
  }

  return data;
};

export const requestEmailChange = async (newEmail) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/request-email-change`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newEmail }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to request email change");
  }

  return data;
};

export const confirmEmailChange = async (token) => {
  const res = await fetch(`${API_URL}/confirm-email-change?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to confirm email change");
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};

export const getToken = () => localStorage.getItem("adminToken");

export const isAuthenticated = () => Boolean(getToken());
