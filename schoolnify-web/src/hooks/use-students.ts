"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { studentsApi } from "@/api/endpoints/students";
import type {
  ApiStudent,
  ApiGuardian,
  StudentListFilters,
  StudentListResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  ChangeStatusRequest,
  ChangeClassRequest,
  PromoteRequest,
} from "@/types/student-api";
import type { Student, Guardian } from "@/types/student";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const STUDENTS_LIST_KEY = (filters: StudentListFilters) => ["students", "list", filters] as const;
export const STUDENT_DETAIL_KEY = (id: string) => ["students", "detail", id] as const;

// ---------------------------------------------------------------------------
// Mappers: API (snake_case) <-> frontend (camelCase)
// ---------------------------------------------------------------------------

function apiGuardianToGuardian(g: ApiGuardian): Guardian {
  return {
    id: g.id,
    firstName: g.first_name,
    lastName: g.last_name,
    phone: g.phone,
    email: g.email ?? undefined,
    relationship: g.relationship,
    occupation: g.occupation ?? undefined,
    isPrimary: g.is_primary,
  };
}

function guardianToApiGuardian(g: Guardian): ApiGuardian {
  return {
    ...(g.id ? { id: g.id } : {}),
    first_name: g.firstName,
    last_name: g.lastName,
    phone: g.phone,
    email: g.email ?? null,
    relationship: g.relationship,
    occupation: g.occupation ?? null,
    is_primary: g.isPrimary,
  };
}

const GENDER_API_TO_FE: Record<"male" | "female", Student["gender"]> = {
  male: "Male",
  female: "Female",
};

const GENDER_FE_TO_API: Record<Student["gender"], "male" | "female"> = {
  Male: "male",
  Female: "female",
  Other: "male", // backend only accepts male/female; coerce
};

const BOARDING_API_TO_FE: Record<string, Student["boardingStatus"]> = {
  day: "Day",
  boarding: "Boarding",
  weekly_boarding: "Weekly Boarding",
};

const BOARDING_FE_TO_API: Record<Student["boardingStatus"], "day" | "boarding" | "weekly_boarding"> = {
  Day: "day",
  Boarding: "boarding",
  "Weekly Boarding": "weekly_boarding",
};

export function apiToStudent(api: ApiStudent): Student {
  return {
    id: api.id,
    admissionNumber: api.admission_number,
    firstName: api.first_name,
    middleName: api.middle_name ?? undefined,
    lastName: api.last_name,
    dateOfBirth: api.date_of_birth,
    gender: GENDER_API_TO_FE[api.gender],
    avatar: api.avatar_url ?? undefined,

    gradeLevel: api.grade_level,
    section: api.section ?? undefined,
    enrollmentDate: api.enrollment_date,
    status: api.status,
    boardingStatus: api.boarding_status ? BOARDING_API_TO_FE[api.boarding_status] : "Day",
    previousSchool: api.previous_school ?? undefined,

    phone: api.phone ?? undefined,
    email: api.email ?? undefined,
    address: api.address ?? undefined,
    city: api.city ?? undefined,
    state: api.state ?? undefined,
    postalCode: api.postal_code ?? undefined,

    guardians: api.guardians.map(apiGuardianToGuardian),

    bloodGroup: api.blood_group ?? undefined,
    genotype: api.genotype ?? undefined,
    allergies: api.allergies ?? undefined,
    medicalConditions: api.medical_conditions ?? undefined,
    stateOfOrigin: api.state_of_origin ?? undefined,
    lga: api.lga ?? undefined,
    religion: api.religion ?? undefined,
    tribe: api.tribe ?? undefined,

    gpa: api.gpa,
    attendanceRate: api.attendance_rate,
    feeStatus: api.fee_status,
  };
}

// Build a CreateStudentRequest from form-style camelCase data
export function buildCreateRequest(data: Partial<Student> & { firstName: string; lastName: string; dateOfBirth: string; gender: Student["gender"]; gradeLevel: string }): CreateStudentRequest {
  return {
    first_name: data.firstName,
    middle_name: data.middleName ?? null,
    last_name: data.lastName,
    date_of_birth: data.dateOfBirth,
    gender: GENDER_FE_TO_API[data.gender],
    grade_level: data.gradeLevel,
    section: data.section ?? null,
    admission_number: data.admissionNumber || null,
    enrollment_date: data.enrollmentDate,
    boarding_status: data.boardingStatus ? BOARDING_FE_TO_API[data.boardingStatus] : undefined,
    phone: data.phone ?? null,
    email: data.email ?? null,
    address: data.address ?? null,
    city: data.city ?? null,
    state: data.state ?? null,
    postal_code: data.postalCode ?? null,
    blood_group: data.bloodGroup ?? null,
    genotype: data.genotype ?? null,
    allergies: data.allergies ?? null,
    medical_conditions: data.medicalConditions ?? null,
    previous_school: data.previousSchool ?? null,
    state_of_origin: data.stateOfOrigin ?? null,
    lga: data.lga ?? null,
    religion: data.religion ?? null,
    tribe: data.tribe ?? null,
    avatar_url: data.avatar ?? null,
    guardians: data.guardians?.map(guardianToApiGuardian) ?? [],
  };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** List students with filters. Returns mapped (camelCase) students + summary. */
export function useStudents(filters: StudentListFilters = {}) {
  return useQuery({
    queryKey: STUDENTS_LIST_KEY(filters),
    queryFn: () => studentsApi.list(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    select: (response: StudentListResponse) => ({
      students: response.data.map(apiToStudent),
      pagination: response.pagination,
      summary: response.summary,
    }),
  });
}

/** Single student detail. */
export function useStudent(id: string | undefined, include?: ("recent_payments" | "recent_attendance")[]) {
  return useQuery({
    queryKey: STUDENT_DETAIL_KEY(id ?? ""),
    queryFn: () => studentsApi.get(id!, include),
    enabled: !!id,
    select: apiToStudent,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentRequest) => studentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) => studentsApi.update(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(vars.id) });
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(id) });
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function useChangeStudentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeStatusRequest }) => studentsApi.changeStatus(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(vars.id) });
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function useChangeStudentClass() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeClassRequest }) => studentsApi.changeClass(id, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: STUDENT_DETAIL_KEY(vars.id) });
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function usePromoteStudents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PromoteRequest) => studentsApi.promote(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

export function useImportStudents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, mapping, skipInvalid }: { file: File; mapping: Record<string, string>; skipInvalid: boolean }) =>
      studentsApi.bulkImport(file, mapping, skipInvalid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students", "list"] });
    },
  });
}

/** Export filtered list as CSV. Triggers browser download. */
export async function exportStudentsCsv(filters: StudentListFilters = {}): Promise<void> {
  const blob = await studentsApi.export(filters);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
