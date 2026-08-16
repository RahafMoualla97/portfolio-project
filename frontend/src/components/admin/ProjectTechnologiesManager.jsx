import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectTechnologies, addTechnologyToProject, removeTechnologyFromProject, getAllTechnologies } from '../../api/technologies';

/**
 * ProjectTechnologiesManager component - Manage technologies for a project.
 *
 * @param {Object} props
 * @param {number} props.projectId - The project ID
 * @param {Function} props.onUpdate - Callback when technologies are updated
 */
const ProjectTechnologiesManager = ({ projectId, onUpdate }) => {
  const { token } = useAuth();
  const [projectTechs, setProjectTechs] = useState([]);
  const [allTechs, setAllTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTechName, setNewTechName] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [projectTechsData, allTechsData] = await Promise.all([
        getProjectTechnologies(projectId),
        getAllTechnologies(),
      ]);
      setProjectTechs(projectTechsData);
      setAllTechs(allTechsData);
    } catch (error) {
      console.error('Error fetching technologies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewTech = async () => {
    if (!newTechName.trim()) {
      alert('Please enter a technology name');
      return;
    }
    try {
      const { createTechnology } = await import('../../api/technologies');
      const newTech = await createTechnology({ name: newTechName.trim() }, token);
      await addTechnologyToProject(projectId, newTech.id, token);
      setNewTechName('');
      await fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding technology:', error);
      alert('Failed to add technology: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleAddExistingTech = async (techId) => {
    try {
      await addTechnologyToProject(projectId, techId, token);
      await fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding technology:', error);
      alert('Failed to add technology');
    }
  };

  const handleRemoveTech = async (techId) => {
    try {
      await removeTechnologyFromProject(projectId, techId, token);
      await fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error removing technology:', error);
      alert('Failed to remove technology');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading technologies...</div>;

  const availableTechs = allTechs.filter(
    (tech) => !projectTechs.some((pt) => pt.id === tech.id)
  );

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-700 mb-2">Technologies</h4>
      
      {/* Current technologies */}
      {projectTechs.length === 0 ? (
        <p className="text-sm text-gray-500">No technologies added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {projectTechs.map((tech) => (
            <span key={tech.id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {tech.name}
              <button
                onClick={() => handleRemoveTech(tech.id)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add new technology */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="New technology name"
          value={newTechName}
          onChange={(e) => setNewTechName(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          onClick={handleAddNewTech}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
        >
          Add New
        </button>
      </div>

      {/* Add existing technology */}
      {availableTechs.length > 0 && (
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) handleAddExistingTech(parseInt(e.target.value));
            }}
            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="">Add existing...</option>
            {availableTechs.map((tech) => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ProjectTechnologiesManager;