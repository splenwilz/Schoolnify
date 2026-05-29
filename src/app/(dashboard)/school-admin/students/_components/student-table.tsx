"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import type { Student } from "@/types/student";
import { primaryGuardian, STATUS_LABEL } from "@/types/student";

type SortField = "name" | "grade" | "admNo" | "gender" | null;
type SortDir = "asc" | "desc";

const STATUS_DOT: Record<Student["status"], string> = {
  active: "bg-[#10B981]",
  inactive: "bg-[var(--border)]",
  suspended: "bg-amber-500",
  graduated: "bg-[#8B5CF6]",
  transferred: "bg-blue-500",
  withdrawn: "bg-red-500",
};

function FeeBadge({ feeStatus }: { feeStatus: Student["feeStatus"] }) {
  const config: Record<Student["feeStatus"], { label: string; className: string }> = {
    paid: { label: "paid", className: "bg-[#10B981]/10 text-[#10B981]" },
    pending: { label: "pending", className: "bg-amber-500/10 text-amber-600" },
    overdue: { label: "overdue", className: "bg-red-500/10 text-red-500" },
    unknown: { label: "—", className: "bg-[var(--background-secondary)] text-[var(--muted)]" },
  };
  const c = config[feeStatus];
  return (
    <span
      className={cn("text-[11px] font-semibold px-2 py-0.5 rounded", c.className)}
      title={feeStatus === "unknown" ? "No fee data yet" : undefined}
    >
      {c.label}
    </span>
  );
}

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
  return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

export function StudentTable({
  students, selectedStudents, onSelectAll, onSelectStudent, currentPage, onPageChange, itemsPerPage,
}: StudentTableProps) {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const mul = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "name": return mul * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      case "grade": return mul * a.gradeLevel.localeCompare(b.gradeLevel);
      case "admNo": return mul * a.admissionNumber.localeCompare(b.admissionNumber);
      case "gender": return mul * a.gender.localeCompare(b.gender);
      default: return 0;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  // Clamp the requested page so deletes / re-filters don't leave us on an
  // empty out-of-range page.
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * itemsPerPage;
  const paged = sorted.slice(start, start + itemsPerPage);
  const allSelected = paged.length > 0 && paged.every((s) => selectedStudents.includes(s.id));

  return (
    <div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    aria-label="Select all students on page"
                    className="rounded border-[var(--border)] accent-[#0891B2]"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <button type="button" onClick={() => toggleSort("name")} className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Student <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button type="button" onClick={() => toggleSort("admNo")} className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Adm No <SortIcon field="admNo" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button type="button" onClick={() => toggleSort("grade")} className="flex items-center gap-1 text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Class <SortIcon field="grade" sortField={sortField} sortDir={sortDir} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Fees</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((student, i) => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn("border-b border-[var(--border)] last:border-0 group transition-colors", isSelected ? "bg-[#0891B2]/5" : "hover:bg-[var(--background-secondary)]")}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectStudent(student.id)}
                        aria-label={`Select student ${student.firstName} ${student.lastName}`}
                        className="rounded border-[var(--border)] accent-[#0891B2]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/school-admin/students/${student.id}`} className="flex items-center gap-3 group/link">
                        <Avatar firstName={student.firstName} lastName={student.lastName} avatar={student.avatar} size="sm" />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[var(--foreground)] group-hover/link:text-[#0891B2] transition-colors truncate">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[12px] text-[var(--muted)] truncate">
                            {primaryGuardian(student) ? `${primaryGuardian(student)!.firstName} ${primaryGuardian(student)!.lastName}` : ""}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--foreground)] tabular-nums">{student.admissionNumber}</td>
                    <td className="px-4 py-3 text-[13px] text-[var(--foreground)]">{student.gradeLevel}{student.section ? ` ${student.section}` : ""}</td>
                    <td className="px-4 py-3 text-[13px] text-[var(--muted)]">{student.gender}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)]">
                        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[student.status])} />
                        {STATUS_LABEL[student.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <FeeBadge feeStatus={student.feeStatus} />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-[13px] text-[var(--muted)]">
          <span>{start + 1}-{Math.min(start + itemsPerPage, sorted.length)} of {sorted.length}</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onPageChange(safePage - 1)} disabled={safePage === 1} className="p-1.5 rounded hover:bg-[var(--background-secondary)] disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
              <button key={p} type="button" onClick={() => onPageChange(p)} className={cn("w-8 h-8 rounded text-[13px] font-medium", p === safePage ? "bg-[#0891B2] text-white" : "hover:bg-[var(--background-secondary)]")}>
                {p}
              </button>
            ))}
            <button type="button" onClick={() => onPageChange(safePage + 1)} disabled={safePage === totalPages} className="p-1.5 rounded hover:bg-[var(--background-secondary)] disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
