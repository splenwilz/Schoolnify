"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useChangeStudentStatus } from "@/hooks/use-students";
import type { Student } from "@/types/student";
import type { ApiStudent } from "@/types/student-api";
import { Modal } from "./modal";

interface StatusChangeDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const STATUS_OPTIONS: { value: ApiStudent["status"]; label: string; description: string }[] = [
  { value: "active", label: "Active", description: "Currently enrolled and attending" },
  { value: "inactive", label: "Inactive", description: "Temporarily not attending" },
  { value: "suspended", label: "Suspended", description: "Disciplinary suspension" },
  { value: "graduated", label: "Graduated", description: "Completed final grade" },
  { value: "transferred", label: "Transferred", description: "Moved to another school" },
  { value: "withdrawn", label: "Withdrawn", description: "Removed from enrollment" },
];

const inputCls = "w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]";

export function StatusChangeDialog({ open, onClose, student }: StatusChangeDialogProps) {
  const mutation = useChangeStudentStatus();
  const [status, setStatus] = useState<ApiStudent["status"]>(student.status);
  const [reason, setReason] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));

  // Reset form whenever the dialog opens or the student changes.
  useEffect(() => {
    if (!open) return;
    setStatus(student.status);
    setReason("");
    setEffectiveDate(new Date().toISOString().slice(0, 10));
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, student.id, student.status]);

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
          status,
          reason: reason.trim() || undefined,
          effective_date: effectiveDate || undefined,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const unchanged = status === student.status;

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change Enrollment Status"
      description={`${student.firstName} ${student.lastName} (${student.admissionNumber})`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[var(--muted)] mb-2">New Status</label>
          <div className="space-y-1">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                  status === opt.value
                    ? "border-[#0891B2]/40 bg-[#0891B2]/5"
                    : "border-[var(--border)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  status === opt.value ? "border-[#0891B2]" : "border-[var(--border)]"
                }`}>
                  {status === opt.value && <span className="w-2 h-2 rounded-full bg-[#0891B2]" />}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--foreground)]">{opt.label}</p>
                  <p className="text-[12px] text-[var(--muted)]">{opt.description}</p>
                </div>
              </button>
            ))}
          </div>
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
            placeholder="e.g. Family relocation, completed senior year"
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
            disabled={unchanged || mutation.isPending}
            className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
          >
            {mutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Update Status
          </button>
        </div>
      </div>
    </Modal>
  );
}
