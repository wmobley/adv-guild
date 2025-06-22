import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import apiClient from '../services/advGuildApiClient'; // Import apiClient

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to check authentication status
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
    };

    checkAuthStatus(); // Initial check when component mounts

    // Listen for changes in localStorage (e.g., if token is removed by another tab/window)
    window.addEventListener('storage', checkAuthStatus);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  const handleLogout = () => {
    apiClient.logoutUser(); // Clear the token from localStorage
    setIsLoggedIn(false); // Update local state
    navigate('/'); // Redirect to login page
  };

  return (
    <header className="bg-guild-primary text-guild-secondary shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold hover:text-guild-highlight">
          The Adventurer’s Guild
        </Link>

        <nav>
          <ul className="flex space-x-6 text-sm font-semibold">
            <li><Link to="/" className="hover:text-guild-highlight">Home</Link></li>
            <li><Link to={isLoggedIn ? "/my-journey" : "/login"} className="hover:text-guild-highlight">My Journey</Link></li>
            <li><Link to="/public-quests" className="hover:text-guild-highlight">Public Quests</Link></li>
          </ul>
        </nav>
        <div className="space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="inline-block bg-guild-accent py-2 px-4 border border-transparent rounded-md text-xs font-medium text-white hover:bg-opacity-80"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login"
                className="inline-block bg-guild-accent py-2 px-4 border border-transparent rounded-md text-xs font-medium text-white hover:bg-opacity-80"
              >
                Sign in
              </Link>
              <Link to="/create-user"
                className="inline-block bg-guild-secondary py-2 px-4 border border-guild-accent rounded-md text-xs font-medium text-guild-accent hover:bg-opacity-80"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
