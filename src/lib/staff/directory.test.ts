import { describe, expect, it } from "vitest";
import { makeStaff } from "@/test/factories/staff";
import {
  departmentsOf,
  filterStaff,
  paginate,
  sortStaff,
  lapsedCount,
  tabCounts,
  type DirectoryFilters,
} from "./directory";

const none: DirectoryFilters = { tab: "all", query: "", department: "", category: "", contractType: "", employer: "", lapsedOnly: false };

const staff = [
  makeStaff({ id: "1", firstName: "Zara", lastName: "Ahmed", email: "zara@s.test", employeeNumber: "EMP-9", designation: "Teacher", department: "Science", employmentStatus: "active", hireDate: "2021-01-01" }),
  makeStaff({ id: "2", firstName: "Ben", lastName: "Okafor", email: null, phone: "+2348090000002", employeeNumber: "EMP-2", designation: "Bursar", department: "Administration", staffCategory: "support", isTeacher: false, employmentStatus: "onboarding", contractType: "fixed_term", employer: "pta", hireDate: "2026-11-01" }),
  makeStaff({ id: "3", firstName: "Amy", lastName: "Chen", email: "amy@s.test", employeeNumber: "EMP-3", designation: "Teacher", department: "Science", employmentStatus: "inactive", exitDate: "2026-01-01", hireDate: "2018-05-05" }),
];
const lapsed = makeStaff({ id: "4", firstName: "Lap", lastName: "Sed", email: "lap@s.test", employeeNumber: "EMP-4", designation: "Teacher", department: "Science", contractLapsed: true, contractType: "fixed_term" });

describe("filterStaff", () => {
  it("returns everyone with empty filters", () => {
    expect(filterStaff(staff, none)).toHaveLength(3);
  });
  it("filters by status tab", () => {
    expect(filterStaff(staff, { ...none, tab: "onboarding" }).map((s) => s.id)).toEqual(["2"]);
    expect(filterStaff(staff, { ...none, tab: "inactive" }).map((s) => s.id)).toEqual(["3"]);
  });
  it("searches name, email, phone, employee number and designation case-insensitively", () => {
    expect(filterStaff(staff, { ...none, query: "zara ah" }).map((s) => s.id)).toEqual(["1"]);
    expect(filterStaff(staff, { ...none, query: "+23480900" }).map((s) => s.id)).toEqual(["2"]);
    expect(filterStaff(staff, { ...none, query: "emp-3" }).map((s) => s.id)).toEqual(["3"]);
    expect(filterStaff(staff, { ...none, query: "bursar" }).map((s) => s.id)).toEqual(["2"]);
  });
  it("combines department, category, contract type and employer", () => {
    expect(filterStaff(staff, { ...none, department: "Science" })).toHaveLength(2);
    expect(filterStaff(staff, { ...none, category: "support" }).map((s) => s.id)).toEqual(["2"]);
    expect(filterStaff(staff, { ...none, contractType: "fixed_term" }).map((s) => s.id)).toEqual(["2"]);
    expect(filterStaff(staff, { ...none, employer: "pta" }).map((s) => s.id)).toEqual(["2"]);
    expect(filterStaff(staff, { ...none, department: "Science", category: "support" })).toHaveLength(0);
  });
  it("narrows to people whose last contract ended, and counts them", () => {
    expect(filterStaff([...staff, lapsed], { ...none, lapsedOnly: true }).map((s) => s.id)).toEqual(["4"]);
    expect(lapsedCount([...staff, lapsed])).toBe(1);
    expect(lapsedCount(staff)).toBe(0);
  });
});

describe("sortStaff", () => {
  it("sorts by name, designation, department, hire date and status in both directions", () => {
    expect(sortStaff(staff, "name", "asc").map((s) => s.id)).toEqual(["3", "2", "1"]);
    expect(sortStaff(staff, "name", "desc").map((s) => s.id)).toEqual(["1", "2", "3"]);
    expect(sortStaff(staff, "hireDate", "asc").map((s) => s.id)).toEqual(["3", "1", "2"]);
    expect(sortStaff(staff, "designation", "asc")[0].id).toBe("2");
    expect(sortStaff(staff, "status", "asc").map((s) => s.employmentStatus)).toEqual(["onboarding", "active", "inactive"]);
  });
  it("does not mutate the input and is stable for ties", () => {
    const input = [...staff];
    sortStaff(input, "department", "asc");
    expect(input.map((s) => s.id)).toEqual(["1", "2", "3"]);
    expect(sortStaff(staff, "department", "desc").map((s) => s.id)).toEqual(["1", "3", "2"]);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 23 }, (_, i) => i + 1);
  it("slices a page and reports bounds", () => {
    expect(paginate(items, 1, 10)).toEqual({ items: items.slice(0, 10), page: 1, totalPages: 3, from: 1, to: 10, total: 23 });
    expect(paginate(items, 3, 10)).toMatchObject({ items: [21, 22, 23], from: 21, to: 23 });
  });
  it("treats a non-finite page as page one", () => {
    expect(paginate([1, 2, 3], Number.NaN, 2)).toMatchObject({ page: 1, items: [1, 2] });
  });

  it("treats a page size below one as one", () => {
    expect(paginate([1, 2, 3], 2, 0)).toMatchObject({ items: [2], totalPages: 3, page: 2 });
  });

  it("clamps out-of-range pages and handles empty input", () => {
    expect(paginate(items, 99, 10).page).toBe(3);
    expect(paginate(items, 0, 10).page).toBe(1);
    expect(paginate([], 1, 10)).toEqual({ items: [], page: 1, totalPages: 1, from: 0, to: 0, total: 0 });
  });
});

describe("departmentsOf / tabCounts", () => {
  it("lists distinct departments sorted", () => {
    expect(departmentsOf(staff)).toEqual(["Administration", "Science"]);
  });
  it("counts each status tab", () => {
    expect(tabCounts(staff)).toEqual({ all: 3, onboarding: 1, active: 1, suspended: 0, inactive: 1 });
  });
});
