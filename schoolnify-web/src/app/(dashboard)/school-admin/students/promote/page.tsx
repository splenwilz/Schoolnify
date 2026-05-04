"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Users, AlertTriangle, Loader2, RefreshCcw, WifiOff } from "lucide-react";
import { useAllStudents, usePromoteStudents } from "@/hooks/use-students";
import { useSchoolSetup } from "@/hooks/use-school-setup";
import { Avatar } from "../_components/avatar";
import { cn } from "@/lib/utils";

type Decision = "promote" | "retain" | "graduate";

export default function PromotionPage() {
  const [selectedGrade, setSelectedGrade] = useState("");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [applied, setApplied] = useState(false);

  const { data, isLoading, error, refetch } = useAllStudents({ status: "active" });
  const { data: setupData } = useSchoolSetup();
  const promoteMutation = usePromoteStudents();
  const students = useMemo(() => data?.students ?? [], [data?.students]);

  // Source the grade progression from school setup so schools with custom
  // levels work end-to-end. The configured order is canonical for nextGrade().
  const configuredGrades = useMemo(() => setupData?.gradeLevels ?? [], [setupData?.gradeLevels]);
  const academicYear = setupData?.currentAcademicYear?.trim() || "";

  const nextGrade = (current: string): string | null => {
    const idx = configuredGrades.indexOf(current);
    if (idx === -1 || idx === configuredGrades.length - 1) return null;
    return configuredGrades[idx + 1];
  };

  const grades = useMemo(() => {
    const unique = [...new Set(students.filter((s) => s.status === "active").map((s) => s.gradeLevel))];
    return unique.sort((a, b) => {
      const ai = configuredGrades.indexOf(a);
      const bi = configuredGrades.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [students, configuredGrades]);

  const classStudents = useMemo(() => {
    if (!selectedGrade) return [];
    return students.filter((s) => s.gradeLevel === selectedGrade && s.status === "active");
  }, [selectedGrade, students]);

  const target = selectedGrade ? nextGrade(selectedGrade) : null;
  const isLastGrade =
    !!selectedGrade &&
    configuredGrades.length > 0 &&
    selectedGrade === configuredGrades[configuredGrades.length - 1];

  // Initialize decisions when grade changes
  const getDecision = (id: string): Decision => {
    if (decisions[id]) return decisions[id];
    return isLastGrade ? "graduate" : "promote";
  };

  const setDecision = (id: string, d: Decision) => {
    setDecisions((prev) => ({ ...prev, [id]: d }));
  };

  const promoteCount = classStudents.filter((s) => getDecision(s.id) === "promote").length;
  const retainCount = classStudents.filter((s) => getDecision(s.id) === "retain").length;
  const graduateCount = classStudents.filter((s) => getDecision(s.id) === "graduate").length;

  // The selected grade has no successor and isn't the last configured grade.
  // This happens when the student's grade isn't in school setup at all
  // (custom/imported grade names). We can't promote without a target, so
  // block Apply and show an explicit warning instead of silently retaining.
  const cannotPromote =
    !!selectedGrade && !isLastGrade && configuredGrades.length > 0 && target === null;

  const handleApply = () => {
    if (!selectedGrade || classStudents.length === 0 || promoteMutation.isPending) return;
    if (!academicYear) return;
    if (cannotPromote) return;

    // Snapshot decisions + class list at click time so the payload reflects the
    // user's current intent, not whatever state lands during the mutation.
    const decisionSnapshot = { ...decisions };
    const classSnapshot = classStudents.slice();
    const isLastSnapshot = isLastGrade;
    const targetSnapshot = target;

    const payload = {
      academic_year: academicYear,
      decisions: classSnapshot.map((s) => {
        const d: Decision = decisionSnapshot[s.id] ?? (isLastSnapshot ? "graduate" : "promote");
        return {
          student_id: s.id,
          action: d,
          to_grade: d === "promote" ? (targetSnapshot ?? undefined) : undefined,
        };
      }),
    };
    promoteMutation.mutate(payload, {
      onSuccess: () => setApplied(true),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-[860px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-[#0891B2] animate-spin" />
        <p className="text-[13px] text-[var(--muted)]">Loading students...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[860px] mx-auto py-24 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
          <WifiOff className="w-6 h-6 text-[var(--muted)]" />
        </div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">Couldn&apos;t load students</p>
        <p className="text-[13px] text-[var(--muted)] max-w-md">{(error as Error).message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (applied) {
    return (
      <div className="max-w-[860px] mx-auto py-16 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Promotion Applied</h2>
        <p className="text-[14px] text-[var(--muted)] mb-1">
          {promoteCount} promoted{target ? ` to ${target}` : ""}, {retainCount} retained, {graduateCount} graduated
        </p>
        <p className="text-[13px] text-[var(--muted)] mb-6">from {selectedGrade}</p>
        <Link href="/school-admin/students" className="text-[14px] font-medium text-[#0891B2] hover:underline inline-flex items-center gap-1">
          Back to Students <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[860px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/school-admin/students" className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Promote Students</h1>
          <p className="text-[14px] text-[var(--muted)]">Move students to the next class for the new academic session</p>
        </div>
      </div>

      {!academicYear && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-700 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Academic year not configured</p>
            <p className="text-[12px] mt-0.5">
              Set the current academic year in school setup before running promotions.
            </p>
          </div>
        </div>
      )}

      {/* Grade selector */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 mb-6">
        <label className="block text-[13px] font-medium text-[var(--muted)] mb-2">Select class to promote from</label>
        <div className="flex flex-wrap gap-2">
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => { setSelectedGrade(grade); setDecisions({}); }}
              className={cn(
                "px-3 py-2 text-[13px] font-medium rounded-lg border transition-colors",
                selectedGrade === grade
                  ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20"
              )}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Student list with promote/retain toggle */}
      {selectedGrade && classStudents.length > 0 && (
        <>
          {cannotPromote && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">No successor grade configured</p>
                <p className="text-[12px] mt-0.5">
                  &quot;{selectedGrade}&quot; isn&apos;t in your school&apos;s grade ladder, so promotion has no target.
                  Add it to school setup&apos;s grade levels (in promotion order) before applying.
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-[14px] text-[var(--foreground)] font-medium">{classStudents.length} students in {selectedGrade}</span>
            </div>
            {target && <span className="text-[13px] text-[var(--muted)]">Promoting to {target}</span>}
            {isLastGrade && <span className="text-[13px] text-[#8B5CF6] font-medium">Final year (graduating)</span>}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => { const d: Record<string, Decision> = {}; classStudents.forEach((s) => d[s.id] = isLastGrade ? "graduate" : "promote"); setDecisions(d); }}
              className="text-[12px] font-medium text-[#0891B2] hover:underline"
            >
              {isLastGrade ? "Graduate all" : "Promote all"}
            </button>
            <span className="text-[var(--border)]">|</span>
            <button
              onClick={() => { const d: Record<string, Decision> = {}; classStudents.forEach((s) => d[s.id] = "retain"); setDecisions(d); }}
              className="text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Retain all
            </button>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden mb-6">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">Adm No</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">GPA</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">Attendance</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">Decision</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => {
                  const decision = getDecision(student.id);
                  return (
                    <tr key={student.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar firstName={student.firstName} lastName={student.lastName} avatar={student.avatar} size="sm" />
                          <span className="font-medium text-[var(--foreground)]">{student.firstName} {student.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{student.admissionNumber}</td>
                      <td className="px-4 py-3">
                        {student.gpa === null ? (
                          <span className="text-[var(--muted)]">—</span>
                        ) : (
                          <span className={cn("font-medium", student.gpa >= 2.5 ? "text-[var(--foreground)]" : "text-red-500")}>
                            {student.gpa.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {student.attendanceRate === null ? (
                          <span className="text-[var(--muted)]">—</span>
                        ) : (
                          <span className={cn("font-medium", student.attendanceRate >= 75 ? "text-[var(--foreground)]" : "text-amber-500")}>
                            {student.attendanceRate}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!isLastGrade && (
                            <button
                              onClick={() => setDecision(student.id, "promote")}
                              className={cn("px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors",
                                decision === "promote" ? "bg-[#10B981]/10 text-[#10B981]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                              )}
                            >
                              Promote
                            </button>
                          )}
                          <button
                            onClick={() => setDecision(student.id, "retain")}
                            className={cn("px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors",
                              decision === "retain" ? "bg-amber-500/10 text-amber-600" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                            )}
                          >
                            Retain
                          </button>
                          {isLastGrade && (
                            <button
                              onClick={() => setDecision(student.id, "graduate")}
                              className={cn("px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors",
                                decision === "graduate" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                              )}
                            >
                              Graduate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {promoteMutation.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
              {(promoteMutation.error as Error).message}
            </div>
          )}

          {/* Summary + Apply */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-4 text-[13px]">
              {promoteCount > 0 && <span className="text-[#10B981] font-medium">{promoteCount} promoting</span>}
              {retainCount > 0 && <span className="text-amber-600 font-medium">{retainCount} retaining</span>}
              {graduateCount > 0 && <span className="text-[#8B5CF6] font-medium">{graduateCount} graduating</span>}
            </div>
            <button
              onClick={handleApply}
              disabled={promoteMutation.isPending || !academicYear || cannotPromote}
              title={
                !academicYear
                  ? "Set the current academic year in school setup"
                  : cannotPromote
                    ? "Add this grade to school setup's grade ladder before promoting"
                    : undefined
              }
              className="px-5 py-2.5 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {promoteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Apply Promotion
            </button>
          </div>
        </>
      )}

      {selectedGrade && classStudents.length === 0 && (
        <div className="py-16 text-center">
          <AlertTriangle className="w-10 h-10 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[15px] font-medium text-[var(--foreground)]">No active students in {selectedGrade}</p>
        </div>
      )}
    </motion.div>
  );
}
