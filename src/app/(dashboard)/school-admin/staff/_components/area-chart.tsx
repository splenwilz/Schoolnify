"use client";

/**
 * Wide area chart matching the main dashboard's "Today" hero chart: a smooth
 * single-hue area with end labels. Static, brand-coloured.
 */
export function AreaChart({
  data,
  height = 140,
}: {
  data: { time: string; value: number }[];
  height?: number;
}) {
  const maxValue = Math.max(...data.map((d) => d.value)) || 1;
  const width = 100;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - (item.value / maxValue) * (height - 20);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="staffAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#staffAreaGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between mt-2 text-xs text-[var(--muted)]">
        <span>{data[0]?.time}</span>
        <span>{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}
