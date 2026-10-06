import type { Metadata } from "next";
import { connection } from "next/server";
import { classSubjects, classes, professionalRegistrations, schoolInfo, staff, staffAbsences, teachingAssignments, trainingRecords, vettingChecks } from "@/lib/demo-data";
import { coverageSummary } from "@/lib/staff/coverage";
import { toISODate } from "@/lib/staff/dates";
import { StaffPageView } from "./_components/staff-page-view";

export const metadata: Metadata = { title: "Staff" };

/**
 * Server Component: resolves "today" and the data once per request and hands
 * serialisable props to the client view. When the staff API lands, this is
 * where the TanStack prefetch + HydrationBoundary goes; the client components
 * below do not change.
 */
export default async function StaffPage() {
  // "Today" is request-time data; without this the page would be prerendered
  // at build and the date frozen. See https://nextjs.org/docs/app/api-reference/functions/connection
  await connection();
  const today = toISODate(new Date());
  return (
    <StaffPageView
      today={today}
      staff={staff}
      compliance={{ registrations: professionalRegistrations, checks: vettingChecks, training: trainingRecords }}
      absences={staffAbsences}
      coverage={coverageSummary(staff, classes, classSubjects, teachingAssignments, today)}
      school={{ name: schoolInfo.name, currentTerm: schoolInfo.currentTerm, academicYear: schoolInfo.academicYear }}
    />
  );
}
