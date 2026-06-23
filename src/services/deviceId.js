/**
 * deviceId.js
 *
 * Since this app has no login, every row in Supabase is tagged with a
 * `device_id` — a random UUID generated once and stored in this browser's
 * localStorage forever. It's the closest thing to a "user id" without auth.
 *
 * IMPORTANT SECURITY NOTE:
 * Without real authentication, anyone who discovers this UUID (e.g. by
 * reading it out of localStorage, or via browser devtools) could read or
 * write that device's rows in Supabase, since the anon key + RLS policies
 * allow any anon request through. This is "security by obscurity" — fine
 * for a private personal app, not a substitute for real auth if this app
 * is ever shared with other people.
 */

const DEVICE_ID_KEY = 'gainward:deviceId';

/** Returns this browser's persistent device ID, creating one on first run. */
export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateUuid();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
