import type { Class, TeachingAssignment } from "@/types/class";
import type { StaffAssignment } from "@/types/staff";

/** Active from startsOn through endsOn inclusive; open ended when endsOn is null. */
export function isAssignmentActiveOn(a: Pick<TeachingAssignment, "startsOn" | "endsOn">, dateISO: string): boolean {
  return a.startsOn <= dateISO && (a.endsOn === null || a.endsOn >= dateISO);
}

type ClassLike = Pick<Class, "id" | "name" | "classTeacherId" | "status" | "academicSession" | "currentTerm">;
type ClassSubjectLike = { classId: string; subjectId: string; teachingSetId: string | null };

/**
 * Everything a person is linked to: the homeroom of each non-archived class
 * they own, then their teaching rows, active on the date unless history is
 * requested. A row attached to a teaching set expands to one entry per member
 * class (pass `classSubjects` for that). Archived classes are excluded.
 */
export function assignmentsForStaff(
  staffId: string,
  dateISO: string,
  rows: readonly TeachingAssignment[],
  classes: readonly ClassLike[],
  options: { includeHistory?: boolean; classSubjects?: readonly ClassSubjectLike[] } = {}
): StaffAssignment[] {
  const live = new Map(classes.filter((c) => c.status !== "archived").map((c) => [c.id, c]));
  const out: StaffAssignment[] = [];

  for (const c of live.values()) {
    if (c.classTeacherId !== staffId) continue;
    out.push({
      id: `homeroom:${c.id}`,
      staffId,
      classId: c.id,
      className: c.name,
      subjectId: null,
      role: "homeroom",
      academicSession: c.academicSession,
      term: c.currentTerm,
      startsOn: "",
      endsOn: null,
      periodsPerWeek: null,
      source: "manual",
      teachingSetId: null,
    });
  }

  const membersOf = (setId: string) => (options.classSubjects ?? []).filter((cs) => cs.teachingSetId === setId).map((cs) => cs.classId);

  for (const a of rows) {
    if (a.staffId !== staffId) continue;
    if (!options.includeHistory && !isAssignmentActiveOn(a, dateISO)) continue;
    const classIds = a.teachingSetId ? membersOf(a.teachingSetId) : [a.classId];
    for (const classId of classIds.length > 0 ? classIds : [a.classId]) {
      const c = live.get(classId);
      if (!c) continue;
      out.push({
        id: a.teachingSetId ? `${a.id}:${c.id}` : a.id,
        staffId,
        classId: c.id,
        className: c.name,
        subjectId: a.subjectId,
        role: a.role,
        academicSession: c.academicSession,
        term: c.currentTerm,
        startsOn: a.startsOn,
        endsOn: a.endsOn,
        periodsPerWeek: a.periodsPerWeek,
        source: a.source,
        teachingSetId: a.teachingSetId,
      });
    }
  }
  return out;
}
