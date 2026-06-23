import { useRef, useState, useEffect } from 'react';

/**
 * PhotoCapture
 *
 * A single file input doubles as both "take photo" and "choose from gallery"
 * on mobile, because `capture="environment"` hints the OS to open the camera
 * directly while still allowing the system picker as a fallback. Desktop
 * browsers just show a normal file picker.
 *
 * Props:
 *  - file: File|null — the currently selected file (uncommitted, not yet uploaded)
 *  - existingPhotoUrl: string|null — a public URL for a photo already saved (edit mode)
 *  - onFileSelected: (file: File|null) => void
 *  - onRemoveExisting: () => void — called when the user removes a previously-saved photo
 */
export default function PhotoCapture({ file, existingPhotoUrl, onFileSelected, onRemoveExisting }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) return;
      onFileSelected(selected);
    }
  };

  const displayUrl = previewUrl || existingPhotoUrl;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-line dark:border-line-dark">
          <img src={displayUrl} alt="Food photo" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => {
              if (previewUrl) {
                onFileSelected(null);
              } else {
                onRemoveExisting?.();
              }
              if (inputRef.current) inputRef.current.value = '';
            }}
            aria-label="Remove photo"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-ink/60 text-cream
                       flex items-center justify-center backdrop-blur-sm hover:bg-ink/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-ink/60 text-cream text-xs font-medium
                       backdrop-blur-sm hover:bg-ink/80 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-line dark:border-line-dark
                     flex flex-col items-center justify-center gap-1.5 text-ink-soft dark:text-cream-dark-text/60
                     hover:border-clay hover:text-clay transition-colors"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="text-sm font-medium">Add a photo</span>
        </button>
      )}
    </div>
  );
}
