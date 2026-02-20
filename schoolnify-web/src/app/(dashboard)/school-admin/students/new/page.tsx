"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  UserPlus,
  CheckCircle2,
  Clock,
  Search,
  ArrowRight,
} from "lucide-react";
import { admissionApplications } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";

interface Application {
  id: string;
  trackingCode?: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status: string;
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
}


export default function EnrollStudentPage() {
  const { fmtClass, gradeOptions } = useSchoolConfig();
  const gradeOpts = gradeOptions({ withSections: true, minLevel: 5, maxLevel: 12 });
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [classAssignment, setClassAssignment] = useState("");
  const [feeStatus, setFeeStatus] = useState("pending");

  // Only show accepted applicants (ready to enroll)
  const accepted = (admissionApplications as Application[]).filter(
    (a) => a.status === "accepted"
  );

  const filtered = accepted.filter(
    (a) =>
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnroll = (appId: string) => {
    if (!classAssignment) return;
    setEnrolledIds((prev) => new Set(prev).add(appId));
    setEnrollingId(null);
    setClassAssignment("");
    setFeeStatus("pending");
    // In production, this would POST to the API to create the student record
  };

  const pendingCount = accepted.length - enrolledIds.size;

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
          href="/school-admin/students"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Enroll Students
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Enroll accepted applicants from the admissions pipeline
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-[#0891B2]/20 bg-[#0891B2]/5 mb-6">
        <UserPlus className="w-5 h-5 text-[#0891B2] shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-[var(--foreground)] font-medium">
            Students are enrolled through the Admissions pipeline
          </p>
          <p className="text-[var(--muted)] mt-0.5">
            New students start as inquiries or applications in{" "}
            <Link
              href="/school-admin/admissions"
              className="text-[#0891B2] hover:underline"
            >
              Admissions
            </Link>
            , move through review, and once accepted they appear here for enrollment.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs text-[var(--muted)]">Ready to Enroll</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {pendingCount}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs text-[var(--muted)]">Enrolled Today</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {enrolledIds.size}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <Link
            href="/school-admin/admissions"
            className="flex items-center justify-between h-full"
          >
            <div>
              <p className="text-xs text-[var(--muted)]">Need more?</p>
              <p className="text-sm font-medium text-[#0891B2] mt-1">
                Go to Admissions
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#0891B2]" />
          </Link>
        </div>
      </div>

      {/* Search */}
      {accepted.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accepted applicants..."
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
          />
        </div>
      )}

      {/* Accepted Applicants List */}
      {accepted.length === 0 ? (
        <div className="p-12 rounded-xl border-2 border-dashed border-[var(--border)] text-center">
          <UserPlus className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">
            No accepted applicants
          </h3>
          <p className="text-sm text-[var(--muted)] mb-4">
            Students need to be accepted through the admissions pipeline before they can be enrolled.
          </p>
          <Link
            href="/school-admin/admissions"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Go to Admissions
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 rounded-xl border border-[var(--border)] bg-[var(--card)] text-center">
          <p className="text-sm text-[var(--muted)]">No results for &ldquo;{searchQuery}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isEnrolled = enrolledIds.has(app.id);
            const isEnrolling = enrollingId === app.id;

            return (
              <motion.div
                key={app.id}
                layout
                className={`rounded-xl border bg-[var(--card)] overflow-hidden transition-colors ${
                  isEnrolled
                    ? "border-[#10B981]/30 bg-[#10B981]/5"
                    : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#0891B2]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-[#0891B2]">
                      {app.studentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {app.studentName}
                      </p>
                      {isEnrolled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Enrolled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      {fmtClass(app.grade)} &middot; {app.parentName} &middot; Applied{" "}
                      {new Date(app.appliedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Action */}
                  {!isEnrolled && (
                    <button
                      onClick={() =>
                        setEnrollingId(isEnrolling ? null : app.id)
                      }
                      className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        isEnrolling
                          ? "bg-[var(--background-secondary)] text-[var(--muted)]"
                          : "bg-[#0891B2] text-white hover:bg-[#0E7490]"
                      }`}
                    >
                      {isEnrolling ? "Cancel" : "Enroll"}
                    </button>
                  )}
                </div>

                {/* Enrollment Form (inline) */}
                <AnimatePresence>
                  {isEnrolling && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-[var(--border)]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                              Assign to Class *
                            </label>
                            <select
                              value={classAssignment}
                              onChange={(e) =>
                                setClassAssignment(e.target.value)
                              }
                              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
                            >
                              <option value="">Select class</option>
                              {gradeOpts.map((g) => (
                                <option key={g.value} value={g.value}>
                                  {g.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                              Fee Status
                            </label>
                            <select
                              value={feeStatus}
                              onChange={(e) => setFeeStatus(e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="partial">Partial</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => handleEnroll(app.id)}
                              disabled={!classAssignment}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#10B981] rounded-lg hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm Enrollment
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
