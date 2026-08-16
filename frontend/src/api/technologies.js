// Technologies API calls - Manage project technologies

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
 * Fetch all available technologies.
 *
 * @returns {Promise<TechnologyResponse[]>} List of technologies
 */
export const getAllTechnologies = async () => {
  const response = await axios.get(`${API_URL}/api/technologies`);
  return response.data;
};

/**
 * Fetch all technologies associated with a project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<TechnologyResponse[]>} List of project technologies
 */
export const getProjectTechnologies = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/projects/${projectId}/technologies`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Create a new technology.
 *
 * @param {TechnologyCreate} technologyData - Technology data (name, icon_url)
 * @param {string} token - JWT access token
 * @returns {Promise<TechnologyResponse>} Created technology
 */
export const createTechnology = async (technologyData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post('/api/admin/technologies', technologyData);
  return response.data;
};

/**
 * Associate a technology with a project.
 *
 * @param {number} projectId - Project ID
 * @param {number} technologyId - Technology ID
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Success message
 */
export const addTechnologyToProject = async (projectId, technologyId, token) => {
  const api = getApiWithToken(token);
  const response = await api.post(`/api/admin/projects/${projectId}/technologies/${technologyId}`);
  return response.data;
};

/**
 * Remove a technology association from a project.
 *
 * @param {number} projectId - Project ID
 * @param {number} technologyId - Technology ID
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Success message
 */
export const removeTechnologyFromProject = async (projectId, technologyId, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/projects/${projectId}/technologies/${technologyId}`);
  return response.data;
};