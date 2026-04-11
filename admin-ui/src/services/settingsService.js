import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/admin/settings`
  : "http://localhost:5000/api/admin/settings";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data;
};

export const updateSecurity = async (securityData) => {
  const res = await fetch(`${API_URL}/security`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(securityData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update security settings");
  return data;
};

export const updateSystemSettings = async (systemData) => {
  const res = await fetch(`${API_URL}/system`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(systemData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update system settings");
  return data;
};

export const updateNotificationSettings = async (notificationData) => {
  const res = await fetch(`${API_URL}/notifications`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(notificationData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update notification settings");
  return data;
};
