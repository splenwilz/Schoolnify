import type { StaffDetail } from "@/types/staff";
import type { StaffFormInput } from "./schema";
import { activeRolesOn, currentContractOn } from "./projections";

/**
 * Form input pre-filled from an existing record, for the edit page. The
 * contract fields come from the contract current on the date (a rehired
 * person's latest contract, not their first hire); without any contract the
 * form falls back to full time so it can be saved.
 */
export function staffDetailToFormInput(s: StaffDetail, todayISO: string): StaffFormInput {
  const contract = currentContractOn(s.contracts, todayISO) ?? s.contracts[0] ?? null;
  const roles = contract ? activeRolesOn([contract], todayISO) : [];
  const primary = roles.find((r) => r.isPrimary) ?? null;
  return {
    title: s.title ?? "",
    firstName: s.firstName,
    middleName: s.middleName ?? "",
    lastName: s.lastName,
    preferredName: s.preferredName ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    gender: s.gender ?? "",
    dateOfBirth: s.dateOfBirth ?? "",
    designation: s.designation,
    staffCategory: s.staffCategory,
    isTeacher: s.isTeacher,
    permissionRole: s.permissionRole,
    department: s.department,
    employer: contract?.employer ?? s.employer,
    contractType: contract?.contractType ?? s.contractType,
    ftePercent: contract ? Math.round(contract.fte * 100) : 100,
    isTermTimeOnly: contract?.isTermTimeOnly ?? s.isTermTimeOnly,
    hireDate: contract?.startDate ?? s.hireDate,
    contractEndDate: contract?.endDate ?? "",
    probationEndDate: contract?.probationEndDate ?? "",
    reportsToId: s.reportsToId ?? "",
    gradeLevel: primary?.payStructure?.gradeLevel ?? s.gradeLevel ?? "",
    responsibilities: roles
      .filter((r) => r.roleKind === "responsibility")
      .map((r) => ({ designation: r.designation, department: r.department ?? "", allowanceCode: r.allowanceCode ?? "", startDate: r.startDate, endDate: r.endDate ?? "" })),
    emergencyContacts: s.emergencyContacts.map((c) => ({ name: c.name, relationship: c.relationship, phone: c.phone, isPrimary: c.isPrimary })),
    employeeNumber: s.employeeNumber,
    sendInvite: false,
  };
}
