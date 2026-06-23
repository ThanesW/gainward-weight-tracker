import { useNavigate } from 'react-router-dom';

/**
 * PageHeader — sticky top bar. Shows a back button when `back` is true,
 * otherwise shows the theme toggle on the right (used on the Dashboard).
 */
export default function PageHeader({ title, back = false, right = null }) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-20 bg-cream/95 dark:bg-ink-dark-bg/95 backdrop-blur
                 border-b border-line dark:border-line-dark
                 pt-[env(safe-area-inset-top)]"
    >
      <div className="flex items-center justify-between px-4 py-3.5 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {back && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="-ml-1.5 p-1.5 rounded-lg text-ink-soft hover:bg-cream-soft dark:text-cream-dark-text dark:hover:bg-ink-dark-surface"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <h1 className="font-display text-xl font-semibold text-ink dark:text-cream-dark-text truncate">
            {title}
          </h1>
        </div>
        {right && <div className="flex items-center gap-1.5">{right}</div>}
      </div>
    </header>
  );
}
