import type { Employer, PayStructure } from "@/types/staff";

/**
 * Default pay structure for a new post. Grade level is the only pay fact the
 * staff module stores; amounts live in Payroll. Government payers use the
 * consolidated public service structure; everyone else gets the school's
 * own bands. Teachers retire at 65 or 40 years of service (Harmonised
 * Retirement Age for Teachers Act 2022); other staff at 60 or 35.
 */
export function defaultPayStructure(input: { employer: Employer; isTeacher: boolean; gradeLevel: string | null; step?: number | null }): PayStructure | null {
  if (!input.gradeLevel) return null;
  return {
    salaryStructure: input.employer === "government_board" ? "CONPSS" : "custom",
    gradeLevel: input.gradeLevel,
    step: input.step ?? null,
    cadre: null,
    firstAppointmentDate: null,
    lastPromotionDate: null,
    retirementRule: input.isTeacher ? "65_or_40" : "60_or_35",
  };
}
