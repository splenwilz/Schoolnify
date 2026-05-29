"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistStep {
  label: string;
  done: boolean;
  hint: string;
}

/**
 * "Set up this class" checklist. Renders only when a class still has setup
 * gaps (no teacher / no subjects / no students). Drives activation on brand-new
 * classes; disappears once everything's in place.
 */
export function SetupChecklist({
  hasTeacher,
  hasSubjects,
  hasStudents,
}: {
  hasTeacher: boolean;
  hasSubjects: boolean;
  hasStudents: boolean;
}) {
  const steps: ChecklistStep[] = [
    { label: "Assign a class teacher", done: hasTeacher, hint: "Settings tab" },
    { label: "Link subjects", done: hasSubjects, hint: "Schedule tab" },
    { label: "Enroll students", done: hasStudents, hint: "Roster tab" },
  ];

  const remaining = steps.filter((s) => !s.done).length;
  if (remaining === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-4 rounded-2xl border border-[#0891B2]/20 bg-[#0891B2]/5 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Set up this class</h3>
        <span className="text-[12px] text-[var(--muted)]">{steps.length - remaining}/{steps.length} done</span>
      </div>
      <ul className="space-y-2">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            {s.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-[var(--muted)] flex-shrink-0" />
            )}
            <span className={cn("text-[13px] flex-1", s.done ? "text-[var(--muted)] line-through" : "text-[var(--foreground)]")}>
              {s.label}
            </span>
            {!s.done && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#0891B2]">
                {s.hint} <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
