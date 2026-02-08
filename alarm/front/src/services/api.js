const API_URL = "http://localhost:5000/api";

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

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Specific API calls
export const notesAPI = {
  getAll: () => apiCall("/notes"),
  create: (data) => apiCall("/notes", "POST", data),
  update: (id, data) => apiCall(`/notes/${id}`, "PUT", data),
  delete: (id) => apiCall(`/notes/${id}`, "DELETE"),
};

export const alarmAPI = {
  getAll: () => apiCall("/alarms"),
  create: (data) => apiCall("/alarms", "POST", data),
  update: (id, data) => apiCall(`/alarms/${id}`, "PUT", data),
  delete: (id) => apiCall(`/alarms/${id}`, "DELETE"),
};

export const filesAPI = {
  getAll: () => apiCall("/files"),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("authToken");
    return fetch(`${API_URL}/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => res.json());
  },
  delete: (id) => apiCall(`/files/${id}`, "DELETE"),
};

export const gamesAPI = {
  getScores: () => apiCall("/game-scores"),
  saveScore: (data) => apiCall("/game-scores", "POST", data),
};
