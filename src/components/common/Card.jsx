export default function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={`bg-white dark:bg-ink-dark-surface border border-line dark:border-line-dark rounded-card shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
