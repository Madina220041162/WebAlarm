// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createAlarmSound } from "../utils/alarmSound";
import io from "socket.io-client";

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;

export function AuthProvider({ children }) {
  // ---------------- USER STATE ----------------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------- THEME STATE ----------------
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  const [explosionMode, setExplosionMode] = useState(false);

  // ---------------- GLOBAL ALARM ----------------
  const [activeAlarmData, setActiveAlarmData] = useState(null);
  const globalAudioRef = useRef(null);

  const startGlobalAlarm = (alarmData) => {
    if (globalAudioRef.current) {
      globalAudioRef.current.stop();
    }

    const audio = createAlarmSound(alarmData.sound || "rooster");
    audio.start(true); // loop indefinitely

    globalAudioRef.current = audio;
    setActiveAlarmData(alarmData);

    console.log("🔊 Global Alarm Started:", alarmData.label);
  };

  const stopGlobalAlarm = () => {
    if (globalAudioRef.current) {
      globalAudioRef.current.stop();
      globalAudioRef.current = null;
    }
    setActiveAlarmData(null);
    console.log("🔇 Global Alarm Stopped.");
  };

  // ---------------- GLOBAL SOCKET ----------------
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Global socket connected");
    });

    socketRef.current.on("alarmTriggered", (data) => {
      console.log("🚨 Alarm Triggered:", data);
      startGlobalAlarm(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ---------------- THEME ENGINE ----------------
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    root.style.colorScheme = theme;

    localStorage.setItem("theme", theme);

    console.log(`🌓 Theme switched to: ${theme.toUpperCase()}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ---------------- ALARM EVENT LISTENER ----------------
  useEffect(() => {
    const handleVictoryEvent = () => {
      console.log("🏆 Victory detected! Silencing global alarm...");
      stopGlobalAlarm();
    };

    window.addEventListener("proof-verification-updated", handleVictoryEvent);

    return () => {
      window.removeEventListener("proof-verification-updated", handleVictoryEvent);
    };
  }, []);

  // ---------------- AUTH INITIALIZATION ----------------
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    setLoading(false);
  }, []);

  // ---------------- REGISTER ----------------
  const register = async (username, email, password) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ---------------- LOGIN ----------------
  const login = async (username, password) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    stopGlobalAlarm();

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ---------------- CONTEXT PROVIDER ----------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        theme,
        toggleTheme,
        explosionMode,
        setExplosionMode,
        startGlobalAlarm,
        stopGlobalAlarm,
        activeAlarmData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);