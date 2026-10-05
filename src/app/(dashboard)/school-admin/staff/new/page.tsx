import type { Metadata } from "next";
import { connection } from "next/server";
import { schoolInfo, staff } from "@/lib/demo-data";
import { staffFullName } from "@/types/staff";
import { toISODate } from "@/lib/staff/dates";
import { departmentsOf } from "@/lib/staff/directory";
import { StaffFormPage } from "../_components/form/staff-form-page";

export const metadata: Metadata = { title: "Add staff" };

export default async function NewStaffPage() {
  // "Today" drives the age and contract rules; request-time, not build-time.
  await connection();
  return (
    <StaffFormPage
      mode="create"
      today={toISODate(new Date())}
      country={schoolInfo.country}
      managers={staff.filter((s) => s.employmentStatus !== "inactive").map((s) => ({ id: s.id, name: staffFullName(s) }))}
      departments={departmentsOf(staff)}
      backHref="/school-admin/staff"
      title="Add Staff"
      subtitle="Add a new staff member or import from a spreadsheet"
    />
  );
}
