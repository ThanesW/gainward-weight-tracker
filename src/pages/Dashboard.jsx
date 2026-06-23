import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import ThemeToggle from '../components/common/ThemeToggle';
import FAB from '../components/common/FAB';
import EmptyState from '../components/common/EmptyState';
import WeightSummaryCard from '../components/dashboard/WeightSummaryCard';
import RangeFilterTabs from '../components/dashboard/RangeFilterTabs';
import SummaryStatsGrid from '../components/dashboard/SummaryStatsGrid';
import FoodLogListItem from '../components/dashboard/FoodLogListItem';
import { useFoodLogStats } from '../hooks/useFoodLogStats';

export default function Dashboard() {
  const [range, setRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const { filteredLogs, summary } = useFoodLogStats(range, searchTerm);

  return (
    <div className="min-h-full pb-28">
      <PageHeader title="Gainward" right={<ThemeToggle />} />

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        <WeightSummaryCard />

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-ink dark:text-cream-dark-text">
              Food log
            </h2>
            <RangeFilterTabs value={range} onChange={setRange} />
          </div>

          <SummaryStatsGrid summary={summary} />
        </section>

        <section>
          <div className="relative mb-3">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/50"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search food history"
              className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                         pl-10 pr-4 py-2.5 text-sm text-ink dark:text-cream-dark-text
                         placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors"
            />
          </div>

          {filteredLogs.length === 0 ? (
            <EmptyState
              icon={
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 3v6a2 2 0 002 2v10M7 3a2 2 0 00-2 2v4a2 2 0 002 2M17 3v18M17 3c-2 0-3 1.5-3 4v3a2 2 0 002 2h1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title={searchTerm ? 'No matching meals' : 'No meals logged yet'}
              message={
                searchTerm
                  ? 'Try a different search term.'
                  : 'Tap the + button to log your first meal and start building momentum.'
              }
            />
          ) : (
            <div className="bg-white dark:bg-ink-dark-surface border border-line dark:border-line-dark rounded-card divide-y divide-line dark:divide-line-dark overflow-hidden mb-20">
              {filteredLogs.map((log) => (
                <FoodLogListItem key={log.id} log={log} />
              ))}
            </div>
          )}
        </section>
      </main>

      <FAB />
    </div>
  );
}
