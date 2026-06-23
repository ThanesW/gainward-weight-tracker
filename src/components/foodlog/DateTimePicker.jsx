import { toLocalDateInputValue } from '../../utils/dateUtils';

/**
 * DateTimePicker
 * Props:
 *  - isHistorical: boolean
 *  - dateValue: string (YYYY-MM-DD)
 *  - timeValue: string (HH:mm)
 *  - onToggleHistorical, onDateChange, onTimeChange: setters
 */
export default function DateTimePicker({
  isHistorical,
  dateValue,
  timeValue,
  onToggleHistorical,
  onDateChange,
  onTimeChange,
}) {
  const now = new Date();

  return (
    <div className="space-y-3">
      {!isHistorical && (
        <div
          className="rounded-xl border border-line dark:border-line-dark bg-cream-soft dark:bg-ink-dark-surface
                     px-4 py-3 text-sm text-ink-soft dark:text-cream-dark-text/70"
        >
          Using current time —{' '}
          <span className="font-medium text-ink dark:text-cream-dark-text">
            {now.toLocaleString(undefined, {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      )}

      <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
        <input
          type="checkbox"
          checked={isHistorical}
          onChange={(e) => onToggleHistorical(e.target.checked)}
          className="h-5 w-5 rounded-md border-line dark:border-line-dark text-clay accent-[var(--color-clay)] cursor-pointer"
        />
        <span className="text-sm font-medium text-ink dark:text-cream-dark-text">
          Record historical entry
        </span>
      </label>

      {isHistorical && (
        <div className="grid grid-cols-2 gap-3 rise-in">
          <div>
            <label htmlFor="entry-date" className="block text-xs font-medium text-ink-soft dark:text-cream-dark-text/60 mb-1.5">
              Date
            </label>
            <input
              id="entry-date"
              type="date"
              value={dateValue}
              max={toLocalDateInputValue(now)}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                         px-3.5 py-3 text-sm text-ink dark:text-cream-dark-text focus:border-clay outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="entry-time" className="block text-xs font-medium text-ink-soft dark:text-cream-dark-text/60 mb-1.5">
              Time
            </label>
            <input
              id="entry-time"
              type="time"
              value={timeValue}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                         px-3.5 py-3 text-sm text-ink dark:text-cream-dark-text focus:border-clay outline-none transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
}
