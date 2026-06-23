import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { formatWeight, formatWeightDelta } from '../../utils/formatUtils';
import { useWeightStats } from '../../hooks/useWeightStats';

/** Builds a smooth SVG path string from chart points, scaled into a viewBox. */
function buildSparklinePath(points, width, height, padding = 6) {
  if (points.length === 0) return '';
  const values = points.map((p) => p.weight);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = points.length === 1 ? width / 2 : padding + (i / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p.weight - min) / range) * (height - padding * 2);
    return [x, y];
  });

  return coords.reduce((acc, [x, y], i) => acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`), '');
}

export default function WeightSummaryCard() {
  const { latest, change, targetWeight, remainingToTarget, chartData } = useWeightStats();

  const recentPoints = chartData.slice(-10);
  const path = buildSparklinePath(recentPoints, 120, 48);

  const isGain = change !== null && change > 0;
  const isLoss = change !== null && change < 0;

  return (
    <Link to="/weight" className="block">
      <Card className="p-5 hover:border-clay/40 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
              Latest weight
            </p>
            <p className="font-display text-3xl font-semibold text-ink dark:text-cream-dark-text mt-1">
              {latest ? formatWeight(latest.weight) : '—'}
            </p>
            {change !== null && (
              <p
                className={`mt-1 text-sm font-medium ${
                  isGain ? 'text-moss dark:text-moss' : isLoss ? 'text-clay' : 'text-ink-soft'
                }`}
              >
                {formatWeightDelta(change)} since last entry
              </p>
            )}
          </div>

          {recentPoints.length > 1 && (
            <svg width="120" height="48" viewBox="0 0 120 48" className="shrink-0 mt-1" aria-hidden="true">
              <path
                d={path}
                fill="none"
                stroke="var(--color-moss)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sparkline-path"
              />
            </svg>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-line dark:border-line-dark flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
              Target weight
            </p>
            <p className="text-base font-semibold text-ink dark:text-cream-dark-text mt-0.5">
              {targetWeight ? formatWeight(targetWeight) : 'Not set'}
            </p>
          </div>
          {remainingToTarget !== null && (
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
                To go
              </p>
              <p className="text-base font-semibold text-gold mt-0.5">
                {remainingToTarget > 0 ? `${remainingToTarget.toFixed(1)} kg` : 'Reached 🎉'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
