"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { specialNeeds } from "@/lib/demo-data";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SpecialNeedRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  type: "IEP" | "504" | "behavioral" | "physical";
  description: string;
  accommodations: string[];
  reviewDate: string;
  assignedStaff: string;
  status: "active" | "review_due" | "archived";
}

const typeConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  IEP: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "IEP",
  },
  "504": {
    bg: "bg-[#8B5CF6]/10",
    text: "text-[#8B5CF6]",
    label: "504",
  },
  behavioral: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Behavioral",
  },
  physical: {
    bg: "bg-[#6B7280]/10",
    text: "text-[#6B7280]",
    label: "Physical",
  },
};

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  active: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Active",
  },
  review_due: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Review Due",
  },
  archived: {
    bg: "bg-[#6B7280]/10",
    text: "text-[#6B7280]",
    label: "Archived",
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SpecialNeedsTab() {
  const [records] = useState<SpecialNeedRecord[]>(
    specialNeeds as SpecialNeedRecord[]
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Special Needs Records
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--border)]">
              <th className="w-8 px-2 py-3"></th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                Accommodations
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Review Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Assigned Staff
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No special needs records found.
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const tConfig = typeConfig[record.type];
                const sConfig = statusConfig[record.status];
                const isExpanded = expandedId === record.id;

                return (
                  <tr
                    key={record.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    {/* Expand toggle - spans visually but we use a wrapper approach */}
                    <td className="px-2 py-3.5 align-top" rowSpan={isExpanded ? 2 : 1}>
                      <button
                        onClick={() => toggleExpand(record.id)}
                        className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5" colSpan={isExpanded ? 8 : 1}>
                      {!isExpanded ? (
                        <span className="text-[13px] font-medium text-[var(--foreground)]">
                          {record.studentName}
                        </span>
                      ) : (
                        /* Expanded view - all info in one cell */
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[13px] font-medium text-[var(--foreground)]">
                              {record.studentName}
                            </span>
                            <span className="text-[12px] text-[var(--muted)]">
                              {record.grade}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                                tConfig.bg,
                                tConfig.text
                              )}
                            >
                              {tConfig.label}
                            </span>
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                                sConfig.bg,
                                sConfig.text
                              )}
                            >
                              {sConfig.label}
                            </span>
                          </div>

                          <div>
                            <p className="text-[12px] font-medium text-[var(--muted)] mb-1">
                              Description
                            </p>
                            <p className="text-[13px] text-[var(--foreground)]">
                              {record.description}
                            </p>
                          </div>

                          <div>
                            <p className="text-[12px] font-medium text-[var(--muted)] mb-1.5">
                              Accommodations
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {record.accommodations.map((acc, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-full border border-[var(--border)]"
                                >
                                  {acc}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-[12px]">
                            <div>
                              <span className="text-[var(--muted)]">
                                Review Date:{" "}
                              </span>
                              <span className="text-[var(--foreground)] font-medium">
                                {formatDate(record.reviewDate)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[var(--muted)]">
                                Assigned:{" "}
                              </span>
                              <span className="text-[var(--foreground)] font-medium">
                                {record.assignedStaff}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    {!isExpanded && (
                      <>
                        <td className="px-4 py-3.5">
                          <span className="text-[12px] text-[var(--muted)]">
                            {record.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                              tConfig.bg,
                              tConfig.text
                            )}
                          >
                            {tConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell max-w-[200px]">
                          <span className="text-[12px] text-[var(--foreground)] line-clamp-2">
                            {record.description}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {record.accommodations.slice(0, 2).map((acc, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-[var(--foreground)] bg-[var(--background-secondary)] rounded-full border border-[var(--border)]"
                              >
                                {acc}
                              </span>
                            ))}
                            {record.accommodations.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                                +{record.accommodations.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-[12px] text-[var(--muted)]">
                            {formatDate(record.reviewDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-[12px] text-[var(--foreground)]">
                            {record.assignedStaff}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                              sConfig.bg,
                              sConfig.text
                            )}
                          >
                            {sConfig.label}
                          </span>
                        </td>
                      </>
                    )}
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
