import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white dark:bg-ink-dark-surface border border-line dark:border-line-dark rounded-lg px-3 py-2 shadow-md">
      <p className="text-xs text-ink-soft dark:text-cream-dark-text/60">{label}</p>
      <p className="text-sm font-semibold text-clay">{payload[0].value.toFixed(1)} kg</p>
    </div>
  );
}

export default function WeightChart({ data, targetWeight }) {
  const { isDark } = useTheme();
  const gridColor = isDark ? '#3A3023' : '#E4DAC6';
  const textColor = isDark ? '#F3ECDD99' : '#5A4F4299';

  if (data.length < 2) {
    return (
      <div className="h-56 flex items-center justify-center text-sm text-ink-soft/70 dark:text-cream-dark-text/50">
        Add at least two weight records to see your trend line.
      </div>
    );
  }

  // Compute the Y domain from the weight data only, so a faraway target
  // line doesn't stretch the axis and flatten the trend.
  const weights = data.map((d) => d.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const padding = Math.max((maxWeight - minWeight) * 0.2, 1);
  const yDomain = [Math.floor(minWeight - padding), Math.ceil(maxWeight + padding)];

  return (
    <div className="h-56 -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            minTickGap={20}
          />
          <YAxis
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={false}
            tickLine={false}
            width={36}
            domain={yDomain}
            allowDataOverflow
          />
          <Tooltip content={<CustomTooltip />} />
          {targetWeight && targetWeight <= yDomain[1] && targetWeight >= yDomain[0] && (
            <ReferenceLine
              y={targetWeight}
              stroke="#D4A024"
              strokeDasharray="5 4"
              label={{ value: 'Target', position: 'insideTopRight', fontSize: 11, fill: '#D4A024' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#5C7B52"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#5C7B52', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
