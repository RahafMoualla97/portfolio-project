// Category API calls - Public viewing and Admin management

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
 * Fetch all categories with pagination.
 *
 * @returns {Promise<CategoryResponse[]>} List of categories
 */
export const getAllCategories = async () => {
  const response = await axios.get(`${API_URL}/api/categories`);
  return response.data;
};

/**
 * Fetch a single category by ID.
 *
 * @param {number} id - Category ID
 * @returns {Promise<CategoryResponse>} Category data
 */
export const getCategory = async (id) => {
  const response = await axios.get(`${API_URL}/api/categories/${id}`);
  return response.data;
};

// Admin endpoints - Authentication required

/**
 * Create a new category.
 *
 * @param {CategoryCreate} categoryData - Category data (name, slug, description)
 * @param {string} token - JWT access token
 * @returns {Promise<CategoryResponse>} Created category
 */
export const createCategory = async (categoryData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post('/api/admin/categories', categoryData);
  return response.data;
};

/**
 * Update an existing category.
 *
 * @param {number} id - Category ID to update
 * @param {CategoryUpdate} categoryData - Updated category data
 * @param {string} token - JWT access token
 * @returns {Promise<CategoryResponse>} Updated category
 */
export const updateCategory = async (id, categoryData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete a category.
 *
 * @param {number} id - Category ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteCategory = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/categories/${id}`);
  return response.data;
};