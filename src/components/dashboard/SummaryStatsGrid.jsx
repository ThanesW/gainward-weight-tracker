import Card from '../common/Card';

export default function SummaryStatsGrid({ summary }) {
  const items = [
    { label: 'Total meals', value: summary.totalMeals },
    { label: 'Avg / day', value: summary.averageMealsPerDay },
    {
      label: 'Most active day',
      value: summary.mostActiveDay ? summary.mostActiveDay.slice(0, 3) : '—',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <Card key={item.label} className="p-3.5 text-center">
          <p className="font-display text-2xl font-semibold text-clay">{item.value}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-soft/70 dark:text-cream-dark-text/50">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  );
}
