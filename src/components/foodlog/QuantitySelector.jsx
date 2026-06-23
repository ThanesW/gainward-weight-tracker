import { QUANTITY_PRESETS, CUSTOM_QUANTITY_VALUE } from '../../types';
import { parseQuantityValue } from '../../utils/formatUtils';

/**
 * QuantitySelector
 * Props:
 *  - preset: string - currently selected preset value (one of QUANTITY_PRESETS)
 *  - customValue: number|string - raw numeric input when preset === 'Custom'
 *  - onPresetChange, onCustomValueChange: setters
 */
export default function QuantitySelector({ preset, customValue, onPresetChange, onCustomValueChange }) {
  return (
    <div className="space-y-2.5">
      <select
        value={preset}
        onChange={(e) => onPresetChange(e.target.value)}
        className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                   px-4 py-3 text-base text-ink dark:text-cream-dark-text focus:border-clay outline-none transition-colors"
      >
        {QUANTITY_PRESETS.map((p) => (
          <option key={p} value={p}>
            {p === CUSTOM_QUANTITY_VALUE ? 'Custom amount' : p}
          </option>
        ))}
      </select>

      {preset === CUSTOM_QUANTITY_VALUE && (
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          placeholder="Enter amount, e.g. 1.5"
          value={customValue}
          onChange={(e) => onCustomValueChange(e.target.value)}
          className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                     px-4 py-3 text-base text-ink dark:text-cream-dark-text
                     placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors"
        />
      )}
    </div>
  );
}

/** Resolves the final numeric quantity value from preset + custom input. */
export function resolveQuantity(preset, customValue) {
  if (preset === CUSTOM_QUANTITY_VALUE) {
    const num = parseFloat(customValue);
    return Number.isFinite(num) ? num : NaN;
  }
  return parseQuantityValue(preset);
}
