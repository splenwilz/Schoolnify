/**
 * API wire-format types for the students module.
 * Mirrors the backend exactly (snake_case). Used by the API client and mappers.
 *
 * Frontend code should use the camelCase Student type from @/types/student
 * and let the hook layer convert between the two.
 */

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface ApiGuardian {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  relationship: string;
  occupation?: string | null;
  is_primary: boolean;
}

export interface ApiStudent {
  id: string;
  admission_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  grade_level: string;
  section?: string | null;
  stream?: string | null;

  enrollment_date: string;
  status: "active" | "inactive" | "suspended" | "graduated" | "withdrawn" | "transferred";
  boarding_status: "day" | "boarding" | "weekly_boarding" | null;

  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;

  guardians: ApiGuardian[];

  blood_group?: string | null;
  genotype?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  previous_school?: string | null;
  state_of_origin?: string | null;
  lga?: string | null;
  religion?: string | null;
  tribe?: string | null;
  avatar_url?: string | null;

  // Computed (null until grades/attendance/fees modules ship)
  gpa: number | null;
  attendance_rate: number | null;
  fee_status: "paid" | "pending" | "overdue" | "unknown";

  created_at: string;
  updated_at: string;

  // Optional includes
  recent_payments?: unknown[];
  recent_attendance?: unknown[];
}

// ---------------------------------------------------------------------------
// List endpoint
// ---------------------------------------------------------------------------

export interface StudentListFilters {
  search?: string;
  grade_level?: string;
  section?: string;
  status?: string;
  gender?: "male" | "female";
  boarding_status?: "day" | "boarding" | "weekly_boarding";
  page?: number;
  page_size?: number;
  sort?: "last_name" | "first_name" | "admission_number" | "enrollment_date" | "created_at";
  order?: "asc" | "desc";
}

export interface StudentListResponse {
  data: ApiStudent[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  summary: {
    total_students: number;
    active: number;
    average_gpa: number | null;
    average_attendance: number | null;
  };
}

// ---------------------------------------------------------------------------
// Create / Update
// ---------------------------------------------------------------------------

export interface CreateStudentRequest {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  grade_level: string;
  section?: string | null;
  stream?: string | null;
  admission_number?: string | null;
  enrollment_date?: string;
  boarding_status?: "day" | "boarding" | "weekly_boarding";
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  blood_group?: string | null;
  genotype?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  previous_school?: string | null;
  state_of_origin?: string | null;
  lga?: string | null;
  religion?: string | null;
  tribe?: string | null;
  avatar_url?: string | null;
  guardians?: ApiGuardian[];
}

export type UpdateStudentRequest = Partial<Omit<CreateStudentRequest, "admission_number">>;

// ---------------------------------------------------------------------------
// Status / Class change
// ---------------------------------------------------------------------------

export interface ChangeStatusRequest {
  status: ApiStudent["status"];
  reason?: string;
  effective_date?: string;
}

export interface ChangeStatusResponse {
  student: ApiStudent;
  status_change: {
    id: string;
    from_status: string;
    to_status: string;
    reason: string | null;
    effective_date: string;
    changed_by: string;
    changed_at: string;
  };
}

export interface ChangeClassRequest {
  grade_level: string;
  section?: string | null;
  stream?: string | null;
  effective_date?: string;
  reason?: string | null;
}

// ---------------------------------------------------------------------------
// Bulk promotion
// ---------------------------------------------------------------------------

export interface PromotionDecision {
  student_id: string;
  action: "promote" | "retain" | "graduate";
  to_grade?: string;
  to_section?: string;
  reason?: string;
}

export interface PromoteRequest {
  decisions: PromotionDecision[];
  academic_year: string;
  effective_date?: string;
}

export interface PromoteResponse {
  promoted: number;
  retained: number;
  graduated: number;
  batch_id: string;
  errors: { student_id: string; message: string }[];
}

// ---------------------------------------------------------------------------
// Bulk import
// ---------------------------------------------------------------------------

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResponse {
  imported: number;
  skipped: number;
  errors: ImportError[];
  imported_students: { id: string; admission_number: string; first_name: string; last_name: string }[];
}
