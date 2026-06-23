import { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';

export function useWeightStats() {
  const { weightLogs, settings } = useAppData();

  const sorted = useMemo(
    () => [...weightLogs].sort((a, b) => new Date(a.recordDate) - new Date(b.recordDate)),
    [weightLogs]
  );

  const latest = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  const change = useMemo(() => {
    if (!latest || !previous) return null;
    return latest.weight - previous.weight;
  }, [latest, previous]);

  const chartData = useMemo(
    () =>
      sorted.map((log) => ({
        date: log.recordDate,
        label: new Date(log.recordDate).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
        }),
        weight: log.weight,
      })),
    [sorted]
  );

  const remainingToTarget = useMemo(() => {
    if (!latest || settings.targetWeight === null || settings.targetWeight === undefined) return null;
    return settings.targetWeight - latest.weight;
  }, [latest, settings.targetWeight]);

  return {
    sorted,
    latest,
    previous,
    change,
    chartData,
    targetWeight: settings.targetWeight,
    remainingToTarget,
  };
}
