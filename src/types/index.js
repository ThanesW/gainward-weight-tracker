/**
 * Type definitions for the Gainward app.
 * Plain JS project — these JSDoc typedefs give editor intellisense
 * and serve as the single source of truth for data shapes.
 */

/**
 * @typedef {Object} FoodLog
 * @property {string} id - UUID
 * @property {string} foodName - Name of the food/dish
 * @property {number} quantity - Numeric quantity (supports fractions like 0.5)
 * @property {string} unit - Unit label (e.g. "จาน", "ชาม", custom string if "อื่นๆ")
 * @property {string} eatDateTime - ISO 8601 datetime string of when it was eaten
 * @property {string|null} photoPath - Path inside the Supabase 'photos' storage bucket, or null
 * @property {string|null} photoUrl - Public URL derived from photoPath, for display
 * @property {string} createdAt - ISO 8601 datetime string of record creation
 * @property {string} updatedAt - ISO 8601 datetime string of last update
 */

/**
 * @typedef {Object} WeightLog
 * @property {string} id - UUID
 * @property {number} weight - Weight value in kg
 * @property {string} recordDate - ISO 8601 datetime string of when weight was recorded
 */

/**
 * @typedef {Object} UserSettings
 * @property {number|null} targetWeight - Goal weight in kg
 * @property {string[]} favoriteFoods - List of favorited food names
 * @property {'light'|'dark'|'system'} theme - Theme preference
 */

/**
 * @typedef {'day'|'week'|'month'} DateFilterRange
 */

export const QUANTITY_PRESETS = ['1/4', '1/3', '1/2', '1', '3/2', '2', '3', '4', 'Custom'];

export const UNIT_OPTIONS = [
  'จาน', 'ชาม', 'ถ้วย', 'ถาด', 'ก้อน', 'ชิ้น',
  'ถุง', 'แก้ว', 'ขวด', 'กล่อง', 'ซอง', 'ลูก', 'ฟอง', 'อื่นๆ',
];

export const OTHER_UNIT_VALUE = 'อื่นๆ';
export const CUSTOM_QUANTITY_VALUE = 'Custom';
