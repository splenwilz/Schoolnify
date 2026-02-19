"use client";

import { Search, ChevronDown, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  type: "behavioral" | "academic" | "attendance" | "bullying" | "property";
  severity: "minor" | "moderate" | "major" | "critical";
  status: "open" | "in_progress" | "resolved" | "escalated";
  description: string;
  location: string;
  reportedBy: string;
  actionTaken: string;
  parentNotified: boolean;
}

interface DisciplineTableProps {
  incidents: Incident[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  severityFilter: string;
  onSeverityChange: (severity: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  onViewIncident: (incident: Incident) => void;
}

const statusTabs = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "escalated", label: "Escalated" },
];

const severityConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  minor: { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", label: "Minor" },
  moderate: {
    bg: "bg-[#F59E0B]/10",
    text: "text-[#F59E0B]",
    label: "Moderate",
  },
  major: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", label: "Major" },
  critical: {
    bg: "bg-[#7C2D12]/10",
    text: "text-[#7C2D12]",
    label: "Critical",
  },
};

const statusConfig: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  open: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", label: "Open" },
  in_progress: {
    bg: "bg-[#3B82F6]/10",
    text: "text-[#3B82F6]",
    label: "In Progress",
  },
  resolved: {
    bg: "bg-[#10B981]/10",
    text: "text-[#10B981]",
    label: "Resolved",
  },
  escalated: {
    bg: "bg-[#EF4444]/10",
    text: "text-[#EF4444]",
    label: "Escalated",
  },
};

const typeLabels: Record<string, string> = {
  behavioral: "Behavioral",
  academic: "Academic",
  attendance: "Attendance",
  bullying: "Bullying",
  property: "Property",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DisciplineTable({
  incidents,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  typeFilter,
  onTypeChange,
  onViewIncident,
}: DisciplineTableProps) {
  // Tab counts
  const tabCounts: Record<string, number> = { all: incidents.length };
  for (const tab of statusTabs) {
    if (tab.id !== "all") {
      tabCounts[tab.id] = incidents.filter((i) => i.status === tab.id).length;
    }
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter && statusFilter !== "all" && inc.status !== statusFilter)
      return false;
    if (severityFilter && inc.severity !== severityFilter) return false;
    if (typeFilter && inc.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !inc.studentName.toLowerCase().includes(query) &&
        !inc.description.toLowerCase().includes(query) &&
        !inc.reportedBy.toLowerCase().includes(query)
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
            Incidents
          </h3>
          <span className="text-[12px] text-[var(--muted)]">
            {filteredIncidents.length} result
            {filteredIncidents.length !== 1 ? "s" : ""}
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

        {/* Search + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or description..."
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
              value={severityFilter}
              onChange={(e) => onSeverityChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !severityFilter && "text-[var(--muted)]"
              )}
            >
              <option value="">All Severities</option>
              <option value="minor">Minor</option>
              <option value="moderate">Moderate</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-2 text-sm rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !typeFilter && "text-[var(--muted)]"
              )}
            >
              <option value="">All Types</option>
              <option value="behavioral">Behavioral</option>
              <option value="academic">Academic</option>
              <option value="attendance">Attendance</option>
              <option value="bullying">Bullying</option>
              <option value="property">Property</option>
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
                Type
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Severity
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider hidden md:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    No incidents found.
                  </p>
                  <button
                    onClick={() => {
                      onSearchChange("");
                      onStatusChange("");
                      onSeverityChange("");
                      onTypeChange("");
                    }}
                    className="mt-2 text-sm text-[#0891B2] hover:underline"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => {
                const sevConfig = severityConfig[inc.severity];
                const statConfig = statusConfig[inc.status];
                return (
                  <tr
                    key={inc.id}
                    className="group border-t border-[var(--border)] hover:bg-[var(--background-secondary)]/40 transition-colors"
                  >
                    {/* Student */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => onViewIncident(inc)}
                        className="text-left"
                      >
                        <p className="text-[13px] font-medium text-[var(--foreground)] hover:text-[#0891B2] transition-colors">
                          {inc.studentName}
                        </p>
                        <p className="text-[12px] text-[var(--muted)] mt-0.5">
                          {inc.grade}
                        </p>
                      </button>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] text-[var(--muted)] bg-[var(--background-secondary)] px-2 py-0.5 rounded">
                        {typeLabels[inc.type] || inc.type}
                      </span>
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full",
                          sevConfig.bg,
                          sevConfig.text
                        )}
                      >
                        {sevConfig.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-[13px] text-[var(--muted)]">
                        {formatDate(inc.date)}
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

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => onViewIncident(inc)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[#0891B2] hover:bg-[#0891B2]/10 rounded-lg transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
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
