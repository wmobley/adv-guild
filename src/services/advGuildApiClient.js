import tokenService from './tokenService';

// Adjusted to match the URL from your error log.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * A generic request handler for the API.
 * It automatically adds the Authorization header for authenticated requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/quests').
 * @param {RequestInit} options - The options for the fetch call.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the API response is not ok.
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = tokenService.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `API Error: ${response.status} ${response.statusText}` 
      }));
      
      const error = new Error(errorData.message || 'An unknown API error occurred');
      error.detail = errorData.detail;
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

const apiClient = {
  // --- Auth ---
  loginUser: async (credentials) => {
    // Convert to form data for OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', credentials.email || credentials.username);
    formData.append('password', credentials.password);
    
    const data = await request('/auth/login/', { 
      method: 'POST', 
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    if (data.access_token) tokenService.setToken(data.access_token);
    return data;
  },

  registerUser: async (userData) => {
    const data = await request('/users/', { method: 'POST', body: JSON.stringify(userData) });
    if (data.access_token) tokenService.setToken(data.access_token);
    return data;
  },

  logoutUser: () => {
    tokenService.removeToken();
  },

  getCurrentUser: () => request('/users/me/'),

  // --- Quests ---
  getPublicQuests: () => request('/quests/?is_public=true'),
  getQuestById: (questId) => request(`/quests/${questId}/`),
  getSavedQuests: () => request('/quests/bookmarked/'),
  getOwnedQuests: () => request('/users/me/quests/'),
  createQuest: (questData) => request('/quests/', { method: 'POST', body: JSON.stringify(questData) }),
  updateQuest: (questId, questData) => request(`/quests/${questId}/`, { method: 'PATCH', body: JSON.stringify(questData) }),
  deleteQuest: (questId) => request(`/quests/${questId}/`, { method: 'DELETE' }),

  // --- Reference Data ---
  getDifficulties: () => request('/reference/difficulties'),
  getInterests: () => request('/reference/interests'),
  getQuestTypes: () => request('/quest-types/'),

  // --- Locations ---
  getLocations: () => request('/locations/'),
  getLocationsPublic: () => request('/locations/public/'),
  createLocation: (locationData) => request('/locations/', { method: 'POST', body: JSON.stringify(locationData) }),
};

export default apiClient;