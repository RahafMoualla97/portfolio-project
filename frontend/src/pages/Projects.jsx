import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { getAllCategories } from '../api/categories';

/**
 * Projects page component - Displays all projects with category filtering.
 */
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, categoriesData] = await Promise.all([
          getProjects(),
          getAllCategories(),
        ]);
        setProjects(projectsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.categories?.some((c) => c.id === selectedCategory))
    : projects;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">My Projects</h1>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition ${
                selectedCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[0].url}
                    alt={project.title}
                    className="w-full h-40 sm:h-48 object-contain"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
                )}
                <div className="p-3 sm:p-4">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100">{project.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 line-clamp-2">
                    {project.description}
                  </p>
                  {/* Categories */}
                  {project.categories && project.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.categories.map((cat) => (
                        <span key={cat.id} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-0.5 sm:py-1 rounded">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
                    {project.technologies?.slice(0, 3).map((tech) => (
                      <span
                        key={tech.id}
                        className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs px-2 py-0.5 sm:py-1 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;