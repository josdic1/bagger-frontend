// src/providers/AuthProvider.jsx
import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api, retryRequest } from "../utils/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await retryRequest(() => api.get("/api/users/me"));
        setUser(userData);
      } catch (err) {
        console.error("Session check failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await api.post("/api/users/login", credentials);

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: "Invalid response from server" };
    } catch (err) {
      console.error("Login failed", err);
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      await api.post("/api/users/", userData);
      return await login({
        email: userData.email,
        password: userData.password,
      });
    } catch (err) {
      console.error("Signup failed", err);
      return {
        success: false,
        error: err.message || "Signup failed. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(
    () => ({ user, setUser, loading, login, signup, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
