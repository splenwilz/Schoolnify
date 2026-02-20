"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Eye,
  ClipboardCheck,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";
import { parseGradeCode } from "@/lib/class-naming";

interface ClassItem {
  id: string;
  name: string;
  students: number;
  teacher: string;
  room: string;
  schedule: string;
  avgGrade: number;
  attendanceRate: number;
  status: string;
}

interface Tab {
  id: string;
  label: string;
  count: number;
}

type SortField = "name" | "teacher" | "students" | "attendance" | "gpa" | null;
type SortDir = "asc" | "desc";

interface ClassTableProps {
  classes: ClassItem[];
  selectedClasses: string[];
  onSelectAll: () => void;
  onSelectClass: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  grades: string[];
  selectedGrade: string;
  onGradeChange: (grade: string) => void;
  teachers: string[];
  selectedTeacher: string;
  onTeacherChange: (teacher: string) => void;
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
  return sortDir === "asc" ? (
    <ArrowUp className="w-3 h-3 text-[var(--foreground)]" />
  ) : (
    <ArrowDown className="w-3 h-3 text-[var(--foreground)]" />
  );
}

export function ClassTable({
  classes,
  selectedClasses,
  onSelectAll,
  onSelectClass,
  currentPage,
  onPageChange,
  itemsPerPage,
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  grades,
  selectedGrade,
  onGradeChange,
  teachers,
  selectedTeacher,
  onTeacherChange,
}: ClassTableProps) {
  const router = useRouter();
  const { fmtClass, fmtGrade } = useSchoolConfig();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedClasses = [...classes].sort((a, b) => {
    if (!sortField) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return mul * a.name.localeCompare(b.name);
      case "teacher":
        return mul * a.teacher.localeCompare(b.teacher);
      case "students":
        return mul * (a.students - b.students);
      case "attendance":
        return mul * (a.attendanceRate - b.attendanceRate);
      case "gpa":
        return mul * (a.avgGrade - b.avgGrade);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedClasses.length / itemsPerPage);
  const paginatedClasses = sortedClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const allSelected = selectedClasses.length === classes.length && classes.length > 0;

  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Table Header with Integrated Filters */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Class Directory</h3>
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {classes.length} classes
              {sortField && <span> · Sorted by {sortField}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedClasses.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-[12px] font-medium text-[var(--muted)]"
                >
                  {selectedClasses.length} selected
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[12px] text-[var(--muted)] tabular-nums">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>

        {/* Filter Row: Tabs + Search + Dropdowns */}
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
              placeholder="Search classes..."
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

          {/* Grade dropdown */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => onGradeChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !selectedGrade && "text-[var(--muted)]"
              )}
            >
              <option value="">All Grades</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {fmtGrade(grade)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--muted)] pointer-events-none" />
          </div>

          {/* Teacher dropdown */}
          <div className="relative">
            <select
              value={selectedTeacher}
              onChange={(e) => onTeacherChange(e.target.value)}
              className={cn(
                "appearance-none pl-3 pr-7 py-1.5 text-[12px] rounded-lg border border-transparent transition-all cursor-pointer",
                "bg-[var(--background-secondary)] text-[var(--foreground)]",
                "focus:outline-none focus:border-[var(--border)]",
                !selectedTeacher && "text-[var(--muted)]"
              )}
            >
              <option value="">All Teachers</option>
              {teachers.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
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
                  Class <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("teacher")}
                className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5">
                  Teacher <SortIcon field="teacher" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th
                onClick={() => handleSort("students")}
                className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5 justify-end">
                  Students <SortIcon field="students" sortField={sortField} sortDir={sortDir} />
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
              <th
                onClick={() => handleSort("gpa")}
                className="px-4 py-3 text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--foreground)] transition-colors select-none"
              >
                <span className="inline-flex items-center gap-1.5 justify-end">
                  Avg GPA <SortIcon field="gpa" sortField={sortField} sortDir={sortDir} />
                </span>
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedClasses.map((cls, index) => {
              const isSelected = selectedClasses.includes(cls.id);
              const parsed = parseGradeCode(cls.name);
              const gradeLabel = parsed ? `${parsed.level}${parsed.section}` : cls.name;

              return (
                <motion.tr
                  key={cls.id}
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
                      onClick={() => onSelectClass(cls.id)}
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

                  {/* Class Name */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/school-admin/classes/${cls.id}`}
                      className="flex items-center gap-3 group/link"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                        {gradeLabel}
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[#0891B2] transition-colors">
                        {fmtClass(cls.name)}
                      </span>
                    </Link>
                  </td>

                  {/* Teacher */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--muted)]">{cls.teacher}</span>
                  </td>

                  {/* Students */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-[13px] font-semibold tabular-nums text-[var(--foreground)]">
                      {cls.students}
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <div className="w-12 h-[5px] rounded-full bg-[var(--border)]/60 overflow-hidden">
                        <motion.div
                          className={cn(
                            "h-full rounded-full",
                            cls.attendanceRate >= 95
                              ? "bg-[#10B981]"
                              : cls.attendanceRate >= 90
                                ? "bg-[#F59E0B]"
                                : "bg-[#EF4444]"
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${cls.attendanceRate}%` }}
                          transition={{ duration: 0.5, delay: index * 0.03 }}
                        />
                      </div>
                      <span className="text-[13px] tabular-nums text-[var(--muted)] w-11 text-right">
                        {cls.attendanceRate}%
                      </span>
                    </div>
                  </td>

                  {/* GPA */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-[13px] font-semibold tabular-nums text-[var(--foreground)]">
                      {cls.avgGrade.toFixed(2)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="relative" ref={openMenuId === cls.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === cls.id ? null : cls.id)}
                        className={cn(
                          "p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-all",
                          openMenuId === cls.id ? "opacity-100 bg-[var(--background-secondary)]" : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenuId === cls.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg z-50 overflow-hidden py-1"
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/school-admin/classes/${cls.id}`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-[var(--muted)]" />
                              View details
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/school-admin/attendance/mark?class=${cls.id}`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <ClipboardCheck className="w-3.5 h-3.5 text-[var(--muted)]" />
                              Mark attendance
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/school-admin/classes/${cls.id}?tab=students`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
                              View students
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                router.push(`/school-admin/classes/${cls.id}?tab=assignments`);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[var(--muted)]" />
                              Assignments
                            </button>
                            <div className="my-1 border-t border-[var(--border)]" />
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                // In production, this would call an API to delete the class
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete class
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {classes.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--muted)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground)]">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, classes.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[var(--foreground)]">{classes.length}</span>
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
