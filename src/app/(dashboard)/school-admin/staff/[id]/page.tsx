import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { staff, staffAbsences, staffAssignments, staffDetail } from "@/lib/demo-data";
import { staffFullName } from "@/types/staff";
import { toISODate } from "@/lib/staff/dates";
import { awayStaffIds } from "@/lib/staff/leave";
import { StaffDetailView } from "./_components/staff-detail-view";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const member = staff.find((s) => s.id === id);
  return { title: member ? staffFullName(member) : "Staff member not found" };
}

/** Server Component: resolves the full record (404 via notFound) and passes plain props down. */
export default async function StaffDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const member = staffDetail(id);
  if (!member) notFound();

  const today = toISODate(new Date());
  const manager = member.reportsToId ? staff.find((s) => s.id === member.reportsToId) : undefined;

  return (
    <StaffDetailView
      member={member}
      today={today}
      assignments={staffAssignments(member.id, today)}
      staffDirectory={staff.map((s) => ({ id: s.id, name: staffFullName(s) }))}
      managerName={manager ? staffFullName(manager) : null}
      awayToday={awayStaffIds(staffAbsences, today).has(member.id)}
    />
  );
}
