import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/advGuildApiClient';
import Header from '../components/Header';
const CreateUserPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.registerUser({
        email,
        password,
        display_name: displayName,
      });
      navigate('/my-journey'); // Registration returns a token, so we can log in immediately
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
      console.error("Create user error:", err);
    }
    setLoading(false);
  };

  return (
    <>
    <Header/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-guild-secondary to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-2 border-guild-highlight/20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-guild-primary">Join the Adventurer's Guild</h2>
          <p className="mt-2 text-center text-sm text-guild-neutral">
            Begin your legendary journey by creating your guild account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-guild-text mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How you'll be known in the Guild"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-guild-neutral/30 placeholder-guild-neutral text-guild-text focus:outline-none focus:ring-2 focus:ring-guild-highlight focus:border-guild-highlight sm:text-sm bg-white transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-guild-text mb-1">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email address" 
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
                placeholder="Create a password" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-3 border-2 border-guild-neutral/30 placeholder-guild-neutral text-guild-text focus:outline-none focus:ring-2 focus:ring-guild-highlight focus:border-guild-highlight sm:text-sm bg-white transition-colors" 
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-guild-text mb-1">
                Confirm Password
              </label>
              <input 
                id="confirmPassword"
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Confirm your password" 
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
                Creating Account...
              </span>
            ) : (
              'Join the Guild'
            )}
          </button>
        </form>
        <div className="text-center">
          <p className="text-sm text-guild-neutral">
            Already a guild member?{' '}
            <Link 
              to="/login" 
              className="font-medium text-guild-accent hover:text-guild-primary transition-colors underline decoration-guild-highlight/50 hover:decoration-guild-primary"
            >
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default CreateUserPage;