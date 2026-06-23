/**
 * storageService.js
 *
 * Single source of truth for all data reads/writes against Supabase.
 * No other file should import supabaseClient directly — that keeps
 * table names, column mapping, and error handling in one place.
 *
 * Every function here is async (network calls), unlike the old
 * LocalStorage version. Every row is scoped to the current device's
 * device_id (see deviceId.js) since there is no login in this app.
 */

import { supabase, PHOTOS_BUCKET } from './supabaseClient';
import { getDeviceId } from './deviceId';

const DEFAULT_SETTINGS = {
  targetWeight: null,
  favoriteFoods: [],
  theme: 'system',
};

// ---------- mapping helpers: snake_case (DB) <-> camelCase (app) ----------

function mapFoodLogFromDb(row) {
  return {
    id: row.id,
    foodName: row.food_name,
    quantity: Number(row.quantity),
    unit: row.unit,
    eatDateTime: row.eat_date_time,
    photoPath: row.photo_path,
    photoUrl: row.photo_path ? getPhotoPublicUrl(row.photo_path) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWeightLogFromDb(row) {
  return {
    id: row.id,
    weight: Number(row.weight),
    recordDate: row.record_date,
  };
}

// ---------- Food Logs ----------

/** @returns {Promise<import('../types').FoodLog[]>} */
export async function getFoodLogs() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('device_id', deviceId)
    .order('eat_date_time', { ascending: false });

  if (error) {
    console.error('storageService: failed to fetch food logs', error);
    return [];
  }
  return data.map(mapFoodLogFromDb);
}

/**
 * Creates a new food log row.
 * @param {{foodName: string, quantity: number, unit: string, eatDateTime: string, photoPath?: string|null}} data
 * @returns {Promise<import('../types').FoodLog|null>}
 */
export async function createFoodLog(data) {
  const deviceId = getDeviceId();
  const { data: row, error } = await supabase
    .from('food_logs')
    .insert({
      device_id: deviceId,
      food_name: data.foodName,
      quantity: data.quantity,
      unit: data.unit,
      eat_date_time: data.eatDateTime,
      photo_path: data.photoPath ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('storageService: failed to create food log', error);
    return null;
  }
  return mapFoodLogFromDb(row);
}

/**
 * Updates an existing food log row. Pass only the fields that changed.
 * @param {string} id
 * @param {Partial<{foodName: string, quantity: number, unit: string, eatDateTime: string, photoPath: string|null, isFavorite: boolean}>} data
 */
export async function updateFoodLogRow(id, data) {
  const payload = { updated_at: new Date().toISOString() };
  if (data.foodName !== undefined) payload.food_name = data.foodName;
  if (data.quantity !== undefined) payload.quantity = data.quantity;
  if (data.unit !== undefined) payload.unit = data.unit;
  if (data.eatDateTime !== undefined) payload.eat_date_time = data.eatDateTime;
  if (data.photoPath !== undefined) payload.photo_path = data.photoPath;

  const { data: row, error } = await supabase
    .from('food_logs')
    .update(payload)
    .eq('id', id)
    .eq('device_id', getDeviceId())
    .select()
    .single();

  if (error) {
    console.error('storageService: failed to update food log', error);
    return null;
  }
  return mapFoodLogFromDb(row);
}

/** @param {string} id */
export async function deleteFoodLogRow(id) {
  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id)
    .eq('device_id', getDeviceId());

  if (error) {
    console.error('storageService: failed to delete food log', error);
    return false;
  }
  return true;
}

// ---------- Food photos (Supabase Storage) ----------

/**
 * Uploads a food photo and returns the storage path to save on the food_logs row.
 * @param {File|Blob} file
 * @returns {Promise<string|null>} storage path, or null on failure
 */
export async function uploadFoodPhoto(file) {
  const deviceId = getDeviceId();
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
  const path = `${deviceId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(PHOTOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('storageService: failed to upload photo', error);
    return null;
  }
  return path;
}

/** @param {string} path */
export async function deleteFoodPhoto(path) {
  if (!path) return true;
  const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove([path]);
  if (error) {
    console.error('storageService: failed to delete photo', error);
    return false;
  }
  return true;
}

/** @param {string} path @returns {string} public URL for displaying the photo */
export function getPhotoPublicUrl(path) {
  if (!path) return null;
  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Weight Logs ----------

/** @returns {Promise<import('../types').WeightLog[]>} */
export async function getWeightLogs() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('device_id', deviceId)
    .order('record_date', { ascending: true });

  if (error) {
    console.error('storageService: failed to fetch weight logs', error);
    return [];
  }
  return data.map(mapWeightLogFromDb);
}

/** @param {{weight: number, recordDate?: string}} data */
export async function createWeightLog(data) {
  const deviceId = getDeviceId();
  const { data: row, error } = await supabase
    .from('weight_logs')
    .insert({
      device_id: deviceId,
      weight: data.weight,
      record_date: data.recordDate || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('storageService: failed to create weight log', error);
    return null;
  }
  return mapWeightLogFromDb(row);
}

/** @param {string} id */
export async function deleteWeightLogRow(id) {
  const { error } = await supabase
    .from('weight_logs')
    .delete()
    .eq('id', id)
    .eq('device_id', getDeviceId());

  if (error) {
    console.error('storageService: failed to delete weight log', error);
    return false;
  }
  return true;
}

// ---------- Settings (one row per device) ----------

/** @returns {Promise<import('../types').UserSettings>} */
export async function getSettings() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (error) {
    console.error('storageService: failed to fetch settings', error);
    return DEFAULT_SETTINGS;
  }
  if (!data) return DEFAULT_SETTINGS;

  return {
    targetWeight: data.target_weight !== null ? Number(data.target_weight) : null,
    favoriteFoods: data.favorite_foods || [],
    theme: data.theme || 'system',
  };
}

/** @param {import('../types').UserSettings} settings */
export async function saveSettings(settings) {
  const deviceId = getDeviceId();
  const { error } = await supabase.from('settings').upsert({
    device_id: deviceId,
    target_weight: settings.targetWeight,
    favorite_foods: settings.favoriteFoods,
    theme: settings.theme,
  });

  if (error) {
    console.error('storageService: failed to save settings', error);
    return false;
  }
  return true;
}

// ---------- Connectivity check ----------

/**
 * Makes one lightweight request and lets any error propagate (unlike the
 * functions above, which catch their own errors and fall back to empty
 * results). Used on initial load to tell "Supabase is unreachable" apart
 * from "you just don't have any data yet" — those would otherwise look
 * identical to the rest of the app.
 * @returns {Promise<boolean>} true if Supabase responded, false otherwise
 */
export async function checkConnection() {
  const TIMEOUT_MS = 6000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const { error } = await supabase
      .from('settings')
      .select('device_id')
      .limit(1)
      .abortSignal(controller.signal);

    // Unlike most errors here, network failures resolve normally with an
    // `error` field rather than throwing — status 0 / empty statusText is
    // the signature of "the request never reached a server" (DNS failure,
    // offline, wrong URL), as opposed to a real PostgREST/HTTP error
    // response, which would have a status code.
    if (error) {
      console.error('storageService: connection check failed', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('storageService: connection check failed', err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Recent / autocomplete food names ----------
// Derived from food_logs rather than stored separately, since the data
// already lives in Supabase and food names are no longer free in a local cache.

const MAX_RECENT_FOODS = 30;

/**
 * Returns the most recently used distinct food names, most recent first.
 * @returns {Promise<string[]>}
 */
export async function getRecentFoodNames() {
  const deviceId = getDeviceId();
  const { data, error } = await supabase
    .from('food_logs')
    .select('food_name, eat_date_time')
    .eq('device_id', deviceId)
    .order('eat_date_time', { ascending: false })
    .limit(200); // generous window to dedupe from

  if (error) {
    console.error('storageService: failed to fetch recent food names', error);
    return [];
  }

  const seen = new Set();
  const names = [];
  for (const row of data) {
    const key = row.food_name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      names.push(row.food_name);
    }
    if (names.length >= MAX_RECENT_FOODS) break;
  }
  return names;
}
