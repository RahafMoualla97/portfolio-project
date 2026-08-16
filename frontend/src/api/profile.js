// Profile API calls - Public viewing and Admin management

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Create an axios instance with authentication token.
 *
 * @param {string} token - JWT access token
 * @returns {AxiosInstance} Authenticated axios instance
 */
const getApiWithToken = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Public endpoints - No authentication required

/**
 * Fetch the public profile data.
 *
 * @returns {Promise<ProfileResponse>} Profile data (bio, title, social links)
 */
export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/api/profile`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Update profile information.
 *
 * @param {ProfileUpdate} profileData - Profile data to update (bio, title, social links)
 * @param {string} token - JWT access token
 * @returns {Promise<ProfileResponse>} Updated profile
 */
export const updateProfile = async (profileData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put('/api/admin/profile', profileData);
  return response.data;
};

/**
 * Upload a profile image.
 *
 * @param {File} file - Image file to upload
 * @param {string} token - JWT access token
 * @returns {Promise<ProfileResponse>} Updated profile with new image URL
 */
export const uploadProfileImage = async (file, token) => {
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/admin/profile/image', formData);
  return response.data;
};

/**
 * Delete the profile image.
 *
 * @param {string} token - JWT access token
 * @returns {Promise<ProfileResponse>} Updated profile without image
 */
export const deleteProfileImage = async (token) => {
  const api = getApiWithToken(token);
  const response = await api.delete('/api/admin/profile/image');
  return response.data;
};