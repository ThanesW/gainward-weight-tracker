/**
 * RecentFoodsQuickSelect
 * Shows up to N recent food names as tappable chips for fast entry.
 */
export default function RecentFoodsQuickSelect({ foods, favorites = [], onSelect, limit = 6 }) {
  const items = foods.slice(0, limit);
  if (items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50 mb-2">
        Quick select
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="px-3.5 py-1.5 rounded-full border border-line dark:border-line-dark
                       bg-white dark:bg-ink-dark-surface text-sm text-ink dark:text-cream-dark-text
                       hover:border-clay hover:text-clay transition-colors flex items-center gap-1.5"
          >
            {favorites.includes(name) && <span aria-hidden="true">⭐</span>}
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
