"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicVisit {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  attendedBy: string;
  status: "treated" | "referred" | "ongoing";
  parentNotified: boolean;
}

interface ClinicVisitsTabProps {
  visits: ClinicVisit[];
  onLogVisit: () => void;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  treated: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Treated",
  },
  referred: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Referred",
  },
  ongoing: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "Ongoing",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClinicVisitsTab({ visits, onLogVisit }: ClinicVisitsTabProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Clinic Visits
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            {visits.length} record{visits.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--border)]">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Diagnosis
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                Treatment
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Parent
              </th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No clinic visits recorded.
                  </p>
                </td>
              </tr>
            ) : (
              visits.map((visit) => {
                const statConfig = statusConfig[visit.status];
                return (
                  <tr
                    key={visit.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--foreground)]">
                        {visit.studentName}
                      </p>
                      <p className="text-[12px] text-[var(--muted)] mt-0.5">
                        {visit.grade}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(visit.date)}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[var(--foreground)]">
                        {visit.reason}
                      </span>
                    </td>

                    {/* Diagnosis */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-[12px] text-[var(--foreground)]">
                        {visit.diagnosis}
                      </span>
                    </td>

                    {/* Treatment */}
                    <td className="px-4 py-3.5 hidden lg:table-cell max-w-[200px]">
                      <span className="text-[12px] text-[var(--muted)] line-clamp-2">
                        {visit.treatment}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          statConfig.bg,
                          statConfig.text
                        )}
                      >
                        {statConfig.label}
                      </span>
                    </td>

                    {/* Parent Notified */}
                    <td className="px-4 py-3.5">
                      {visit.parentNotified ? (
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--muted)]" />
                      )}
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
