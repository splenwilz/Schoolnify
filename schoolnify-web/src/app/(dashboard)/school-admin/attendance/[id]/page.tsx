"use client";

/**
 * Class Attendance Detail Page - Stripe-Inspired Design
 * Shows a full breakdown for a specific class attendance record.
 * Route: /school-admin/attendance/[id]
 */

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Edit3,
  Calendar,
  User,
} from "lucide-react";
import { classAttendanceRecords, students } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";
import { parseGradeCode } from "@/lib/class-naming";

type AttendanceStatus = "present" | "absent" | "late";

interface RosterStudent {
  id: string;
  name: string;
  avatar: string | null;
  status: AttendanceStatus;
}

/**
 * Generate a deterministic mock student roster for a class.
 * Matches real students by grade first, then fills remaining with generated names.
 * For completed records, distributes absent/late counts to match the record.
 */
function generateClassRoster(
  className: string,
  totalStudents: number,
  record: { status: string; present: number; absent: number; late: number }
): RosterStudent[] {
  const parsed = parseGradeCode(className);
  const gradeMatch = parsed ? `${parsed.level}${parsed.section}` : className;

  // Match real students from demo data
  const matched: RosterStudent[] = students
    .filter((s) => s.grade === gradeMatch && s.status === "active")
    .map((s) => ({
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      avatar: s.avatar ?? null,
      status: "present" as AttendanceStatus,
    }));

  // Fill remaining slots with generated names
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

  const remaining = totalStudents - matched.length;
  for (let i = 0; i < remaining; i++) {
    matched.push({
      id: `gen_${gradeMatch}_${i}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      avatar: null,
      status: "present" as AttendanceStatus,
    });
  }

  const roster = matched.slice(0, totalStudents);

  // For completed records, assign absent/late statuses to match the record counts
  if (record.status === "completed") {
    let absentCount = record.absent;
    let lateCount = record.late;

    // Assign absences starting from the end of the roster
    for (let i = roster.length - 1; i >= 0 && absentCount > 0; i--) {
      roster[i].status = "absent";
      absentCount--;
    }

    // Assign late statuses from positions just before the absences
    for (
      let i = roster.length - 1 - record.absent;
      i >= 0 && lateCount > 0;
      i--
    ) {
      roster[i].status = "late";
      lateCount--;
    }
  } else {
    // Pending records: assign random statuses with mostly present
    // Use a seeded approach based on index for consistency
    roster.forEach((student, i) => {
      const seed = i * 7 + 3;
      if (seed % 13 === 0) {
        student.status = "absent";
      } else if (seed % 11 === 0) {
        student.status = "late";
      }
    });
  }

  return roster;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const statusConfig: Record<
  AttendanceStatus,
  { label: string; color: string; bg: string }
> = {
  present: { label: "Present", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  absent: { label: "Absent", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  late: { label: "Late", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

export default function ClassAttendanceDetailPage() {
  const { fmtClass } = useSchoolConfig();
  const params = useParams();
  const id = params.id as string;

  const record = classAttendanceRecords.find((r) => r.id === id);

  const roster = useMemo(() => {
    if (!record) return [];
    return generateClassRoster(record.className, record.totalStudents, record);
  }, [record]);

  if (!record) {
    return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Record Not Found
          </h1>
          <p className="text-sm text-[var(--muted)] mt-2">
            The attendance record you are looking for does not exist.
          </p>
          <Link
            href="/school-admin/attendance"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Attendance
          </Link>
        </div>
      </div>
    );
  }

  const presentCount = roster.filter((s) => s.status === "present").length;
  const absentCount = roster.filter((s) => s.status === "absent").length;
  const lateCount = roster.filter((s) => s.status === "late").length;
  const attendanceRate =
    roster.length > 0
      ? ((presentCount / roster.length) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/school-admin/attendance"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Attendance
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {fmtClass(record.className)}
            </h1>
            <span
              className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full"
              style={{
                color:
                  record.status === "completed" ? "#10B981" : "#F59E0B",
                backgroundColor:
                  record.status === "completed"
                    ? "rgba(16,185,129,0.1)"
                    : "rgba(245,158,11,0.1)",
              }}
            >
              {record.status === "completed" ? "Completed" : "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              {record.teacher}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(record.date)}
            </span>
            {record.markedAt && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Marked at {record.markedAt}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <Link
            href={`/school-admin/attendance/mark?class=${id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Attendance
          </Link>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {/* Present */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Present
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: "#10B981" }} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#10B981" }}>
            {presentCount}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            of {roster.length} students
          </p>
        </div>

        {/* Absent */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Absent
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
            >
              <XCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#EF4444" }}>
            {absentCount}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {roster.length > 0
              ? ((absentCount / roster.length) * 100).toFixed(1)
              : "0.0"}
            % of class
          </p>
        </div>

        {/* Late */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Late
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
            >
              <Clock className="w-4 h-4" style={{ color: "#F59E0B" }} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#F59E0B" }}>
            {lateCount}
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            {roster.length > 0
              ? ((lateCount / roster.length) * 100).toFixed(1)
              : "0.0"}
            % of class
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
              Attendance Rate
            </p>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(8,145,178,0.1)" }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: "#0891B2" }} />
            </div>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: "#0891B2" }}>
            {attendanceRate}%
          </p>
          <p className="text-xs text-[var(--muted)] mt-1">
            class average
          </p>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
      >
        {/* List Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--muted)]" />
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Student Roster
            </h2>
            <span className="text-xs text-[var(--muted)]">
              ({roster.length} students)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#10B981" }}
              />
              Present ({presentCount})
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#EF4444" }}
              />
              Absent ({absentCount})
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#F59E0B" }}
              />
              Late ({lateCount})
            </span>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr] items-center px-6 py-3 bg-[var(--background-secondary)] text-xs font-medium text-[var(--muted)] uppercase tracking-wide border-b border-[var(--border)]">
          <span>Student</span>
          <span className="hidden sm:block text-center">ID</span>
          <span className="text-right">Status</span>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-[var(--border)]">
          {roster.map((student, index) => {
            const config = statusConfig[student.status];
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.2 + index * 0.02,
                }}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_1fr] items-center px-6 py-3 hover:bg-[var(--background-secondary)] transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(8,145,178,0.1)",
                        color: "#0891B2",
                      }}
                    >
                      {getInitials(student.name)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {student.name}
                  </span>
                </div>

                {/* Student ID */}
                <span className="hidden sm:block text-center text-xs text-[var(--muted)] font-mono">
                  {student.id}
                </span>

                {/* Status Badge */}
                <div className="flex justify-end">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
                    style={{
                      color: config.color,
                      backgroundColor: config.bg,
                    }}
                  >
                    {student.status === "present" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {student.status === "absent" && (
                      <XCircle className="w-3 h-3" />
                    )}
                    {student.status === "late" && (
                      <Clock className="w-3 h-3" />
                    )}
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {roster.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--muted)]">
              No students found for this class.
            </p>
          </div>
        )}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center justify-between mt-6 pt-6 border-t border-[var(--border)]"
      >
        <Link
          href="/school-admin/attendance"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          View all classes
        </Link>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <Link
            href={`/school-admin/attendance/mark?class=${id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Attendance
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
