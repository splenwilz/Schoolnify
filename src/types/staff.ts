/**
 * Staff types (teaching + non-teaching).
 *
 * Country-agnostic, grounded in how Fedena, BambooHR, and PowerSchool model
 * employees:
 *  - one role string is split into designation (job title), staffCategory,
 *    an isTeacher eligibility flag, and a permissionRole seam (PowerSchool keeps
 *    permissions separate from the person; we reserve the seam without building
 *    RBAC yet).
 *  - an employment block (employee number that doubles as login, type, FTE,
 *    hire/exit dates, reports-to) replaces a lone join date.
 *  - credentials (license, work permit/visa, background check, medical) live in
 *    a separate repeatable entity keyed on an expiry date (Fedena/BambooHR keep
 *    these out of the core record; the expiry is the load-bearing field).
 *  - government IDs / bank details are config-driven customFields, never
 *    hardcoded columns (BambooHR ships per-country ID fields).
 *  - salary moves to a future payroll module; only a gradeBand reference stays.
 *
 * Legacy aliases (role, joinDate, status, salary, classesAssigned, subjects)
 * are kept so existing components compile until they migrate.
 */

export type StaffCategory = "academic" | "support";

export type EmploymentType = "full_time" | "part_time" | "contract" | "term_time";

export type EmploymentStatus = "onboarding" | "active" | "suspended" | "inactive";

/**
 * Coarse permission role. Placeholder until the RBAC module exists, at which
 * point this becomes a foreign key to a configurable roles table. Values match
 * the app's existing portals.
 */
export type PermissionRole =
  | "school_admin"
  | "teacher"
  | "bursar"
  | "registrar"
  | "support";

export type CredentialType =
  | "teaching_license"
  | "work_permit"        // visa / work permit for expatriate staff
  | "background_check"
  | "medical"
  | "contract"
  | "other";

export type CredentialStatus = "valid" | "expiring" | "expired" | "pending";

export interface StaffCredential {
  id: string;
  staffId: string;
  type: CredentialType;
  name: string;              // config-driven label, e.g. "TRCN", "QTS", "H-1B Visa", "DBS"
  issuingAuthority: string;
  number: string;
  issueDate: string;         // YYYY-MM-DD
  expiryDate: string | null; // null = does not expire
  status: CredentialStatus;
}

export type AssignmentRole = "homeroom" | "subject" | "co_teacher";

/**
 * A teaching assignment, derived from class.classTeacherId and the
 * classSubject teacher links. Scoped to a session/term. Not stored on the staff
 * record (avoids the drift the old classesAssigned count caused).
 */
export interface StaffAssignment {
  staffId: string;
  classId: string;
  className: string;
  subjectId: string | null;  // null for a pure homeroom assignment
  role: AssignmentRole;
  academicSession: string;
  term: string;
}

export interface Staff {
  id: string;

  // Identity
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string | null;  // override for name ordering / mononyms
  email: string;               // work email
  phone: string;               // store E.164; format on display
  avatar: string | null;
  gender: "male" | "female" | "other" | null;

  // Employment
  employeeNumber: string;      // unique; doubles as login
  designation: string;         // config-driven job title
  staffCategory: StaffCategory;
  isTeacher: boolean;          // eligibility to be assigned to a class
  permissionRole: PermissionRole;
  department: string;          // config lookup
  employmentType: EmploymentType;
  ftePercent: number;          // 100 = full time
  hireDate: string;            // YYYY-MM-DD
  exitDate: string | null;
  reportsToId: string | null;  // FK -> staff.id
  employmentStatus: EmploymentStatus;
  gradeBand: string | null;    // pay band reference; amounts live in payroll

  // Country-specific config bag (government IDs, bank details, etc.).
  customFields: Record<string, string>;

  // Subjects the staff member is qualified to teach (config subject ids).
  qualifiedSubjectIds: string[];

  // --- Legacy aliases kept so existing components compile until migrated ---
  /** @deprecated use designation + permissionRole + isTeacher */
  role: string;
  /** @deprecated use hireDate */
  joinDate: string;
  /** @deprecated use employmentStatus; on_leave is a leave-module state */
  status: "active" | "on_leave";
  /** @deprecated salary moves to payroll; use gradeBand */
  salary: number;
  /** @deprecated derive from assignments */
  classesAssigned: number;
  /** @deprecated use qualifiedSubjectIds */
  subjects: string[];
}

// ---- Display labels ----

export const EMPLOYMENT_STATUS_LABEL: Record<EmploymentStatus, string> = {
  onboarding: "Onboarding",
  active: "Active",
  suspended: "Suspended",
  inactive: "Inactive",
};

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  term_time: "Term time",
};

export const PERMISSION_ROLE_LABEL: Record<PermissionRole, string> = {
  school_admin: "School admin",
  teacher: "Teacher",
  bursar: "Bursar",
  registrar: "Registrar",
  support: "Support",
};

export const CREDENTIAL_TYPE_LABEL: Record<CredentialType, string> = {
  teaching_license: "Teaching license",
  work_permit: "Work permit / visa",
  background_check: "Background check",
  medical: "Medical",
  contract: "Contract",
  other: "Other",
};

// ---- Helpers ----

export function staffFullName(s: Pick<Staff, "firstName" | "lastName" | "displayName">): string {
  return s.displayName ?? `${s.firstName} ${s.lastName}`;
}

/**
 * Credential status from an expiry date, given "today" (passed in to stay pure
 * and SSR-safe). Expiring = within `withinDays` of expiry. Demo data ships a
 * stored status; this is for when credentials become live.
 */
export function credentialStatusFor(
  expiryDate: string | null,
  todayISO: string,
  withinDays = 90
): CredentialStatus {
  if (!expiryDate) return "valid";
  const expiry = new Date(expiryDate).getTime();
  const today = new Date(todayISO).getTime();
  if (expiry < today) return "expired";
  const days = (expiry - today) / 86_400_000;
  return days <= withinDays ? "expiring" : "valid";
}
