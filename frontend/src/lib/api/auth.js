import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// No need for a request interceptor to attach the JWT token as we are using cookies
// with withCredentials: true

export const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    const responseData = response.data;
    
    // Token is now handled by HttpOnly cookies automatically
    if (responseData.token) {
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          userId: responseData.userId,
          email: responseData.email,
          role: responseData.role,
        }),
      );
    }
    return responseData;
  },

  verifyOtp: async (data) => {
    const response = await api.post("/auth/verify-otp", data);
    const responseData = response.data;
    
    // Upon successful OTP verification, token is set in cookies by the server
    if (responseData.token) {
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          userId: responseData.userId,
          email: responseData.email,
          role: responseData.role,
        }),
      );
    }
    return responseData;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("user_data");
  },

  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("user_data");
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    // We check for user_data since auth_token is now a HttpOnly cookie
    return !!localStorage.getItem("user_data");
  },
};

export default api;
