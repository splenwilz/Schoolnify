"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  UserPlus,
  FileDown,
  Upload,
  Search,
  X,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { primaryGuardian, type Student } from "@/types/student";
import { cn } from "@/lib/utils";
import { useAllStudents, exportStudentsCsv } from "@/hooks/use-students";
import { escapeCsvCell } from "./_utils/csv";
import { StatCard } from "./_components/stat-card";
import { EnrollmentChart } from "./_components/enrollment-chart";
import { MetricsGrid } from "./_components/metrics-grid";
import { StudentTable } from "./_components/student-table";
import { BulkActionsBar } from "./_components/bulk-actions-bar";
import { Avatar } from "./_components/avatar";

const ITEMS_PER_PAGE = 25;

function avgOrDash(nums: (number | null)[], digits = 1): string {
  const present = nums.filter((n): n is number => n !== null);
  if (present.length === 0) return "—";
  return (present.reduce((s, n) => s + n, 0) / present.length).toFixed(digits);
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // TODO: source from `useRecentlyViewedStudents()` (localStorage) once implemented.
  // The Recently viewed section below renders only when this is non-empty.
  const [recentViewIds] = useState<string[]>([]);

  const { data, isLoading, error } = useAllStudents();
  const students: Student[] = useMemo(() => data?.students ?? [], [data?.students]);
  const apiSummary = data?.summary;

  const stats = useMemo(() => ({
    total: apiSummary?.total_students ?? students.length,
    active: apiSummary?.active ?? students.filter((s) => s.status === "active").length,
    avgGpa: apiSummary?.average_gpa != null
      ? apiSummary.average_gpa.toFixed(2)
      : avgOrDash(students.map((s) => s.gpa), 2),
    avgAttendance: apiSummary?.average_attendance != null
      ? apiSummary.average_attendance.toFixed(1)
      : avgOrDash(students.map((s) => s.attendanceRate), 1),
  }), [apiSummary, students]);

  const gradeGroups = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      map.set(s.gradeLevel, (map.get(s.gradeLevel) ?? 0) + 1);
    }
    return [...map.entries()].sort(([a], [b]) => {
      const order = ["Nursery", "Primary", "JSS", "SSS"];
      const ai = order.findIndex((o) => a.startsWith(o));
      const bi = order.findIndex((o) => b.startsWith(o));
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.localeCompare(b);
    });
  }, [students]);

  const isSearching = searchQuery.length > 0 || selectedGrade.length > 0;

  const filteredStudents = useMemo(() => {
    if (!isSearching) return [];
    return students.filter((student) => {
      if (selectedGrade && student.gradeLevel !== selectedGrade) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const admNo = student.admissionNumber.toLowerCase();
        const guardian = primaryGuardian(student);
        const guardianName = guardian ? `${guardian.firstName} ${guardian.lastName}`.toLowerCase() : "";
        const guardianPhone = guardian?.phone ?? "";
        if (!fullName.includes(q) && !admNo.includes(q) && !(student.email ?? "").toLowerCase().includes(q) && !guardianName.includes(q) && !guardianPhone.includes(q))
          return false;
      }
      return true;
    });
  }, [searchQuery, selectedGrade, isSearching, students]);

  // Reset pagination when filters change. Using the "Adjusting state during render"
  // pattern from React docs avoids the cascading-render hazard of useEffect+setState.
  const filterSignature = `${searchQuery}|${selectedGrade}`;
  const [prevFilterSignature, setPrevFilterSignature] = useState(filterSignature);
  if (prevFilterSignature !== filterSignature) {
    setPrevFilterSignature(filterSignature);
    setCurrentPage(1);
  }

  // The visible page slice. Select-all and the page passed into StudentTable
  // must agree -- otherwise the header checkbox toggles a row set the user
  // can't see, and `allSelected` flickers as the page changes.
  const currentPageStudents = useMemo(
    () => filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredStudents, currentPage]
  );

  const handleSelectAllPage = () => {
    const pageIds = currentPageStudents.map((s) => s.id);
    const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedStudents.includes(id));
    if (allOnPageSelected) {
      // Deselect everything on this page (preserve other pages' selections).
      setSelectedStudents((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedStudents((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedGrade("");
    setSelectedStudents([]);
  };

  const exportLocally = (studentList: Student[]) => {
    const headers = [
      "Admission No", "First Name", "Last Name", "Middle Name", "Grade", "Section",
      "Gender", "DOB", "Status", "Boarding", "Fee Status", "Guardian Name", "Guardian Phone",
    ];
    const lines = [
      headers.join(","),
      ...studentList.map((s) => {
        const g = primaryGuardian(s);
        const guardianName = g ? `${g.firstName} ${g.lastName}` : "";
        return [
          s.admissionNumber, s.firstName, s.lastName, s.middleName ?? "",
          s.gradeLevel, s.section ?? "", s.gender, s.dateOfBirth, s.status,
          s.boardingStatus, s.feeStatus, guardianName, g?.phone ?? "",
        ].map(escapeCsvCell).join(",");
      }),
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export strategy: always prefer the backend export so the column schema is
  // consistent regardless of filters. Selected-row exports and offline failure
  // fall back to building the CSV locally from the same Student shape. Both
  // paths must reflect the *same* visible filter set (grade + search) so the
  // user gets the export they expect.
  const handleExportAll = async () => {
    const filters: { grade_level?: string; search?: string } = {};
    if (selectedGrade) filters.grade_level = selectedGrade;
    if (searchQuery.trim()) filters.search = searchQuery.trim();
    try {
      await exportStudentsCsv(filters);
    } catch {
      exportLocally(filteredStudents.length > 0 ? filteredStudents : students);
    }
  };
  const handleExportSelected = () => {
    const selected = students.filter((s) => selectedStudents.includes(s.id));
    exportLocally(selected);
  };

  const recentStudents = recentViewIds
    .map((id) => students.find((s) => s.id === id))
    .filter((s): s is Student => !!s);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-[#0891B2] animate-spin" />
        <p className="text-[13px] text-[var(--muted)]">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto py-24 text-center">
        <p className="text-[15px] font-medium text-red-600 mb-2">Could not load students</p>
        <p className="text-[13px] text-[var(--muted)]">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Students</h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            {stats.total} enrolled &middot; {stats.active} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportAll} className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <FileDown className="w-4 h-4" />
            Export
          </button>
          <Link href="/school-admin/students/import" className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <Upload className="w-4 h-4" />
            Import
          </Link>
          <Link href="/school-admin/students/promote" className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-xl hover:bg-[var(--background-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all">
            <ArrowRight className="w-4 h-4" />
            Promote
          </Link>
          <Link href="/school-admin/students/new" className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
            <UserPlus className="w-4 h-4" />
            Enroll student
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Students" value={stats.total} subtitle={stats.total === 0 ? "no students yet" : "currently enrolled"} color="#0891B2" index={0} />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats.active}
          change={stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(0)}%` : undefined}
          changeUp
          subtitle="of total enrolled"
          color="#10B981"
          index={1}
        />
        <StatCard icon={GraduationCap} label="Avg GPA" value={stats.avgGpa} subtitle={stats.avgGpa === "—" ? "no data yet" : "across all students"} color="#3B82F6" index={2} />
        <StatCard icon={CalendarCheck} label="Attendance" value={stats.avgAttendance === "—" ? "—" : `${stats.avgAttendance}%`} subtitle={stats.avgAttendance === "—" ? "no data yet" : "last 30 days"} color="#F59E0B" index={3} />
      </div>

      {/* Search Bar -- the main interaction point */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students by name, admission number, or guardian..."
          className="w-full pl-12 pr-10 py-3.5 text-[15px] bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2] shadow-[0_1px_1px_rgba(0,0,0,0.03),0_3px_6px_rgba(18,42,66,0.02)]"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-[var(--background-secondary)] text-[var(--muted)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isSearching ? (
          /* ---- RESULTS MODE ---- */
          <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* Active filter bar */}
            <div className="flex items-center gap-2 mb-4">
              {selectedGrade && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-md bg-[#0891B2]/10 text-[#0891B2] border border-[#0891B2]/20">
                  {selectedGrade}
                  <button onClick={() => setSelectedGrade("")} className="hover:text-[#0E7490]"><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="text-[13px] text-[var(--muted)]">
                  {filteredStudents.length} result{filteredStudents.length !== 1 ? "s" : ""} {selectedGrade ? `in ${selectedGrade}` : ""}
                </span>
              )}
              <div className="flex-1" />
              <button onClick={clearSearch} className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)]">
                Clear
              </button>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="py-16 text-center">
                <Search className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-40" />
                <p className="text-[15px] font-medium text-[var(--foreground)] mb-1">No students found</p>
                <p className="text-[13px] text-[var(--muted)]">Try a different search term or class</p>
              </div>
            ) : (
              <StudentTable
                students={filteredStudents}
                selectedStudents={selectedStudents}
                onSelectAll={handleSelectAllPage}
                onSelectStudent={handleSelectStudent}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            )}
          </motion.div>
        ) : (
          /* ---- DEFAULT MODE: browse by class + recent ---- */
          <motion.div key="default" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-8">

            {/* Browse by class */}
            <div>
              <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">Browse by class</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {gradeGroups.map(([grade, count]) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className="p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-all text-left group"
                  >
                    <p className="text-[13px] font-medium text-[var(--foreground)] group-hover:text-[#0891B2] transition-colors">{grade}</p>
                    <p className="text-[11px] text-[var(--muted)]">{count} student{count !== 1 ? "s" : ""}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recently viewed -- renders only when recentViewIds is populated.
                The empty default keeps the section hidden until the localStorage
                tracker is wired (see TODO above on `recentViewIds` state). */}
            {recentStudents.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recently viewed
                </h2>
                <div className="space-y-1">
                  {recentStudents.map((student) => {
                    const guardian = primaryGuardian(student);
                    return (
                      <Link
                        key={student.id}
                        href={`/school-admin/students/${student.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted)]/30 hover:bg-[var(--background-secondary)] transition-all group"
                      >
                        <Avatar firstName={student.firstName} lastName={student.lastName} avatar={student.avatar} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-[var(--foreground)]">{student.firstName} {student.lastName}</p>
                          <p className="text-[12px] text-[var(--muted)]">
                            {student.admissionNumber} &middot; {student.gradeLevel}{student.section ? ` ${student.section}` : ""}
                          </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                          {guardian && <span className="text-[12px] text-[var(--muted)]">{guardian.firstName} {guardian.lastName}</span>}
                          <span className={cn(
                            "text-[11px] font-medium px-2 py-0.5 rounded",
                            student.feeStatus === "paid" ? "bg-[#10B981]/10 text-[#10B981]"
                              : student.feeStatus === "pending" ? "bg-amber-500/10 text-amber-600"
                                : student.feeStatus === "overdue" ? "bg-red-500/10 text-red-500"
                                  : "bg-[var(--background-secondary)] text-[var(--muted)]"
                          )}>
                            {student.feeStatus === "unknown" ? "—" : student.feeStatus}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--muted)] opacity-0 group-hover:opacity-100" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enrollment Chart */}
            <div>
              <EnrollmentChart />
            </div>

            {/* Metrics Grid */}
            <div>
              <MetricsGrid />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BulkActionsBar count={selectedStudents.length} onClear={() => setSelectedStudents([])} onExport={handleExportSelected} />
    </motion.div>
  );
}
