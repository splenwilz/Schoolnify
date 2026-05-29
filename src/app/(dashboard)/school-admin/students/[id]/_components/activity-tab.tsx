"use client";

import { motion } from "framer-motion";
import { BookOpen, Check, Clock, DollarSign } from "lucide-react";

/**
 * Activity tab.
 *
 * Real activity (attendance marks, grade entries, fee payments) will stream
 * from the events / audit log endpoint once it ships. When it does, replace
 * `activityTimeline` below with `useStudentActivity(studentId)`. The full
 * timeline layout is preserved below the empty-state guard so it lights up
 * automatically when data arrives.
 */

type ActivityType = "attendance" | "academic" | "financial";

interface ActivityEntry {
  date: string;
  action: string;
  type: ActivityType;
}

const typeConfig: Record<ActivityType, { icon: typeof Check; color: string; bg: string }> = {
  attendance: { icon: Check, color: "#10B981", bg: "bg-[#10B981]/10" },
  academic: { icon: BookOpen, color: "#0891B2", bg: "bg-[#0891B2]/10" },
  financial: { icon: DollarSign, color: "#F59E0B", bg: "bg-[#F59E0B]/10" },
};

export function ActivityTab() {
  // TODO: replace with `useStudentActivity(studentId)` once the activity feed lands.
  const activityTimeline: ActivityEntry[] = [];

  if (activityTimeline.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <Clock className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No activity recorded yet</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          A timeline of attendance, grade, and payment events will appear here once those modules are wired.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Recent Activity</h2>
      <div className="relative space-y-5">
        {/* Connecting line */}
        <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[var(--border)]" aria-hidden="true" />

        {activityTimeline.map((item, idx) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={`${item.date}-${idx}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="relative flex items-start gap-3 pl-0"
            >
              <span
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center ${cfg.bg}`}
                style={{ color: cfg.color }}
                aria-hidden="true"
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-[13px] text-[var(--foreground)]">{item.action}</p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">{item.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
