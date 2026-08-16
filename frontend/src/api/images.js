// Image API calls - Upload, fetch, and delete project images

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

/**
 * Create an axios instance with authentication token for file uploads.
 * Uses multipart/form-data content type.
 *
 * @param {string} token - JWT access token
 * @returns {AxiosInstance} Authenticated axios instance for file uploads
 */
const getApiWithToken = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

// Public endpoints - No authentication required

/**
 * Fetch all images for a specific project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<ImageResponse[]>} List of project images
 */
export const getProjectImages = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/projects/${projectId}/images`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Upload an image for a project or section.
 *
 * @param {number} projectId - Project ID
 * @param {File} file - Image file to upload
 * @param {string} token - JWT access token
 * @param {number|null} sectionId - Optional section ID for section-specific images
 * @returns {Promise<ImageResponse>} Uploaded image data
 */
export const uploadImage = async (projectId, file, token, sectionId = null) => {
  const api = getApiWithToken(token);

  const formData = new FormData();
  formData.append('file', file);

  if (sectionId !== null && sectionId !== undefined) {
    formData.append('section_id', String(sectionId));
  }

  const response = await api.post(`/api/admin/projects/${projectId}/images`, formData);
  return response.data;
};

/**
 * Delete an image by ID.
 *
 * @param {number} imageId - Image ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteImage = async (imageId, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/images/${imageId}`);
  return response.data;
};