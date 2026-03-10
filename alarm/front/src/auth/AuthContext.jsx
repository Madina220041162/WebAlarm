import { createContext, useContext, useState, useEffect } from "react";
import { signInWithGooglePopup } from "../config/firebase";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    const guestMode = localStorage.getItem("guestMode") === "true";

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsGuest(false);
    } else if (guestMode) {
      setIsGuest(true);
    }

    setLoading(false);
  }, []);

  const setLoggedInState = (token, nextUser) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.removeItem("guestMode");
    setUser(nextUser);
    setIsGuest(false);
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const { token, user: nextUser } = data;
      setLoggedInState(token, nextUser);

      return { success: true, user: nextUser };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { idToken } = await signInWithGooglePopup();
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Google login failed");
      }

      const data = await response.json();
      const { token, user: nextUser } = data;
      setLoggedInState(token, nextUser);

      return { success: true, user: nextUser };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      const { token, user: nextUser } = data;
      setLoggedInState(token, nextUser);

      return { success: true, user: nextUser };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const enterGuestMode = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.setItem("guestMode", "true");
    setUser(null);
    setIsGuest(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("guestMode");
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoggedIn: Boolean(user),
        canManageAlarms: Boolean(user),
        login,
        loginWithGoogle,
        register,
        enterGuestMode,
        logout,
        setLoggedInState,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


