import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile, uploadProfileImage, deleteProfileImage } from '../../api/profile';
import ImageCropper from '../ImageCropper';

/**
 * AdminProfile component - Manage user profile settings.
 */
const AdminProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        title: data.title || '',
        bio: data.bio || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        twitter_url: data.twitter_url || '',
        website_url: data.website_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData, token);
      await fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /**
   * Edit the existing profile image.
   */
  const handleEditImage = () => {
    if (profile?.profile_image) {
      setTempImage(profile.profile_image);
      setShowCropper(true);
    } else {
      alert('No image to edit. Please upload one first.');
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setUploading(true);
    try {
      await uploadProfileImage(croppedFile, token);
      await fetchProfile();
      alert('Image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to update image');
    } finally {
      setUploading(false);
      setShowCropper(false);
      setTempImage(null);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImage(null);
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) return;
    try {
      await deleteProfileImage(token);
      await fetchProfile();
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading profile...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <div className="flex items-center gap-6">
            {profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover border-4 border-indigo-600"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                
                {profile?.profile_image && (
                  <>
                    <button
                      type="button"
                      onClick={handleEditImage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Edit Image
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Delete Image
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Upload a profile image (JPG, PNG)</p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Backend Developer"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://github.com/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
            <input
              type="url"
              name="twitter_url"
              value={formData.twitter_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://twitter.com/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* Image Cropper Modal */}
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </div>
  );
};

export default AdminProfile;