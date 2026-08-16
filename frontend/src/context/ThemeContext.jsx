import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * ThemeContext - Manages dark/light theme state.
 */
const ThemeContext = createContext(null);

/**
 * ThemeProvider component - Wraps the app and provides theme context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to wrap
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  /**
   * Toggle between dark and light mode.
   */
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the ThemeContext.
 *
 * @returns {Object} Theme context values
 * @throws {Error} If used outside of ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};