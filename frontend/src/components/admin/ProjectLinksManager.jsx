import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectLinks, createLink, deleteLink } from '../../api/links';

/**
 * ProjectLinksManager component - Manage links for a project.
 *
 * @param {Object} props
 * @param {number} props.projectId - The project ID
 * @param {Function} props.onUpdate - Callback when links are updated
 */
const ProjectLinksManager = ({ projectId, onUpdate }) => {
  const { token } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const fetchLinks = async () => {
    if (!projectId) return;
    try {
      const data = await getProjectLinks(projectId);
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [projectId]);

  const handleAddLink = async () => {
    if (!newPlatform || !newUrl) {
      alert('Please fill in both fields');
      return;
    }
    try {
      await createLink(projectId, { platform_name: newPlatform, url: newUrl }, token);
      setNewPlatform('');
      setNewUrl('');
      await fetchLinks();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding link:', error);
      let errorMessage = 'Failed to add link';
      if (error.response) {
        errorMessage = error.response.data?.detail || JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert('Failed to add link: ' + errorMessage);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await deleteLink(linkId, token);
      await fetchLinks();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading links...</div>;

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-700 mb-2">Links</h4>
      {links.length === 0 ? (
        <p className="text-sm text-gray-500">No links yet.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {links.map((link) => (
            <div key={link.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-sm">
                {link.platform_name}: <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">{link.url}</a>
              </span>
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Platform (e.g. GitHub)"
          value={newPlatform}
          onChange={(e) => setNewPlatform(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <input
          type="url"
          placeholder="URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          onClick={handleAddLink}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProjectLinksManager;