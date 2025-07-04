import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tokenService from '../services/tokenService';

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(tokenService.hasToken());

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(tokenService.hasToken());
    };

    // The 'storage' event is dispatched by tokenService on set/remove
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  return (
    <section className="text-center py-20">
      <h1 className="text-6xl font-bold text-guild-primary mb-4">Welcome to the Adventurer's Guild</h1>
      <p className="text-xl text-guild-text max-w-2xl mx-auto mb-8">
        This is your guild hall for legendary travel. Explore the real-world roots of fantasy, myth, and magic.
      </p>
      {!isLoggedIn && (
        <Link
          to="/login"
          className="bg-guild-accent hover:bg-guild-primary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300"
        >
          Login & Begin Your Quest
        </Link>
      )}
    </section>
  );
};

export default Hero;
