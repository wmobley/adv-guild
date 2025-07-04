import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import apiClient from '../services/advGuildApiClient';
import tokenService from '../services/tokenService';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(tokenService.hasToken());

  useEffect(() => {
    // Function to check authentication status
    const checkAuthStatus = () => {
      setIsLoggedIn(tokenService.hasToken());
    };

    // The 'storage' event is dispatched by tokenService on set/remove
    window.addEventListener('storage', checkAuthStatus);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    apiClient.logoutUser(); // This calls tokenService.removeToken(), which triggers the 'storage' event listener.
    navigate('/'); // Redirect to login page
  };

  return (
    <header className="bg-guild-primary text-guild-secondary shadow-lg sticky top-0 z-[9999]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold hover:text-guild-highlight">
          The Adventurer's Guild
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
