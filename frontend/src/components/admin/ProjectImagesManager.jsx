import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjectImages, uploadImage, deleteImage } from '../../api/images';

/**
 * ProjectImagesManager component - Manage images for a project or section.
 *
 * @param {Object} props
 * @param {number} props.projectId - The project ID
 * @param {number|null} props.sectionId - Optional section ID for section-specific images
 * @param {Function} props.onUpdate - Callback when images are updated
 */
const ProjectImagesManager = ({ projectId, sectionId, onUpdate }) => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    try {
      const data = await getProjectImages(projectId);
      if (sectionId) {
        setImages(data.filter((img) => img.section_id === sectionId));
      } else {
        setImages(data.filter((img) => img.section_id === null));
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchImages();
    }
  }, [projectId, sectionId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadImage(projectId, file, token, sectionId);
      await fetchImages();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await deleteImage(imageId, token);
      await fetchImages();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading images...</div>;

  return (
    <div>
      <h4 className="font-semibold text-gray-700 mb-2">
        {sectionId ? 'Section Images' : 'Project Images'}
      </h4>
      
      <div className="mb-3">
        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm inline-block">
          {uploading ? 'Uploading...' : '+ Add Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-gray-500">No images yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.alt_text || 'Project image'}
                className="w-full h-32 object-contain rounded-lg"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
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

export default ProjectImagesManager;