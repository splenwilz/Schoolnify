"use client";

import { motion } from "framer-motion";
import { Cake } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { Avatar } from "../../students/_components/avatar";

// Generate deterministic birthday dates from staff id
function getBirthday(id: string): { month: number; day: number } {
  const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const month = (hash % 12) + 1;
  const day = (hash % 28) + 1;
  return { month, day };
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Get all staff with birthdays, sorted by upcoming date
const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentDay = now.getDate();

const staffWithBirthdays = staff
  .map((s) => {
    const bd = getBirthday(s.id);
    // Days until birthday (wrapping around year)
    const bdDate = new Date(now.getFullYear(), bd.month - 1, bd.day);
    if (bdDate < now) bdDate.setFullYear(bdDate.getFullYear() + 1);
    const daysUntil = Math.ceil(
      (bdDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      ...s,
      birthdayMonth: bd.month,
      birthdayDay: bd.day,
      birthdayLabel: `${MONTH_NAMES[bd.month - 1]} ${bd.day}`,
      daysUntil,
    };
  })
  .sort((a, b) => a.daysUntil - b.daysUntil)
  .slice(0, 4);

export function BirthdaysCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cake className="w-4 h-4 text-[var(--muted)]" />
        <p className="text-[15px] font-semibold text-[var(--foreground)]">
          Upcoming Birthdays
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {staffWithBirthdays.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.45 + i * 0.06 }}
            className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-[var(--background-secondary)]/50 transition-colors"
          >
            <Avatar
              firstName={member.firstName}
              lastName={member.lastName}
              size="sm"
              className="rounded-full flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-[var(--foreground)] truncate">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {member.birthdayLabel}
              </p>
            </div>
            <span className="text-[11px] text-[var(--muted)] flex-shrink-0">
              {member.daysUntil === 0
                ? "Today!"
                : member.daysUntil === 1
                ? "Tomorrow"
                : `${member.daysUntil}d`}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
