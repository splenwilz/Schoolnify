"use client";

/**
 * Absent Students Page
 * Shows all absent students for today with search, class info, and notify actions
 * Quick action page linked from the main attendance dashboard
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  UserX,
  Bell,
  CheckCircle,
  Building2,
  AlertCircle,
} from "lucide-react";
import { classAttendanceRecords, students } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";
import { parseGradeCode } from "@/lib/class-naming";

// Mock names for generating absent students beyond what's in the students array
const mockFirstNames = [
  "Aiden", "Mia", "Caleb", "Zoe", "Dylan", "Harper", "Logan", "Ella",
  "Ryan", "Aria", "Jack", "Lily", "Owen", "Chloe", "Leo", "Grace",
  "Wyatt", "Nora", "Luke", "Stella", "Henry", "Hazel", "Sebastian", "Luna",
];

const mockLastNames = [
  "Rivera", "Nguyen", "Patel", "Kim", "Santos", "Murphy", "Walsh", "Foster",
  "Reed", "Cooper", "Brooks", "Bell", "Price", "Morgan", "Howard", "Barnes",
  "Sullivan", "Russell", "Griffin", "Hayes", "Coleman", "Perry", "Simmons", "Long",
];

interface AbsentStudent {
  id: string;
  name: string;
  initials: string;
  className: string;
  teacher: string;
  avatar: string | null;
  parentName: string;
}

function generateAbsentStudents(): AbsentStudent[] {
  const completedClasses = classAttendanceRecords.filter(
    (r) => r.status === "completed" && r.absent > 0
  );

  const absentList: AbsentStudent[] = [];
  let nameIdx = 0;

  for (const cls of completedClasses) {
    // Extract grade from className (e.g., "Grade 5A" -> "5A")
    const parsed = parseGradeCode(cls.className);
    const gradePart = parsed ? `${parsed.level}${parsed.section}` : cls.className;

    // Try to match real students first
    const matchedStudents = students.filter(
      (s) => s.grade === gradePart && s.status === "active"
    );

    for (let i = 0; i < cls.absent; i++) {
      if (matchedStudents[i]) {
        const s = matchedStudents[i];
        absentList.push({
          id: `absent-${cls.id}-${i}`,
          name: `${s.firstName} ${s.lastName}`,
          initials: `${s.firstName[0]}${s.lastName[0]}`,
          className: cls.className,
          teacher: cls.teacher,
          avatar: s.avatar,
          parentName: s.parentName,
        });
      } else {
        // Generate a mock absent student
        const firstName = mockFirstNames[nameIdx % mockFirstNames.length];
        const lastName = mockLastNames[nameIdx % mockLastNames.length];
        nameIdx++;
        absentList.push({
          id: `absent-${cls.id}-${i}`,
          name: `${firstName} ${lastName}`,
          initials: `${firstName[0]}${lastName[0]}`,
          className: cls.className,
          teacher: cls.teacher,
          avatar: null,
          parentName: `Mr./Mrs. ${lastName}`,
        });
      }
    }
  }

  return absentList;
}

export default function AbsentStudentsPage() {
  const { fmtClass } = useSchoolConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const allAbsentStudents = useMemo(() => generateAbsentStudents(), []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return allAbsentStudents;
    const query = searchQuery.toLowerCase();
    return allAbsentStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.className.toLowerCase().includes(query)
    );
  }, [allAbsentStudents, searchQuery]);

  // Stats
  const totalAbsent = allAbsentStudents.length;
  const classesWithAbsences = new Set(allAbsentStudents.map((s) => s.className)).size;

  const handleNotify = (studentId: string) => {
    setNotifiedIds((prev) => {
      const next = new Set(prev);
      next.add(studentId);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button + Header */}
      <div className="mb-6">
        <Link
          href="/school-admin/attendance"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Attendance
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Absent Students</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{todayStr}</p>
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
              <UserX className="w-4 h-4 text-[#EF4444]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Total Absent Today</p>
          <p className="text-2xl font-bold text-[#EF4444] mt-1">{totalAbsent}</p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] uppercase tracking-wide">
            Classes with Absences
          </p>
          <p className="text-2xl font-bold text-[#F59E0B] mt-1">{classesWithAbsences}</p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          type="text"
          placeholder="Search by student name or class..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#0891B2] transition-colors"
        />
      </div>

      {/* Absent Students List */}
      {filteredStudents.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student, index) => {
              const isNotified = notifiedIds.has(student.id);
              return (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
                >
                  {/* Avatar */}
                  <div className="shrink-0">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#EF4444]">
                          {student.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {student.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--muted)]">{fmtClass(student.className)}</span>
                      <span className="text-xs text-[var(--muted)]">&middot;</span>
                      <span className="text-xs text-[var(--muted)]">{student.teacher}</span>
                    </div>
                  </div>

                  {/* Notify Button / Confirmed State */}
                  <div className="shrink-0">
                    {isNotified ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-xs font-medium text-[#10B981]">Notified</span>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => handleNotify(student.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[#0891B2] hover:text-[#0891B2] transition-colors"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Notify Parent
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Count Footer */}
          <div className="pt-2 text-center">
            <p className="text-xs text-[var(--muted)]">
              Showing {filteredStudents.length} of {totalAbsent} absent student
              {totalAbsent !== 1 ? "s" : ""}
            </p>
          </div>
        </motion.div>
      ) : totalAbsent === 0 ? (
        /* Empty State - no absences at all */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-16 text-center rounded-xl border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-7 h-7 text-[#10B981]" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            No Absences Today
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-xs mx-auto">
            All students are present across all classes. Great attendance!
          </p>
        </motion.div>
      ) : (
        /* Empty State - search returned no results */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-16 text-center rounded-xl border border-[var(--border)] bg-[var(--card)]"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-[var(--background-secondary)] flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-[var(--muted)]" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            No matching students
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-xs mx-auto">
            No absent students match &ldquo;{searchQuery}&rdquo;. Try a different search term.
          </p>
        </motion.div>
      )}
    </div>
  );
}
