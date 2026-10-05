import { describe, expect, it } from "vitest";
import { makeAssignment, makeClass } from "@/test/factories/class";
import { assignmentsForStaff, isAssignmentActiveOn } from "./assignments";

const TODAY = "2026-10-04";

describe("isAssignmentActiveOn", () => {
  it("is active from startsOn through endsOn inclusive, open ended when endsOn is null", () => {
    const a = makeAssignment({ startsOn: "2026-10-01", endsOn: "2026-10-10" });
    expect(isAssignmentActiveOn(a, "2026-09-30")).toBe(false);
    expect(isAssignmentActiveOn(a, "2026-10-01")).toBe(true);
    expect(isAssignmentActiveOn(a, "2026-10-10")).toBe(true);
    expect(isAssignmentActiveOn(a, "2026-10-11")).toBe(false);
    expect(isAssignmentActiveOn(makeAssignment({ startsOn: "2026-10-01", endsOn: null }), "2030-01-01")).toBe(true);
  });
});

describe("assignmentsForStaff", () => {
  const c1 = makeClass({ id: "c1", name: "Primary 4A", classTeacherId: "t1", teachingModel: "self_contained" });
  const c2 = makeClass({ id: "c2", name: "JSS 2B", classTeacherId: "t2" });
  const archived = makeClass({ id: "c3", name: "Old", classTeacherId: "t1", status: "archived" });
  const rows = [
    makeAssignment({ id: "a1", classId: "c1", subjectId: "Mathematics", staffId: "t1", source: "self_contained" }),
    makeAssignment({ id: "a2", classId: "c2", subjectId: "Biology", staffId: "t1", role: "cover", startsOn: "2026-09-20", endsOn: "2026-10-31", notes: "Covering for t3" }),
    makeAssignment({ id: "a3", classId: "c2", subjectId: "Physics", staffId: "t1", startsOn: "2026-11-01" }),
    makeAssignment({ id: "a4", classId: "c2", subjectId: "Chemistry", staffId: "t1", startsOn: "2026-01-10", endsOn: "2026-07-20" }),
    makeAssignment({ id: "a5", classId: "c3", subjectId: "History", staffId: "t1" }),
  ];

  it("returns the homeroom for owned non-archived classes plus assignments active on the date", () => {
    const out = assignmentsForStaff("t1", TODAY, rows, [c1, c2, archived]);
    expect(out.map((a) => `${a.role}:${a.className}:${a.subjectId ?? "-"}`)).toEqual([
      "homeroom:Primary 4A:-",
      "subject:Primary 4A:Mathematics",
      "cover:JSS 2B:Biology",
    ]);
    const cover = out[2];
    expect(cover).toMatchObject({ id: "a2", startsOn: "2026-09-20", endsOn: "2026-10-31", source: "manual", academicSession: "2026/2027", term: "First" });
    expect(out[0].id).toBe("homeroom:c1");
  });

  it("includes history when asked", () => {
    const out = assignmentsForStaff("t1", TODAY, rows, [c1, c2, archived], { includeHistory: true });
    expect(out.map((a) => a.id)).toEqual(["homeroom:c1", "a1", "a2", "a3", "a4"]);
  });

  it("expands a set assignment to every member class", () => {
    const sa = makeClass({ id: "sa", name: "SS1 Science A" });
    const aa = makeClass({ id: "aa", name: "SS1 Arts A" });
    const subjects = [
      { classId: "sa", subjectId: "Further Mathematics", teachingSetId: "set1" },
      { classId: "aa", subjectId: "Further Mathematics", teachingSetId: "set1" },
    ];
    const row = makeAssignment({ id: "a9", classId: "sa", subjectId: "Further Mathematics", staffId: "t9", teachingSetId: "set1" });
    const out = assignmentsForStaff("t9", TODAY, [row], [sa, aa], { classSubjects: subjects });
    expect(out.map((a) => `${a.id}|${a.className}`)).toEqual(["a9:sa|SS1 Science A", "a9:aa|SS1 Arts A"]);
    expect(out.every((a) => a.teachingSetId === "set1")).toBe(true);
  });

  it("returns nothing for someone with no links", () => {
    expect(assignmentsForStaff("nobody", TODAY, rows, [c1, c2])).toEqual([]);
  });
});
