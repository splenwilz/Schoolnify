import * as z from "zod";
import type { EmergencyContact, PersonPhone } from "@/types/person";
import type { ContractRole, ContractType, Employer, StaffContract } from "@/types/staff";
import { isValidISODate } from "./dates";
import { defaultPayStructure } from "./pay";
import { normalizeToE164, phoneErrorMessage } from "./person";
import { staffRecordIssues } from "./rules";

/**
 * Staff create/edit form contract (Zod 4). One schema drives validation,
 * field-level messages and the react-hook-form types.
 *
 * Input type = what the form holds (strings from inputs, "" for empty).
 * Output type = normalised values: "" becomes null, email lower-cased, phones
 * in E.164 for the school's country.
 */

// Column limits from docs/12A; the API enforces the same.
export const LIMITS = { name: 100, email: 254, designation: 80, department: 80, gradeLevel: 20, employeeNumber: 32, title: 20 } as const;

export const GENDER_OPTIONS = ["male", "female", "other"] as const;
export const CONTRACT_TYPES = ["permanent", "fixed_term", "temporary", "casual", "corps_member", "trainee", "volunteer", "supply"] as const;
export const EMPLOYERS = ["school", "government_board", "pta", "mission", "nysc", "agency", "volunteer", "self"] as const;
export const PERMISSION_ROLES = ["school_admin", "teacher", "bursar", "registrar", "support"] as const;

const required = (label: string, max: number) =>
  z.string().trim().min(1, { error: `${label} is required` }).max(max, { error: `${label} must be ${max} characters or fewer` });
const optionalText = (label: string, max: number) =>
  z.string().trim().max(max, { error: `${label} must be ${max} characters or fewer` }).transform((v) => (v === "" ? null : v));
const isoDate = z.iso.date({ error: "Use the format YYYY-MM-DD" });
const optionalDate = z.string().trim().transform((v) => (v === "" ? null : v)).pipe(isoDate.nullable());

export interface SchemaOptions {
  /** ISO 3166-1 alpha-2 of the school, for national phone numbers. */
  country: string;
  /** Reference date for "not in the future" and age checks. */
  today: string;
}

function phoneField(country: string, { required: isRequired }: { required: boolean }) {
  return z
    .string()
    .trim()
    .transform((v, ctx) => {
      if (v === "") {
        if (isRequired) ctx.issues.push({ code: "custom", message: "Phone number is required", input: v });
        return null;
      }
      const normalised = normalizeToE164(v, country);
      if (normalised === null) ctx.issues.push({ code: "custom", message: phoneErrorMessage(country), input: v });
      return normalised;
    });
}

export function staffFormSchemaFor(opts: SchemaOptions) {
  const emergencyContact = z.object({
    name: required("Contact name", LIMITS.name),
    relationship: required("Relationship", 40),
    phone: phoneField(opts.country, { required: true }),
    isPrimary: z.boolean(),
  });

  const responsibility = z
    .object({
      designation: required("Responsibility", LIMITS.designation),
      department: optionalText("Department", LIMITS.department),
      allowanceCode: optionalText("Allowance code", 20),
      startDate: z.string().trim().min(1, { error: "Start date is required" }).pipe(isoDate),
      endDate: optionalDate,
    })
    .check((ctx) => {
      const v = ctx.value;
      if (v.endDate && isValidISODate(v.startDate) && v.endDate < v.startDate) {
        ctx.issues.push({ code: "custom", path: ["endDate"], message: "End date must be on or after the start date", input: v.endDate });
      }
    });

  return z
    .object({
      title: optionalText("Title", LIMITS.title),
      firstName: required("First name", LIMITS.name),
      middleName: optionalText("Middle name", LIMITS.name),
      lastName: required("Last name", LIMITS.name),
      preferredName: optionalText("Preferred name", LIMITS.name),
      email: z
        .string()
        .trim()
        .max(LIMITS.email, { error: `Email must be ${LIMITS.email} characters or fewer` })
        .toLowerCase()
        .transform((v) => (v === "" ? null : v))
        .pipe(z.email({ error: "Enter a valid email address" }).nullable()),
      phone: phoneField(opts.country, { required: false }),
      gender: z.enum([...GENDER_OPTIONS, ""]).transform((v) => (v === "" ? null : v)),
      dateOfBirth: optionalDate,
      designation: required("Designation", LIMITS.designation),
      staffCategory: z.enum(["academic", "support"]),
      isTeacher: z.boolean(),
      permissionRole: z.enum(PERMISSION_ROLES),
      department: required("Department", LIMITS.department),
      employer: z.enum(EMPLOYERS),
      contractType: z.enum(CONTRACT_TYPES),
      ftePercent: z.coerce
        .number({ error: "Enter a percentage" })
        .int({ error: "Use a whole number" })
        .min(1, { error: "FTE must be between 1 and 100" })
        .max(100, { error: "FTE must be between 1 and 100" })
        .default(100),
      isTermTimeOnly: z.boolean(),
      hireDate: z.string().trim().min(1, { error: "Hire date is required" }).pipe(isoDate),
      contractEndDate: optionalDate,
      probationEndDate: optionalDate,
      reportsToId: optionalText("Reports to", 64),
      gradeLevel: optionalText("Grade level", LIMITS.gradeLevel),
      responsibilities: z.array(responsibility),
      emergencyContacts: z.array(emergencyContact),
      /** Blank = let the backend allocate one from the tenant sequence. */
      employeeNumber: optionalText("Employee number", LIMITS.employeeNumber),
      sendInvite: z.boolean(),
    })
    .check((ctx) => {
      // Cross-field rules are shared with the CSV import (rules.ts).
      for (const issue of staffRecordIssues(ctx.value, opts.today)) {
        ctx.issues.push({ code: "custom", path: [issue.path], message: issue.message, input: ctx.value[issue.path] });
      }
    });
}

/** Forms build the schema per render with the request-time date and the school's country. */
export type StaffFormSchema = ReturnType<typeof staffFormSchemaFor>;
export type StaffFormInput = z.input<StaffFormSchema>;
export type StaffFormValues = z.output<StaffFormSchema>;

export function staffFormDefaults(): StaffFormInput {
  return {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    preferredName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    designation: "",
    staffCategory: "academic",
    isTeacher: true,
    permissionRole: "teacher",
    department: "",
    employer: "school",
    contractType: "permanent",
    ftePercent: 100,
    isTermTimeOnly: false,
    hireDate: "",
    contractEndDate: "",
    probationEndDate: "",
    reportsToId: "",
    gradeLevel: "",
    responsibilities: [],
    emergencyContacts: [],
    employeeNumber: "",
    sendInvite: false,
  };
}

/** First message per field path, keyed by dotted path, from a Zod error. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_root";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

// ---- Output shapes ----

export interface PersonInput {
  title: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  preferredName: string | null;
  gender: "male" | "female" | "other" | null;
  dateOfBirth: string | null;
  phones: Omit<PersonPhone, "verifiedAt">[];
  emergencyContacts: Omit<EmergencyContact, "id">[];
}

export interface StaffHeaderInput {
  email: string | null;
  employeeNumber: string | null;
  staffCategory: "academic" | "support";
  isTeacher: boolean;
  permissionRole: (typeof PERMISSION_ROLES)[number];
}

export type ContractInput = Omit<StaffContract, "id" | "staffId" | "roles"> & { roles: Omit<ContractRole, "id" | "contractId">[] };

/** Employment status is not here: it is projected from employment events (docs/12A). */
export interface StaffCreateInput {
  person: PersonInput;
  staff: StaffHeaderInput;
  contract: ContractInput;
  sendInvite: boolean;
}

/** Edit saves name the contract being changed; null means the record had none and one is created. */
export interface StaffUpdateInput extends StaffCreateInput {
  contractId: string | null;
}

/** Normalised form values to the shapes the API (and demo store) accept. */
export function toStaffInput(v: StaffFormValues): StaffCreateInput {
  const primaryPost: Omit<ContractRole, "id" | "contractId"> = {
    designation: v.designation,
    roleKind: "post",
    department: v.department,
    reportsToId: v.reportsToId,
    fteShare: null,
    allowanceCode: null,
    allowanceAmount: null,
    isPrimary: true,
    startDate: v.hireDate,
    endDate: null,
    payStructure: defaultPayStructure({ employer: v.employer as Employer, isTeacher: v.isTeacher, gradeLevel: v.gradeLevel }),
  };
  const responsibilities = v.responsibilities.map<Omit<ContractRole, "id" | "contractId">>((r) => ({
    designation: r.designation,
    roleKind: "responsibility",
    department: r.department,
    reportsToId: null,
    fteShare: null,
    allowanceCode: r.allowanceCode,
    allowanceAmount: null,
    isPrimary: false,
    startDate: r.startDate,
    endDate: r.endDate,
    payStructure: null,
  }));
  return {
    person: {
      title: v.title,
      firstName: v.firstName,
      middleName: v.middleName,
      lastName: v.lastName,
      preferredName: v.preferredName,
      gender: v.gender,
      dateOfBirth: v.dateOfBirth,
      phones: v.phone ? [{ type: "mobile", number: v.phone, isPrimary: true }] : [],
      emergencyContacts: v.emergencyContacts.map((c, i) => ({ name: c.name, relationship: c.relationship, phone: c.phone ?? "", altPhone: null, email: null, priority: i + 1, isPrimary: c.isPrimary })),
    },
    staff: {
      email: v.email,
      employeeNumber: v.employeeNumber,
      staffCategory: v.staffCategory,
      isTeacher: v.isTeacher,
      permissionRole: v.permissionRole,
    },
    contract: {
      employer: v.employer as Employer,
      agencyId: null,
      contractType: v.contractType as ContractType,
      startDate: v.hireDate,
      endDate: v.contractEndDate,
      probationEndDate: v.probationEndDate,
      confirmationDate: null,
      hoursPerWeek: null,
      weeksPerYear: null,
      fte: v.ftePercent / 100,
      isTermTimeOnly: v.isTermTimeOnly,
      noticePeriodDays: null,
      documentUrl: null,
      roles: [primaryPost, ...responsibilities],
    },
    sendInvite: v.sendInvite,
  };
}
