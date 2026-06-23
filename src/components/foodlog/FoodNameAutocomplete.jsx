import { useState, useRef, useEffect, useMemo } from 'react';

/**
 * FoodNameAutocomplete
 * Text input with a dropdown of matching previous food names.
 * Also surfaces favorites at the top when the input is empty.
 */
export default function FoodNameAutocomplete({
  value,
  onChange,
  suggestions = [],
  favorites = [],
  placeholder = 'e.g. Pad Krapow Moo',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const term = value.trim().toLowerCase();
    if (!term) {
      // Show favorites first when empty, deduped against generic suggestions
      const favSet = new Set(favorites);
      const rest = suggestions.filter((s) => !favSet.has(s));
      return [...favorites, ...rest].slice(0, 8);
    }
    return suggestions.filter((s) => s.toLowerCase().includes(term)).slice(0, 8);
  }, [value, suggestions, favorites]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (name) => {
    onChange(name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(filtered[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                   px-4 py-3 text-base text-ink dark:text-cream-dark-text
                   placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
      />

      {isOpen && filtered.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border border-line
                     dark:border-line-dark bg-white dark:bg-ink-dark-surface shadow-lg py-1.5"
        >
          {filtered.map((name, i) => (
            <li key={name} role="option" aria-selected={i === highlightedIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(name)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 ${
                  i === highlightedIndex
                    ? 'bg-cream-soft dark:bg-ink-dark-bg'
                    : 'hover:bg-cream-soft dark:hover:bg-ink-dark-bg'
                } text-ink dark:text-cream-dark-text`}
              >
                {favorites.includes(name) && <span aria-hidden="true">⭐</span>}
                <span className="truncate">{name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
