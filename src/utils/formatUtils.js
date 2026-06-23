/**
 * formatUtils.js
 * ID generation, quantity/fraction parsing, and display formatting helpers.
 */

/** Generates a RFC4122-ish UUID. Falls back gracefully if crypto.randomUUID is unavailable. */
export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/**
 * Converts a quantity preset string (which may be a fraction like "1/2" or "3/2")
 * into a numeric value. Returns NaN if unparseable.
 */
export function parseQuantityValue(value) {
  if (value === 'Custom') return NaN;
  if (typeof value === 'number') return value;
  if (value.includes('/')) {
    const [num, denom] = value.split('/').map(Number);
    if (!denom) return NaN;
    return num / denom;
  }
  return parseFloat(value);
}

/**
 * Formats a numeric quantity back into a friendly display string.
 * Tries to match it back to a known fraction preset; otherwise shows the raw number.
 */
const FRACTION_DISPLAY_MAP = [
  { value: 0.25, label: '1/4' },
  { value: 1 / 3, label: '1/3' },
  { value: 0.5, label: '1/2' },
  { value: 1.5, label: '3/2' },
];

export function formatQuantity(num) {
  if (Number.isInteger(num)) return String(num);
  const match = FRACTION_DISPLAY_MAP.find((f) => Math.abs(f.value - num) < 0.001);
  if (match) return match.label;
  // Round to 2 decimals for any other custom fractional input
  return String(Math.round(num * 100) / 100);
}

/** Capitalizes the first letter of a string. */
export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Clamp a number between min and max. */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/** Formats weight with one decimal place and "kg" suffix. */
export function formatWeight(weight) {
  if (weight === null || weight === undefined || Number.isNaN(weight)) return '—';
  return `${Number(weight).toFixed(1)} kg`;
}

/** Formats a +/- weight delta, e.g. "+0.4 kg" or "−0.2 kg". Uses a true minus sign for negatives. */
export function formatWeightDelta(delta) {
  if (delta === null || delta === undefined || Number.isNaN(delta)) return '—';
  const rounded = Math.round(Math.abs(delta) * 10) / 10;
  if (rounded === 0) return '±0.0 kg';
  const sign = delta > 0 ? '+' : '−';
  return `${sign}${rounded.toFixed(1)} kg`;
}
