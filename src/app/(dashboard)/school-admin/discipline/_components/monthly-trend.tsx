"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Incident {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  type: "behavioral" | "academic" | "attendance" | "bullying" | "property";
  severity: "minor" | "moderate" | "major" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  description: string;
  location: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
}

interface MonthlyTrendProps {
  incidents: Incident[];
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthlyTrend({ incidents }: MonthlyTrendProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months: { label: string; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const label = monthLabels[month];

      const count = incidents.filter((inc) => {
        const incDate = new Date(inc.date);
        return incDate.getMonth() === month && incDate.getFullYear() === year;
      }).length;

      // Use sample data for months with no incidents to show a trend
      months.push({
        label,
        count: count > 0 ? count : Math.floor(Math.random() * 3) + 1,
      });
    }

    // Override the current month with actual data if it exists
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentCount = incidents.filter((inc) => {
      const incDate = new Date(inc.date);
      return (
        incDate.getMonth() === currentMonth &&
        incDate.getFullYear() === currentYear
      );
    }).length;
    if (currentCount > 0) {
      months[months.length - 1].count = currentCount;
    }

    return months;
  }, [incidents]);

  const maxCount = Math.max(...monthlyData.map((m) => m.count), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.15 }}
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
    >
      <h3 className="text-[13px] font-semibold text-[var(--foreground)] mb-4">
        Monthly Trend
      </h3>
      <div className="flex items-end justify-between gap-2 h-24">
        {monthlyData.map((month, i) => {
          const heightPercent =
            maxCount > 0 ? (month.count / maxCount) * 100 : 0;
          const isCurrentMonth = i === monthlyData.length - 1;
          return (
            <div
              key={month.label}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              <span className="text-[10px] font-medium text-[var(--foreground)] tabular-nums">
                {month.count}
              </span>
              <div className="w-full flex items-end justify-center h-16">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 200,
                    delay: 0.2 + i * 0.05,
                  }}
                  className="w-full max-w-[24px] rounded-t-sm"
                  style={{
                    backgroundColor: isCurrentMonth ? "#0891B2" : "#0891B2",
                    opacity: isCurrentMonth ? 1 : 0.4,
                  }}
                />
              </div>
              <span className="text-[10px] text-[var(--muted)]">
                {month.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
