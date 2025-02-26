import axios from "axios";

const api = axios.create({
  baseURL: "https://api-gateway-kxzj.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  }
);

export const login = (credentials) => api.post("/auth/login", credentials);
export const signup = (userData) => api.post("/auth/signup", userData);
export const getStreams = () => api.get("/streams");
export const startStream = (title, token) =>
  api.post(
    "/streams/start-stream",
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export default api;
