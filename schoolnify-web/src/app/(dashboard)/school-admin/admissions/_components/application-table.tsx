"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  trackingCode?: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status:
    | "inquiry"
    | "applied"
    | "under_review"
    | "accepted"
    | "enrolled"
    | "rejected"
    | "waitlisted";
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  relationship?: string;
  statusHistory?: { status: string; date: string; note: string }[];
}

interface ApplicationTableProps {
  applications: Application[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  gradeFilter: string;
  onGradeChange: (grade: string) => void;
  onApplicationStatusChange?: (appId: string, newStatus: string) => void;
  onReview?: (application: Application) => void;
}

const statusTabs = [
  { id: "all", label: "All" },
  { id: "inquiry", label: "Inquiry" },
  { id: "applied", label: "Applied" },
  { id: "under_review", label: "Review" },
  { id: "accepted", label: "Accepted" },
  { id: "enrolled", label: "Enrolled" },
  { id: "rejected", label: "Rejected" },
];

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  inquiry: { bg: "bg-[#6B7280]/10", text: "text-[#6B7280]", label: "Inquiry" },
  applied: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", label: "Applied" },
  under_review: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", label: "Under Review" },
  accepted: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", label: "Accepted" },
  enrolled: { bg: "bg-[#0891B2]/10", text: "text-[#0891B2]", label: "Enrolled" },
  rejected: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", label: "Rejected" },
  waitlisted: { bg: "bg-[#A855F7]/10", text: "text-[#A855F7]", label: "Waitlisted" },
};

const gradeOptions = [
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationTable({
  applications,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  gradeFilter,
  onGradeChange,
  onApplicationStatusChange,
  onReview,
}: ApplicationTableProps) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tab counts
  const tabCounts: Record<string, number> = { all: applications.length };
  for (const tab of statusTabs) {
    if (tab.id !== "all") {
      tabCounts[tab.id] = applications.filter((a) => a.status === tab.id).length;
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (statusFilter && statusFilter !== "all" && app.status !== statusFilter)
      return false;
    if (gradeFilter && app.grade !== gradeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !app.studentName.toLowerCase().includes(query) &&
        !app.email.toLowerCase().includes(query) &&
        !app.parentName.toLowerCase().includes(query)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Applications
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            {filteredApplications.length} result
            {filteredApplications.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
          {statusTabs.map((tab) => {
            const isActive =
              statusFilter === tab.id || (tab.id === "all" && !statusFilter);
            return (
              <button
                key={tab.id}
                onClick={() => onStatusChange(tab.id === "all" ? "" : tab.id)}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
                <span className="ml-1 tabular-nums opacity-60">
                  {tabCounts[tab.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Grade Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={gradeFilter}
              onChange={(e) => onGradeChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !gradeFilter && "text-[var(--muted)]"
              )}
            >
              <option value="">All Grades</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
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
                Grade
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden lg:table-cell">
                Previous School
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No applications found.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange("");
                      onStatusChange("");
                      onGradeChange("");
                    }}
                    className="mt-2 text-sm text-[#0891B2] hover:underline"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredApplications.map((app) => {
                const config = statusConfig[app.status];
                return (
                  <tr
                    key={app.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onReview?.(app)}
                        className="text-left"
                      >
                        <p className="text-[13px] font-medium text-[var(--foreground)] hover:text-[#0891B2] transition-colors">
                          {app.studentName}
                        </p>
                        <p className="text-[12px] text-[var(--muted)] mt-0.5">
                          {app.email || app.parentEmail}
                        </p>
                      </button>
                    </td>

                    {/* Grade */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--foreground)]">
                        {app.grade}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(app.appliedDate)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          config.bg,
                          config.text
                        )}
                      >
                        {config.label}
                      </span>
                    </td>

                    {/* Previous School */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-[13px] text-[var(--muted)]">
                        {app.previousSchool || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div
                        className="relative"
                        ref={
                          openActionMenu === app.id
                            ? actionMenuRef
                            : undefined
                        }
                      >
                        <button
                          onClick={() =>
                            setOpenActionMenu(
                              openActionMenu === app.id ? null : app.id
                            )
                          }
                          className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {openActionMenu === app.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.12 }}
                              className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                            >
                              <button
                                onClick={() => {
                                  onReview?.(app);
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0891B2] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Review
                              </button>
                              <button
                                onClick={() => {
                                  onApplicationStatusChange?.(app.id, "accepted");
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#10B981] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  onApplicationStatusChange?.(app.id, "rejected");
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#EF4444] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  onApplicationStatusChange?.(app.id, "waitlisted");
                                  setOpenActionMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#A855F7] hover:bg-[var(--background-secondary)] transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                Waitlist
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
