const API_URL = import.meta.env.VITE_API_URL;

export const sendChatMessage = async (message, history) => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch response");
  }

  return res.json();
};

