"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Check } from "lucide-react";
import type { Class } from "@/types/class";
import { classRoster, classSubjects } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

/**
 * Gradebook -- continuous-assessment-aware spreadsheet.
 *
 * Columns: CA1 + CA2 + Exam -> Total -> Grade. This composition is the core of
 * many grading systems (West-African CA model among them) and is configurable
 * later. Rows are the real roster; cells are empty + editable (no fabricated
 * scores). Local state until the grades module is wired; weights and grade
 * scale are demo defaults.
 */

const CA1_MAX = 20;
const CA2_MAX = 20;
const EXAM_MAX = 60;

interface ScoreRow {
  ca1: string;
  ca2: string;
  exam: string;
}

function gradeLetter(total: number): string {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

const GRADE_COLOR: Record<string, string> = {
  A: "text-[#10B981]",
  B: "text-[#0891B2]",
  C: "text-[#0891B2]",
  D: "text-[#F59E0B]",
  E: "text-[#F59E0B]",
  F: "text-[#EF4444]",
};

interface GradebookTabProps {
  classData: Class;
}

export function GradebookTab({ classData }: GradebookTabProps) {
  const roster = useMemo(() => classRoster(classData.id), [classData.id]);
  const subjects = useMemo(
    () => classSubjects.filter((cs) => cs.classId === classData.id).map((cs) => cs.subjectId),
    [classData.id]
  );
  const [subject, setSubject] = useState(subjects[0] ?? "");
  // Scores keyed by `${subject}:${studentId}`.
  const [scores, setScores] = useState<Record<string, ScoreRow>>({});

  const keyFor = (sid: string) => `${subject}:${sid}`;
  const rowFor = (sid: string): ScoreRow => scores[keyFor(sid)] ?? { ca1: "", ca2: "", exam: "" };

  const setCell = (sid: string, field: keyof ScoreRow, raw: string, max: number) => {
    // Clamp to [0, max]; allow empty.
    let v = raw.replace(/[^0-9.]/g, "");
    if (v !== "" && Number(v) > max) v = String(max);
    setScores((prev) => ({ ...prev, [keyFor(sid)]: { ...rowFor(sid), [field]: v } }));
  };

  const totalFor = (sid: string): number | null => {
    const r = rowFor(sid);
    if (r.ca1 === "" && r.ca2 === "" && r.exam === "") return null;
    return (Number(r.ca1) || 0) + (Number(r.ca2) || 0) + (Number(r.exam) || 0);
  };

  if (roster.length === 0 || subjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <BarChart3 className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">Gradebook not ready</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          {roster.length === 0
            ? "Enroll students to start recording scores."
            : "Link subjects to this class to start recording scores."}
        </p>
      </motion.div>
    );
  }

  const thCls = "px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider";
  const cellInput =
    "w-14 px-2 py-1 text-[13px] text-center tabular-nums bg-[var(--background-secondary)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--card)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <label htmlFor="gb-subject" className="text-[13px] text-[var(--muted)]">Subject</label>
          <select
            id="gb-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-1.5 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <p className="text-[12px] text-[var(--muted)]">
          {classData.currentTerm} Term · CA1 ({CA1_MAX}) + CA2 ({CA2_MAX}) + Exam ({EXAM_MAX}) = 100
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className={cn(thCls, "text-left")}>Student</th>
              <th className={thCls}>CA1<span className="block text-[9px] font-normal normal-case text-[var(--muted)]/70">/ {CA1_MAX}</span></th>
              <th className={thCls}>CA2<span className="block text-[9px] font-normal normal-case text-[var(--muted)]/70">/ {CA2_MAX}</span></th>
              <th className={thCls}>Exam<span className="block text-[9px] font-normal normal-case text-[var(--muted)]/70">/ {EXAM_MAX}</span></th>
              <th className={thCls}>Total</th>
              <th className={thCls}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((s, i) => {
              const r = rowFor(s.id);
              const total = totalFor(s.id);
              const letter = total === null ? null : gradeLetter(total);
              return (
                <tr
                  key={s.id}
                  className={cn(
                    "border-b border-[var(--border)]/50 last:border-b-0",
                    i % 2 === 1 && "bg-[var(--background-secondary)]/20"
                  )}
                >
                  <td className="px-3 py-2 text-[13px] font-medium text-[var(--foreground)] whitespace-nowrap">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input aria-label={`CA1 for ${s.firstName} ${s.lastName}`} inputMode="numeric" value={r.ca1} onChange={(e) => setCell(s.id, "ca1", e.target.value, CA1_MAX)} className={cellInput} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input aria-label={`CA2 for ${s.firstName} ${s.lastName}`} inputMode="numeric" value={r.ca2} onChange={(e) => setCell(s.id, "ca2", e.target.value, CA2_MAX)} className={cellInput} />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input aria-label={`Exam for ${s.firstName} ${s.lastName}`} inputMode="numeric" value={r.exam} onChange={(e) => setCell(s.id, "exam", e.target.value, EXAM_MAX)} className={cellInput} />
                  </td>
                  <td className="px-3 py-2 text-center text-[13px] font-semibold tabular-nums text-[var(--foreground)]">
                    {total === null ? "—" : total}
                  </td>
                  <td className={cn("px-3 py-2 text-center text-[13px] font-bold", letter ? GRADE_COLOR[letter] : "text-[var(--muted)]")}>
                    {letter ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
        >
          <Check className="w-4 h-4" />
          Save scores
        </button>
      </div>
    </motion.div>
  );
}
