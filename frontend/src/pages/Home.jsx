import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { getSkillCategories, getSkills } from '../api/skills';
import { getProfile } from '../api/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faDatabase,
  faServer,
  faCloud,
  faCogs,
  faLaptopCode,
  faBrain,
  faRocket,
  faGlobe,
  faMobileAlt,
  faPalette,
  faChartLine,
  faWrench,
  faArrowRight,
  faPuzzlePiece,
  faClipboardList,
  faLink,
  faTable,
  faBolt,
  faLayerGroup,
  faExchangeAlt,
  faArchway,
  faCube,
  faObjectGroup,
  faDraftingCompass,
  faSearch,
  faPeopleArrows,
  faNetworkWired,
  faLock,
  faCheckCircle,
  faClock,
  faBook,
  faFileCode,
  faWind,
  faPaperPlane,
  faUsers,
  faBookOpen,
  faCrown,
  faLightbulb,
  faComments,
  faArrowsAlt,
  faCodeBranch,
} from '@fortawesome/free-solid-svg-icons';
import {
  faPython,
  faJs,
  faReact,
  faDocker,
  faGithub,
  faLinkedin,
  faTwitter,
  faNodeJs,
  faJava,
  faPhp,
  faVuejs,
  faAngular,
  faAws,
  faBootstrap,
  faGitlab,
  faLinux,
  faGitAlt,
} from '@fortawesome/free-brands-svg-icons';

const iconMap = {
  FaCode: faCode,
  FaDatabase: faDatabase,
  FaServer: faServer,
  FaCloud: faCloud,
  FaCogs: faCogs,
  FaLaptopCode: faLaptopCode,
  FaBrain: faBrain,
  FaRocket: faRocket,
  FaGlobe: faGlobe,
  FaMobileAlt: faMobileAlt,
  FaPalette: faPalette,
  FaChartLine: faChartLine,
  FaWrench: faWrench,
  FaPuzzlePiece: faPuzzlePiece,
  FaClipboardList: faClipboardList,
  FaLink: faLink,
  FaTable: faTable,
  FaBolt: faBolt,
  FaLayerGroup: faLayerGroup,
  FaExchangeAlt: faExchangeAlt,
  FaArchway: faArchway,
  FaCube: faCube,
  FaObjectGroup: faObjectGroup,
  FaDraftingCompass: faDraftingCompass,
  FaSearch: faSearch,
  FaPeopleArrows: faPeopleArrows,
  FaNetworkWired: faNetworkWired,
  FaLock: faLock,
  FaCheckCircle: faCheckCircle,
  FaClock: faClock,
  FaBook: faBook,
  FaFileCode: faFileCode,
  FaWind: faWind,
  faGitAlt: faGitAlt,
  FaPaperPlane: faPaperPlane,
  FaUsers: faUsers,
  FaBookOpen: faBookOpen,
  FaCrown: faCrown,
  FaLightbulb: faLightbulb,
  FaComments: faComments,
  FaArrowsAlt: faArrowsAlt,
  FaCodeBranch: faCodeBranch,
  FaPython: faPython,
  FaJs: faJs,
  FaReact: faReact,
  FaDocker: faDocker,
  FaGithub: faGithub,
  FaLinkedin: faLinkedin,
  FaTwitter: faTwitter,
  FaNodeJs: faNodeJs,
  FaJava: faJava,
  FaPhp: faPhp,
  FaVuejs: faVuejs,
  FaAngular: faAngular,
  FaAws: faAws,
  FaBootstrap: faBootstrap,
  FaGitlab: faGitlab,
  FaLinux: faLinux,
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getProjects();

        let categoriesData = [];
        try {
          categoriesData = await getSkillCategories();
        } catch (err) {
          console.warn('⚠️ Failed to fetch skill categories:', err.message);
        }

        let skillsData = [];
        try {
          skillsData = await getSkills();
        } catch (err) {
          console.warn('⚠️ Failed to fetch skills:', err.message);
        }

        let profileData = null;
        try {
          profileData = await getProfile();
        } catch (err) {
          console.warn('⚠️ Failed to fetch profile:', err.message);
        }

        const latestPerCategory = [];
        const seenCategories = new Set();

        const sortedProjects = [...projectsData].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        for (const project of sortedProjects) {
          if (project.categories && project.categories.length > 0) {
            for (const category of project.categories) {
              if (!seenCategories.has(category.id)) {
                seenCategories.add(category.id);
                latestPerCategory.push({
                  ...project,
                  categoryName: category.name,
                });
              }
            }
          }
        }

        setProjects(latestPerCategory);
        setSkillCategories(categoriesData);
        setAllSkills(skillsData);
        setProfile(profileData);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 dark:text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900">
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {profile?.profile_image && (
              <div className="flex-shrink-0">
                <img
                  src={profile.profile_image}
                  alt="Rahaf Moualla"
                  className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-indigo-600 shadow-xl"
                />
              </div>
            )}
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">
                Hi, I'm <span className="text-indigo-600">Rahaf</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-6">
                {profile?.title || 'Python Backend Developer | Odoo ERP Developer | FastAPI | REST APIs'}
              </p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 md:mb-8">
                {profile?.bio || 'Turning ideas into powerful applications.'}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
                <Link
                  to="/projects"
                  className="bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm sm:text-base"
                >
                  View Projects <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white text-indigo-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition text-sm sm:text-base"
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-0">Latest Projects</h2>
            <Link to="/projects" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition flex items-center gap-1 text-sm sm:text-base">
              View All <FontAwesomeIcon icon={faArrowRight} className="text-xs sm:text-sm" />
            </Link>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No projects yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
                >
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0].url}
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    {project.categoryName && (
                      <span className="inline-block mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                        📁 {project.categoryName}
                      </span>
                    )}
                    <span className="inline-block mt-2 sm:mt-3 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-medium">
                      View Project →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {skillCategories.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-8">
              {skillCategories.map((category, index) => (
                <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition border border-gray-100 dark:border-gray-700">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    {category.icon && iconMap[category.icon] && (
                      <FontAwesomeIcon icon={iconMap[category.icon]} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    )}
                    {category.name}
                  </h2>

                  {category.skills && category.skills.length > 0 && (
                    <div className="mb-4">
                      <ul className="list-disc list-inside ml-6 space-y-1">
                        {category.skills.map((skill) => (
                          <li key={skill.id} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            {skill.icon && iconMap[skill.icon] && (
                              <FontAwesomeIcon icon={iconMap[skill.icon]} className="mr-1 text-indigo-400 dark:text-indigo-400" />
                            )}
                            {skill.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {category.children && category.children.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {category.children.map((sub) => (
                        <div key={sub.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition border border-gray-100 dark:border-gray-600">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            {sub.icon && iconMap[sub.icon] && (
                              <FontAwesomeIcon icon={iconMap[sub.icon]} className="mr-2 text-indigo-500 dark:text-indigo-400" />
                            )}
                            {sub.name}
                          </h3>
                          <ul className="list-disc list-inside space-y-1">
                            {sub.skills && sub.skills.length > 0 ? (
                              sub.skills.map((skill) => (
                                <li key={skill.id} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                  {skill.icon && iconMap[skill.icon] && (
                                    <FontAwesomeIcon icon={iconMap[skill.icon]} className="mr-1 text-indigo-400 dark:text-indigo-400" />
                                  )}
                                  {skill.name}
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-gray-400 dark:text-gray-500">No skills yet</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Have a Project in Mind?</h2>
          <p className="text-indigo-100 dark:text-indigo-200 text-base sm:text-lg mb-6 sm:mb-8">
            Let's work together to build something amazing.
          </p>
          <Link
            to="/contact"
            className="bg-white text-indigo-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-indigo-50 transition font-semibold inline-block text-sm sm:text-base"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;