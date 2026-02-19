"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const attendanceHistory = [
  { date: "Jan 6, 2026", status: "present", time: "8:05 AM" },
  { date: "Jan 5, 2026", status: "present", time: "7:58 AM" },
  { date: "Jan 4, 2026", status: "late", time: "8:22 AM" },
  { date: "Jan 3, 2026", status: "present", time: "8:01 AM" },
  { date: "Jan 2, 2026", status: "absent", time: "\u2014" },
  { date: "Dec 20, 2025", status: "present", time: "7:55 AM" },
  { date: "Dec 19, 2025", status: "present", time: "8:10 AM" },
  { date: "Dec 18, 2025", status: "late", time: "8:18 AM" },
];

function generateLast30Days() {
  const days = [];
  const today = new Date();
  // Find the start of the calendar (first day should align to start of week)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 29);

  // Seed a deterministic pattern so it doesn't change every render
  const pattern = [1, 1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1];

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayOfWeek = date.getDay();

    let status: string;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = "weekend";
    } else {
      const p = pattern[i];
      status = p === 0 ? "absent" : p === 2 ? "late" : "present";
    }

    days.push({ date, status });
  }
  return days;
}

export function AttendanceTab() {
  const last30Days = useMemo(() => generateLast30Days(), []);

  // Pad the start to align with day-of-week columns
  const firstDayOfWeek = last30Days[0].date.getDay();
  const padding = Array.from({ length: firstDayOfWeek }, () => null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Calendar Heatmap */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
          Last 30 Days
        </h2>
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-[10px] text-center text-[var(--muted)] font-medium">
              {d}
            </div>
          ))}
          {padding.map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {last30Days.map((day, i) => (
            <div
              key={i}
              title={`${day.date.toLocaleDateString()} - ${day.status}`}
              className={cn(
                "aspect-square rounded-sm transition-transform hover:scale-110",
                day.status === "present" && "bg-[#10B981]",
                day.status === "late" && "bg-[#F59E0B]",
                day.status === "absent" && "bg-[#EF4444]",
                day.status === "weekend" && "bg-[var(--background-secondary)]"
              )}
            />
          ))}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> Late
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--background-secondary)]" /> Weekend
          </span>
        </div>
      </div>

      {/* Attendance List */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
          Attendance History
        </h2>
        <div className="space-y-3">
          {attendanceHistory.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    item.status === "present" && "bg-[#10B981]",
                    item.status === "late" && "bg-[#F59E0B]",
                    item.status === "absent" && "bg-[#EF4444]"
                  )}
                />
                <span className="text-sm text-[var(--foreground)]">{item.date}</span>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    item.status === "present" && "bg-[#10B981]/10 text-[#10B981]",
                    item.status === "late" && "bg-[#F59E0B]/10 text-[#F59E0B]",
                    item.status === "absent" && "bg-[#EF4444]/10 text-[#EF4444]"
                  )}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
              <span className="text-xs text-[var(--muted)]">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
