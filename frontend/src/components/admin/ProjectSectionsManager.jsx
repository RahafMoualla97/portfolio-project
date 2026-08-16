import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectSections, createSection, updateSection, deleteSection } from '../../api/sections';
import ProjectImagesManager from './ProjectImagesManager';
import ProjectVideosManager from './ProjectVideosManager';

/**
 * ProjectSectionsManager component - Manage sections within a project.
 *
 * @param {Object} props
 * @param {number} props.projectId - The project ID
 */
const ProjectSectionsManager = ({ projectId }) => {
  const { token } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchSections();
    }
  }, [projectId]);

  const fetchSections = async () => {
    if (!projectId) return;
    try {
      const data = await getProjectSections(projectId);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSection = async (sectionData) => {
    if (!projectId) {
      alert('Please save the project first before adding sections.');
      return;
    }
    try {
      let savedSection;
      if (sectionData.id) {
        savedSection = await updateSection(sectionData.id, sectionData, token);
      } else {
        savedSection = await createSection(projectId, {
          title: sectionData.title,
          description: sectionData.description,
          order: sectionData.order,
        }, token);
      }
      await fetchSections();
      setShowForm(false);
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all its content?')) return;
    try {
      await deleteSection(sectionId, token);
      await fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading sections...</div>;

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-700">Sections</h4>
        <button
          onClick={() => {
            if (!projectId) {
              alert('Please save the project first before adding sections.');
              return;
            }
            setEditingSection(null);
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm"
        >
          + Add Section
        </button>
      </div>

      {showForm && (
        <SectionForm
          section={editingSection}
          onSave={handleSaveSection}
          onCancel={() => {
            setShowForm(false);
            setEditingSection(null);
          }}
        />
      )}

      {sections.length === 0 ? (
        <p className="text-sm text-gray-500">No sections yet.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-800">
                    {index + 1}. {section.title}
                  </h5>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingSection(section);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Section Images */}
              <div className="mt-3">
                <ProjectImagesManager 
                  projectId={projectId} 
                  sectionId={section.id}
                  onUpdate={fetchSections}
                />
              </div>

              {/* Section Videos */}
              <div className="mt-3">
                <ProjectVideosManager 
                  projectId={projectId} 
                  sectionId={section.id}
                  onUpdate={fetchSections}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * SectionForm component - Form for creating/editing a section.
 */
const SectionForm = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    description: section?.description || '',
    order: section?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'order' ? parseInt(value) || 0 : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...formData, id: section?.id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg mb-4 border">
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition text-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Section'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSectionsManager;