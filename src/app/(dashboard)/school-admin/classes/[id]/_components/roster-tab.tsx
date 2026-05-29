"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Printer } from "lucide-react";
import type { Class } from "@/types/class";
import type { Student } from "@/types/student";
import { primaryGuardian } from "@/types/student";
import { classEnrollments, students } from "@/lib/demo-data";
import { StudentTable } from "../../../students/_components/student-table";
import { BulkActionsBar } from "../../../students/_components/bulk-actions-bar";
import { escapeCsvCell } from "../../../students/_utils/csv";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

const ITEMS_PER_PAGE = 25;

interface RosterTabProps {
  classData: Class;
}

export function RosterTab({ classData }: RosterTabProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Real roster: active enrollments for this class -> the matching students.
  const roster = useMemo(() => {
    const ids = new Set(
      classEnrollments
        .filter((e) => e.classId === classData.id && e.status === "active")
        .map((e) => e.studentId)
    );
    return students.filter((s) => ids.has(s.id));
  }, [classData.id]);

  const currentPageStudents = useMemo(
    () => roster.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [roster, currentPage]
  );

  const handleSelectAllPage = () => {
    const pageIds = currentPageStudents.map((s) => s.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds]))
    );
  };

  const handleSelectStudent = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const exportRoster = (list: Student[]) => {
    const headers = ["Name", "Admission No", "Gender", "Attendance", "GPA", "Fee Status", "Guardian", "Guardian Phone"];
    const lines = [
      headers.join(","),
      ...list.map((s) => {
        const g = primaryGuardian(s);
        return [
          `${s.firstName} ${s.lastName}`,
          s.admissionNumber,
          s.gender,
          s.attendanceRate === null ? "" : `${s.attendanceRate}%`,
          s.gpa === null ? "" : s.gpa.toFixed(2),
          s.feeStatus,
          g ? `${g.firstName} ${g.lastName}` : "",
          g?.phone ?? "",
        ].map(escapeCsvCell).join(",");
      }),
    ];
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${classData.name.replace(/\s+/g, "_")}_roster.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print-perfect roster: open a clean A4 document in a new window so the app's
  // chrome/CSS never interferes. Numbered list with photos-optional columns.
  const printRoster = () => {
    const rows = roster
      .map((s, i) => {
        const g = primaryGuardian(s);
        return `<tr>
          <td class="num">${i + 1}</td>
          <td>${escapeHtml(`${s.lastName}, ${s.firstName}`)}</td>
          <td>${escapeHtml(s.admissionNumber)}</td>
          <td>${escapeHtml(s.gender)}</td>
          <td>${escapeHtml(g ? `${g.firstName} ${g.lastName}` : "")}</td>
          <td>${escapeHtml(g?.phone ?? "")}</td>
        </tr>`;
      })
      .join("");

    const doc = `<!doctype html><html><head><meta charset="utf-8" />
      <title>${escapeHtml(classData.name)} — Roster</title>
      <style>
        @page { size: A4 portrait; margin: 18mm; }
        * { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; }
        h1 { font-size: 18px; margin: 0; }
        .meta { font-size: 12px; color: #555; margin: 4px 0 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; }
        th { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; color: #555; border-bottom: 1.5px solid #999; }
        td.num, th.num { width: 28px; color: #888; }
        tfoot td { border: none; padding-top: 12px; font-size: 11px; color: #777; }
      </style></head><body>
      <h1>${escapeHtml(classData.name)} — Class Roster</h1>
      <div class="meta">
        Teacher: ${escapeHtml(classData.teacher)} &nbsp;·&nbsp; Room: ${escapeHtml(classData.room)}
        &nbsp;·&nbsp; ${escapeHtml(classData.academicSession)} ${escapeHtml(classData.currentTerm)} Term
        &nbsp;·&nbsp; ${roster.length} students
      </div>
      <table>
        <thead><tr>
          <th class="num">#</th><th>Name</th><th>Admission No</th><th>Gender</th><th>Guardian</th><th>Phone</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </body></html>`;

    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) return;
    w.document.write(doc);
    w.document.close();
    w.focus();
    w.print();
  };

  if (roster.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-3">
          <Users className="w-5 h-5 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">No students enrolled yet</p>
        <p className="text-[13px] text-[var(--muted)] mt-1 max-w-md">
          Enrolled students will appear here. Add students to this class to build the roster.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Enroll students
        </button>
      </motion.div>
    );
  }

  const overCapacity = classData.capacity > 0 && roster.length > classData.capacity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Roster</h3>
          <p className="text-[12px] text-[var(--muted)] mt-0.5">
            {roster.length} {roster.length === 1 ? "student" : "students"}
            {classData.capacity > 0 && ` · capacity ${classData.capacity}`}
            {overCapacity && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-600">
                over capacity
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={printRoster}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Enroll students
          </button>
        </div>
      </div>

      <StudentTable
        students={roster}
        selectedStudents={selected}
        onSelectAll={handleSelectAllPage}
        onSelectStudent={handleSelectStudent}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <BulkActionsBar
        count={selected.length}
        onClear={() => setSelected([])}
        onExport={() => exportRoster(students.filter((s) => selected.includes(s.id)))}
      />
    </motion.div>
  );
}
