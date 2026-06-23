const RANGES = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'all', label: 'All' },
];

export default function RangeFilterTabs({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter food logs by date range"
      className="inline-flex p-1 rounded-xl bg-cream-soft dark:bg-ink-dark-surface gap-1"
    >
      {RANGES.map((r) => {
        const active = value === r.value;
        return (
          <button
            key={r.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(r.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-clay text-cream shadow-sm'
                : 'text-ink-soft dark:text-cream-dark-text/70 hover:text-ink dark:hover:text-cream-dark-text'
            }`}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}
