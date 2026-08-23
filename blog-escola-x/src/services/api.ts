import axios from "axios";

const api = axios.create({
  // Em dev o Vite faz proxy de /api → http://localhost:3000 (sem CORS).
  // Em produção, define VITE_API_URL com a URL completa do backend.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
    }
    return Promise.reject(error);
  },
);

export default api;