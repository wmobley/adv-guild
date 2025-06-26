// src/services/advGuildApiClient.js
// Update the first line to force HTTPS in production
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  console.log(envUrl)
  if (envUrl) {
    // If we're in production and the URL is HTTP, convert to HTTPS
    if (import.meta.env.PROD && envUrl.startsWith('http://')) {
      return envUrl.replace('http://', 'https://');
    }
    return envUrl;
  }
  
  // Default fallback
  return import.meta.env.PROD ? 'https://api.adv-guild.com/api/v1' : 'http://localhost:8000/api/v1';
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Add debugging
console.log('🔍 Environment check:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_BASE_URL: API_BASE_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  PROD: import.meta.env.PROD,
  windowProtocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A'
});

// Helper to get the auth token (e.g., from localStorage)
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  console.log('🔑 Getting auth token:', token ? `${token.substring(0, 20)}...` : 'null');
  return token;
};

const setAuthToken = (token) => {
  console.log('💾 Setting auth token:', token ? `${token.substring(0, 20)}...` : 'null');
  localStorage.setItem('authToken', token);
};

const removeAuthToken = () => {
  console.log('🗑️ Removing auth token');
  localStorage.removeItem('authToken');
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
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

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 Making API request to: ${fullUrl}`); // This should show HTTPS
  console.log('🔍 Full URL being called:', fullUrl);
  
  console.log('📋 Request config:', {
    method: config.method || 'GET',
    headers: {
      ...headers,
      Authorization: headers.Authorization ? `Bearer ${headers.Authorization.substring(7, 27)}...` : 'none'
    },
    hasBody: !!config.body
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let apiError;
      try {
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        // Try to parse as JSON
        if (responseText) {
          try {
            apiError = JSON.parse(responseText);
          } catch (parseError) {
            console.log('⚠️ Response is not JSON, treating as text');
            apiError = { detail: responseText };
          }
        }
      } catch (e) {
        console.log('⚠️ Could not read response body:', e);
      }
      
      console.error('❌ API Error:', apiError);
      
      const error = new Error(apiError?.detail || `API Request Failed: ${response.status} ${response.statusText}`);
      error.status = response.status;
      error.data = apiError;
      
      // Handle specific error cases
      if (response.status === 401) {
        console.log('🔐 Unauthorized - token may be expired or invalid');
        // Optionally remove invalid token
        // removeAuthToken();
      }
      
      throw error;
    }
    
    if (response.status === 204) { // No Content
        console.log('✅ No content response');
        return null;
    }
    
    const data = await response.json();
    console.log('✅ Response data:', data);
    return data;
  } catch (error) {
    console.error(`❌ API call to ${API_BASE_URL}${endpoint} failed:`, error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

// --- Auth Endpoints ---
export const loginUser = async (credentials) => {
  console.log('🔐 Attempting login for:', credentials.email);
  
  // FastAPI's OAuth2PasswordRequestForm expects 'username' and 'password' in form data
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); // Assuming email is used as username
  formData.append('password', credentials.password);

  const response = await request('/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });

  if (response && response.access_token) {
    setAuthToken(response.access_token);
    console.log('✅ Login successful, token stored');
  }
  return response;
};

export const registerUser = async (userData) => {
  console.log('📝 Attempting registration for:', userData.email);
  
  // userData: { email, password, ...other fields for your UserCreate schema }
  const response = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (response && response.access_token) {
    setAuthToken(response.access_token);
    console.log('✅ Registration successful, token stored');
  }
  return response;
};

export const logoutUser = () => {
  removeAuthToken();
  console.log('👋 User logged out');
};

export const getCurrentUser = async () => {
  console.log('👤 Getting current user');
  return request('/users/me/');
};

// --- Quest Endpoints ---
export const getPublicQuests = async () => {
  console.log('🗺️ Getting public quests');
  const data = await request('/quests/');
  return data;
};

export const getQuestById = async (questId) => {
  console.log('🎯 Getting quest by ID:', questId);
  return request(`/quests/${questId}`);
};

export const createQuest = async (questData) => {
  console.log('✨ Creating new quest');
  return request('/quests/', {
    method: 'POST',
    body: JSON.stringify(questData),
  });
};

// --- Reference Data Endpoints ---
export const getLocations = async () => {
  console.log('📍 Getting locations from backend');
  try {
    const data = await request('/locations/');
    console.log('✅ Locations retrieved:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to get locations:', error);
    
    // If it's an auth error, provide more context
    if (error.status === 401) {
      console.log('🔍 Auth token status:', {
        hasToken: !!getAuthToken(),
        tokenPreview: getAuthToken() ? `${getAuthToken().substring(0, 20)}...` : 'none'
      });
    }
    
    throw error;
  }
};

// Alternative function to get locations without authentication
export const getLocationsPublic = async () => {
  console.log('📍 Getting public locations (no auth)');
  try {
    // Try without authentication first
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch(`${API_BASE_URL}/locations/`, {
      method: 'GET',
      headers
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Public locations retrieved:', data);
      return data;
    } else {
      console.log('❌ Public locations failed, falling back to authenticated request');
      return getLocations(); // Fall back to authenticated request
    }
  } catch (error) {
    console.error('❌ Public locations request failed:', error);
    throw error;
  }
};

export const createLocation = async (locationData) => {
  console.log('✨ Creating new location');
  return request('/locations/', {
    method: 'POST',
    body: JSON.stringify(locationData),
  });
};

export const getDifficulties = async () => {
  console.log('⚡ Getting difficulties');
  const data = await request('/reference/difficulties');
  return data;
};

export const getInterests = async () => {
  console.log('🎯 Getting interests');
  const data = await request('/reference/interests');
  return data;
};

// --- Saved/Bookmarked Quests ---
export const getSavedQuests = async () => {
  console.log('💾 Getting saved quests');
  const data = await request('/users/me/bookmarks');
  return data || [];
};

// --- Debug Functions ---
export const debugAuth = () => {
  const token = getAuthToken();
  console.log('🔍 Auth Debug Info:', {
    hasToken: !!token,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 30)}...` : 'none',
    tokenExpiry: token ? parseJWT(token) : 'no token'
  });
};

// Helper to parse JWT token (for debugging)
const parseJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    return {
      ...payload,
      exp: payload.exp ? new Date(payload.exp * 1000) : 'no expiry',
      iat: payload.iat ? new Date(payload.iat * 1000) : 'no issued at',
      isExpired: payload.exp ? Date.now() >= (payload.exp * 1000) : 'unknown'
    };
  } catch (e) {
    return 'invalid token format';
  }
};

const updateQuest = async (questId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}/`, {
      method: 'PUT', // or 'PATCH' depending on your API
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating quest:', error);
    throw error;
  }
};

export const getOwnedQuests = async () => {
  console.log('👑 Getting owned quests');
  const data = await request('/users/me/quests');
  return data || [];
};

const apiClient = { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser, 
  getPublicQuests, 
  getQuestById, 
  createQuest, 
  getSavedQuests, 
  getLocations, 
  getLocationsPublic,
  createLocation, 
  getDifficulties, 
  getInterests,
  debugAuth,
  getOwnedQuests,
  updateQuest
};

export default apiClient;