const TOKEN_KEY = 'authToken';
const TOKEN_EXPIRY_KEY = 'authTokenExpiry';
const TOKEN_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const tokenService = {
  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }
    
    // Check if token has expired
    if (Date.now() > parseInt(expiry)) {
      console.log('🕐 Token has expired, removing...');
      tokenService.removeToken();
      return null;
    }
    
    return token;
  },

  setToken: (token) => {
    if (token) {
      const expiryTime = Date.now() + TOKEN_DURATION;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      console.log('🔐 Token stored with expiry:', new Date(expiryTime).toLocaleString());
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
    // Dispatch a storage event to notify other tabs/windows of the change.
    // This is useful for components like Header that react to login/logout.
    window.dispatchEvent(new Event('storage'));
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    window.dispatchEvent(new Event('storage'));
  },

  hasToken: () => {
    const token = tokenService.getToken(); // This will check expiry automatically
    return !!token;
  },

  getTokenExpiry: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? new Date(parseInt(expiry)) : null;
  },

  getTimeUntilExpiry: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    
    const timeLeft = parseInt(expiry) - Date.now();
    return Math.max(0, timeLeft);
  },

  isTokenExpiringSoon: (warningMinutes = 5) => {
    const timeLeft = tokenService.getTimeUntilExpiry();
    const warningTime = warningMinutes * 60 * 1000; // Convert to milliseconds
    return timeLeft > 0 && timeLeft <= warningTime;
  },

  // Method to refresh/extend token expiry (if your API supports token refresh)
  refreshTokenExpiry: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const newExpiryTime = Date.now() + TOKEN_DURATION;
      localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiryTime.toString());
      console.log('🔄 Token expiry refreshed:', new Date(newExpiryTime).toLocaleString());
      window.dispatchEvent(new Event('storage'));
    }
  }
};

export default tokenService;