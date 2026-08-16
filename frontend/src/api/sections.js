// Section API calls - Manage project sections

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
 * Fetch all sections for a specific project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<SectionResponse[]>} List of project sections
 */
export const getProjectSections = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/projects/${projectId}/sections`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Create a new section within a project.
 *
 * @param {number} projectId - Project ID
 * @param {SectionCreate} sectionData - Section data (title, description, order)
 * @param {string} token - JWT access token
 * @returns {Promise<SectionResponse>} Created section
 */
export const createSection = async (projectId, sectionData, token) => {
  const api = getApiWithToken(token);
  const data = {
    ...sectionData,
    project_id: projectId,
  };
  const response = await api.post(`/api/admin/projects/${projectId}/sections`, data);
  return response.data;
};

/**
 * Update an existing section.
 *
 * @param {number} sectionId - Section ID to update
 * @param {SectionBase} sectionData - Updated section data
 * @param {string} token - JWT access token
 * @returns {Promise<SectionResponse>} Updated section
 */
export const updateSection = async (sectionId, sectionData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/sections/${sectionId}`, sectionData);
  return response.data;
};

/**
 * Delete a section permanently.
 *
 * @param {number} sectionId - Section ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteSection = async (sectionId, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/sections/${sectionId}`);
  return response.data;
};