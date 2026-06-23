import { useRef, useState, useEffect } from 'react';

/**
 * PhotoCapture
 *
 * Uses two separate hidden file inputs instead of one, because the single-
 * input + `capture="environment"` approach behaves inconsistently across
 * platforms: iOS Safari treats `capture` as "camera only, no picker," while
 * Android Chrome still shows a picker with camera/gallery/files as options.
 * Splitting into two explicit buttons — one input with `capture`, one
 * without — gives identical, predictable behavior on both platforms.
 *
 * Props:
 *  - file: File|null — the currently selected file (uncommitted, not yet uploaded)
 *  - existingPhotoUrl: string|null — a public URL for a photo already saved (edit mode)
 *  - onFileSelected: (file: File|null) => void
 *  - onRemoveExisting: () => void — called when the user removes a previously-saved photo
 */
export default function PhotoCapture({ file, existingPhotoUrl, onFileSelected, onRemoveExisting }) {
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
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

  const resetInputs = () => {
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const displayUrl = previewUrl || existingPhotoUrl;

  return (
    <div>
      {/* Camera input: capture="environment" opens the camera directly. */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      {/* Gallery input: no capture attribute, so it always opens the
          system file/photo picker on every platform. */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
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
              resetInputs();
            }}
            aria-label="Remove photo"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-ink/60 text-cream
                       flex items-center justify-center backdrop-blur-sm hover:bg-ink/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute bottom-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-ink/60 text-cream text-xs font-medium
                         backdrop-blur-sm hover:bg-ink/80 transition-colors"
            >
              Camera
            </button>
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-ink/60 text-cream text-xs font-medium
                         backdrop-blur-sm hover:bg-ink/80 transition-colors"
            >
              Gallery
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="h-32 rounded-xl border-2 border-dashed border-line dark:border-line-dark
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
            <span className="text-sm font-medium">Take photo</span>
          </button>

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="h-32 rounded-xl border-2 border-dashed border-line dark:border-line-dark
                       flex flex-col items-center justify-center gap-1.5 text-ink-soft dark:text-cream-dark-text/60
                       hover:border-clay hover:text-clay transition-colors"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 16l4.5-5 3 3 5-6L20 14M4 8a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-medium">Choose photo</span>
          </button>
        </div>
      )}
    </div>
  );
}
