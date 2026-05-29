/**
 * Class / ClassSubject / ClassEnrollment types.
 *
 * Mirrors the Fedena-style K-12 cohort model: a Class is the "arm" that students
 * picture (e.g., "JSS 1A", "Primary 4 Gold"), subjects are linked to it via
 * ClassSubject, and the roster lives in ClassEnrollment. This is deliberately
 * NOT PowerSchool's section-as-instance model -- Nigerian primary/JSS schools
 * think in arms, not periods. SSS electives can be modelled later by putting a
 * sub-roster on ClassSubject.
 *
 * Performance fields (averageGrade, averageAttendance) are nullable until the
 * matching backend modules ship -- same convention as Student.
 */

export type ClassStatus = "active" | "draft" | "archived";

export type SssStream = "Science" | "Arts" | "Commercial" | "Technical";

export interface Class {
  id: string;
  name: string;                  // "JSS 1A", "Primary 4 Gold", "SS2 Sci A"
  gradeLevel: string;            // FK reference to setup wizard grade level (e.g., "JSS 1")
  arm: string;                   // "A", "Gold", "Blue" -- separate from name for grouping/sort
  stream: SssStream | null;      // SSS-only; null otherwise
  academicSession: string;       // "2025/2026"
  currentTerm: string;           // "First", "Second", "Third"
  classTeacherId: string;        // FK -> staff.id (homeroom)
  room: string;
  capacity: number;
  status: ClassStatus;

  // Denormalised summary fields kept in sync at the demo-data level for quick
  // list rendering. The eventual backend will compute these on read.
  // Legacy aliases (`students`, `avgGrade`, `attendanceRate`) are kept until
  // the consuming components migrate to `studentCount`, etc.
  studentCount: number;
  averageGrade: number | null;        // null until grades module ships
  averageAttendance: number | null;   // null until attendance module ships
  /** @deprecated use studentCount */
  students: number;
  /** @deprecated use averageGrade */
  avgGrade: number;
  /** @deprecated use averageAttendance */
  attendanceRate: number;

  // Legacy fields preserved so existing callers (`teacher` string, `schedule`
  // text) keep working until they migrate to the new model.
  teacher: string;               // class teacher's full name
  schedule: string;              // human-readable schedule blurb
}

export interface ClassSubject {
  classId: string;
  subjectId: string;             // matches setup wizard subject names for now
  // Co-teaching / split sections: a subject can be taught by more than one
  // staff member. Empty array = falls back to the class (homeroom) teacher.
  teacherIds: string[];          // FK[] -> staff.id
  // SSS electives: when false, only students in ClassSubjectEnrollment take this
  // subject (a sub-roster). When true, every enrolled student takes it (core).
  isCore: boolean;
}

export type EnrollmentStatus = "active" | "withdrawn" | "transferred";

export interface ClassEnrollment {
  classId: string;
  studentId: string;
  enrolledAt: string;            // YYYY-MM-DD
  exitedAt: string | null;       // mid-term transfers
  status: EnrollmentStatus;
}

/**
 * Per-subject roster for elective subjects (primarily SSS). Only rows here take
 * a non-core ClassSubject. Core subjects (isCore=true) are taken by the whole
 * class and need no rows. A student must already have a ClassEnrollment in the
 * same class to appear here.
 */
export interface ClassSubjectEnrollment {
  classId: string;
  subjectId: string;
  studentId: string;
  status: EnrollmentStatus;
}

/** Display labels for the class status union. */
export const CLASS_STATUS_LABEL: Record<ClassStatus, string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
};

/** Helper: pretty class name. Falls back to `name` if no stream. */
export function classDisplayName(c: Pick<Class, "name" | "stream">): string {
  return c.stream ? `${c.name} (${c.stream})` : c.name;
}

const LEVEL_ABBR: Record<string, string> = {
  nursery: "N",
  primary: "P",
  jss: "J",
  sss: "S",
  ss: "S",
};

/**
 * Compact badge code for square avatars, e.g. "Primary 1" + "A" -> "P1A",
 * "Nursery 3" -> "N3", "SSS 2" + "A" -> "S2A". Falls back to a 3-char slice.
 * Keeps long names from overflowing tiny badge boxes.
 */
export function classShortCode(
  c: Pick<Class, "name"> & Partial<Pick<Class, "gradeLevel" | "arm">>
): string {
  const lvl = c.gradeLevel || c.name;
  const m = lvl.match(/^(Nursery|Primary|JSS|SSS|SS)\s*(\d+)/i);
  if (m) {
    const abbr = LEVEL_ABBR[m[1].toLowerCase()] ?? m[1][0].toUpperCase();
    return `${abbr}${m[2]}${c.arm ?? ""}`;
  }
  return (c.name || "?").slice(0, 3);
}

/**
 * The band label of a grade level — the non-numeric leading text.
 * Country-agnostic: "Primary 4" -> "Primary", "Grade 5" -> "Grade",
 * "Year 7" -> "Year", "JSS 1" -> "JSS", "Kindergarten" -> "Kindergarten".
 * Used to group classes into filter bands derived from whatever naming the
 * school configured, rather than any hardcoded national scheme.
 */
export function classBand(gradeLevel: string): string {
  const m = gradeLevel.match(/^(.*?)\s*\d/);
  return m && m[1].trim() ? m[1].trim() : gradeLevel.trim();
}

/**
 * Sort helper for grade levels. Orders by the band's first appearance in a
 * loose conventional sequence, then by the numeric suffix. Works for any
 * naming scheme; unknown bands sort to the end alphabetically.
 */
const BAND_ORDER = ["creche", "nursery", "pre", "kindergarten", "reception", "primary", "elementary", "grade", "year", "jss", "middle", "sss", "ss", "form", "senior"];
function bandRank(band: string): number {
  const i = BAND_ORDER.findIndex((b) => band.toLowerCase().startsWith(b));
  return i === -1 ? 99 : i;
}
export function compareClasses(a: Class, b: Class): number {
  const ba = classBand(a.gradeLevel);
  const bb = classBand(b.gradeLevel);
  const ra = bandRank(ba);
  const rb = bandRank(bb);
  if (ra !== rb) return ra - rb;
  if (ba !== bb) return ba.localeCompare(bb);
  const na = parseInt(a.gradeLevel.match(/\d+/)?.[0] ?? "0", 10);
  const nb = parseInt(b.gradeLevel.match(/\d+/)?.[0] ?? "0", 10);
  if (na !== nb) return na - nb;
  return a.arm.localeCompare(b.arm);
}
