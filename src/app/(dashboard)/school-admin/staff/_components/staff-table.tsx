"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "../../students/_components/avatar";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "on_leave";
  joinDate: string;
  classesAssigned: number;
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

type SortField = "name" | "role" | "department" | "joined" | null;
type SortDir = "asc" | "desc";

interface StaffTableProps {
  staff: StaffMember[];
  selectedStaff: string[];
  onSelectAll: () => void;
  onSelectStaff: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function StaffTable({
  staff,
  selectedStaff,
  onSelectAll,
  onSelectStaff,
  currentPage,
  onPageChange,
  itemsPerPage,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  departments,
  selectedDepartment,
  onDepartmentChange,
}: StaffTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedStaff = [...staff].sort((a, b) => {
    if (!sortField) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return mul * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "role":
        return mul * a.role.localeCompare(b.role);
      case "department":
        return mul * a.department.localeCompare(b.department);
      case "joined":
        return mul * (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const allSelected = selectedStaff.length === staff.length && staff.length > 0;

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Table Header with Integrated Filters */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Staff Directory</h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {staff.length} members
              {sortField && <span> · Sorted by {sortField}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedStaff.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-[12px] font-medium text-[var(--muted)]"
                >
                  {selectedStaff.length} selected
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[12px] text-[var(--muted)] tabular-nums">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>

        {/* Filter Row: Tabs + Search + Department */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
                <span className="ml-1 tabular-nums opacity-60">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8.5 pr-8 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-transparent rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--border)] transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[var(--card)] text-[var(--muted)]"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Department dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !selectedDepartment && "text-[var(--muted)]"
              )}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-[var(--border)]">
              <th className="w-14 px-6 py-3">
                <div
                  onClick={onSelectAll}
                  className={cn(
                    "w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all",
                    allSelected
                      ? "bg-[var(--foreground)] border-[var(--foreground)]"
                      : "border-[var(--border)] hover:border-[var(--muted)]"
                  )}
                >
                  {allSelected && (
                    <svg className="w-2.5 h-2.5 text-[var(--background)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort("name")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Name <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("role")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Role <SortIcon field="role" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("department")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Department <SortIcon field="department" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th
                onClick={() => handleSort("joined")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Joined <SortIcon field="joined" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.map((member, index) => {
              const isSelected = selectedStaff.includes(member.id);

              return (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className={cn(
                    "group transition-colors",
                    "border-b border-[var(--border)]/50 last:border-b-0",
                    isSelected
                      ? "bg-[var(--background-secondary)]/60"
                      : "hover:bg-[var(--background-secondary)]/30"
                  )}
                >
                  <td className="px-6 py-4">
                    <div
                      onClick={() => onSelectStaff(member.id)}
                      className={cn(
                        "w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center cursor-pointer transition-all",
                        isSelected
                          ? "bg-[var(--foreground)] border-[var(--foreground)]"
                          : "border-[var(--border)] group-hover:border-[var(--muted)]"
                      )}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-[var(--background)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/school-admin/staff/${member.id}`}
                      className="flex items-center gap-3.5 group/link"
                    >
                      <Avatar
                        firstName={member.firstName}
                        lastName={member.lastName}
                        size="md"
                        className="rounded-xl"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[#0891B2] transition-colors truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-[12.5px] text-[var(--muted)] mt-0.5 truncate">
                          {member.email}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {member.role}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {member.department}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          member.status === "active" ? "bg-[#10B981]" : "bg-[#F59E0B]"
                        )}
                      />
                      {member.status === "active" ? "Active" : "On leave"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">
                      {formatDate(member.joinDate)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button className="p-1.5 rounded-lg text-[var(--muted)] opacity-0 group-hover:opacity-100 hover:bg-[var(--background-secondary)] transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {staff.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground)]">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, staff.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--foreground)]">{staff.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <div className="flex items-center gap-0.5 mx-1">
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "w-8 h-8 text-[12px] rounded-lg font-medium transition-all",
                    page === currentPage
                      ? "bg-[var(--foreground)] text-[var(--background)]"
                      : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
