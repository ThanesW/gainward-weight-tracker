import { useEffect, useRef } from 'react';
import Button from './Button';

/**
 * ConfirmDialog — modal confirmation, used before destructive actions (delete).
 *
 * Props:
 *  - open: boolean
 *  - title: string
 *  - message: string
 *  - confirmLabel / cancelLabel: string
 *  - onConfirm / onCancel: () => void
 *  - danger: boolean — style confirm button as destructive
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = true,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      const onKey = (e) => {
        if (e.key === 'Escape') onCancel?.();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-[2px] px-4 pb-4 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full sm:max-w-sm bg-cream dark:bg-ink-dark-surface rounded-card border border-line dark:border-line-dark p-5 rise-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="font-display text-lg font-semibold text-ink dark:text-cream-dark-text">
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-sm text-ink-soft dark:text-cream-dark-text/70">{message}</p>
        )}
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" full onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={danger ? 'danger' : 'primary'}
            full
            className={danger ? 'bg-red-600 text-white hover:bg-red-700' : ''}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
