import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import type { StaffAssignment } from "@/types/staff";
import { AssignmentsTab } from "../assignments-tab";

const base = { staffId: "t1", classId: "c1", className: "JSS 2B", academicSession: "2026/2027", term: "First", periodsPerWeek: null, source: "manual" as const, teachingSetId: null };

describe("AssignmentsTab", () => {
  it("shows cover assignments with their window and system rows as such", () => {
    const rows: StaffAssignment[] = [
      { ...base, id: "homeroom:c1", subjectId: null, role: "homeroom", startsOn: "2026-09-07", endsOn: null },
      { ...base, id: "a1", subjectId: "Biology", role: "cover", startsOn: "2026-09-20", endsOn: "2026-10-31" },
      { ...base, id: "a2", className: "Primary 4A", classId: "c2", subjectId: "Mathematics", role: "subject", startsOn: "2026-09-07", endsOn: null, source: "self_contained", periodsPerWeek: 5 },
    ];
    render(<AssignmentsTab staff={makeStaff({ id: "t1" })} assignments={rows} />);
    expect(screen.getByText("Cover")).toBeInTheDocument();
    expect(screen.getByText(/20 Sep 2026 to 31 Oct 2026/)).toBeInTheDocument();
    expect(screen.getByText(/class teacher teaches all subjects/i)).toBeInTheDocument();
    expect(screen.getByText(/5 periods\/week/i)).toBeInTheDocument();
  });
  it("keeps two classes with the same display name as separate groups", () => {
    const rows: StaffAssignment[] = [
      { ...base, id: "a1", classId: "c1", className: "JSS 2B", subjectId: "Biology", role: "subject", startsOn: "2026-09-07", endsOn: null },
      { ...base, id: "a2", classId: "c9", className: "JSS 2B", academicSession: "2025/2026", subjectId: "Biology", role: "subject", startsOn: "2025-09-07", endsOn: "2026-07-31" },
    ];
    render(<AssignmentsTab staff={makeStaff({ id: "t1" })} assignments={rows} />);
    expect(screen.getAllByText("JSS 2B")).toHaveLength(2);
  });
});
