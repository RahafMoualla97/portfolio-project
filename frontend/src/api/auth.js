// Authentication API calls - Login and user session management

import axios from 'axios';

// Base URL from environment or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Axios instance with form-urlencoded content type for login
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

/**
 * Login user and retrieve JWT access token.
 *
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<{access_token: string, token_type: string}>} Token response
 */
export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/api/auth/login', formData);
  return response.data;
};

/**
 * Get the current authenticated user's profile.
 *
 * @param {string} token - JWT access token
 * @returns {Promise<UserResponse>} User profile data
 */
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};