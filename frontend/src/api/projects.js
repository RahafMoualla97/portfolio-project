// Project API calls - Public viewing and Admin CRUD operations

import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

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


// ============================================
// PUBLIC ENDPOINTS - No authentication required
// ============================================

/**
 * Fetch all projects with pagination.
 * Falls back to mock data if backend is unavailable.
 *
 * @returns {Promise<ProjectResponse[]>} List of projects
 */
export const getProjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/projects`);
    return response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data');
    return []; // ✅ التعديل الوحيد هنا: استبدلنا MOCK_PROJECTS بـ []
  }
};


/**
 * Fetch a single project by ID with all related data.
 * Falls back to mock data if backend is unavailable.
 *
 * @param {number} id - Project ID
 * @returns {Promise<ProjectResponse>} Project data with relations
 */
export const getProject = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/projects/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Backend not available, using mock data');
    const project = MOCK_PROJECTS.find((p) => p.id === parseInt(id));
    return project || null;
  }
};


// ============================================
// ADMIN ENDPOINTS - Authentication required
// ============================================

/**
 * Create a new project.
 *
 * @param {ProjectCreate} projectData - Project data (title, description, problem_solved, category_ids)
 * @param {string} token - JWT access token
 * @returns {Promise<ProjectResponse>} Created project
 */
export const createProject = async (projectData, token) => {
  const api = getApiWithToken(token);
  const response = await api.post('/api/admin/projects', {
    title: projectData.title,
    description: projectData.description,
    problem_solved: projectData.problem_solved,
    category_ids: projectData.category_ids || [],
  });
  return response.data;
};


/**
 * Update an existing project.
 *
 * @param {number} id - Project ID to update
 * @param {ProjectUpdate} projectData - Updated project data
 * @param {string} token - JWT access token
 * @returns {Promise<ProjectResponse>} Updated project
 */
export const updateProject = async (id, projectData, token) => {
  const api = getApiWithToken(token);
  const response = await api.put(`/api/admin/projects/${id}`, {
    title: projectData.title,
    description: projectData.description,
    problem_solved: projectData.problem_solved,
    category_ids: projectData.category_ids || [],
  });
  return response.data;
};


/**
 * Delete a project permanently.
 *
 * @param {number} id - Project ID to delete
 * @param {string} token - JWT access token
 * @returns {Promise<{message: string}>} Deletion confirmation
 */
export const deleteProject = async (id, token) => {
  const api = getApiWithToken(token);
  const response = await api.delete(`/api/admin/projects/${id}`);
  return response.data;
};


// ============================================
// MOCK DATA - Fallback for testing
// ============================================

const MOCK_PROJECTS = [
  {
    id: 1,
    title: 'TaskFlow API',
    description: 'A RESTful task management API with JWT authentication and RBAC.',
    problem_solved: 'Managing tasks efficiently with role-based access control.',
    images: [],
    videos: [],
    links: [
      { id: 1, platform_name: 'GitHub', url: 'https://github.com' },
    ],
    technologies: [
      { id: 1, name: 'FastAPI' },
      { id: 2, name: 'PostgreSQL' },
      { id: 3, name: 'Docker' },
    ],
    sections: [
      {
        id: 1,
        title: 'Authentication',
        description: 'JWT-based authentication with refresh tokens.',
        images: [],
        videos: [],
      },
    ],
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description: 'Full-featured e-commerce platform with payment integration.',
    problem_solved: 'Online shopping with secure payments and inventory management.',
    images: [],
    videos: [],
    links: [
      { id: 2, platform_name: 'Live Demo', url: 'https://demo.com' },
    ],
    technologies: [
      { id: 4, name: 'React' },
      { id: 5, name: 'Node.js' },
      { id: 6, name: 'MongoDB' },
    ],
    sections: [],
  },
];