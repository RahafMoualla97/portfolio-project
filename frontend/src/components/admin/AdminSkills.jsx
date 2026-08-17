import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  faWrench,
  faChartLine,
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
  faApple,
  faAndroid,
  faBootstrap,
  faGitlab,
  faLinux,
  faGitAlt,
} from '@fortawesome/free-brands-svg-icons';
import {
  getSkillCategories,
  getSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../api/skills';

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
  FaWrench: faWrench,
  FaChartLine: faChartLine,
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
  FaApple: faApple,
  FaAndroid: faAndroid,
  FaBootstrap: faBootstrap,
  FaGitlab: faGitlab,
  FaLinux: faLinux,
};

const AdminSkills = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: '', parent_id: null, order: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', icon: '', level: 0, order: 0, skill_category_id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, skillsData] = await Promise.all([
        getSkillCategories(),
        getSkills(),
      ]);

      setCategories(categoriesData);
      setSkills(skillsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateSkillCategory(editingCategory.id, categoryForm, token);
      } else {
        await createSkillCategory(categoryForm, token);
      }
      setCategoryForm({ name: '', slug: '', icon: '', parent_id: null, order: 0 });
      setEditingCategory(null);
      setShowCategoryForm(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its sub-categories?')) return;
    try {
      await deleteSkillCategory(id, token);
      await fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillForm, token);
      } else {
        await createSkill(skillForm, token);
      }
      setSkillForm({ name: '', icon: '', level: 0, order: 0, skill_category_id: '' });
      setEditingSkill(null);
      setShowSkillForm(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id, token);
      await fetchData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) return cat.name;
    return 'None';
  };

  const flattenForDropdown = (cats, result = []) => {
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        flattenForDropdown(cat.children, result);
      }
    }
    return result;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Skills Management</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          <button
            onClick={() => {
              setEditingCategory(null);
              setCategoryForm({ name: '', slug: '', icon: '', parent_id: null, order: 0 });
              setShowCategoryForm(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Category
          </button>
        </div>

        {showCategoryForm && (
          <form onSubmit={handleCategorySubmit} className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="e.g. technical-skills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None</option>
                  <option value="FaCode">FaCode</option>
                  <option value="FaDatabase">FaDatabase</option>
                  <option value="FaServer">FaServer</option>
                  <option value="FaCloud">FaCloud</option>
                  <option value="FaCogs">FaCogs</option>
                  <option value="FaLaptopCode">FaLaptopCode</option>
                  <option value="FaBrain">FaBrain</option>
                  <option value="FaRocket">FaRocket</option>
                  <option value="FaGlobe">FaGlobe</option>
                  <option value="FaMobileAlt">FaMobileAlt</option>
                  <option value="FaPalette">FaPalette</option>
                  <option value="FaWrench">FaWrench</option>
                  <option value="FaChartLine">FaChartLine</option>
                  <option value="FaPuzzlePiece">FaPuzzlePiece</option>
                  <option value="FaClipboardList">FaClipboardList</option>
                  <option value="FaLink">FaLink</option>
                  <option value="FaTable">FaTable</option>
                  <option value="FaBolt">FaBolt</option>
                  <option value="FaLayerGroup">FaLayerGroup</option>
                  <option value="FaExchangeAlt">FaExchangeAlt</option>
                  <option value="FaArchway">FaArchway</option>
                  <option value="FaCube">FaCube</option>
                  <option value="FaObjectGroup">FaObjectGroup</option>
                  <option value="FaDraftingCompass">FaDraftingCompass</option>
                  <option value="FaSearch">FaSearch</option>
                  <option value="FaPeopleArrows">FaPeopleArrows</option>
                  <option value="FaNetworkWired">FaNetworkWired</option>
                  <option value="FaLock">FaLock</option>
                  <option value="FaCheckCircle">FaCheckCircle</option>
                  <option value="FaClock">FaClock</option>
                  <option value="FaBook">FaBook</option>
                  <option value="FaFileCode">FaFileCode</option>
                  <option value="FaWind">FaWind</option>
                  <option value="faGitAlt">faGitAlt</option>
                  <option value="FaPaperPlane">FaPaperPlane</option>
                  <option value="FaUsers">FaUsers</option>
                  <option value="FaBookOpen">FaBookOpen</option>
                  <option value="FaCrown">FaCrown</option>
                  <option value="FaLightbulb">FaLightbulb</option>
                  <option value="FaComments">FaComments</option>
                  <option value="FaArrowsAlt">FaArrowsAlt</option>
                  <option value="FaPython">FaPython</option>
                  <option value="FaJs">FaJs</option>
                  <option value="FaReact">FaReact</option>
                  <option value="FaDocker">FaDocker</option>
                  <option value="FaGithub">FaGithub</option>
                  <option value="FaLinkedin">FaLinkedin</option>
                  <option value="FaTwitter">FaTwitter</option>
                  <option value="FaNodeJs">FaNodeJs</option>
                  <option value="FaJava">FaJava</option>
                  <option value="FaPhp">FaPhp</option>
                  <option value="FaVuejs">FaVuejs</option>
                  <option value="FaAngular">FaAngular</option>
                  <option value="FaAws">FaAws</option>
                  <option value="FaBootstrap">FaBootstrap</option>
                  <option value="FaGitlab">FaGitlab</option>
                  <option value="FaLinux">FaLinux</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <select
                  value={categoryForm.parent_id || ''}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None (Main Category)</option>
                  {categories.filter((c) => c.parent_id === null).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowCategoryForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {cat.icon && iconMap[cat.icon] && (
                      <FontAwesomeIcon icon={iconMap[cat.icon]} className="mr-2 text-indigo-600" />
                    )}
                    {cat.name}
                  </h4>
                  <p className="text-sm text-gray-500">Order: {cat.order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryForm(cat);
                      setShowCategoryForm(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm">
                    Delete
                  </button>
                </div>
              </div>

              {/* Skills directly under this category */}
              {cat.skills && cat.skills.length > 0 && (
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  {cat.skills.map((skill) => (
                    <li key={skill.id} className="text-sm text-gray-600">
                      {skill.icon && iconMap[skill.icon] && (
                        <FontAwesomeIcon icon={iconMap[skill.icon]} className="mr-1 text-indigo-400" />
                      )}
                      {skill.name}
                    </li>
                  ))}
                </ul>
              )}

              {/* Sub-categories (if any) */}
              {cat.children && cat.children.length > 0 && (
                <div className="mt-3 ml-6 border-l-2 border-gray-200 pl-4 space-y-3">
                  {cat.children.map((sub) => (
                    <div key={sub.id} className="py-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {sub.icon && iconMap[sub.icon] && (
                            <FontAwesomeIcon icon={iconMap[sub.icon]} className="mr-2 text-indigo-500" />
                          )}
                          {sub.name}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(sub);
                              setCategoryForm(sub);
                              setShowCategoryForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteCategory(sub.id)} className="text-red-600 hover:text-red-800 text-sm">
                            Delete
                          </button>
                        </div>
                      </div>
                      {/* Skills under sub-category */}
                      {sub.skills && sub.skills.length > 0 && (
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          {sub.skills.map((skill) => (
                            <li key={skill.id} className="text-sm text-gray-600">
                              {skill.icon && iconMap[skill.icon] && (
                                <FontAwesomeIcon icon={iconMap[skill.icon]} className="mr-1 text-indigo-400" />
                              )}
                              {skill.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Skills</h3>
          <button
            onClick={() => {
              setEditingSkill(null);
              setSkillForm({ name: '', icon: '', level: 0, order: 0, skill_category_id: '' });
              setShowSkillForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Skill
          </button>
        </div>

        {showSkillForm && (
          <form onSubmit={handleSkillSubmit} className="bg-white rounded-xl shadow-md p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">None</option>
                  <option value="FaCode">FaCode</option>
                  <option value="FaDatabase">FaDatabase</option>
                  <option value="FaServer">FaServer</option>
                  <option value="FaCloud">FaCloud</option>
                  <option value="FaCogs">FaCogs</option>
                  <option value="FaLaptopCode">FaLaptopCode</option>
                  <option value="FaBrain">FaBrain</option>
                  <option value="FaRocket">FaRocket</option>
                  <option value="FaGlobe">FaGlobe</option>
                  <option value="FaMobileAlt">FaMobileAlt</option>
                  <option value="FaPalette">FaPalette</option>
                  <option value="FaChartLine">FaChartLine</option>
                  <option value="FaPuzzlePiece">FaPuzzlePiece</option>
                  <option value="FaClipboardList">FaClipboardList</option>
                  <option value="FaLink">FaLink</option>
                  <option value="FaTable">FaTable</option>
                  <option value="FaBolt">FaBolt</option>
                  <option value="FaLayerGroup">FaLayerGroup</option>
                  <option value="FaExchangeAlt">FaExchangeAlt</option>
                  <option value="FaArchway">FaArchway</option>
                  <option value="FaCube">FaCube</option>
                  <option value="FaObjectGroup">FaObjectGroup</option>
                  <option value="FaDraftingCompass">FaDraftingCompass</option>
                  <option value="FaSearch">FaSearch</option>
                  <option value="FaPeopleArrows">FaPeopleArrows</option>
                  <option value="FaNetworkWired">FaNetworkWired</option>
                  <option value="FaLock">FaLock</option>
                  <option value="FaCheckCircle">FaCheckCircle</option>
                  <option value="FaClock">FaClock</option>
                  <option value="FaBook">FaBook</option>
                  <option value="FaFileCode">FaFileCode</option>
                  <option value="FaWind">FaWind</option>
                  <option value="faGitAlt">faGitAlt</option>
                  <option value="FaPaperPlane">FaPaperPlane</option>
                  <option value="FaUsers">FaUsers</option>
                  <option value="FaBookOpen">FaBookOpen</option>
                  <option value="FaCrown">FaCrown</option>
                  <option value="FaLightbulb">FaLightbulb</option>
                  <option value="FaComments">FaComments</option>
                  <option value="FaArrowsAlt">FaArrowsAlt</option>
                  <option value="FaPython">FaPython</option>
                  <option value="FaJs">FaJs</option>
                  <option value="FaReact">FaReact</option>
                  <option value="FaDocker">FaDocker</option>
                  <option value="FaGithub">FaGithub</option>
                  <option value="FaLinkedin">FaLinkedin</option>
                  <option value="FaTwitter">FaTwitter</option>
                  <option value="FaNodeJs">FaNodeJs</option>
                  <option value="FaJava">FaJava</option>
                  <option value="FaPhp">FaPhp</option>
                  <option value="FaVuejs">FaVuejs</option>
                  <option value="FaAngular">FaAngular</option>
                  <option value="FaAws">FaAws</option>
                  <option value="FaBootstrap">FaBootstrap</option>
                  <option value="FaGitlab">FaGitlab</option>
                  <option value="FaLinux">FaLinux</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={skillForm.skill_category_id}
                  onChange={(e) => setSkillForm({ ...skillForm, skill_category_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  {flattenForDropdown(categories).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={skillForm.order}
                  onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                {editingSkill ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowSkillForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white rounded-xl shadow-md p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div className="w-full sm:w-auto">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center">
                    {skill.icon && iconMap[skill.icon] && (
                      <FontAwesomeIcon icon={iconMap[skill.icon]} className="mr-2 text-indigo-600" />
                    )}
                    {skill.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Category: {getCategoryName(skill.skill_category_id)}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setEditingSkill(skill);
                      setSkillForm(skill);
                      setShowSkillForm(true);
                    }}
                    className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;