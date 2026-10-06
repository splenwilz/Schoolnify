"use client";

/**
 * Mini sparkline matching the main dashboard's "Your overview" cards: a thin
 * line over a faint area fill, with an optional dashed comparison series.
 * Static (no animation) to stay calm and Stripe-like.
 */
export function Sparkline({
  data,
  compareData,
  color = "var(--brand)",
  height = 40,
}: {
  data: number[];
  compareData?: number[];
  color?: string;
  height?: number;
}) {
  const all = [...data, ...(compareData || [])].filter((d) => d > 0);
  const max = all.length > 0 ? Math.max(...all) : 1;
  const min = all.length > 0 ? Math.min(...all) : 0;
  const range = max - min || 1;
  const width = 100;

  const buildPoints = (values: number[]) =>
    values
      .map((value, index) => {
        const x = (index / (values.length - 1 || 1)) * width;
        const y = height - ((value - min) / range) * (height - 4);
        return `${x},${y}`;
      })
      .join(" ");

  const points = buildPoints(data);
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} aria-hidden="true">
      <polygon points={areaPoints} fill={color} fillOpacity={0.1} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {compareData && compareData.length > 1 && (
        <polyline
          points={buildPoints(compareData)}
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 3"
          opacity={0.4}
        />
      )}
    </svg>
  );
}
