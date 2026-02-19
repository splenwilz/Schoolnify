"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { waitlistEntries } from "@/lib/demo-data";
import { Clock, Gift, XCircle, Trash2 } from "lucide-react";

interface WaitlistEntry {
  id: string;
  studentName: string;
  email: string;
  grade: string;
  appliedDate: string;
  position: number;
  priority: "high" | "normal" | "low";
  notes: string;
  status: "waiting" | "offered" | "declined";
}

const priorityConfig: Record<
  WaitlistEntry["priority"],
  { bg: string; text: string; label: string }
> = {
  high: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", label: "High" },
  normal: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", label: "Normal" },
  low: { bg: "bg-[#6B7280]/10", text: "text-[#6B7280]", label: "Low" },
};

const statusConfig: Record<
  WaitlistEntry["status"],
  { bg: string; text: string; label: string; icon: typeof Clock }
> = {
  waiting: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Waiting",
    icon: Clock,
  },
  offered: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Offered",
    icon: Gift,
  },
  declined: {
    bg: "bg-[#6B7280]/10",
    text: "text-[#6B7280]",
    label: "Declined",
    icon: XCircle,
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function WaitlistTab() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(waitlistEntries);

  const waitingCount = entries.filter((e) => e.status === "waiting").length;
  const offeredCount = entries.filter((e) => e.status === "offered").length;

  const handleOfferSpot = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "offered" as const } : e))
    );
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Summary */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
          Waitlist
        </h3>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B]" />
            {waitingCount} student{waitingCount !== 1 ? "s" : ""} waiting
          </span>
          <span className="text-[var(--border)]">|</span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" />
            {offeredCount} offered
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--border)]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider w-16">
                Pos.
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No waitlist entries.
                  </p>
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const priority = priorityConfig[entry.priority];
                const status = statusConfig[entry.status];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={entry.id}
                    className="border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    {/* Position */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--background-secondary)] text-[13px] font-semibold text-[var(--foreground)]">
                        {entry.position}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {entry.studentName}
                      </p>
                      <p className="text-[12px] text-[var(--muted)] mt-0.5">
                        {entry.email}
                      </p>
                    </td>

                    {/* Grade */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {entry.grade}
                      </span>
                    </td>

                    {/* Applied Date */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(entry.appliedDate)}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          priority.bg,
                          priority.text
                        )}
                      >
                        {priority.label}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full",
                          status.bg,
                          status.text
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {entry.status === "waiting" && (
                          <button
                            onClick={() => handleOfferSpot(entry.id)}
                            className="px-3 py-1.5 text-[12px] font-medium text-[#10B981] bg-[#10B981]/10 rounded-lg hover:bg-[#10B981]/20 transition-colors"
                          >
                            Offer Spot
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(entry.id)}
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                          title="Remove from waitlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
