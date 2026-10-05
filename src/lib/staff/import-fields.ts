import type { ImportField, RowError } from "@/lib/import/types";
import { buildCsv } from "@/lib/import/csv";
import type { ContractInput, PersonInput, StaffCreateInput } from "./schema";
import { CONTRACT_TYPES, EMPLOYERS, GENDER_OPTIONS, PERMISSION_ROLES } from "./schema";
import { defaultPayStructure } from "./pay";
import { staffRecordIssues, type RuleIssue } from "./rules";

/**
 * Staff CSV template. Required columns are the creation fields; email is
 * optional because many support staff only have a phone (one of the two is
 * enforced by the shared row rules). Email is the primary match key for
 * upserts, employee number the secondary. There is no status column:
 * employment status is projected from events (docs/12A).
 */
export const STAFF_IMPORT_FIELDS: readonly ImportField[] = [
  { key: "employee_number", label: "Employee number", required: false, type: "text", unique: true, aliases: ["staff id", "staff number", "emp no", "employee id", "payroll number"], description: "Blank = allocated automatically" },
  { key: "title", label: "Title", required: false, type: "text", aliases: ["honorific", "salutation"] },
  { key: "first_name", label: "First name", required: true, type: "text", aliases: ["given name", "forename", "firstname"] },
  { key: "last_name", label: "Last name", required: true, type: "text", aliases: ["surname", "family name", "lastname"] },
  { key: "middle_name", label: "Middle name", required: false, type: "text", aliases: ["other names", "middlename"] },
  { key: "email", label: "Work email", required: false, type: "email", unique: true, aliases: ["e-mail", "email address", "work email", "staff email"] },
  { key: "phone", label: "Phone", required: false, type: "phone", aliases: ["mobile", "phone number", "telephone", "cell"] },
  { key: "gender", label: "Gender", required: false, type: "enum", enumValues: GENDER_OPTIONS, aliases: ["sex"] },
  { key: "date_of_birth", label: "Date of birth", required: false, type: "date", aliases: ["dob", "birth date", "birthday"] },
  { key: "designation", label: "Designation", required: true, type: "text", aliases: ["job title", "position", "title of post", "role"] },
  { key: "category", label: "Category", required: true, type: "enum", enumValues: ["academic", "support"], aliases: ["staff category", "staff type", "teaching/non-teaching"] },
  { key: "department", label: "Department", required: true, type: "text", aliases: ["dept", "faculty", "unit"] },
  { key: "reports_to_email", label: "Reports to (email)", required: false, type: "email", mustExistIn: "email", aliases: ["manager email", "supervisor email", "line manager"] },
  { key: "employer", label: "Employer / payer", required: false, type: "enum", enumValues: EMPLOYERS, defaultValue: "school", aliases: ["payer", "paid by", "funding source"] },
  { key: "contract_type", label: "Contract type", required: false, type: "enum", enumValues: CONTRACT_TYPES, defaultValue: "permanent", aliases: ["employment type", "contract", "engagement type"] },
  { key: "contract_end_date", label: "Contract end date", required: false, type: "date", aliases: ["end date", "contract end", "service end date"] },
  { key: "fte_percent", label: "FTE %", required: false, type: "number", min: 1, max: 100, integer: true, aliases: ["fte", "full time equivalent"] },
  { key: "hire_date", label: "Hire date", required: true, type: "date", aliases: ["start date", "date joined", "joining date", "date of employment", "resumption date", "date of first appointment"] },
  { key: "permission_role", label: "Permission role", required: false, type: "enum", enumValues: PERMISSION_ROLES, aliases: ["access role", "system role"] },
  { key: "emergency_contact_name", label: "Emergency contact name", required: false, type: "text", aliases: ["next of kin", "next of kin name", "nok name", "emergency contact"] },
  { key: "emergency_contact_phone", label: "Emergency contact phone", required: false, type: "phone", aliases: ["next of kin phone", "nok phone", "emergency phone"] },
  { key: "emergency_contact_relationship", label: "Emergency contact relationship", required: false, type: "text", aliases: ["next of kin relationship", "nok relationship", "relationship"] },
  { key: "grade_level", label: "Grade level", required: false, type: "text", aliases: ["gl", "grade", "salary grade"] },
  { key: "step", label: "Step", required: false, type: "number", min: 1, max: 15, integer: true, aliases: ["salary step", "increment step"] },
  { key: "state_payroll_number", label: "State payroll number", required: false, type: "text", aliases: ["oracle number", "ippis", "ippis number", "subeb id", "tescom id"] },
];

const RULE_FIELD: Record<RuleIssue["path"], string> = {
  phone: "phone",
  contractEndDate: "contract_end_date",
  dateOfBirth: "date_of_birth",
  // Unreachable from CSV: teaching eligibility is derived from the category
  // (there is no is_teacher column), so the shared rule can never fire here.
  isTeacher: "category",
  emergencyContacts: "emergency_contact_name",
};

/**
 * The cross-field rules the form applies (rules.ts), mapped onto column keys,
 * plus the emergency contact columns that must travel together.
 */
export function staffImportRowRules(todayISO: string): (normalized: Record<string, string>) => RowError[] {
  return (row) => {
    const category = row.category === "support" ? "support" : "academic";
    const errors: RowError[] = staffRecordIssues(
      {
        email: row.email || null,
        phone: row.phone || null,
        hireDate: row.hire_date,
        contractType: (row.contract_type || "permanent") as ContractInput["contractType"],
        contractEndDate: row.contract_end_date || null,
        dateOfBirth: row.date_of_birth || null,
        staffCategory: category,
        isTeacher: category === "academic",
        emergencyContacts: row.emergency_contact_name ? [{ isPrimary: true }] : [],
      },
      todayISO
    ).map((i) => ({ field: RULE_FIELD[i.path], message: i.message }));
    if (row.emergency_contact_name) {
      if (!row.emergency_contact_phone) errors.push({ field: "emergency_contact_phone", message: "Emergency contact phone is required when a contact is named" });
      if (!row.emergency_contact_relationship) errors.push({ field: "emergency_contact_relationship", message: "Emergency contact relationship is required when a contact is named" });
    }
    return errors;
  };
}

export interface StaffImportContext {
  /** Lower-cased email -> staff id, for resolving reports_to_email. */
  staffIdByEmail: ReadonlyMap<string, string>;
}

/** Normalised, validated row -> the create shape. Mirrors toStaffInput() for the form. */
export function rowToStaffInput(row: Record<string, string>, ctx: StaffImportContext): StaffCreateInput {
  const category = row.category === "support" ? "support" : "academic";
  const permissionRole = (row.permission_role || (category === "academic" ? "teacher" : "support")) as StaffCreateInput["staff"]["permissionRole"];
  const contractType = (row.contract_type || "permanent") as ContractInput["contractType"];
  const employer = (row.employer || "school") as ContractInput["employer"];
  const fte = row.fte_percent ? Number(row.fte_percent) / 100 : 1;

  const person: PersonInput = {
    title: row.title || null,
    firstName: row.first_name,
    middleName: row.middle_name || null,
    lastName: row.last_name,
    preferredName: null,
    gender: (row.gender || null) as PersonInput["gender"],
    dateOfBirth: row.date_of_birth || null,
    phones: row.phone ? [{ type: "mobile", number: row.phone, isPrimary: true }] : [],
    // Row rules guarantee phone and relationship accompany a named contact.
    emergencyContacts: row.emergency_contact_name
      ? [{ name: row.emergency_contact_name, relationship: row.emergency_contact_relationship, phone: row.emergency_contact_phone, altPhone: null, email: null, priority: 1, isPrimary: true }]
      : [],
  };

  const contract: ContractInput = {
    employer,
    agencyId: null,
    contractType,
    startDate: row.hire_date,
    endDate: row.contract_end_date || null,
    probationEndDate: null,
    confirmationDate: null,
    hoursPerWeek: null,
    weeksPerYear: null,
    fte,
    isTermTimeOnly: false,
    noticePeriodDays: null,
    documentUrl: null,
    roles: [
      {
        designation: row.designation,
        roleKind: "post",
        department: row.department,
        reportsToId: row.reports_to_email ? (ctx.staffIdByEmail.get(row.reports_to_email) ?? null) : null,
        fteShare: null,
        allowanceCode: null,
        allowanceAmount: null,
        isPrimary: true,
        startDate: row.hire_date,
        endDate: null,
        payStructure: defaultPayStructure({ employer, isTeacher: category === "academic", gradeLevel: row.grade_level || null, step: row.step ? Number(row.step) : null }),
      },
    ],
  };

  return {
    person,
    staff: {
      email: row.email || null,
      employeeNumber: row.employee_number || null,
      staffCategory: category,
      isTeacher: category === "academic",
      permissionRole,
    },
    contract,
    sendInvite: false,
  };
}

export function staffImportTemplate(): string {
  const keys = STAFF_IMPORT_FIELDS.map((f) => f.key);
  const example: Record<string, string> = {
    employee_number: "",
    title: "Mrs",
    first_name: "Ada",
    last_name: "Lovelace",
    middle_name: "",
    email: "ada.lovelace@school.edu",
    phone: "+2348031234567",
    gender: "female",
    date_of_birth: "1990-05-05",
    designation: "Teacher",
    category: "academic",
    department: "Mathematics",
    reports_to_email: "",
    employer: "school",
    contract_type: "permanent",
    contract_end_date: "",
    fte_percent: "100",
    hire_date: "2026-09-01",
    permission_role: "teacher",
    emergency_contact_name: "Grace Lovelace",
    emergency_contact_phone: "+2348030000001",
    emergency_contact_relationship: "Sister",
    grade_level: "",
    step: "",
    state_payroll_number: "",
  };
  return buildCsv(keys, [example]);
}
