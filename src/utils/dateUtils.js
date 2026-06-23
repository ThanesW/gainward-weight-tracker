/**
 * dateUtils.js
 * Date formatting and range-filtering helpers used across the app.
 */

/** Returns YYYY-MM-DD in local time (not UTC) for a Date object. */
export function toLocalDateInputValue(date) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

/** Returns HH:mm in local time for a Date object. */
export function toLocalTimeInputValue(date) {
  const d = new Date(date);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Combines a YYYY-MM-DD date string and HH:mm time string into an ISO datetime string. */
export function combineDateAndTime(dateStr, timeStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return d.toISOString();
}

/** Human friendly: "Today, 14:30" / "Yesterday, 09:00" / "12 Jun, 18:45" */
export function formatRelativeDateTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = isSameDay(date, now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = isSameDay(date, yesterday);

  const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;

  const dateLabel = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return `${dateLabel}, ${time}`;
}

/** Full readable datetime, e.g. "18 Jun 2026, 14:30" */
export function formatFullDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns the Monday-start week range [start, end] (end exclusive) containing `date`. */
export function getWeekRange(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return [start, end];
}

/** Returns [start, end) of the calendar day containing `date`. */
export function getDayRange(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return [start, end];
}

/** Returns [start, end) of the calendar month containing `date`. */
export function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return [start, end];
}

/**
 * Filters an array of items (with a `eatDateTime` or `recordDate` ISO field)
 * to those falling within the given range type, anchored to "now".
 * @param {Array} items
 * @param {'day'|'week'|'month'|'all'} range
 * @param {string} dateField - property name holding the ISO datetime
 */
export function filterByRange(items, range, dateField = 'eatDateTime') {
  if (range === 'all') return items;
  const now = new Date();
  let start, end;
  if (range === 'day') [start, end] = getDayRange(now);
  else if (range === 'week') [start, end] = getWeekRange(now);
  else if (range === 'month') [start, end] = getMonthRange(now);
  else return items;

  return items.filter((item) => {
    const t = new Date(item[dateField]);
    return t >= start && t < end;
  });
}

/** Weekday name, e.g. "Monday" */
export function getWeekdayName(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, { weekday: 'long' });
}

/** Sort items by a datetime field, descending (newest first). Returns a new array. */
export function sortByDateDesc(items, dateField = 'eatDateTime') {
  return [...items].sort((a, b) => new Date(b[dateField]) - new Date(a[dateField]));
}
