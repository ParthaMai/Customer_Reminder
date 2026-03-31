import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://192.168.1.8:4000"
  baseURL: "https://customer-reminder-backend.onrender.com"
});

// 🔥 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response && error.response.status === 401) {
      
      // ❌ Token expired or invalid
      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      // 🔥 Redirect
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;