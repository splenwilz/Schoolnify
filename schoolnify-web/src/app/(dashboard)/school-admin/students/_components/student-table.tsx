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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  status: "active" | "inactive";
  gpa: number;
  attendanceRate: number;
  feeStatus: "paid" | "pending" | "overdue";
  avatar?: string | null;
}

type SortField = "name" | "grade" | "gpa" | "attendance" | null;
type SortDir = "asc" | "desc";

interface StudentTableProps {
  students: Student[];
  selectedStudents: string[];
  onSelectAll: () => void;
  onSelectStudent: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

export function StudentTable({
  students,
  selectedStudents,
  onSelectAll,
  onSelectStudent,
  currentPage,
  onPageChange,
  itemsPerPage,
}: StudentTableProps) {
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

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return mul * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "grade":
        return mul * a.grade.localeCompare(b.grade);
      case "gpa":
        return mul * (a.gpa - b.gpa);
      case "attendance":
        return mul * (a.attendanceRate - b.attendanceRate);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const allSelected = selectedStudents.length === students.length && students.length > 0;

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Table Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Student Directory</h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {students.length} students
              {sortField && <span> · Sorted by {sortField}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedStudents.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-[12px] font-medium text-[var(--muted)]"
                >
                  {selectedStudents.length} selected
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[12px] text-[var(--muted)] tabular-nums">
              Page {currentPage} of {totalPages || 1}
            </span>
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
                  Student Name <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("grade")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Grade <SortIcon field="grade" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Status
              </th>
              <th
                onClick={() => handleSort("gpa")}
                className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5 justify-end">
                  GPA <SortIcon field="gpa" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("attendance")}
                className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5 justify-end">
                  Attendance <SortIcon field="attendance" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                Fees
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, index) => {
              const isSelected = selectedStudents.includes(student.id);

              return (
                <motion.tr
                  key={student.id}
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
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <div
                      onClick={() => onSelectStudent(student.id)}
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

                  {/* Student Name */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/school-admin/students/${student.id}`}
                      className="flex items-center gap-3.5 group/link"
                    >
                      <Avatar
                        firstName={student.firstName}
                        lastName={student.lastName}
                        avatar={student.avatar}
                        size="md"
                        className="rounded-xl"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[#0891B2] transition-colors truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[12.5px] text-[var(--muted)] mt-0.5 truncate">
                          {student.email}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--foreground)]">
                      {student.grade}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          student.status === "active" ? "bg-[#10B981]" : "bg-[var(--border)]"
                        )}
                      />
                      {student.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* GPA */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-[13px] font-semibold tabular-nums text-[var(--foreground)]">
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-12 h-[5px] rounded-full bg-[var(--border)]/60 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[var(--foreground)]/20"
                          initial={{ width: 0 }}
                          animate={{ width: `${student.attendanceRate}%` }}
                          transition={{ duration: 0.5, delay: index * 0.03 }}
                        />
                      </div>
                      <span className="text-[13px] tabular-nums text-[var(--muted)] w-11 text-right">
                        {student.attendanceRate}%
                      </span>
                    </div>
                  </td>

                  {/* Fee Status */}
                  <td className="px-4 py-4 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[68px] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-md",
                        student.feeStatus === "paid" &&
                          "bg-[#10B981]/8 text-[#10B981]",
                        student.feeStatus === "pending" &&
                          "bg-[#F59E0B]/8 text-[#D97706]",
                        student.feeStatus === "overdue" &&
                          "bg-[#EF4444]/8 text-[#DC2626]"
                      )}
                    >
                      {student.feeStatus === "paid"
                        ? "Paid"
                        : student.feeStatus === "pending"
                          ? "Pending"
                          : "Overdue"}
                    </span>
                  </td>

                  {/* Actions */}
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
      {students.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground)]">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, students.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--foreground)]">{students.length}</span>
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
