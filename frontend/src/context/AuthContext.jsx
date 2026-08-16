import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, getCurrentUser } from '../api/auth';

/**
 * AuthContext - Manages user authentication state and provides login/logout functions.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider component - Wraps the app and provides authentication context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to wrap
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('portfolio_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('portfolio_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  /**
   * Login function - authenticates user and stores token.
   *
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>} Result of login attempt
   */
  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      localStorage.setItem('portfolio_token', data.access_token);
      setToken(data.access_token);
      const userData = await getCurrentUser(data.access_token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  };

  /**
   * Logout function - clears token and user state.
   */
  const logout = () => {
    localStorage.removeItem('portfolio_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 *
 * @returns {Object} Auth context values
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};