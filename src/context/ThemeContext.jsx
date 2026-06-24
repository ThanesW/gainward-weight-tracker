import { createContext, useContext, useEffect, useMemo } from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider — theme switching has been removed. The app is permanently
 * light mode (the cream/clay palette with the food-pattern background).
 * This still sets up the meta theme-color tag once on mount so the
 * browser chrome (e.g. Android status bar) matches the page background.
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FBF6EE');
  }, []);

  const value = useMemo(() => ({ isDark: false, theme: 'light', setTheme: () => {} }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
