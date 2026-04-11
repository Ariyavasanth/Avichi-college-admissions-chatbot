import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/chatbot`
  : "http://localhost:5000/api/chatbot";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getSettings = async () => {
  const res = await fetch(`${API_URL}/settings`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch chatbot settings");
  return data;
};

export const updateSettings = async (settingsPayload) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(settingsPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update chatbot settings");
  return data;
};

export const getSuggestions = async () => {
  const res = await fetch(`${API_URL}/suggestions`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch suggestions");
  return data;
};

export const createSuggestion = async (text) => {
  const res = await fetch(`${API_URL}/suggestions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create suggestion");
  return data;
};

export const updateSuggestion = async (id, payload) => {
  const res = await fetch(`${API_URL}/suggestions/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update suggestion");
  return data;
};

export const deleteSuggestion = async (id) => {
  const res = await fetch(`${API_URL}/suggestions/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete suggestion");
  return data;
};
