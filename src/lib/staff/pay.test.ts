import { describe, expect, it } from "vitest";
import { defaultPayStructure } from "./pay";

describe("defaultPayStructure", () => {
  it("is null without a grade level", () => {
    expect(defaultPayStructure({ employer: "school", isTeacher: true, gradeLevel: null })).toBeNull();
  });
  it("uses the public service structure only for government payers", () => {
    expect(defaultPayStructure({ employer: "government_board", isTeacher: true, gradeLevel: "GL 08", step: 3 })).toMatchObject({ salaryStructure: "CONPSS", gradeLevel: "GL 08", step: 3 });
    expect(defaultPayStructure({ employer: "school", isTeacher: true, gradeLevel: "T2" })).toMatchObject({ salaryStructure: "custom", gradeLevel: "T2", step: null });
  });
  it("applies the teachers' retirement rule to teachers only", () => {
    expect(defaultPayStructure({ employer: "school", isTeacher: true, gradeLevel: "T2" })?.retirementRule).toBe("65_or_40");
    expect(defaultPayStructure({ employer: "school", isTeacher: false, gradeLevel: "S1" })?.retirementRule).toBe("60_or_35");
  });
});
