// Automatically use HTTPS in production, HTTP in development
const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return 'https://35.225.179.98'
  }
  return 'http://localhost:8000'
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl()

// Optional: Create a helper function for making API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  const response = await fetch(url, { ...defaultOptions, ...options })
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }
  
  return response.json()
}