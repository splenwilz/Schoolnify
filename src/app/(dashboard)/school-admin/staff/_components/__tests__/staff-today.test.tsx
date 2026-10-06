import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeCheck, makeRegistration, makeStaff, makeTraining } from "@/test/factories/staff";
import { StaffToday } from "../staff-today";

const TODAY = "2026-10-04";

describe("StaffToday", () => {
  it("derives on duty, away and compliance from data", () => {
    const staff = [
      makeStaff({ id: "a", isTeacher: true }),
      makeStaff({ id: "b", isTeacher: true }),
      makeStaff({ id: "c", isTeacher: false, staffCategory: "support" }),
      makeStaff({ id: "d", hireDate: "2027-01-01", employmentStatus: "onboarding" }),
      makeStaff({ id: "e", employmentStatus: "suspended" }),
      makeStaff({ id: "f", hireDate: "2026-09-20", employmentStatus: "onboarding" }),
    ];
    const leave = [{ staffId: "b", startDate: "2026-10-01", endDate: "2026-10-10", status: "approved" }];
    const compliance = {
      registrations: [makeRegistration({ staffId: "a", expiryDate: "2026-09-01" })],
      checks: [makeCheck({ staffId: "c", expiryDate: "2026-10-20" })],
      training: [makeTraining({ staffId: "c", expiryDate: "not-a-date" })],
    };
    render(
      <StaffToday
        today={TODAY}
        staff={staff}
        absences={leave}
        compliance={compliance}
        coverage={{ teachersOnBooks: 2, unassignedTeacherIds: ["b"], classesWithoutTeacherIds: ["c1", "c2"], subjectsWithoutTeacher: [{ classId: "c1", subjectId: "Physics" }, { classId: "c3", subjectId: "Maths" }, { classId: "c3", subjectId: "Art" }] }}
        school={{ name: "Greenwood", currentTerm: "Term 1", academicYear: "2026/2027" }}
      />
    );
    const tile = (name: RegExp) => screen.getByRole("group", { name });
    // 5 on books (a, b, c, e, f); b is away and e is suspended
    expect(within(tile(/on duty today/i)).getByText("3")).toBeInTheDocument();
    expect(within(tile(/on duty today/i)).getByText(/1 away · 1 suspended/i)).toBeInTheDocument();
    expect(within(tile(/away today/i)).getByText("1")).toBeInTheDocument();
    // onboarding uses the same rule as the overview: upcoming (d) + started but not activated (f)
    expect(screen.getByRole("definition", { name: /onboarding/i })).toHaveTextContent("2");
    expect(within(tile(/credentials to action/i)).getByText("3")).toBeInTheDocument();
    expect(within(tile(/credentials to action/i)).getByText(/1 expired · 1 expiring soon · 1 to check/i)).toBeInTheDocument();
    expect(within(tile(/unassigned teachers/i)).getByText("1")).toBeInTheDocument();
    expect(within(tile(/classes without a teacher/i)).getByText("2")).toBeInTheDocument();
    expect(within(tile(/subjects without a teacher/i)).getByText("3")).toBeInTheDocument();
    expect(within(tile(/subjects without a teacher/i)).getByText(/in 2 classes/i)).toBeInTheDocument();
    expect(screen.getByText("Greenwood")).toBeInTheDocument();
  });
});
