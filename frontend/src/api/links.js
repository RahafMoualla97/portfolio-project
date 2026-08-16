// Link API calls - Manage project links (GitHub, Live Demo, etc.)

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
 * Fetch all links for a specific project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<LinkResponse[]>} List of project links
 */
export const getProjectLinks = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/projects/${projectId}/links`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Add a new link to a project.
 *
 * @param {number} projectId - Project ID
 * @param {LinkCreate} linkData - Link data (platform_name, url)
 * @param {string} token - JWT access token
 * @returns {Promise<LinkResponse>} Created link
 */
export const createLink = async (projectId, linkData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post(`/api/admin/projects/${projectId}/links`, linkData);
  return response.data;
};

/**
 * Delete a link by ID.
 *
 * @param {number} linkId - Link ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteLink = async (linkId, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/links/${linkId}`);
  return response.data;
};