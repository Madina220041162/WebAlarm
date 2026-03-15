// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createAlarmSound } from "../utils/alarmSound";
import io from "socket.io-client";

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;
const ACTIVE_ALARM_STORAGE_KEY = "active-alarm-runtime";

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
  const [alarmAudioReady, setAlarmAudioReady] = useState(true);
  const globalAudioRef = useRef(null);

  const startGlobalAlarm = async (alarmData) => {
    if (!alarmData) return;

    const incomingId = alarmData.id || alarmData._id;
    const currentId = activeAlarmData?.id || activeAlarmData?._id;

    // Avoid restarting the same active alarm repeatedly (e.g. socket reconnect)
    if (globalAudioRef.current && incomingId && currentId && incomingId === currentId) {
      return;
    }

    if (globalAudioRef.current) {
      globalAudioRef.current.stop();
    }

    const audio = createAlarmSound(alarmData.sound || "rooster");
    const didPlay = await audio.start(true); // loop indefinitely

    globalAudioRef.current = audio;
    setActiveAlarmData(alarmData);
    setAlarmAudioReady(Boolean(didPlay));
    localStorage.setItem(ACTIVE_ALARM_STORAGE_KEY, JSON.stringify(alarmData));

    console.log("🔊 Global Alarm Started:", alarmData.label);
  };

  const stopGlobalAlarm = () => {
    if (globalAudioRef.current) {
      globalAudioRef.current.stop();
      globalAudioRef.current = null;
    }
    setActiveAlarmData(null);
    setAlarmAudioReady(true);
    localStorage.removeItem(ACTIVE_ALARM_STORAGE_KEY);
    console.log("🔇 Global Alarm Stopped.");
  };

  const resumeGlobalAlarmAudio = async () => {
    if (!globalAudioRef.current) return false;
    const didPlay = await globalAudioRef.current.start(true);
    setAlarmAudioReady(Boolean(didPlay));
    return Boolean(didPlay);
  };

  // Restore active alarm after page reloads
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_ALARM_STORAGE_KEY);
      if (!raw) return;

      const restoredAlarm = JSON.parse(raw);
      if (!restoredAlarm) return;

      console.log("♻️ Restoring active alarm after reload:", restoredAlarm.label);
      startGlobalAlarm(restoredAlarm);
    } catch (error) {
      console.warn("Failed to restore active alarm from storage:", error);
      localStorage.removeItem(ACTIVE_ALARM_STORAGE_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If autoplay is blocked after reload, retry as soon as user interacts.
  useEffect(() => {
    if (!activeAlarmData || alarmAudioReady) return;

    const retryPlayback = () => {
      resumeGlobalAlarmAudio();
    };

    window.addEventListener("pointerdown", retryPlayback);
    window.addEventListener("keydown", retryPlayback);

    return () => {
      window.removeEventListener("pointerdown", retryPlayback);
      window.removeEventListener("keydown", retryPlayback);
    };
  }, [activeAlarmData, alarmAudioReady]);

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
        resumeGlobalAlarmAudio,
        activeAlarmData,
        alarmAudioReady,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);