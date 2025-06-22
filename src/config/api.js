export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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