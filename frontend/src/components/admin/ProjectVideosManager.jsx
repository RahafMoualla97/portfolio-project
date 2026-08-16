import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectVideos, uploadVideo, deleteVideo } from '../../api/videos';

/**
 * ProjectVideosManager component - Manage videos for a project or section.
 *
 * @param {Object} props
 * @param {number} props.projectId - The project ID
 * @param {number|null} props.sectionId - Optional section ID for section-specific videos
 * @param {Function} props.onUpdate - Callback when videos are updated
 */
const ProjectVideosManager = ({ projectId, sectionId, onUpdate }) => {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchVideos();
    }
  }, [projectId, sectionId]);

  const fetchVideos = async () => {
    try {
      const data = await getProjectVideos(projectId);
      if (sectionId) {
        setVideos(data.filter((v) => v.section_id === sectionId));
      } else {
        setVideos(data.filter((v) => v.section_id === null));
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadVideo(projectId, file, token, sectionId);
      await fetchVideos();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await deleteVideo(videoId, token);
      await fetchVideos();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading videos...</div>;

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-700 mb-2">
        {sectionId ? 'Section Videos' : 'Project Videos'}
      </h4>
      
      <div className="mb-3">
        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm inline-block">
          {uploading ? 'Uploading...' : '+ Add Video'}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {videos.length === 0 ? (
        <p className="text-sm text-gray-500">No videos yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {videos.map((video) => (
            <div key={video.id} className="relative group">
              <video
                src={video.url}
                className="w-full h-32 object-contain rounded-lg bg-black"
                controls
                style={{ maxHeight: '240px', aspectRatio: 'auto' }}
              />
              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectVideosManager;