// Skills API calls - Skill categories and individual skills

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
 * Fetch all skill categories with their nested skills.
 *
 * @returns {Promise<SkillCategoryResponse[]>} List of skill categories
 */
export const getSkillCategories = async () => {
  const response = await axios.get(`${API_URL}/api/skill-categories`);
  return response.data;
};

/**
 * Fetch all skills.
 *
 * @returns {Promise<SkillResponse[]>} List of skills
 */
export const getSkills = async () => {
  const response = await axios.get(`${API_URL}/api/skills`);
  return response.data;
};

// Admin endpoints - Authentication required

// Skill Categories

/**
 * Create a new skill category.
 *
 * @param {SkillCategoryCreate} categoryData - Category data (name, icon, order, parent_id)
 * @param {string} token - JWT access token
 * @returns {Promise<SkillCategoryResponse>} Created category
 */
export const createSkillCategory = async (categoryData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post('/api/admin/skill-categories', categoryData);
  return response.data;
};

/**
 * Update an existing skill category.
 *
 * @param {number} id - Category ID to update
 * @param {SkillCategoryUpdate} categoryData - Updated category data
 * @param {string} token - JWT access token
 * @returns {Promise<SkillCategoryResponse>} Updated category
 */
export const updateSkillCategory = async (id, categoryData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/skill-categories/${id}`, categoryData);
  return response.data;
};

/**
 * Delete a skill category.
 *
 * @param {number} id - Category ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteSkillCategory = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/skill-categories/${id}`);
  return response.data;
};

// Skills

/**
 * Create a new skill.
 *
 * @param {SkillCreate} skillData - Skill data (name, icon, level, order, skill_category_id)
 * @param {string} token - JWT access token
 * @returns {Promise<SkillResponse>} Created skill
 */
export const createSkill = async (skillData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post('/api/admin/skills', skillData);
  return response.data;
};

/**
 * Update an existing skill.
 *
 * @param {number} id - Skill ID to update
 * @param {SkillUpdate} skillData - Updated skill data
 * @param {string} token - JWT access token
 * @returns {Promise<SkillResponse>} Updated skill
 */
export const updateSkill = async (id, skillData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/skills/${id}`, skillData);
  return response.data;
};

/**
 * Delete a skill.
 *
 * @param {number} id - Skill ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteSkill = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/skills/${id}`);
  return response.data;
};