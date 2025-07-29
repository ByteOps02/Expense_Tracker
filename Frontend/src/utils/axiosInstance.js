import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:5000/api", // fallback if BASE_URL is undefined
  timeout: 10000,
  headers: {
    Accept: "application/json",
    // Do not set Content-Type here!
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        // Use window.location for navigation in interceptors since we don't have access to navigate
        // This ensures the redirect happens even if the component is unmounted
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      } else if (error.response.status === 403) {
        console.error("Access denied. You don't have permission to perform this action.");
      } else if (error.response.status === 404) {
        console.error("Resource not found.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else if (error.message === "Network Error") {
      console.error("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
