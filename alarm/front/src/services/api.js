const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const options = {
    method,
    headers: getAuthHeaders(),
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Authentication required");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Notes API
export const notesAPI = {
  getAll: () => apiCall("/notes"),
  create: (data) => apiCall("/notes", "POST", data),
  update: (id, data) => apiCall(`/notes/${id}`, "PUT", data),
  delete: (id) => apiCall(`/notes/${id}`, "DELETE"),
};

// Alarms API
export const alarmsAPI = {
  getAll: () => apiCall("/alarms"),
  create: (data) => apiCall("/alarms", "POST", data),
  update: (id, data) => apiCall(`/alarms/${id}`, "PUT", data),
  delete: (id) => apiCall(`/alarms/${id}`, "DELETE"),
  toggle: (id) => apiCall(`/alarms/${id}/toggle`, "PUT"),
};

// Alias for backward compatibility
export const alarmAPI = alarmsAPI;

// Files API
export const filesAPI = {
  getAll: () => apiCall("/files"),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = getAuthToken();
    return fetch(`${API_URL}/files`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          throw new Error("Authentication required");
        }
        if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
        return res.json();
      });
  },
  getFile: (fileId) => apiCall(`/files/${fileId}`),
  delete: (fileId) => apiCall(`/files/${fileId}`, "DELETE"),
};

// Calendar API
export const calendarAPI = {
  getAll: () => apiCall("/calendar"),
  create: (data) => apiCall("/calendar", "POST", data),
  getEvent: (id) => apiCall(`/calendar/${id}`),
  update: (id, data) => apiCall(`/calendar/${id}`, "PUT", data),
  delete: (id) => apiCall(`/calendar/${id}`, "DELETE"),
  getByDateRange: (startDate, endDate) => {
    const start = typeof startDate === "string" ? startDate : startDate.toISOString();
    const end = typeof endDate === "string" ? endDate : endDate.toISOString();
    return apiCall(`/calendar/range?startDate=${start}&endDate=${end}`);
  },
};

// Game Scores API
export const gameScoresAPI = {
  getAll: () => apiCall("/game-scores"),
  getByGame: (gameType) => apiCall(`/game-scores/${gameType}`),
  getUserScores: (gameType) => apiCall(`/game-scores/user/${gameType}`),
  getUserBestScore: (gameType) => apiCall(`/game-scores/user/${gameType}/best`),
  getLeaderboard: (gameType, limit = 10) =>
    apiCall(`/game-scores/${gameType}/leaderboard?limit=${limit}`),
  save: (gameType, data) => apiCall(`/game-scores/${gameType}`, "POST", data),
  delete: (scoreId) => apiCall(`/game-scores/${scoreId}`, "DELETE"),
};

// Alias for backward compatibility
export const gamesAPI = {
  getScores: () => gameScoresAPI.getAll(),
  saveScore: (data) => apiCall("/game-scores", "POST", data),
};

// Settings API
export const settingsAPI = {
  get: () => apiCall("/settings"),
  update: (data) => apiCall("/settings", "PUT", data),
};

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiCall("/auth/login", "POST", { email, password }),
  register: (email, password, username) =>
    apiCall("/auth/register", "POST", { email, password, username }),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export { getAuthToken };
