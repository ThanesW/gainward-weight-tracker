import { UNIT_OPTIONS, OTHER_UNIT_VALUE } from '../../types';

/**
 * UnitSelector
 * Props:
 *  - unit: string - currently selected unit (one of UNIT_OPTIONS, or custom text if อื่นๆ chosen previously)
 *  - customUnit: string - raw text input when อื่นๆ is selected
 *  - onUnitChange, onCustomUnitChange: setters
 */
export default function UnitSelector({ unit, customUnit, onUnitChange, onCustomUnitChange }) {
  return (
    <div className="space-y-2.5">
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                   px-4 py-3 text-base text-ink dark:text-cream-dark-text focus:border-clay outline-none transition-colors"
      >
        {UNIT_OPTIONS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      {unit === OTHER_UNIT_VALUE && (
        <input
          type="text"
          placeholder="Type custom unit"
          value={customUnit}
          onChange={(e) => onCustomUnitChange(e.target.value)}
          className="w-full rounded-xl border border-line dark:border-line-dark bg-white dark:bg-ink-dark-surface
                     px-4 py-3 text-base text-ink dark:text-cream-dark-text
                     placeholder:text-ink-soft/50 focus:border-clay outline-none transition-colors"
        />
      )}
    </div>
  );
}
