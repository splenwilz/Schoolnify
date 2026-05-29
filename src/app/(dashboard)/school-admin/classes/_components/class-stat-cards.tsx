"use client";

import {
  GraduationCap,
  Users,
  CalendarCheck,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { classes } from "@/lib/demo-data";

const totalClasses = classes.length;
const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
const avgAttendance = (
  classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length
).toFixed(1);
const avgGPA = (
  classes.reduce((sum, c) => sum + c.avgGrade, 0) / classes.length
).toFixed(2);

interface StatCardData {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sparkline: number[];
}

const stats: StatCardData[] = [
  {
    icon: GraduationCap,
    label: "Total Classes",
    value: totalClasses,
    sparkline: [6, 7, 8, 8, 9, 10, 10, 11, 12, 12],
  },
  {
    icon: Users,
    label: "Total Students",
    value: totalStudents,
    sparkline: [240, 260, 275, 290, 300, 310, 318, 330, 340, totalStudents],
  },
  {
    icon: CalendarCheck,
    label: "Avg Attendance",
    value: `${avgAttendance}%`,
    sparkline: [89.2, 90.1, 90.8, 91.2, 91.5, 92.0, 92.4, 92.8, 93.1, parseFloat(avgAttendance)],
  },
  {
    icon: BarChart3,
    label: "Avg GPA",
    value: avgGPA,
    sparkline: [3.35, 3.38, 3.40, 3.42, 3.44, 3.45, 3.48, 3.49, 3.50, parseFloat(avgGPA)],
  },
];

function buildSparkPath(data: number[], w: number, h: number) {
  const pad = 2;
  const min = Math.min(...data) * 0.98;
  const max = Math.max(...data) * 1.02;
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cx1 = p.x + (c.x - p.x) * 0.4;
    const cx2 = c.x - (c.x - p.x) * 0.4;
    line += ` C ${cx1} ${p.y}, ${cx2} ${c.y}, ${c.x} ${c.y}`;
  }
  return line;
}

// Period-over-period delta from the sparkline's first vs last sample.
function delta(data: number[]): { pct: string; up: boolean } {
  const first = data[0];
  const last = data[data.length - 1];
  if (first === last || first === 0) return { pct: "0.0", up: true };
  const pct = ((last - first) / first) * 100;
  return { pct: Math.abs(pct).toFixed(1), up: pct >= 0 };
}

export function ClassStatCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const W = 96;
        const H = 32;
        const line = buildSparkPath(stat.sparkline, W, H);
        const Icon = stat.icon;
        const { pct, up } = delta(stat.sparkline);

        return (
          <div key={stat.label} className="surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4 text-[var(--muted)]" />
              <p className="text-[12px] text-[var(--muted)] font-medium">
                {stat.label}
              </p>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[24px] font-semibold text-[var(--foreground)] tabular-nums leading-none">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span
                    className={
                      up
                        ? "inline-flex items-center gap-0.5 text-[11px] font-medium text-[var(--success)]"
                        : "inline-flex items-center gap-0.5 text-[11px] font-medium text-[var(--error)]"
                    }
                  >
                    {up ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {pct}%
                  </span>
                  <span className="text-[11px] text-[var(--muted)]">vs last term</span>
                </div>
              </div>

              {/* Subtle single-hue sparkline, no animation */}
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-[96px] h-[32px] flex-shrink-0"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={line}
                  fill="none"
                  stroke="var(--brand)"
                  strokeOpacity={0.7}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
