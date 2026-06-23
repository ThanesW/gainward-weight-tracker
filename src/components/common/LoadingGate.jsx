import { useAppData } from '../../context/AppDataContext';

export default function LoadingGate({ children }) {
  const { loading, loadError, configMissing } = useAppData();

  if (configMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-ink-dark-bg px-6">
        <div className="text-center max-w-sm">
          <p className="font-display text-lg font-semibold text-ink dark:text-cream-dark-text">
            Supabase isn't set up yet
          </p>
          <p className="mt-2 text-sm text-ink-soft dark:text-cream-dark-text/70">
            Copy <code className="font-mono text-xs bg-cream-soft dark:bg-ink-dark-surface px-1 py-0.5 rounded">.env.example</code> to{' '}
            <code className="font-mono text-xs bg-cream-soft dark:bg-ink-dark-surface px-1 py-0.5 rounded">.env.local</code> and fill in
            your Supabase project URL and anon key, then restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-ink-dark-bg px-6">
        <div className="text-center max-w-sm">
          <p className="font-display text-lg font-semibold text-ink dark:text-cream-dark-text">
            Couldn't connect
          </p>
          <p className="mt-2 text-sm text-ink-soft dark:text-cream-dark-text/70">
            Gainward couldn't reach the database. Check your internet connection, or that the
            Supabase URL and key are configured correctly, then reload.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-ink-dark-bg">
        <div
          className="h-8 w-8 rounded-full border-2 border-clay/30 border-t-clay animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return children;
}
