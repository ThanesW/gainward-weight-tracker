import { Link } from 'react-router-dom';
import { formatRelativeDateTime } from '../../utils/dateUtils';
import { formatQuantity } from '../../utils/formatUtils';

export default function FoodLogListItem({ log }) {
  return (
    <Link
      to={`/log/${log.id}`}
      className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl
                 hover:bg-cream-soft dark:hover:bg-ink-dark-surface transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        {log.photoUrl ? (
          <img
            src={log.photoUrl}
            alt=""
            className="shrink-0 w-10 h-10 rounded-full object-cover"
            aria-hidden="true"
          />
        ) : (
          <div
            className="shrink-0 w-10 h-10 rounded-full bg-clay/10 dark:bg-clay/20
                       flex items-center justify-center text-clay font-display font-semibold text-sm"
            aria-hidden="true"
          >
            🍽️
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium text-ink dark:text-cream-dark-text truncate">{log.foodName}</p>
          <p className="text-sm text-ink-soft/80 dark:text-cream-dark-text/60">
            {formatQuantity(log.quantity)} {log.unit}
          </p>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm text-ink-soft dark:text-cream-dark-text/70 whitespace-nowrap">
          {formatRelativeDateTime(log.eatDateTime)}
        </p>
      </div>
    </Link>
  );
}
