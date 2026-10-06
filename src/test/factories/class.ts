import type { Class, ClassSubject, TeachingAssignment } from "@/types/class";

let seq = 0;

export function makeClass(overrides: Partial<Class> = {}): Class {
  seq += 1;
  const id = overrides.id ?? `cls_${String(seq).padStart(3, "0")}`;
  return {
    id,
    name: `JSS 1${String.fromCharCode(64 + (seq % 26 || 1))}`,
    gradeLevel: "JSS 1",
    arm: "A",
    stream: null,
    academicSession: "2026/2027",
    currentTerm: "First",
    classTeacherId: null,
    teachingModel: "form_plus_specialists",
    room: "R1",
    capacity: 30,
    status: "active",
    studentCount: 0,
    averageGrade: null,
    averageAttendance: null,
    students: 0,
    avgGrade: 0,
    attendanceRate: 0,
    teacher: "",
    schedule: "",
    ...overrides,
  };
}

export function makeClassSubject(overrides: Partial<ClassSubject> = {}): ClassSubject {
  return { classId: "cls_001", subjectId: "Mathematics", teacherIds: [], isCore: true, teachingSetId: null, ...overrides };
}

export function makeAssignment(overrides: Partial<TeachingAssignment> = {}): TeachingAssignment {
  seq += 1;
  return {
    id: `ta_${String(seq).padStart(3, "0")}`,
    classId: "cls_001",
    subjectId: "Mathematics",
    staffId: "stf_001",
    role: "subject",
    teachingSetId: null,
    termId: null,
    startsOn: "2026-09-07",
    endsOn: null,
    periodsPerWeek: null,
    source: "manual",
    notes: null,
    ...overrides,
  };
}
