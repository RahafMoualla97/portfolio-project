import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

/**
 * Navbar component - Main navigation bar with user authentication and theme toggle.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          Rahaf Moualla
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Home
          </Link>
          <Link
            to="/projects"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
            >
              Login
            </Link>
          )}
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-xl"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-xl"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-2xl"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 py-4 px-4 transition-colors">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2"
            >
              Home
            </Link>
            <Link
              to="/projects"
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2"
            >
              Projects
            </Link>
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2"
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition text-left py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;