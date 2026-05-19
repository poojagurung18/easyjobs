"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { authService } from "@/lib/api/auth";

const AuthContext = createContext();

let listeners = [];

const subscribe = (listener) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(() => authService.getCurrentUser(), []);
  const getServerUser = useCallback(() => null, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });

    if (response.token) {
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role,
      };

      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
      notifyListeners();
    }

    return response;
  };

  const verifyOtp = async (email, otp) => {
    const response = await authService.verifyOtp({ email, otp });

    if (response.token) {
      const userData = {
        userId: response.userId,
        email: response.email,
        role: response.role,
      };

      localStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
      notifyListeners();
    }

    return response;
  };

  const register = async (name, email, password, role) => {
    return await authService.register({ name, email, password, role });
  };

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        verifyOtp,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
