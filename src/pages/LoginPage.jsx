import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/advGuildApiClient';
import tokenService from '../services/tokenService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenWarning, setTokenWarning] = useState('');
  const navigate = useNavigate();

  // Check if user is already logged in and redirect
  useEffect(() => {
    if (tokenService.hasToken()) {
      navigate('/my-journey');
    }
  }, [navigate]);

  // Set up token expiry monitoring
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (tokenService.hasToken()) {
        if (tokenService.isTokenExpiringSoon()) {
          const timeLeft = tokenService.getTimeUntilExpiry();
          const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
          setTokenWarning(`Your session will expire in ${minutesLeft} minute(s). Please save your work.`);
        } else {
          setTokenWarning('');
        }
      } else {
        setTokenWarning('');
      }
    };

    // Check immediately
    checkTokenExpiry();

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);

    // Listen for storage events (token changes)
    const handleStorageChange = () => {
      checkTokenExpiry();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTokenWarning('');
    
    try {
      await apiClient.loginUser({ email, password });
      console.log('✅ Login successful, redirecting...');
      navigate('/my-journey'); // Navigate to discovery page after login
    } catch (err) {
      setError(err.message || 'Failed to login. Check your credentials.');
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-guild-secondary to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-2 border-guild-highlight/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-guild-primary">Sign in to your Guild Account</h2>
          <p className="mt-2 text-center text-sm text-guild-neutral">
            Enter the guild hall and begin your legendary journey
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Token expiry warning */}
          {tokenWarning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md text-sm text-center">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {tokenWarning}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-guild-text mb-1">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-guild-neutral/30 placeholder-guild-neutral text-guild-text focus:outline-none focus:ring-2 focus:ring-guild-highlight focus:border-guild-highlight sm:text-sm bg-white transition-colors" 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-guild-text mb-1">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-guild-neutral/30 placeholder-guild-neutral text-guild-text focus:outline-none focus:ring-2 focus:ring-guild-highlight focus:border-guild-highlight sm:text-sm bg-white transition-colors" 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-guild-accent hover:bg-guild-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guild-highlight disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Enter the Guild Hall'
            )}
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-guild-neutral">
            Not yet a guild member?{' '}
            <Link 
              to="/create-user" 
              className="font-medium text-guild-accent hover:text-guild-primary transition-colors underline decoration-guild-highlight/50 hover:decoration-guild-primary"
            >
              Join the Guild
            </Link>
          </p>
        </div>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && tokenService.hasToken() && (
          <div className="text-xs text-gray-500 text-center mt-4">
            <p>Token expires: {tokenService.getTokenExpiry()?.toLocaleString()}</p>
            <p>Time left: {Math.ceil(tokenService.getTimeUntilExpiry() / (60 * 1000))} minutes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;