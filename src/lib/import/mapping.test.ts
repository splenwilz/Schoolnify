import { describe, expect, it } from "vitest";
import type { ImportField } from "./types";
import { autoMap, normalizeHeader } from "./mapping";

const fields: ImportField[] = [
  { key: "first_name", label: "First name", required: true, type: "text", aliases: ["given name", "forename"] },
  { key: "last_name", label: "Last name", required: true, type: "text", aliases: ["surname", "family name"] },
  { key: "email", label: "Work email", required: true, type: "email", aliases: ["e-mail", "email address"] },
  { key: "hire_date", label: "Hire date", required: true, type: "date", aliases: ["start date", "date joined"] },
];

describe("normalizeHeader", () => {
  it("lower-cases and strips punctuation and extra spaces", () => {
    expect(normalizeHeader("  E-Mail Address ")).toBe("e mail address");
    expect(normalizeHeader("First_Name")).toBe("first name");
  });
});

describe("autoMap", () => {
  it("maps by key, label and alias, leaving unknown columns unmapped", () => {
    expect(autoMap(["first_name", "Surname", "E-mail", "Start Date", "Shoe size"], fields)).toEqual({
      first_name: "first_name",
      Surname: "last_name",
      "E-mail": "email",
      "Start Date": "hire_date",
      "Shoe size": "",
    });
  });
  it("never maps two columns to the same field", () => {
    const m = autoMap(["Email", "Email Address"], fields);
    expect(Object.values(m).filter((v) => v === "email")).toHaveLength(1);
  });
});
