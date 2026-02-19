"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { feeSummary, financialTransactions } from "@/lib/demo-data";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

interface StatCardData {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  sparkline?: number[];
}

const totalAccounts = financialTransactions.length;

const stats: StatCardData[] = [
  {
    icon: TrendingUp,
    label: "This Month Collected",
    value: formatCurrency(feeSummary.thisMonthCollected),
    subtitle: `of ${formatCurrency(feeSummary.totalExpected / 10)} target`,
    color: "#10B981",
    sparkline: [82000, 90000, 95000, 102000, 110000, 118000, 125000],
  },
  {
    icon: AlertCircle,
    label: "Outstanding Balance",
    value: formatCurrency(feeSummary.totalOutstanding),
    subtitle: `${feeSummary.overdueAccounts} overdue accounts`,
    color: "#F59E0B",
    sparkline: [180000, 175000, 168000, 165000, 160000, 155000, 152500],
  },
  {
    icon: Clock,
    label: "Overdue Accounts",
    value: `${feeSummary.overdueAccounts}`,
    subtitle: `of ${totalAccounts} total accounts`,
    color: "#EF4444",
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

  const area =
    line + ` L ${pts[pts.length - 1].x} ${h} L ${pts[0].x} ${h} Z`;
  return { line, area };
}

export function FinanceStatCards() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const W = 80;
        const H = 30;
        const spark = stat.sparkline
          ? buildSparkPath(stat.sparkline, W, H)
          : null;
        const gradientId = `finSpark-${i}`;

        // Progress ring for overdue card
        const showRing = !stat.sparkline;
        const ringR = 14;
        const ringCirc = 2 * Math.PI * ringR;
        const ringPct = feeSummary.overdueAccounts / totalAccounts;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            className="flex-1 rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px] px-5 py-4 flex items-center justify-between gap-3"
            style={{ borderLeftColor: stat.color }}
          >
            {/* Left: icon + metrics */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}14` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[20px] font-bold text-[var(--foreground)] tabular-nums leading-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] text-[var(--muted)] font-medium mt-0.5 truncate">
                  {stat.label}
                </p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 truncate">
                  {stat.subtitle}
                </p>
              </div>
            </div>

            {/* Right: sparkline or ring */}
            {spark && (
              <div className="flex-shrink-0 w-[80px]">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full h-[30px]"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={stat.color}
                        stopOpacity="0.25"
                      />
                      <stop
                        offset="100%"
                        stopColor={stat.color}
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={spark.area}
                    fill={`url(#${gradientId})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  />
                  <motion.path
                    d={spark.line}
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * 0.08,
                      ease: "easeOut",
                    }}
                  />
                </svg>
              </div>
            )}
            {showRing && (
              <div className="flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r={ringR}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="3"
                    opacity="0.3"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r={ringR}
                    fill="none"
                    stroke={stat.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={ringCirc}
                    strokeDashoffset={ringCirc * (1 - ringPct)}
                    transform="rotate(-90 20 20)"
                    initial={{ strokeDashoffset: ringCirc }}
                    animate={{
                      strokeDashoffset: ringCirc * (1 - ringPct),
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5,
                      ease: "easeOut",
                    }}
                  />
                  <text
                    x="20"
                    y="21"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={stat.color}
                  >
                    {feeSummary.overdueAccounts}
                  </text>
                </svg>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
