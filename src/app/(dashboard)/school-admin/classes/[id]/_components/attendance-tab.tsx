"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Check } from "lucide-react";
import type { Class } from "@/types/class";
import { classRoster } from "@/lib/demo-data";
import { todayLocalISO } from "../../../students/_utils/dates";
import { Avatar } from "../../../students/_components/avatar";
import { cn } from "@/lib/utils";

type AttStatus = "present" | "absent" | "late" | "excused";

const STATUSES: { value: AttStatus; label: string; short: string; active: string }[] = [
  { value: "present", label: "Present", short: "P", active: "bg-[#10B981] text-white border-[#10B981]" },
  { value: "absent", label: "Absent", short: "A", active: "bg-[#EF4444] text-white border-[#EF4444]" },
  { value: "late", label: "Late", short: "L", active: "bg-[#F59E0B] text-white border-[#F59E0B]" },
  { value: "excused", label: "Excused", short: "E", active: "bg-[#8B5CF6] text-white border-[#8B5CF6]" },
];

interface AttendanceTabProps {
  classData: Class;
}

/**
 * Attendance marking grid -- an interactive surface, not a display of fabricated
 * history. Defaults everyone to Present (fastest path: flip the absentees), with
 * a date picker and live counts. Marks are local state until the attendance
 * module is wired; "Save" is a placeholder for now.
 */
export function AttendanceTab({ classData }: AttendanceTabProps) {
  const roster = useMemo(() => classRoster(classData.id), [classData.id]);
  const [date, setDate] = useState(todayLocalISO());
  const [marks, setMarks] = useState<Record<string, AttStatus>>({});

  const statusFor = (id: string): AttStatus => marks[id] ?? "present";
  const setStatus = (id: string, s: AttStatus) => setMarks((prev) => ({ ...prev, [id]: s }));
  const markAllPresent = () => setMarks({});

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of roster) c[marks[s.id] ?? "present"] += 1;
    return c;
  }, [roster, marks]);

  const pct = roster.length ? Math.round(((counts.present + counts.late) / roster.length) * 100) : 0;

  if (roster.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <CalendarCheck className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No students to mark</p>
        <p className="text-[13px] text-[var(--muted)] mt-1">Enroll students in this class to take attendance.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Controls + summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <label htmlFor="att-date" className="text-[13px] text-[var(--muted)]">Date</label>
          <input
            id="att-date"
            type="date"
            value={date}
            max={todayLocalISO()}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          />
          <button
            type="button"
            onClick={markAllPresent}
            className="text-[12px] font-medium text-[#0891B2] hover:underline"
          >
            Mark all present
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-[12px] text-[var(--muted)]">
          <span><span className="font-semibold text-[#10B981]">{counts.present}</span> present</span>
          <span><span className="font-semibold text-[#EF4444]">{counts.absent}</span> absent</span>
          <span><span className="font-semibold text-[#F59E0B]">{counts.late}</span> late</span>
          <span><span className="font-semibold text-[#8B5CF6]">{counts.excused}</span> excused</span>
          <span className="pl-2 border-l border-[var(--border)] font-semibold text-[var(--foreground)] tabular-nums">{pct}%</span>
        </div>
      </div>

      {/* Roster marking list */}
      <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {roster.map((s, i) => {
          const current = statusFor(s.id);
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--border)]/50 last:border-b-0",
                i % 2 === 1 && "bg-[var(--background-secondary)]/20"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar firstName={s.firstName} lastName={s.lastName} avatar={s.avatar} size="sm" />
                <span className="text-[13px] font-medium text-[var(--foreground)] truncate">
                  {s.firstName} {s.lastName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0" role="group" aria-label={`Attendance for ${s.firstName} ${s.lastName}`}>
                {STATUSES.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    aria-pressed={current === st.value}
                    aria-label={st.label}
                    title={st.label}
                    onClick={() => setStatus(s.id, st.value)}
                    className={cn(
                      "w-8 h-8 sm:w-7 sm:h-7 rounded-md border text-[11px] font-bold flex items-center justify-center transition-colors",
                      current === st.value
                        ? st.active
                        : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                    )}
                  >
                    {st.short}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
        >
          <Check className="w-4 h-4" />
          Save attendance
        </button>
      </div>
    </motion.div>
  );
}
