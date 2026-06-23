import { useNavigate } from 'react-router-dom';

/**
 * FAB — floating action button, fixed bottom-right, opens Add Food Log page.
 * Sits above the bottom nav on mobile.
 */
export default function FAB() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/add')}
      aria-label="Add new food log"
      className="fixed z-40 right-5 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-8
                 h-14 w-14 rounded-full bg-clay text-cream shadow-lg shadow-clay/30
                 flex items-center justify-center
                 transition-transform duration-150 active:scale-90 hover:bg-clay-dark"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
