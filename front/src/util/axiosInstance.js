import axios from "axios";
import  store  from "../redux/store"; // Your Redux store
import { logout } from "../redux/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

// Add a request interceptor to refresh token if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

     
      try {
        // Call refreshToken API
        const refreshTokenValue = localStorage.getItem("refreshToken");

        if (!refreshTokenValue) {
          store.dispatch(logout());
          return Promise.reject(error);
        }
        const response = await axios.post("http://localhost:5000/api/auth/refresh", {
          token: refreshTokenValue,
        });

        // Update new token in Redux and localStorage
        localStorage.setItem("accessToken", response.data.accessToken);

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
