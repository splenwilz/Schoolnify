"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { studentLeaveRequests } from "@/lib/demo-data";

type LeaveRequest = (typeof studentLeaveRequests)[number];

const typeConfig: Record<
  LeaveRequest["type"],
  { label: string; color: string }
> = {
  sick: { label: "Sick", color: "bg-[#EF4444]/10 text-[#EF4444]" },
  family: { label: "Family", color: "bg-[#3B82F6]/10 text-[#3B82F6]" },
  personal: { label: "Personal", color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  other: { label: "Other", color: "bg-[#6B7280]/10 text-[#6B7280]" },
};

const statusConfig: Record<
  LeaveRequest["status"],
  { label: string; color: string }
> = {
  pending: { label: "Pending", color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
  approved: { label: "Approved", color: "bg-[#10B981]/10 text-[#10B981]" },
  rejected: { label: "Rejected", color: "bg-[#EF4444]/10 text-[#EF4444]" },
};

type FilterTab = "all" | "pending" | "approved" | "rejected";

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function LeaveRequestsTab() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, LeaveRequest["status"]>
  >({});

  const getEffectiveStatus = (request: LeaveRequest): LeaveRequest["status"] => {
    return localStatuses[request.id] ?? request.status;
  };

  const filteredRequests = useMemo(() => {
    if (activeFilter === "all") return studentLeaveRequests;
    return studentLeaveRequests.filter(
      (r) => getEffectiveStatus(r) === activeFilter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, localStatuses]);

  const handleApprove = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: "approved" }));
  };

  const handleReject = (id: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: "rejected" }));
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] w-fit mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "px-4 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
              activeFilter === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Applied By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredRequests.map((request) => {
                const effectiveStatus = getEffectiveStatus(request);
                const type = typeConfig[request.type];
                const status = statusConfig[effectiveStatus];
                return (
                  <tr
                    key={request.id}
                    className="hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {request.studentName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--foreground)]">
                        {request.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                          type.color
                        )}
                      >
                        {type.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--foreground)] whitespace-nowrap">
                        {request.startDate} &mdash; {request.endDate}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[var(--foreground)]">
                        {request.days}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)] max-w-[200px] truncate block">
                        {request.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[var(--muted)] whitespace-nowrap">
                        {request.appliedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                          status.color
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {effectiveStatus === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-[#10B981] rounded-md hover:bg-[#059669] transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-[#EF4444] rounded-md hover:bg-[#DC2626] transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredRequests.length === 0 && (
          <div className="py-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-[var(--muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-[var(--foreground)]">
              No leave requests found
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              There are no {activeFilter !== "all" ? activeFilter : ""} leave
              requests at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
