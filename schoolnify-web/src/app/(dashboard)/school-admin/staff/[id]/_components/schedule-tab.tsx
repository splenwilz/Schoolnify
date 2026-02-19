"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const weeklySchedule = [
  {
    day: "Mon",
    periods: [
      { name: "7A Math", time: "8:00 - 8:45", type: "class" },
      { name: "8B Math", time: "9:00 - 9:45", type: "class" },
      { name: "7C Math", time: "10:00 - 10:45", type: "class" },
      { name: "Planning", time: "11:00 - 12:00", type: "other" },
    ],
  },
  {
    day: "Tue",
    periods: [
      { name: "7B Math", time: "8:00 - 8:45", type: "class" },
      { name: "8A Math", time: "9:00 - 9:45", type: "class" },
      { name: "8C Math", time: "10:00 - 10:45", type: "class" },
      { name: "Staff Meeting", time: "2:00 - 3:00", type: "other" },
    ],
  },
  {
    day: "Wed",
    periods: [
      { name: "7A Math", time: "8:00 - 8:45", type: "class" },
      { name: "7C Math", time: "9:00 - 9:45", type: "class" },
      { name: "8B Math", time: "10:00 - 10:45", type: "class" },
      { name: "Conferences", time: "1:00 - 3:00", type: "other" },
    ],
  },
  {
    day: "Thu",
    periods: [
      { name: "8A Math", time: "8:00 - 8:45", type: "class" },
      { name: "7B Math", time: "9:00 - 9:45", type: "class" },
      { name: "8C Math", time: "10:00 - 10:45", type: "class" },
      { name: "Planning", time: "11:00 - 12:00", type: "other" },
    ],
  },
  {
    day: "Fri",
    periods: [
      { name: "7A Math", time: "8:00 - 8:45", type: "class" },
      { name: "8B Math", time: "9:00 - 9:45", type: "class" },
      { name: "Quiz Review", time: "10:00 - 10:45", type: "class" },
      { name: "Dept Meeting", time: "1:00 - 2:00", type: "other" },
    ],
  },
];

export function ScheduleCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
            <CalendarDays className="w-3.5 h-3.5 text-[#0891B2]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Weekly Schedule</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#0891B2]/15 border border-[#0891B2]/25" />
            <span className="text-[10px] text-[var(--muted)]">Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/25" />
            <span className="text-[10px] text-[var(--muted)]">Other</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {weeklySchedule.map((day, idx) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 + idx * 0.04 }}
            className="flex gap-3"
          >
            <div className="w-9 flex-shrink-0 pt-1.5">
              <p className="text-[12px] font-semibold text-[var(--muted)]">{day.day}</p>
            </div>
            <div className="flex-1 flex flex-wrap gap-1.5">
              {day.periods.map((period, pIdx) => (
                <div
                  key={pIdx}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg text-[11px]",
                    period.type === "class"
                      ? "bg-[#0891B2]/8 text-[#0891B2]"
                      : "bg-[#F59E0B]/8 text-[#D97706]"
                  )}
                >
                  <p className="font-semibold leading-tight">{period.name}</p>
                  <p className="mt-0.5 opacity-70 text-[10px]">{period.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
