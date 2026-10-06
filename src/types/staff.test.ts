import { describe, expect, it } from "vitest";
import { staffFullName } from "./staff";

describe("staffFullName", () => {
  it("prefers the preferred name, else title and names", () => {
    expect(staffFullName({ firstName: "A", lastName: "B", preferredName: "Ms B" })).toBe("Ms B");
    expect(staffFullName({ firstName: "A", lastName: "B", preferredName: null })).toBe("A B");
    expect(staffFullName({ firstName: "A", lastName: "B", preferredName: null, title: "Rev. Fr." })).toBe("Rev. Fr. A B");
  });
});
