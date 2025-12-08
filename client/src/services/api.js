const API_BASE_URL = "https://cs409-wellness-warriors.onrender.com/api";

async function request(path, { method = "GET", body, userId } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (userId) {
    headers["x-user-id"] = userId;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore JSON parse issues
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const habitApi = {
  async list(userId) {
    const data = await request("/habits", { userId });
    return data.habits;
  },
  async create(userId, payload) {
    const data = await request("/habits", {
      method: "POST",
      body: payload,
      userId,
    });
    return data.habit;
  },
  async update(userId, habitId, payload) {
    const data = await request(`/habits/${habitId}`, {
      method: "PUT",
      body: payload,
      userId,
    });
    return data.habit;
  },
  async logCompletion(userId, habitId, date) {
    const data = await request(`/habits/${habitId}/completions`, {
      method: "POST",
      body: { date },
      userId,
    });
    return data.habit;
  },
  async removeCompletion(userId, habitId, completionId) {
    const data = await request(
      `/habits/${habitId}/completions/${completionId}`,
      {
        method: "DELETE",
        userId,
      }
    );
    return data.habit;
  },
};

export const progressApi = {
  async overview(userId) {
    const data = await request("/progress/overview", { userId });
    return data.summary;
  },
  async calendar(userId, params) {
    const query = new URLSearchParams(params || {}).toString();
    const data = await request(`/progress/calendar?${query}`, { userId });
    return data;
  },
};

export function getApiBaseUrl() {
  return API_BASE_URL;
}
