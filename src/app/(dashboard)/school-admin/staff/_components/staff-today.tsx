"use client";

import { useId, useMemo } from "react";
import type { Staff } from "@/types/staff";
import type { AbsenceLike } from "@/lib/staff/leave";
import type { CoverageSummary } from "@/lib/staff/coverage";
import type { ComplianceInput } from "@/lib/staff/rows";
import { awayStaffIds } from "@/lib/staff/leave";
import { CREDENTIAL_EXPIRY_WINDOW_DAYS, complianceSummary, expiringItemsOf } from "@/lib/staff/credentials";
import { onboardingOn } from "@/lib/staff/overview";
import { headcountOn, headcountSeries, isOnBooksOn, seriesDates } from "@/lib/staff/metrics";
import { addDays, formatDate } from "@/lib/staff/dates";
import { AreaChart } from "./area-chart";
import { StatTile } from "./stat-tile";

interface StaffTodayProps {
  today: string;
  staff: readonly Staff[];
  absences: readonly AbsenceLike[];
  compliance: ComplianceInput;
  coverage: CoverageSummary;
  school: { name: string; currentTerm: string; academicYear: string };
}

export function StaffToday({ today, staff, absences, compliance, coverage, school }: StaffTodayProps) {
  const statsId = useId();
  const model = useMemo(() => {
    const onBooks = staff.filter((s) => isOnBooksOn(s, today));
    const away = awayStaffIds(absences, today);
    const awayCount = onBooks.filter((s) => away.has(s.id)).length;
    // Suspended staff stay on the books (headcount, FTE) but are not available today.
    const suspendedCount = onBooks.filter((s) => s.employmentStatus === "suspended" && !away.has(s.id)).length;
    const complianceCounts = complianceSummary(expiringItemsOf(compliance), today);
    const series = headcountSeries(staff, seriesDates(addDays(today, -29), today, "daily")).map((p) => ({
      time: formatDate(p.date, "short"),
      value: p.value,
    }));
    return {
      total: onBooks.length,
      onDuty: onBooks.length - awayCount - suspendedCount,
      awayCount,
      suspendedCount,
      teachers: onBooks.filter((s) => s.isTeacher).length,
      support: onBooks.filter((s) => s.staffCategory === "support").length,
      departments: new Set(onBooks.map((s) => s.department)).size,
      onboarding: onboardingOn(staff, today),
      compliance: complianceCounts,
      series,
      headcountThirtyDaysAgo: headcountOn(staff, addDays(today, -30)),
    };
  }, [staff, absences, compliance, today]);

  const issues = model.compliance.expired + model.compliance.expiring + model.compliance.unknown;
  const complianceDetail =
    issues === 0
      ? `Nothing expiring in the next ${CREDENTIAL_EXPIRY_WINDOW_DAYS} days`
      : [
          model.compliance.expired > 0 && `${model.compliance.expired} expired`,
          model.compliance.expiring > 0 && `${model.compliance.expiring} expiring soon`,
          model.compliance.unknown > 0 && `${model.compliance.unknown} to check`,
        ]
          .filter(Boolean)
          .join(" · ");

  const quickStats = [
    { label: "On the books", value: model.total },
    { label: "Teachers", value: model.teachers },
    { label: "Support staff", value: model.support },
    { label: "Departments", value: model.departments },
    { label: "Onboarding", value: model.onboarding },
  ];

  return (
    <section aria-labelledby="staff-today-heading">
      <div className="flex items-baseline justify-between mb-6">
        <h2 id="staff-today-heading" className="text-2xl font-semibold text-[var(--foreground)]">Today</h2>
        <span className="text-sm text-[var(--muted)]">{formatDate(today, "long")}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile
              label="On duty today"
              value={model.onDuty}
              detail={`of ${model.total} on the books · ${model.awayCount} away · ${model.suspendedCount} suspended`}
            />
            <StatTile label="Away today" value={model.awayCount} detail="Approved leave" />
            <StatTile
              label="Credentials to action"
              value={issues}
              detail={complianceDetail}
              tone={model.compliance.expired > 0 ? "error" : model.compliance.expiring + model.compliance.unknown > 0 ? "warning" : "default"}
            />
          </div>

          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--muted)]">Headcount, last 30 days</span>
              <span className="text-xs text-[var(--muted)] tabular-nums">
                {model.headcountThirtyDaysAgo} to {model.total}
              </span>
            </div>
            <AreaChart data={model.series} height={140} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatTile
              label="Unassigned teachers"
              value={coverage.unassignedTeacherIds.length}
              detail={`of ${coverage.teachersOnBooks} teachers`}
              href="/school-admin/staff"
            />
            <StatTile
              label="Classes without a teacher"
              value={coverage.classesWithoutTeacherIds.length}
              detail="Form or class teacher missing"
              href="/school-admin/classes"
            />
            <StatTile
              label="Subjects without a teacher"
              value={coverage.subjectsWithoutTeacher.length}
              detail={`in ${new Set(coverage.subjectsWithoutTeacher.map((s) => s.classId)).size} classes`}
              href="/school-admin/classes"
            />
          </div>
        </div>

        <aside className="w-full lg:w-72 space-y-4">
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">Quick stats</h3>
            <dl className="space-y-4">
              {quickStats.map((s, i) => (
                <div key={s.label} className="flex items-center justify-between">
                  <dt id={`${statsId}-${i}`} className="text-sm text-[var(--muted)]">{s.label}</dt>
                  <dd aria-labelledby={`${statsId}-${i}`} className="text-sm font-medium text-[var(--foreground)] font-mono tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">{school.name}</h3>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Term</dt>
                <dd className="text-[var(--foreground)]">{school.currentTerm}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--muted)]">Academic year</dt>
                <dd className="text-[var(--foreground)]">{school.academicYear}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
