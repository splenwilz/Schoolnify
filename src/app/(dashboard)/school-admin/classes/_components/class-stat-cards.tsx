"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  change: string;
  changeUp: boolean;
  color: string;
  sparkline: number[];
}

const stats: StatCardData[] = [
  {
    icon: GraduationCap,
    label: "Total Classes",
    value: totalClasses,
    change: "+2",
    changeUp: true,
    color: "#0891B2",
    sparkline: [6, 7, 8, 8, 9, 10, 10, 11, 12, 12],
  },
  {
    icon: Users,
    label: "Total Students",
    value: totalStudents,
    change: "+5.2%",
    changeUp: true,
    color: "#10B981",
    sparkline: [240, 260, 275, 290, 300, 310, 318, 330, 340, totalStudents],
  },
  {
    icon: CalendarCheck,
    label: "Avg Attendance",
    value: `${avgAttendance}%`,
    change: "+1.3%",
    changeUp: true,
    color: "#F59E0B",
    sparkline: [89.2, 90.1, 90.8, 91.2, 91.5, 92.0, 92.4, 92.8, 93.1, parseFloat(avgAttendance)],
  },
  {
    icon: BarChart3,
    label: "Avg GPA",
    value: avgGPA,
    change: "+0.12",
    changeUp: true,
    color: "#8B5CF6",
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

  const area = line + ` L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  return { line, area, lastPt: pts[pts.length - 1] };
}

export function ClassStatCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, i) => {
        const W = 120;
        const H = 40;
        const { line, area, lastPt } = buildSparkPath(stat.sparkline, W, H);
        const Icon = stat.icon;
        const gradientId = `statSpark-${i}`;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-start justify-between gap-3"
          >
            {/* Left: metrics */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}14` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <p className="text-[12px] text-[var(--muted)] font-medium">
                  {stat.label}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[22px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {stat.value}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-md",
                    stat.changeUp
                      ? "bg-[#10B981]/10 text-[#10B981]"
                      : "bg-[#EF4444]/10 text-[#EF4444]"
                  )}
                >
                  {stat.changeUp ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {stat.change}
                </span>
              </div>
            </div>

            {/* Right: sparkline */}
            <div className="flex-shrink-0 w-[120px] self-end">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-[40px]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stat.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={stat.color} stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={area}
                  fill={`url(#${gradientId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                />
                <motion.path
                  d={line}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.07,
                    ease: "easeOut",
                  }}
                />
                <motion.circle
                  cx={lastPt.x}
                  cy={lastPt.y}
                  r="3"
                  fill={stat.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.07 }}
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
