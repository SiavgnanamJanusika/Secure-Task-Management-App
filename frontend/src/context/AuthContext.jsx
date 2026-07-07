import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, fetchCurrentUser } from "../api/authApi.js";

const AuthContext = createContext(null);

const normalizeUser = (user) =>
  user ? { ...user, role: String(user.role || "").trim().toLowerCase() } : user;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((data) => setUser(normalizeUser(data)))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    setUser(normalizeUser(data.user));
    return data.user;
  };

  const register = async ({ email, password, full_name }) => {
    return registerRequest({ email, password, full_name });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
