import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
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

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Emitir evento para que o AuthProvider limpe o estado React
      // e o ProtectedRoute redirecione para /login.
      // Evita manipular localStorage diretamente aqui (responsabilidade do AuthProvider).
      window.dispatchEvent(new CustomEvent("session:expired"));
    }
    return Promise.reject(error);
  },
);

export default api;