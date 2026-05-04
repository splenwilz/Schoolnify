"use client";

import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Attendance tab.
 *
 * The attendance module isn't shipped yet, so the data sources default to
 * empty arrays. When the module lands, replace the two `useMemo` defaults
 * below with real hook calls, e.g.:
 *   const last30Days = useStudentAttendanceCalendar(studentId, 30);
 *   const attendanceHistory = useStudentAttendanceHistory(studentId);
 *
 * The full layout (calendar heatmap + history list) lives below the empty-state
 * guard so it's already wired and styled when real data arrives.
 *
 * NOTE: Do NOT re-introduce the previous `generateLast30Days()` helper — it
 * synthesized fake attendance from a hardcoded pattern. The grid renders only
 * when real data is present.
 */

interface CalendarDay {
  date: Date;
  status: "present" | "late" | "absent" | "weekend";
}

interface HistoryEntry {
  date: string;
  status: "present" | "late" | "absent";
  time: string;
}

export function AttendanceTab() {
  // TODO: replace with real attendance data once the attendance module ships.
  const last30Days: CalendarDay[] = [];
  const attendanceHistory: HistoryEntry[] = [];

  if (last30Days.length === 0 && attendanceHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-10 flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <CalendarCheck className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No attendance recorded yet</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          Daily attendance and the 30-day calendar will appear here once the attendance module is wired.
        </p>
      </motion.div>
    );
  }

  // Pad the calendar start to align with day-of-week columns
  const firstDayOfWeek = last30Days[0]?.date.getDay() ?? 0;
  const padding = Array.from({ length: firstDayOfWeek }, () => null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Calendar Heatmap */}
      {last30Days.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Last 30 Days</h2>
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
      )}

      {/* Attendance List */}
      {attendanceHistory.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Attendance History</h2>
          <div className="space-y-3">
            {attendanceHistory.map((item, idx) => (
              <motion.div
                key={`${item.date}-${idx}`}
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
      )}
    </motion.div>
  );
}
