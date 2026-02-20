"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";
import { classAttendanceRecords, students } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";
import { parseGradeCode } from "@/lib/class-naming";

type AttendanceStatus = "present" | "absent" | "late";

interface StudentMark {
  id: string;
  name: string;
  avatar?: string | null;
  status: AttendanceStatus;
}

// Generate a mock student roster for a class based on its totalStudents count
function generateRoster(
  className: string,
  total: number
): StudentMark[] {
  // Try to match real students to this class grade
  const parsed = parseGradeCode(className);
  const gradeMatch = parsed ? `${parsed.level}${parsed.section}` : className;
  const matched = students
    .filter((s) => s.grade === gradeMatch && s.status === "active")
    .map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      avatar: s.avatar,
      status: "present" as AttendanceStatus,
    }));

  // Fill remaining with generated names
  const firstNames = [
    "Ava", "Liam", "Noah", "Mia", "Ethan", "Chloe", "Lucas",
    "Zoe", "Oliver", "Lily", "Jack", "Grace", "Henry", "Ella",
    "Leo", "Aria", "Sam", "Nora", "Ben", "Ivy", "Owen", "Ruby",
    "Max", "Luna", "Kai", "Jade", "Finn", "Iris", "Cole", "Hope",
    "Seth", "Faye",
  ];
  const lastNames = [
    "Adeyemi", "Bello", "Chukwu", "Dada", "Eze", "Fashola",
    "Garba", "Hassan", "Ibrahim", "Johnson", "Kalu", "Lawal",
    "Mensah", "Nwosu", "Obi", "Peters", "Quadri", "Raji",
    "Sani", "Taiwo", "Udoh", "Vince", "Wale", "Yusuf",
    "Zaki", "Amadi", "Bako", "Chima", "Dunn", "Efosa",
    "Faruk", "Gani",
  ];

  const remaining = total - matched.length;
  for (let i = 0; i < remaining; i++) {
    matched.push({
      id: `gen_${className}_${i}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      avatar: null,
      status: "present" as AttendanceStatus,
    });
  }

  return matched.slice(0, total);
}

function MarkAttendanceContent() {
  const { fmtClass } = useSchoolConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClassId, setSelectedClassId] = useState("");
  const [roster, setRoster] = useState<StudentMark[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Auto-select class from query param (e.g. ?class=att_005)
  useEffect(() => {
    if (initialized) return;
    const classParam = searchParams.get("class");
    if (classParam) {
      const cls = classAttendanceRecords.find((c) => c.id === classParam);
      if (cls) {
        setSelectedClassId(classParam);
        setRoster(generateRoster(cls.className, cls.totalStudents));
        setInitialized(true);
      }
    }
  }, [searchParams, initialized]);

  // Only show pending classes first, then completed ones
  const sortedClasses = useMemo(() => {
    return [...classAttendanceRecords].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    });
  }, []);

  const pendingCount = classAttendanceRecords.filter(
    (c) => c.status === "pending"
  ).length;

  const selectedClass = classAttendanceRecords.find(
    (c) => c.id === selectedClassId
  );

  const handleSelectClass = (classId: string) => {
    const cls = classAttendanceRecords.find((c) => c.id === classId);
    if (!cls) return;
    setSelectedClassId(classId);
    setRoster(generateRoster(cls.className, cls.totalStudents));
    setSubmitted(false);
    setShowClassMenu(false);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: "present" })));
  };

  const stats = useMemo(() => {
    const present = roster.filter((s) => s.status === "present").length;
    const absent = roster.filter((s) => s.status === "absent").length;
    const late = roster.filter((s) => s.status === "late").length;
    return { present, absent, late, total: roster.length };
  }, [roster]);

  const handleSubmit = () => {
    // In production this would POST to the API
    setSubmitted(true);
  };

  const statusColors: Record<AttendanceStatus, { bg: string; text: string; ring: string }> = {
    present: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", ring: "ring-[#10B981]" },
    absent: { bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", ring: "ring-[#EF4444]" },
    late: { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", ring: "ring-[#F59E0B]" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/school-admin/attendance"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Mark Attendance
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Select a class and mark each student&apos;s attendance
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs text-[var(--muted)]">Pending</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {pendingCount}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">classes to mark</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs text-[var(--muted)]">Completed</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {classAttendanceRecords.length - pendingCount}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">classes done</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#0891B2]" />
            <span className="text-xs text-[var(--muted)]">Total Classes</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {classAttendanceRecords.length}
          </p>
          <p className="text-xs text-[var(--muted)] mt-0.5">for today</p>
        </div>
      </div>

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-[var(--muted)] mb-2">
          Select Class
        </label>
        <div className="relative">
          <button
            onClick={() => setShowClassMenu(!showClassMenu)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            {selectedClass ? (
              <div className="flex items-center gap-3">
                <span className="font-medium">{fmtClass(selectedClass.className)}</span>
                <span className="text-[var(--muted)]">&middot;</span>
                <span className="text-[var(--muted)]">{selectedClass.teacher}</span>
                <span className="text-[var(--muted)]">&middot;</span>
                <span className="text-[var(--muted)]">{selectedClass.totalStudents} students</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    selectedClass.status === "pending"
                      ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                      : "bg-[#10B981]/10 text-[#10B981]"
                  }`}
                >
                  {selectedClass.status === "pending" ? "Pending" : "Completed"}
                </span>
              </div>
            ) : (
              <span className="text-[var(--muted)]">Choose a class to mark attendance...</span>
            )}
            <ChevronDown className="w-4 h-4 text-[var(--muted)] shrink-0" />
          </button>

          <AnimatePresence>
            {showClassMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 max-h-72 overflow-y-auto"
              >
                {sortedClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-[var(--background-secondary)] transition-colors border-b border-[var(--border)] last:border-0 ${
                      selectedClassId === cls.id ? "bg-[#0891B2]/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[var(--foreground)]">
                        {fmtClass(cls.className)}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {cls.teacher}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--muted)]">
                        {cls.totalStudents} students
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          cls.status === "pending"
                            ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                            : "bg-[#10B981]/10 text-[#10B981]"
                        }`}
                      >
                        {cls.status === "pending" ? "Pending" : "Done"}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* No class selected */}
      {!selectedClass && (
        <div className="p-12 rounded-xl border-2 border-dashed border-[var(--border)] text-center">
          <Users className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">
            Select a class to begin
          </h3>
          <p className="text-sm text-[var(--muted)]">
            Choose a class from the dropdown above to see the student roster
          </p>
        </div>
      )}

      {/* Submitted success */}
      {selectedClass && submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Attendance Submitted
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            {fmtClass(selectedClass.className)} — {stats.present} present, {stats.absent} absent, {stats.late} late
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedClassId("");
                setRoster([]);
                setSubmitted(false);
              }}
              className="px-4 py-2 text-sm font-medium text-[#0891B2] bg-[#0891B2]/10 rounded-lg hover:bg-[#0891B2]/20 transition-colors"
            >
              Mark Another Class
            </button>
            <Link
              href="/school-admin/attendance"
              className="px-4 py-2 text-sm font-medium text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
            >
              Back to Attendance
            </Link>
          </div>
        </motion.div>
      )}

      {/* Student Roster */}
      {selectedClass && !submitted && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-[var(--muted)]">Present</span>
                <span className="font-semibold text-[var(--foreground)]">{stats.present}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <span className="text-[var(--muted)]">Absent</span>
                <span className="font-semibold text-[var(--foreground)]">{stats.absent}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-[var(--muted)]">Late</span>
                <span className="font-semibold text-[var(--foreground)]">{stats.late}</span>
              </span>
            </div>
            <button
              onClick={markAllPresent}
              className="px-3 py-1.5 text-xs font-medium text-[#0891B2] border border-[#0891B2]/30 rounded-lg hover:bg-[#0891B2]/10 transition-colors"
            >
              Mark All Present
            </button>
          </div>

          {/* Student List */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {roster.map((student, idx) => {
                const colors = statusColors[student.status];
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    {/* Number */}
                    <span className="w-6 text-xs text-[var(--muted)] text-right tabular-nums">
                      {idx + 1}
                    </span>

                    {/* Avatar */}
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                        <span className="text-xs font-medium text-[var(--muted)]">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <span className="flex-1 text-sm font-medium text-[var(--foreground)]">
                      {student.name}
                    </span>

                    {/* Status Buttons */}
                    <div className="flex items-center gap-1.5">
                      {(["present", "absent", "late"] as AttendanceStatus[]).map(
                        (status) => {
                          const isActive = student.status === status;
                          const c = statusColors[status];
                          return (
                            <button
                              key={status}
                              onClick={() =>
                                setStudentStatus(student.id, status)
                              }
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                                isActive
                                  ? `${c.bg} ${c.text} ring-1 ${c.ring}`
                                  : "text-[var(--muted)] hover:bg-[var(--background-secondary)]"
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Submit Bar */}
          <div className="flex items-center justify-between mt-6 pb-8">
            <Link
              href="/school-admin/attendance"
              className="px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </Link>
            <div className="flex items-center gap-3">
              <p className="text-sm text-[var(--muted)]">
                {stats.present}/{stats.total} present ({stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%)
              </p>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Attendance
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function MarkAttendancePage() {
  return (
    <Suspense>
      <MarkAttendanceContent />
    </Suspense>
  );
}
