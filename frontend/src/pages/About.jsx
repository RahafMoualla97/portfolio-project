import React, { useState, useEffect } from 'react';
import { getProfile } from '../api/profile';

/**
 * About page component - Displays the user's profile information.
 */
const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-gray-600 dark:text-gray-400">No profile data available</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 md:p-8">
          {/* Profile Image */}
          {profile.profile_image && (
            <div className="flex justify-center mb-4 sm:mb-6">
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-600"
              />
            </div>
          )}
          
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
            {profile.title || 'Rahaf Moualla'}
          </h1>
          
          <div className="space-y-3 sm:space-y-4 text-gray-600 dark:text-gray-400 mt-4 sm:mt-6">
            {profile.bio && (
              <p className="text-sm sm:text-base whitespace-pre-line">{profile.bio}</p>
            )}
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4 justify-center">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition text-sm sm:text-base">
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition text-sm sm:text-base">
                  LinkedIn
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition text-sm sm:text-base">
                  Twitter
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition text-sm sm:text-base">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;