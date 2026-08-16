import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminProjects from '../components/admin/AdminProjects';
import AdminCategories from '../components/admin/AdminCategories';
import AdminProfile from '../components/admin/AdminProfile';
import AdminSkills from '../components/admin/AdminSkills';
import AdminMessages from '../components/admin/AdminMessages';

/**
 * AdminDashboard page component - Main admin panel with tabbed navigation.
 */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Welcome, {user?.username}!</p>

          {/* Tabs */}
          <div className="flex gap-2 sm:gap-4 border-b mb-4 sm:mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-2 px-2 sm:px-4 transition text-sm sm:text-base ${
                activeTab === 'projects'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-2 px-2 sm:px-4 transition text-sm sm:text-base ${
                activeTab === 'categories'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2 px-2 sm:px-4 transition text-sm sm:text-base ${
                activeTab === 'profile'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2 px-2 sm:px-4 transition text-sm sm:text-base ${
                activeTab === 'skills'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-2 px-2 sm:px-4 transition text-sm sm:text-base ${
                activeTab === 'messages'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-semibold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Messages
            </button>
          </div>

          {/* Content */}
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'profile' && <AdminProfile />}
          {activeTab === 'skills' && <AdminSkills />}
          {activeTab === 'messages' && <AdminMessages />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;