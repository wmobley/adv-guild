// Force HTTPS in production, HTTP in development
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  // Check if we're in production (deployed) or if page is loaded over HTTPS
  if (import.meta.env.PROD || (typeof window !== 'undefined' && window.location.protocol === 'https:')) {
    return 'api.adv-guild.com'
  }
  
  // Development default
  return 'http://localhost:8000'
}

export const API_BASE_URL = getApiBaseUrl()

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