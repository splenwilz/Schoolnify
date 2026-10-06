import type { Staff } from "@/types/staff";
import type { TeachingAssignment, TeachingModel } from "@/types/class";
import { isOnBooksOn } from "./metrics";
import { isAssignmentActiveOn } from "./assignments";

/**
 * Teaching coverage, read through each class's teaching model
 * (docs/11A-TEACHING-MODEL-AMENDMENT.md):
 *  - a class needs a class teacher unless it is specialists_only;
 *  - every class subject needs an active assignment (self-contained classes
 *    get theirs materialised, so the gap there is the missing class teacher);
 *  - a teacher is unassigned when they own no class and hold no active row;
 *  - only active classes count (drafts are being set up, archived is history).
 */
export interface ClassLike {
  id: string;
  classTeacherId: string | null;
  teachingModel: TeachingModel;
  status: string;
}

export interface ClassSubjectLike {
  classId: string;
  subjectId: string;
  /** Member of a cross-arm set; staffed when the set has an active assignment. */
  teachingSetId?: string | null;
}

export interface CoverageSummary {
  teachersOnBooks: number;
  unassignedTeacherIds: string[];
  classesWithoutTeacherIds: string[];
  subjectsWithoutTeacher: { classId: string; subjectId: string }[];
}

export function coverageSummary(
  staff: readonly Staff[],
  classes: readonly ClassLike[],
  classSubjects: readonly ClassSubjectLike[],
  assignments: readonly TeachingAssignment[],
  todayISO: string
): CoverageSummary {
  const teachers = staff.filter((s) => s.isTeacher && isOnBooksOn(s, todayISO));
  const teacherIds = new Set(teachers.map((t) => t.id));
  // Drafts are still being set up and archived classes are history; neither is a gap.
  const liveClasses = classes.filter((c) => c.status === "active");
  const liveClassIds = new Set(liveClasses.map((c) => c.id));

  const active = assignments.filter((a) => (liveClassIds.has(a.classId) || a.teachingSetId) && isAssignmentActiveOn(a, todayISO) && teacherIds.has(a.staffId));
  const staffedSubjects = new Set(active.map((a) => `${a.classId}\u0000${a.subjectId}`));
  const staffedSets = new Set(active.flatMap((a) => (a.teachingSetId ? [a.teachingSetId] : [])));
  const linked = new Set<string>(active.map((a) => a.staffId));
  for (const c of liveClasses) if (c.classTeacherId && teacherIds.has(c.classTeacherId)) linked.add(c.classTeacherId);

  const classesWithoutTeacherIds = liveClasses
    .filter((c) => c.teachingModel !== "specialists_only" && (!c.classTeacherId || !teacherIds.has(c.classTeacherId)))
    .map((c) => c.id);

  const subjectsWithoutTeacher = classSubjects
    .filter(
      (cs) =>
        liveClassIds.has(cs.classId) &&
        !staffedSubjects.has(`${cs.classId}\u0000${cs.subjectId}`) &&
        !(cs.teachingSetId && staffedSets.has(cs.teachingSetId))
    )
    .map((cs) => ({ classId: cs.classId, subjectId: cs.subjectId }));

  return {
    teachersOnBooks: teachers.length,
    unassignedTeacherIds: teachers.filter((t) => !linked.has(t.id)).map((t) => t.id),
    classesWithoutTeacherIds,
    subjectsWithoutTeacher,
  };
}
