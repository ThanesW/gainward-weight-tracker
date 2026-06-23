import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { filterByRange, sortByDateDesc, getWeekdayName } from '../utils/dateUtils';

/**
 * useFoodLogStats
 * @param {'day'|'week'|'month'|'all'} range
 * @param {string} searchTerm - optional case-insensitive search on foodName
 */
export function useFoodLogStats(range = 'all', searchTerm = '') {
  const { foodLogs } = useAppData();

  const filteredLogs = useMemo(() => {
    let logs = filterByRange(foodLogs, range, 'eatDateTime');
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      logs = logs.filter((log) => log.foodName.toLowerCase().includes(term));
    }
    return sortByDateDesc(logs, 'eatDateTime');
  }, [foodLogs, range, searchTerm]);

  const summary = useMemo(() => {
    const totalMeals = filteredLogs.length;

    // Group by calendar day (local) to compute days-with-logs and per-day counts
    const dayBuckets = new Map();
    filteredLogs.forEach((log) => {
      const d = new Date(log.eatDateTime);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      dayBuckets.set(key, (dayBuckets.get(key) || 0) + 1);
    });

    const activeDayCount = dayBuckets.size;
    const averageMealsPerDay = activeDayCount > 0 ? totalMeals / activeDayCount : 0;

    // Most active eating day: weekday with the highest total meal count
    const weekdayBuckets = new Map();
    filteredLogs.forEach((log) => {
      const name = getWeekdayName(log.eatDateTime);
      weekdayBuckets.set(name, (weekdayBuckets.get(name) || 0) + 1);
    });
    let mostActiveDay = null;
    let mostActiveDayCount = 0;
    weekdayBuckets.forEach((count, name) => {
      if (count > mostActiveDayCount) {
        mostActiveDayCount = count;
        mostActiveDay = name;
      }
    });

    return {
      totalMeals,
      averageMealsPerDay: Math.round(averageMealsPerDay * 10) / 10,
      mostActiveDay,
      mostActiveDayCount,
    };
  }, [filteredLogs]);

  return { filteredLogs, summary };
}
