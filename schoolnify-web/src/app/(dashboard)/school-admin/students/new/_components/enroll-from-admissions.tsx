"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Search, ArrowRight, Loader2 } from "lucide-react";
import { admissionApplications } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";
import { useCreateStudent, buildCreateRequest } from "@/hooks/use-students";
import type { Student } from "@/types/student";

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

export function EnrollFromAdmissions() {
  const { gradeOptions } = useSchoolConfig();
  const gradeOpts = gradeOptions({ withSections: true, minLevel: 5, maxLevel: 12 });
  const createMutation = useCreateStudent();
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [classAssignment, setClassAssignment] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [enrollError, setEnrollError] = useState("");

  const accepted = (admissionApplications as Application[]).filter(
    (a) => a.status === "accepted"
  );

  const filtered = accepted.filter(
    (a) =>
      !enrolledIds.has(a.id) &&
      (a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEnroll = (app: Application) => {
    if (!classAssignment || !dateOfBirth || !gender) return;
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      setEnrollError("Date of birth is not valid.");
      return;
    }
    setEnrollError("");
    const parts = app.studentName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ") || "—";
    const [gradePart, sectionPart] = classAssignment.split(" / ").map((s) => s.trim());

    const payload = buildCreateRequest({
      firstName,
      lastName,
      dateOfBirth,
      gender: gender as Student["gender"],
      gradeLevel: gradePart || classAssignment,
      section: sectionPart || undefined,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      email: app.email || undefined,
      previousSchool: app.previousSchool || undefined,
      guardians: [
        {
          firstName: app.parentName.split(" ")[0] ?? "Parent",
          lastName: app.parentName.split(" ").slice(1).join(" ") || "—",
          phone: app.phone || "",
          email: app.parentEmail || undefined,
          relationship: "Guardian",
          isPrimary: true,
        },
      ],
    });

    createMutation.mutate(payload, {
      onSuccess: () => {
        setEnrolledIds((prev) => new Set([...prev, app.id]));
        setEnrollingId(null);
        setClassAssignment("");
        setDateOfBirth("");
        setGender("");
      },
      onError: (e) => setEnrollError((e as Error).message),
    });
  };

  if (accepted.length === 0) {
    return (
      <div className="py-16 text-center">
        <Clock className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">No Accepted Applicants</h3>
        <p className="text-[14px] text-[var(--muted)] mb-4">
          There are no applicants with &quot;Accepted&quot; status ready for enrollment.
        </p>
        <Link href="/school-admin/admissions" className="text-[14px] font-medium text-[#0891B2] hover:underline inline-flex items-center gap-1">
          Go to Admissions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search accepted applicants..."
          className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]"
        />
      </div>

      {/* Summary */}
      <p className="text-[13px] text-[var(--muted)]">
        {filtered.length} applicant{filtered.length !== 1 ? "s" : ""} ready to enroll
        {enrolledIds.size > 0 && ` (${enrolledIds.size} enrolled this session)`}
      </p>

      {enrollError && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          {enrollError}
        </div>
      )}

      {/* Applicant cards */}
      <div className="space-y-3">
        {filtered.map((app) => (
          <div key={app.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-medium text-[var(--foreground)]">{app.studentName}</p>
                <p className="text-[13px] text-[var(--muted)]">{app.email} &middot; Applied for Grade {app.grade}</p>
              </div>
              {enrollingId === app.id ? (
                <button
                  type="button"
                  onClick={() => handleEnroll(app)}
                  disabled={!classAssignment || !dateOfBirth || !gender || createMutation.isPending}
                  className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#10B981] text-white hover:bg-[#059669] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1"
                >
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Confirm
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEnrollingId(app.id);
                    setClassAssignment("");
                    setDateOfBirth("");
                    setGender("");
                  }}
                  className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
                >
                  Enroll
                </button>
              )}
            </div>

            {enrollingId === app.id && (
              <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
                <p className="text-[12px] text-[var(--muted)]">
                  Confirm the applicant&apos;s details before enrolling. The admissions module will pre-fill these once it&apos;s wired.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`enroll-class-${app.id}`} className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                      Assign to Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`enroll-class-${app.id}`}
                      value={classAssignment}
                      onChange={(e) => setClassAssignment(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    >
                      <option value="">Select class...</option>
                      {gradeOpts.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`enroll-dob-${app.id}`} className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`enroll-dob-${app.id}`}
                      type="date"
                      value={dateOfBirth}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div>
                    <label htmlFor={`enroll-gender-${app.id}`} className="block text-[12px] font-medium text-[var(--muted)] mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`enroll-gender-${app.id}`}
                      value={gender}
                      onChange={(e) => setGender(e.target.value as "Male" | "Female" | "")}
                      className="w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
