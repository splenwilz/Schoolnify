import type { ContractType } from "@/types/staff";
import { DATED_CONTRACT_TYPES } from "@/types/staff";
import { isValidISODate, toISODate } from "./dates";
import { validateEmergencyContacts } from "./person";

/**
 * Cross-field rules for a staff record, shared by the form schema and the
 * CSV import so the two entry points cannot drift. Values arrive normalised
 * (null for blank); a date that is not a valid ISO date is treated as absent
 * because the field-level check has already reported it.
 */

export const MIN_STAFF_AGE = 16;

export interface StaffRecordLike {
  email: string | null;
  phone: string | null;
  hireDate: string;
  contractType: ContractType;
  contractEndDate: string | null;
  dateOfBirth: string | null;
  staffCategory: "academic" | "support";
  isTeacher: boolean;
  emergencyContacts: readonly { isPrimary: boolean }[];
}

export interface RuleIssue {
  /** Form field path; the import maps it to its column key. */
  path: "phone" | "contractEndDate" | "dateOfBirth" | "isTeacher" | "emergencyContacts";
  message: string;
}

const date = (v: string | null) => (v && isValidISODate(v) ? v : null);

export function staffRecordIssues(v: StaffRecordLike, todayISO: string): RuleIssue[] {
  const issues: RuleIssue[] = [];
  const hire = date(v.hireDate);
  const end = date(v.contractEndDate);
  const dob = date(v.dateOfBirth);

  if (v.email === null && v.phone === null) {
    issues.push({ path: "phone", message: "Give an email or a phone number so the person can be reached and invited" });
  }
  if (end && hire && end < hire) {
    issues.push({ path: "contractEndDate", message: "Contract end must be on or after the hire date" });
  } else if (DATED_CONTRACT_TYPES.includes(v.contractType) && v.contractEndDate === null) {
    issues.push({ path: "contractEndDate", message: "This contract type needs an end date" });
  }
  if (v.isTeacher && v.staffCategory !== "academic") {
    issues.push({ path: "isTeacher", message: "Only academic staff can be marked as eligible to teach" });
  }
  if (dob) {
    if (dob > todayISO) {
      issues.push({ path: "dateOfBirth", message: "Date of birth cannot be in the future" });
    } else {
      const [y, m, d] = dob.split("-").map(Number);
      const cutoff = toISODate(new Date(Date.UTC(y + MIN_STAFF_AGE, m - 1, d)));
      if (cutoff > todayISO) issues.push({ path: "dateOfBirth", message: `Staff must be at least ${MIN_STAFF_AGE}` });
    }
  }
  const contactError = validateEmergencyContacts(v.emergencyContacts);
  if (contactError) issues.push({ path: "emergencyContacts", message: contactError });
  return issues;
}
