import axios from "axios";

const api = axios.create({
  // Use same-origin path so the browser doesn't perform a cross-origin XHR.
  // Next.js will proxy requests to the real API via rewrites.
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      config.headers = config.headers ?? {};
      if (token) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
