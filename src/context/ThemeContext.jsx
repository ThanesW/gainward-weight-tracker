import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAppData } from './AppDataContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { settings, updateSettings } = useAppData();
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemPrefersDark(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const isDark = useMemo(() => {
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'light') return false;
    return systemPrefersDark;
  }, [settings.theme, systemPrefersDark]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#1A1510' : '#FBF6EE');
  }, [isDark]);

  const setTheme = useCallback((theme) => updateSettings({ theme }), [updateSettings]);

  const value = useMemo(
    () => ({ isDark, theme: settings.theme, setTheme }),
    [isDark, settings.theme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
