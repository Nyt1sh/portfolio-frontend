// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("admin_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from "axios";

// --- AXIOS CLIENT (Authenticated) ---
const api = axios.create({
//   baseURL: "http://localhost:8080",
  baseURL: "https://nyt1sh-portfolio.up.railway.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


// --- FETCH UTILITIES (Unauthenticated/Login) ---
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

export async function apiPut(path, body) {
    const token = localStorage.getItem("admin_token");

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });

    if (res.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
    }

    // Attempt to return JSON if available, otherwise just acknowledge success
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }
    return res.text(); // Returns success message from backend
}