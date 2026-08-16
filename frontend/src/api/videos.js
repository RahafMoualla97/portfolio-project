// Video API calls - Upload, fetch, and delete project videos

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
 * Fetch all videos for a specific project.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<VideoResponse[]>} List of project videos
 */
export const getProjectVideos = async (projectId) => {
  const response = await axios.get(`${API_URL}/api/projects/${projectId}/videos`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Upload a video for a project or section.
 *
 * @param {number} projectId - Project ID
 * @param {File} file - Video file to upload
 * @param {string} token - JWT access token
 * @param {number|null} sectionId - Optional section ID for section-specific videos
 * @returns {Promise<VideoResponse>} Uploaded video data
 */
export const uploadVideo = async (projectId, file, token, sectionId = null) => {
  const api = getApiWithToken(token);
  const formData = new FormData();
  formData.append('file', file);

  if (sectionId) {
    formData.append('section_id', String(sectionId));
  }

  const response = await api.post(`/api/admin/projects/${projectId}/videos`, formData);
  return response.data;
};

/**
 * Delete a video by ID.
 *
 * @param {number} videoId - Video ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteVideo = async (videoId, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/videos/${videoId}`);
  return response.data;
};