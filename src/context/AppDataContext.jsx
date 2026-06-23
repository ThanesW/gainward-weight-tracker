import { createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import * as storageService from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [foodLogs, setFoodLogs] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [settings, setSettings] = useState({ targetWeight: null, favoriteFoods: [], theme: 'system' });
  const [recentFoods, setRecentFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [configMissing, setConfigMissing] = useState(false);

  // Initial fetch from Supabase on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      if (!isSupabaseConfigured) {
        // Don't even attempt network calls — they'll fail anyway, and a
        // dedicated "not configured" message is clearer than a generic
        // connection error for first-time setup.
        if (!cancelled) {
          setConfigMissing(true);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setLoadError(null);
      try {
        const LOAD_TIMEOUT_MS = 10000;
        const timeout = (label) =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out`)), LOAD_TIMEOUT_MS)
          );

        const [foods, weights, userSettings, recent] = await Promise.all([
          Promise.race([storageService.getFoodLogs(), timeout('getFoodLogs')]),
          Promise.race([storageService.getWeightLogs(), timeout('getWeightLogs')]),
          Promise.race([storageService.getSettings(), timeout('getSettings')]),
          Promise.race([storageService.getRecentFoodNames(), timeout('getRecentFoodNames')]),
        ]);
        if (cancelled) return;
        setFoodLogs(foods);
        setWeightLogs(weights);
        setSettings(userSettings);
        setRecentFoods(recent);

        // storageService functions catch their own network errors internally
        // and fall back to empty results, so a total outage looks identical
        // to "you have no data yet" unless we check connectivity directly.
        // A lightweight ping confirms whether Supabase was actually reachable.
        const reachable = await storageService.checkConnection();
        if (!reachable && !cancelled) {
          setLoadError(new Error('Could not reach Supabase'));
        }
      } catch (err) {
        console.error('AppDataProvider: failed to load data', err);
        if (!cancelled) setLoadError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Food Log actions ----------
  // Each action updates local state optimistically after the Supabase call
  // succeeds, so the dashboard doesn't need to refetch the whole list.

  const addFoodLog = useCallback(async (data) => {
    const created = await storageService.createFoodLog(data);
    if (!created) return null;
    setFoodLogs((prev) => [created, ...prev]);
    setRecentFoods((prev) => {
      const withoutDup = prev.filter((n) => n.toLowerCase() !== created.foodName.toLowerCase());
      return [created.foodName, ...withoutDup].slice(0, 30);
    });
    return created;
  }, []);

  const updateFoodLog = useCallback(async (id, data) => {
    const updated = await storageService.updateFoodLogRow(id, data);
    if (!updated) return null;
    setFoodLogs((prev) => prev.map((log) => (log.id === id ? updated : log)));
    if (data.foodName) {
      setRecentFoods((prev) => {
        const withoutDup = prev.filter((n) => n.toLowerCase() !== updated.foodName.toLowerCase());
        return [updated.foodName, ...withoutDup].slice(0, 30);
      });
    }
    return updated;
  }, []);

  const deleteFoodLog = useCallback(async (id) => {
    // Look up the row first so we can also clean up its photo, if any.
    const existing = foodLogs.find((log) => log.id === id);
    const success = await storageService.deleteFoodLogRow(id);
    if (!success) return false;
    if (existing?.photoPath) {
      // Best-effort cleanup; don't block the UI on this.
      storageService.deleteFoodPhoto(existing.photoPath);
    }
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
    return true;
  }, [foodLogs]);

  const getFoodLogById = useCallback(
    (id) => foodLogs.find((log) => log.id === id) || null,
    [foodLogs]
  );

  // ---------- Weight Log actions ----------

  const addWeightLog = useCallback(async (data) => {
    const created = await storageService.createWeightLog(data);
    if (!created) return null;
    setWeightLogs((prev) => [...prev, created]);
    return created;
  }, []);

  const deleteWeightLog = useCallback(async (id) => {
    const success = await storageService.deleteWeightLogRow(id);
    if (!success) return false;
    setWeightLogs((prev) => prev.filter((log) => log.id !== id));
    return true;
  }, []);

  // ---------- Settings / favorites ----------

  const updateSettings = useCallback(async (partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      storageService.saveSettings(next); // fire-and-forget; UI updates immediately
      return next;
    });
  }, []);

  const toggleFavoriteFood = useCallback(async (foodName) => {
    setSettings((prev) => {
      const exists = prev.favoriteFoods.includes(foodName);
      const favoriteFoods = exists
        ? prev.favoriteFoods.filter((f) => f !== foodName)
        : [...prev.favoriteFoods, foodName];
      const next = { ...prev, favoriteFoods };
      storageService.saveSettings(next);
      return next;
    });
  }, []);

  // ---------- Photo upload helper (exposed for the Add Food Log form) ----------

  const uploadFoodPhoto = useCallback(async (file) => {
    return storageService.uploadFoodPhoto(file);
  }, []);

  const uniqueFoodNames = useMemo(() => {
    const names = new Set();
    foodLogs.forEach((log) => names.add(log.foodName));
    recentFoods.forEach((name) => names.add(name));
    return Array.from(names);
  }, [foodLogs, recentFoods]);

  const value = useMemo(
    () => ({
      foodLogs,
      weightLogs,
      settings,
      recentFoods,
      uniqueFoodNames,
      loading,
      loadError,
      configMissing,
      addFoodLog,
      updateFoodLog,
      deleteFoodLog,
      getFoodLogById,
      addWeightLog,
      deleteWeightLog,
      updateSettings,
      toggleFavoriteFood,
      uploadFoodPhoto,
    }),
    [
      foodLogs,
      weightLogs,
      settings,
      recentFoods,
      uniqueFoodNames,
      loading,
      loadError,
      configMissing,
      addFoodLog,
      updateFoodLog,
      deleteFoodLog,
      getFoodLogById,
      addWeightLog,
      deleteWeightLog,
      updateSettings,
      toggleFavoriteFood,
      uploadFoodPhoto,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
}
