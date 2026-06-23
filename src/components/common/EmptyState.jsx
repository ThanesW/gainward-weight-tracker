/**
 * EmptyState — shown when a list has no data yet.
 * icon: a small inline SVG node (kept simple, line-art style to match the brand)
 */
export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 rise-in">
      {icon && (
        <div className="mb-4 text-clay/70 dark:text-clay/80" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-ink dark:text-cream-dark-text">
        {title}
      </h3>
      {message && (
        <p className="mt-1.5 text-sm text-ink-soft dark:text-cream-dark-text/70 max-w-xs">
          {message}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
