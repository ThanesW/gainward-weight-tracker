import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useAppData } from '../context/AppDataContext';
import { formatFullDateTime } from '../utils/dateUtils';
import { formatQuantity } from '../utils/formatUtils';

export default function FoodLogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFoodLogById, deleteFoodLog, settings, toggleFavoriteFood } = useAppData();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const log = getFoodLogById(id);

  if (!log) {
    return <Navigate to="/" replace />;
  }

  const isFavorite = (settings.favoriteFoods || []).includes(log.foodName);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteFoodLog(log.id);
    if (success) {
      navigate('/');
    } else {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  const rows = [
    { label: 'Food name', value: log.foodName },
    { label: 'Quantity', value: formatQuantity(log.quantity) },
    { label: 'Unit', value: log.unit },
    { label: 'Eaten at', value: formatFullDateTime(log.eatDateTime) },
    { label: 'Created', value: formatFullDateTime(log.createdAt) },
  ];

  if (log.updatedAt && log.updatedAt !== log.createdAt) {
    rows.push({ label: 'Last updated', value: formatFullDateTime(log.updatedAt) });
  }

  return (
    <div className="min-h-full pb-10">
      <PageHeader
        title="Food log detail"
        back
        right={
          <button
            type="button"
            onClick={() => toggleFavoriteFood(log.foodName)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 rounded-lg text-xl hover:bg-cream-soft dark:hover:bg-ink-dark-surface transition-colors"
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        }
      />

      <main className="max-w-2xl mx-auto px-4 pt-5 space-y-5">
        <Card className="overflow-hidden">
          {log.photoUrl && (
            <img src={log.photoUrl} alt={log.foodName} className="w-full h-56 object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              {!log.photoUrl && (
                <div
                  className="w-12 h-12 rounded-full bg-clay/10 dark:bg-clay/20 flex items-center justify-center text-2xl"
                  aria-hidden="true"
                >
                  🍽️
                </div>
              )}
              <div>
                <p className="font-display text-xl font-semibold text-ink dark:text-cream-dark-text">
                  {log.foodName}
                </p>
                <p className="text-sm text-ink-soft dark:text-cream-dark-text/60">
                  {formatQuantity(log.quantity)} {log.unit}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-line dark:divide-line-dark">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
                  <dt className="text-ink-soft dark:text-cream-dark-text/60">{row.label}</dt>
                  <dd className="font-medium text-ink dark:text-cream-dark-text text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" full onClick={() => navigate(`/edit/${log.id}`)}>
            Edit
          </Button>
          <Button
            variant="danger"
            full
            className="border border-red-200 dark:border-red-900/50"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this food log?"
        message={`This will permanently remove "${log.foodName}" from your history. This can't be undone.`}
        confirmLabel={isDeleting ? 'Deleting…' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
