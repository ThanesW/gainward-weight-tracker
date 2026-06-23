import { forwardRef } from 'react';

/**
 * Button — shared button component with consistent variants.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 *  - size: 'md' | 'lg'
 *  - full: boolean — stretch to full width
 */
const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  type = 'button',
  ...rest
}, ref) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3.5 text-base',
  };

  const variants = {
    primary:
      'bg-clay text-cream hover:bg-clay-dark dark:bg-clay dark:hover:bg-clay-dark',
    secondary:
      'bg-cream-soft text-ink hover:bg-line dark:bg-ink-dark-surface dark:text-cream-dark-text dark:hover:bg-line-dark',
    ghost:
      'bg-transparent text-ink-soft hover:bg-cream-soft dark:text-cream-dark-text dark:hover:bg-ink-dark-surface',
    danger:
      'bg-transparent text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
