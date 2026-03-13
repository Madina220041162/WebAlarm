const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiCall = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("authToken");
  
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Handle empty responses to prevent "Unexpected end of JSON"
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// --- Specific API Modules ---

export const notesAPI = {
  getAll: () => apiCall("/api/notes"),
  create: (data) => apiCall("/api/notes", "POST", data),
  update: (id, data) => apiCall(`/api/notes/${id}`, "PUT", data),
  delete: (id) => apiCall(`/api/notes/${id}`, "DELETE"),
};

export const alarmAPI = {
  getAll: () => apiCall("/api/alarms"),
  create: (data) => apiCall("/api/alarms", "POST", data),
  update: (id, data) => apiCall(`/api/alarms/${id}`, "PUT", data),
  delete: (id) => apiCall(`/api/alarms/${id}`, "DELETE"),
  clearPast: () => apiCall("/api/alarms/history/past", "DELETE"),
  toggle: (id) => apiCall(`/api/alarms/${id}/toggle`, "POST"),
  
  /**
   * MISSION CRITICAL: Dismissal
   * This is the call that stops the alarm after a game/scan
   */
  dismiss: (alarmId, challengeType) => 
    apiCall("/api/alarms/dismiss", "POST", { 
      alarmId, 
      challengeType, 
      success: true 
    }),
};

export const filesAPI = {
  getAll: () => apiCall("/api/files"),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("authToken");
    
    return fetch(`${API_URL}/api/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data;
    });
  },
  delete: (id) => apiCall(`/api/files/${id}`, "DELETE"),
};

export const gamesAPI = {
  getScores: () => apiCall("/api/game-scores"),
  saveScore: (data) => apiCall("/api/game-scores", "POST", data),
};