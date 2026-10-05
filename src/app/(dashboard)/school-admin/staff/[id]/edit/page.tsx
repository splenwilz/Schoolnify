import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { schoolInfo, staff, staffDetail } from "@/lib/demo-data";
import { staffFullName } from "@/types/staff";
import { toISODate } from "@/lib/staff/dates";
import { departmentsOf } from "@/lib/staff/directory";
import { StaffFormPage } from "../../_components/form/staff-form-page";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const member = staff.find((s) => s.id === id);
  return { title: member ? `Edit ${staffFullName(member)}` : "Staff member not found" };
}

export default async function EditStaffPage({ params }: { params: Params }) {
  const { id } = await params;
  const member = staffDetail(id);
  if (!member) notFound();

  return (
    <StaffFormPage
      mode="edit"
      initial={member}
      today={toISODate(new Date())}
      country={schoolInfo.country}
      managers={staff.filter((s) => s.employmentStatus !== "inactive").map((s) => ({ id: s.id, name: staffFullName(s) }))}
      departments={departmentsOf(staff)}
      backHref={`/school-admin/staff/${member.id}`}
      title={`Edit ${staffFullName(member)}`}
      subtitle={member.employeeNumber}
    />
  );
}
