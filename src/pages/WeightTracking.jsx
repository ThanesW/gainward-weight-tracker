import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AddWeightForm from '../components/weight/AddWeightForm';
import WeightChart from '../components/weight/WeightChart';
import WeightLogListItem from '../components/weight/WeightLogListItem';
import { useAppData } from '../context/AppDataContext';
import { useWeightStats } from '../hooks/useWeightStats';
import { formatWeight, formatWeightDelta } from '../utils/formatUtils';

export default function WeightTracking() {
  const { addWeightLog, deleteWeightLog, settings, updateSettings } = useAppData();
  const { sorted, latest, change, chartData, targetWeight } = useWeightStats();

  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(targetWeight ?? '');
  const [isSavingWeight, setIsSavingWeight] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const reversedHistory = [...sorted].reverse(); // newest first for the list

  const handleAddWeight = async (data) => {
    setIsSavingWeight(true);
    const created = await addWeightLog(data);
    setIsSavingWeight(false);
    if (created) setShowForm(false);
  };

  const handleSaveTarget = async (e) => {
    e.preventDefault();
    const num = parseFloat(targetInput);
    await updateSettings({ targetWeight: Number.isFinite(num) && num > 0 ? num : null });
    setEditingTarget(false);
  };

  return (
    <div className="min-h-full pb-28">
      <PageHeader title="Weight tracking" back />

      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
                Latest weight
              </p>
              <p className="font-display text-3xl font-semibold text-ink dark:text-cream-dark-text mt-1">
                {latest ? formatWeight(latest.weight) : '—'}
              </p>
              {change !== null && (
                <p
                  className={`mt-1 text-sm font-medium ${
                    change > 0 ? 'text-moss' : change < 0 ? 'text-clay' : 'text-ink-soft'
                  }`}
                >
                  {formatWeightDelta(change)} since last entry
                </p>
              )}
            </div>
            <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Close' : 'Add weight'}</Button>
          </div>

          {showForm && (
            <div className="mt-5 pt-5 border-t border-line dark:border-line-dark rise-in">
              <AddWeightForm onSubmit={handleAddWeight} onCancel={() => setShowForm(false)} isSaving={isSavingWeight} />
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold text-ink dark:text-cream-dark-text">
              Trend
            </h2>
          </div>
          <WeightChart data={chartData} targetWeight={targetWeight} />
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
                Target weight
              </p>
              {!editingTarget && (
                <p className="text-lg font-semibold text-ink dark:text-cream-dark-text mt-0.5">
                  {targetWeight ? formatWeight(targetWeight) : 'Not set'}
                </p>
              )}
            </div>
            {!editingTarget && (
              <Button variant="secondary" onClick={() => setEditingTarget(true)}>
                {targetWeight ? 'Edit' : 'Set target'}
              </Button>
            )}
          </div>

          {editingTarget && (
            <form onSubmit={handleSaveTarget} className="mt-4 flex gap-3 rise-in">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                autoFocus
                placeholder="e.g. 65"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="flex-1 rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                           px-4 py-2.5 text-base text-ink dark:text-cream-dark-text
                           placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors"
              />
              <Button type="submit">Save</Button>
            </form>
          )}
        </Card>

        <section>
          <h2 className="font-display text-base font-semibold text-ink dark:text-cream-dark-text mb-3">
            History
          </h2>
          {reversedHistory.length === 0 ? (
            <EmptyState
              icon={
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 17l5-5 4 3 7-8M14 7h5v5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              title="No weight records yet"
              message="Add your first weight record to start tracking your trend."
            />
          ) : (
            <Card className="divide-y divide-line dark:divide-line-dark overflow-hidden">
              {reversedHistory.map((log) => (
                <WeightLogListItem key={log.id} log={log} onDelete={setPendingDelete} />
              ))}
            </Card>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this weight record?"
        message={
          pendingDelete
            ? `This will remove the ${formatWeight(pendingDelete.weight)} record. This can't be undone.`
            : ''
        }
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        onConfirm={async () => {
          setIsDeleting(true);
          const success = await deleteWeightLog(pendingDelete.id);
          setIsDeleting(false);
          if (success) setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
