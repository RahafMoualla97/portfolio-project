import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjects, deleteProject } from '../../api/projects';
import ProjectLinksManager from './ProjectLinksManager';
import ProjectTechnologiesManager from './ProjectTechnologiesManager';
import ProjectImagesManager from './ProjectImagesManager';
import ProjectSectionsManager from './ProjectSectionsManager';
import { getAllCategories } from '../../api/categories';

/**
 * AdminProjects component - Manage projects.
 */
const AdminProjects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id, token);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
        <button
          onClick={() => setEditingProject({})}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          + Add New Project
        </button>
      </div>

      {editingProject !== null && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProject.id ? 'Edit Project' : 'Add New Project'}
          </h3>
          <ProjectForm
            project={editingProject}
            onSave={() => {
              fetchProjects();
            }}
            onCancel={() => setEditingProject(null)}
          />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No projects yet.</div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-md p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex-1 w-full sm:w-auto">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{project.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{project.description}</p>
                  {project.categories && project.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.categories.map((cat) => (
                        <span key={cat.id} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech.id} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded">
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ProjectForm component - Form for creating/editing a project.
 */
const ProjectForm = ({ project, onSave, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    problem_solved: project?.problem_solved || '',
    key_features: project?.key_features || '',  // ✅ NEW FIELD ADDED
  });
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(project?.id || null);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    project?.categories?.map(c => c.id) || []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { createProject, updateProject } = await import('../../api/projects');
      const projectData = {
        ...formData,
        category_ids: selectedCategoryIds,
      };
      let savedProject;
      if (projectId) {
        await updateProject(projectId, projectData, token);
        savedProject = { id: projectId, ...formData };
      } else {
        savedProject = await createProject(projectData, token);
        setProjectId(savedProject.id);
        project.id = savedProject.id;
      }
      await onSave();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Problem Solved</label>
        <textarea
          name="problem_solved"
          value={formData.problem_solved}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ✅ NEW FIELD: Key Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
        <textarea
          name="key_features"
          value={formData.key_features}
          onChange={handleChange}
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 admin-textarea"
          placeholder="Write the key features here... (use Enter for new lines)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories available. Create one first.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                    } else {
                      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                    }
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {(projectId || project?.id) && (
        <>
          <div className="mt-6 border-t pt-4">
            <ProjectImagesManager projectId={projectId || project.id} onUpdate={onSave} />
          </div>
          <div className="mt-6 border-t pt-4">
            <ProjectLinksManager projectId={projectId || project.id} onUpdate={onSave} />
          </div>
          <div className="mt-6 border-t pt-4">
            <ProjectTechnologiesManager projectId={projectId || project.id} onUpdate={onSave} />
          </div>
          <div className="mt-6 border-t pt-4">
            <ProjectSectionsManager projectId={projectId || project.id} />
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm sm:text-base"
        >
          {loading ? 'Saving...' : 'Save Project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminProjects;