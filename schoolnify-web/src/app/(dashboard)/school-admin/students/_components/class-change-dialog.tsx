"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useChangeStudentClass } from "@/hooks/use-students";
import { useSchoolSetup } from "@/hooks/use-school-setup";
import type { Student } from "@/types/student";
import { Modal } from "./modal";

interface ClassChangeDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const inputCls = "w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]";

export function ClassChangeDialog({ open, onClose, student }: ClassChangeDialogProps) {
  const mutation = useChangeStudentClass();
  const { data: setupData } = useSchoolSetup();
  const gradeLevels = setupData?.gradeLevels ?? [];

  const [gradeLevel, setGradeLevel] = useState(student.gradeLevel);
  const [section, setSection] = useState(student.section ?? "");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setGradeLevel(student.gradeLevel);
    setSection(student.section ?? "");
    setEffectiveDate(new Date().toISOString().slice(0, 10));
    setReason("");
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, student.id, student.gradeLevel, student.section]);

  const close = () => {
    if (mutation.isPending) return;
    mutation.reset();
    onClose();
  };

  const handleSubmit = () => {
    mutation.mutate(
      {
        id: student.id,
        data: {
          grade_level: gradeLevel,
          section: section.trim() || null,
          effective_date: effectiveDate || undefined,
          reason: reason.trim() || null,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  // No "unchanged" gate: the user opened the dialog deliberately. Backend
  // can no-op a same-grade move; we still want to record reason / effective_date.

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change Class"
      description={`${student.firstName} ${student.lastName} (${student.admissionNumber})`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">Grade Level</label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className={`${inputCls} cursor-pointer`}
          >
            {gradeLevels.length === 0 && <option value={student.gradeLevel}>{student.gradeLevel}</option>}
            {gradeLevels.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {gradeLevels.length === 0 && (
            <p className="text-[11px] text-[var(--muted)] mt-1">
              Set up grade levels in school setup to choose from a list.
            </p>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">
            Section <span className="text-[var(--muted)] font-normal">(optional)</span>
          </label>
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="e.g. A, Science, Blue"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">Effective Date</label>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">
            Reason <span className="text-[var(--muted)] font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="e.g. Mid-term promotion, repeat grade"
            className={inputCls}
          />
        </div>

        {mutation.error && (
          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
            {(mutation.error as Error).message}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={close}
            disabled={mutation.isPending}
            className="px-4 py-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!gradeLevel || mutation.isPending}
            className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
          >
            {mutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Move to Class
          </button>
        </div>
      </div>
    </Modal>
  );
}
