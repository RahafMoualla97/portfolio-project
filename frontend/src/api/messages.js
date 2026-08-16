// Contact message API calls - Public submission and Admin management

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
 * Send a contact message from the public contact form.
 *
 * @param {MessageCreate} messageData - Message data (name, email, subject, message)
 * @returns {Promise<MessageResponse>} Created message
 */
export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/api/contact`, messageData);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Fetch all contact messages with pagination.
 * Messages are sorted newest first.
 *
 * @param {string} token - JWT access token
 * @param {number} skip - Number of messages to skip (pagination)
 * @param {number} limit - Maximum number of messages to return
 * @returns {Promise<MessageResponse[]>} List of messages
 */
export const getMessages = async (token, skip = 0, limit = 100) => {
  const api = getApiWithToken(token);
  const response = await api.get(`/api/admin/messages?skip=${skip}&limit=${limit}`);
  return response.data;
};

/**
 * Fetch a single message by ID.
 *
 * @param {number} id - Message ID
 * @param {string} token - JWT access token
 * @returns {Promise<MessageResponse>} Message data
 */
export const getMessage = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.get(`/api/admin/messages/${id}`);
  return response.data;
};

/**
 * Mark a message as read.
 *
 * @param {number} id - Message ID
 * @param {string} token - JWT access token
 * @returns {Promise<MessageResponse>} Updated message
 */
export const markMessageAsRead = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/messages/${id}`, { is_read: 1 });
  return response.data;
};

/**
 * Delete a message permanently.
 *
 * @param {number} id - Message ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteMessage = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/messages/${id}`);
  return response.data;
};