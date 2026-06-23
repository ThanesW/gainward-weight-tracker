import { useTheme } from '../../context/ThemeContext';

const ICONS = {
  light: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  dark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),

  system: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4.5"
        width="18"
        height="12"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 20h7M12 16.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  mos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mosGradient" x1="0" x2="1">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>
      </defs>

      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M5 15c4-6 10-6 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="9"
        r="2"
        fill="currentColor"
      />
    </svg>
  ),
};


const ORDER = [
  'system',
  'light',
  'dark',
  'mos'
];


const LABELS = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
  mos: 'Mos mode'
};


export default function ThemeToggle() {

  const { theme, setTheme } = useTheme();


  const handleClick = () => {

    const idx = ORDER.indexOf(theme);

    const next = ORDER[
      (idx + 1) % ORDER.length
    ];

    setTheme(next);

  };


  return (

    <button
      type="button"
      onClick={handleClick}
      aria-label={`Theme: ${LABELS[theme]}. Tap to change.`}
      title={LABELS[theme]}
      className="
        p-2
        rounded-lg
        text-ink-soft
        hover:bg-cream-soft

        dark:text-cream-dark-text
        dark:hover:bg-ink-dark-surface

        mos:text-white
        mos:hover:bg-white/10

        transition-colors
      "
    >

      {ICONS[theme]}

    </button>

  );
}