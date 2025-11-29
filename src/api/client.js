// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://nyt1sh-portfolio.up.railway.app";

export async function apiPost(path, body, token) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  return res.json();
}
