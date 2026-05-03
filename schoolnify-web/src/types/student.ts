/**
 * Shared Student and Guardian types used across all student-related components.
 * Import this everywhere instead of defining Student locally.
 */

export interface Guardian {
  /** Backend-assigned ID. Present on guardians fetched from the server; omitted for newly added ones. */
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  relationship: string;
  occupation?: string;
  isPrimary: boolean;
}

export interface Student {
  id: string;

  // Personal
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  avatar?: string | null;

  // Academic
  admissionNumber: string;
  gradeLevel: string;
  section?: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "suspended" | "graduated" | "transferred" | "withdrawn";
  boardingStatus: "Day" | "Boarding" | "Weekly Boarding";
  previousSchool?: string;

  // Contact
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;

  // Guardians
  guardians: Guardian[];

  // Medical
  bloodGroup?: string;
  genotype?: string;
  allergies?: string;
  medicalConditions?: string;

  // Regional (Nigeria-specific for now; extend per country later)
  stateOfOrigin?: string;
  lga?: string;
  religion?: string;
  tribe?: string;

  // Performance (computed by backend; null until grades/attendance modules ship)
  attendanceRate: number | null;
  gpa: number | null;
  feeStatus: "paid" | "pending" | "overdue" | "unknown";
}

/**
 * Helper: full name from student
 */
export function studentFullName(s: Student): string {
  return s.middleName
    ? `${s.firstName} ${s.middleName} ${s.lastName}`
    : `${s.firstName} ${s.lastName}`;
}

/**
 * Helper: primary guardian
 */
export function primaryGuardian(s: Student): Guardian | undefined {
  return s.guardians.find((g) => g.isPrimary) ?? s.guardians[0];
}
