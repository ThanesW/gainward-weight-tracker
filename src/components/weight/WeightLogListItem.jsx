import { formatFullDateTime } from '../../utils/dateUtils';
import { formatWeight } from '../../utils/formatUtils';

export default function WeightLogListItem({ log, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="font-medium text-ink dark:text-cream-dark-text">{formatWeight(log.weight)}</p>
        <p className="text-sm text-ink-soft/80 dark:text-cream-dark-text/60">
          {formatFullDateTime(log.recordDate)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(log)}
        aria-label={`Delete weight record of ${log.weight} kg`}
        className="p-2 rounded-lg text-ink-soft/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m1.5 0L18.5 19a1 1 0 01-1 1H6.5a1 1 0 01-1-1L5.5 7h13z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
