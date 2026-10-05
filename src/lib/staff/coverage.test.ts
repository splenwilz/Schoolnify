import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import { makeAssignment, makeClass, makeClassSubject } from "@/test/factories/class";
import { coverageSummary } from "./coverage";

const TODAY = "2026-10-04";
const t1 = makeStaff({ id: "t1", isTeacher: true });
const t2 = makeStaff({ id: "t2", isTeacher: true });
const t3 = makeStaff({ id: "t3", isTeacher: true });
const left = makeStaff({ id: "left", isTeacher: true, employmentStatus: "inactive", exitDate: "2026-01-01" });
const support = makeStaff({ id: "s1", isTeacher: false, staffCategory: "support" });

describe("coverageSummary by teaching model", () => {
  it("self-contained: the class teacher covers every subject; a missing class teacher is the gap", () => {
    const ok = makeClass({ id: "p1", teachingModel: "self_contained", classTeacherId: "t1" });
    const noTeacher = makeClass({ id: "p2", teachingModel: "self_contained", classTeacherId: null });
    const subjects = [makeClassSubject({ classId: "p1", subjectId: "Maths" }), makeClassSubject({ classId: "p2", subjectId: "Maths" })];
    const rows = [makeAssignment({ classId: "p1", subjectId: "Maths", staffId: "t1", source: "self_contained" })];
    const r = coverageSummary([t1, t2], [ok, noTeacher], subjects, rows, TODAY);
    expect(r.classesWithoutTeacherIds).toEqual(["p2"]);
    expect(r.subjectsWithoutTeacher).toEqual([{ classId: "p2", subjectId: "Maths" }]);
    expect(r.unassignedTeacherIds).toEqual(["t2"]);
  });

  it("specialists-only: no class teacher is fine; an unstaffed subject is the gap", () => {
    const senior = makeClass({ id: "ss1", teachingModel: "specialists_only", classTeacherId: null });
    const subjects = [makeClassSubject({ classId: "ss1", subjectId: "Physics" }), makeClassSubject({ classId: "ss1", subjectId: "Chemistry" })];
    const rows = [makeAssignment({ classId: "ss1", subjectId: "Physics", staffId: "t1" })];
    const r = coverageSummary([t1, t2], [senior], subjects, rows, TODAY);
    expect(r.classesWithoutTeacherIds).toEqual([]);
    expect(r.subjectsWithoutTeacher).toEqual([{ classId: "ss1", subjectId: "Chemistry" }]);
    expect(r.unassignedTeacherIds).toEqual(["t2"]);
  });

  it("form teacher plus specialists: a class teacher who left counts as missing; ended cover does not staff a subject", () => {
    const jss = makeClass({ id: "j1", teachingModel: "form_plus_specialists", classTeacherId: "left" });
    const subjects = [makeClassSubject({ classId: "j1", subjectId: "Biology" })];
    const rows = [makeAssignment({ classId: "j1", subjectId: "Biology", staffId: "t3", role: "cover", startsOn: "2026-01-01", endsOn: "2026-06-30" })];
    const r = coverageSummary([t1, t3, left, support], [jss], subjects, rows, TODAY);
    expect(r.classesWithoutTeacherIds).toEqual(["j1"]);
    expect(r.subjectsWithoutTeacher).toEqual([{ classId: "j1", subjectId: "Biology" }]);
    expect(r.unassignedTeacherIds.sort()).toEqual(["t1", "t3"]);
    expect(r.teachersOnBooks).toBe(2);
  });

  it("an elective taught to a set across arms is staffed by the set's assignment", () => {
    const sciA = makeClass({ id: "sa", teachingModel: "specialists_only" });
    const artsA = makeClass({ id: "aa", teachingModel: "specialists_only" });
    const subjects = [
      makeClassSubject({ classId: "sa", subjectId: "Further Mathematics", isCore: false, teachingSetId: "set1" }),
      makeClassSubject({ classId: "aa", subjectId: "Further Mathematics", isCore: false, teachingSetId: "set1" }),
      makeClassSubject({ classId: "aa", subjectId: "Government", isCore: true }),
    ];
    const rows = [makeAssignment({ classId: "sa", subjectId: "Further Mathematics", staffId: "t1", teachingSetId: "set1" })];
    const r = coverageSummary([t1], [sciA, artsA], subjects, rows, TODAY);
    expect(r.subjectsWithoutTeacher).toEqual([{ classId: "aa", subjectId: "Government" }]);
    expect(r.unassignedTeacherIds).toEqual([]);
  });

  it("ignores draft and archived classes and does not count support staff", () => {
    const archived = makeClass({ id: "old", teachingModel: "form_plus_specialists", classTeacherId: null, status: "archived" });
    const draft = makeClass({ id: "new", teachingModel: "form_plus_specialists", classTeacherId: null, status: "draft" });
    const r = coverageSummary([support], [archived, draft], [makeClassSubject({ classId: "old" }), makeClassSubject({ classId: "new" })], [], TODAY);
    expect(r).toEqual({ teachersOnBooks: 0, unassignedTeacherIds: [], classesWithoutTeacherIds: [], subjectsWithoutTeacher: [] });
  });
});
