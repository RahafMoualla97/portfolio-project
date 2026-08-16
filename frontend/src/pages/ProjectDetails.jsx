import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/projects';

/**
 * ProjectDetails page component - Displays detailed information about a single project.
 */
const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl text-gray-600 dark:text-gray-400">Project not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Project Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{project.title}</h1>
        
        {/* Project Images */}
        {project.images && project.images.filter((img) => img.section_id === null).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {project.images.filter((img) => img.section_id === null).map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.alt_text || project.title}
                className="rounded-lg w-full h-40 sm:h-48 object-cover"
              />
            ))}
          </div>
        )}

        {/* Project Videos */}
        {project.videos && project.videos.filter((v) => v.section_id === null).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {project.videos.filter((v) => v.section_id === null).map((video) => (
              <video
                key={video.id}
                src={video.url}
                controls
                className="rounded-lg w-full h-40 sm:h-48 object-cover"
              />
            ))}
          </div>
        )}

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Description</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{project.description}</p>
        </div>

        {/* Problem Solved */}
        {project.problem_solved && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Problem Solved</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{project.problem_solved}</p>
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech.id}
                  className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Links</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {project.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline text-sm sm:text-base"
                >
                  {link.platform_name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {project.sections && project.sections.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {project.sections.map((section) => (
              <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">{section.description}</p>
                
                {/* Section Images */}
                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    {section.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={image.alt_text || section.title}
                        className="rounded-lg w-full h-24 sm:h-32 object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Section Videos */}
                {section.videos && section.videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                    {section.videos.map((video) => (
                      <video
                        key={video.id}
                        src={video.url}
                        controls
                        className="rounded-lg w-full h-24 sm:h-32 object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;