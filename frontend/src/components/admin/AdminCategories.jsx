import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';

/**
 * AdminCategories component - Manage project categories.
 */
const AdminCategories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData, token);
      } else {
        await createCategory(formData, token);
      }
      setFormData({ name: '', slug: '', description: '' });
      setEditingCategory(null);
      setShowForm(false);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id, token);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading categories...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '' });
            setShowForm(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                placeholder="e.g. python-projects"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
              {editingCategory ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base">
              Cancel
            </button>
          </div>
        </form>
      )}

      {categories.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No categories yet.</p>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-md p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div className="w-full sm:w-auto">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Slug: {category.slug}</p>
                  {category.description && <p className="text-xs text-gray-500">{category.description}</p>}
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button onClick={() => handleEdit(category)} className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap">
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

export default AdminCategories;