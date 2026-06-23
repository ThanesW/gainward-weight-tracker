import { useState } from 'react';
import Button from '../common/Button';

export default function AddWeightForm({ onSubmit, onCancel, isSaving = false }) {
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(weight);
    if (!Number.isFinite(num) || num <= 0) {
      setError('Enter a valid weight in kilograms.');
      return;
    }
    if (num > 500) {
      setError('That weight looks too high — double check it.');
      return;
    }
    onSubmit({ weight: num, recordDate: new Date().toISOString() });
    setWeight('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="weight-input" className="block text-xs font-medium text-ink-soft dark:text-cream-dark-text/60 mb-1.5">
          Weight (kg)
        </label>
        <input
          id="weight-input"
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          autoFocus
          placeholder="e.g. 58.5"
          value={weight}
          disabled={isSaving}
          onChange={(e) => {
            setWeight(e.target.value);
            setError('');
          }}
          className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                     px-4 py-3 text-base text-ink dark:text-cream-dark-text
                     placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors
                     disabled:opacity-60"
        />
        {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="secondary" full onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        )}
        <Button type="submit" full disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save record'}
        </Button>
      </div>
    </form>
  );
}
