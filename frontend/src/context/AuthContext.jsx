import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("nexthire_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nexthire_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("nexthire_token");
        localStorage.removeItem("nexthire_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("nexthire_token", data.token);
    localStorage.setItem("nexthire_user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    persistSession(res.data.data);
    return res.data.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    persistSession(res.data.data);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem("nexthire_token");
    localStorage.removeItem("nexthire_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
