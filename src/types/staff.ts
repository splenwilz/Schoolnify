import type { ConsentFlag, PersonFields, PersonIdentifier } from "./person";

/**
 * Staff types. See docs/12-STAFF-MODULE-SPEC.md and 12A-STAFF-MODEL-AMENDMENT.md.
 *
 * `Staff` is the read model every list and card renders: person fields
 * flattened, plus projections of the current contract and primary post
 * (designation, department, FTE, employer, status). `StaffDetail` adds the
 * underlying arrays. The projections are computed by lib/staff/projections.ts
 * in the demo and returned by the API in production.
 */

export type StaffCategory = "academic" | "support";

export type EmploymentStatus = "onboarding" | "active" | "suspended" | "inactive";

/** Coarse permission seam until RBAC exists; values match the app's portals. */
export type PermissionRole = "school_admin" | "teacher" | "bursar" | "registrar" | "support";

// ---- Contracts and roles ----

export type Employer = "school" | "government_board" | "pta" | "mission" | "nysc" | "agency" | "volunteer" | "self";

export type ContractType =
  | "permanent"
  | "fixed_term"
  | "temporary"
  | "casual"
  | "corps_member"
  | "trainee"
  | "volunteer"
  | "supply";

/** Contract types that must carry an end date. */
export const DATED_CONTRACT_TYPES: readonly ContractType[] = ["fixed_term", "corps_member", "trainee", "supply"];

export type RoleKind = "post" | "responsibility";

export type RetirementRule = "60_or_35" | "65_or_40";

export interface PayStructure {
  salaryStructure: string; // CONPSS, TSS, a state variant, or custom
  gradeLevel: string; // "GL 08"
  step: number | null;
  cadre: string | null;
  firstAppointmentDate: string | null;
  lastPromotionDate: string | null;
  retirementRule: RetirementRule;
}

export interface ContractRole {
  id: string;
  contractId: string;
  designation: string;
  roleKind: RoleKind;
  department: string | null;
  reportsToId: string | null;
  fteShare: number | null; // fraction of the contract FTE
  allowanceCode: string | null;
  allowanceAmount: number | null; // amount only; payment is payroll
  isPrimary: boolean;
  startDate: string;
  endDate: string | null;
  payStructure: PayStructure | null;
}

export interface StaffContract {
  id: string;
  staffId: string;
  employer: Employer;
  agencyId: string | null;
  contractType: ContractType;
  startDate: string;
  endDate: string | null;
  probationEndDate: string | null;
  confirmationDate: string | null;
  hoursPerWeek: number | null;
  weeksPerYear: number | null;
  fte: number; // 1 = full time
  isTermTimeOnly: boolean;
  noticePeriodDays: number | null;
  documentUrl: string | null;
  roles: ContractRole[];
}

// ---- Employment events ----

export type EmploymentEventType =
  | "hire"
  | "probation_end"
  | "confirmation"
  | "promotion"
  | "transfer"
  | "suspension"
  | "reinstatement"
  | "contract_renewal"
  | "status_change"
  | "exit"
  | "rehire";

export type ExitReason = "resignation" | "dismissal" | "end_of_contract" | "retirement" | "death" | "transfer_out";

export interface EmploymentEvent {
  id: string;
  staffId: string;
  type: EmploymentEventType;
  effectiveDate: string;
  endDate: string | null; // suspensions
  outcome: string | null; // probation outcome
  reason: string | null; // ExitReason for exits, free text otherwise
  eligibleForRehire: boolean | null;
  notes: string | null;
  recordedById: string | null;
  recordedAt: string;
}

// ---- Credentials, split four ways ----

export interface Expiring {
  expiryDate: string | null; // null = does not expire
}

export type AwardType = "nce" | "bed" | "bsc" | "hnd" | "pgde" | "msc" | "phd" | "other";

export interface EducationAward {
  id: string;
  staffId: string;
  award: AwardType;
  subject: string;
  institution: string;
  year: number;
  classOfAward: string | null;
  verifiedById: string | null;
  verifiedAt: string | null;
}

export type RegistrationBody = "trcn" | "qts" | "qtls" | "eyts" | "hlta" | "other";
export type TrcnCategory = "A" | "B" | "C" | "D";

export interface ProfessionalRegistration extends Expiring {
  id: string;
  staffId: string;
  body: RegistrationBody;
  number: string;
  category: TrcnCategory | null;
  validFrom: string;
  cpdCredits: number | null;
  verifiedById: string | null;
  verifiedAt: string | null;
}

export type VettingCheckType =
  | "identity"
  | "police_character"
  | "dbs_enhanced"
  | "barred_list"
  | "prohibition"
  | "section_128"
  | "overseas"
  | "right_to_work"
  | "medical_fitness"
  | "safeguarding_policy_signed"
  | "code_of_conduct_signed"
  | "other";

export type CheckOutcome = "clear" | "concern" | "pending";

export interface VettingCheck extends Expiring {
  id: string;
  staffId: string;
  type: VettingCheckType;
  completedOn: string;
  checkedById: string | null;
  outcome: CheckOutcome;
  reference: string | null;
  agencyAssuranceReceivedOn: string | null;
}

export type TrainingType = "safeguarding" | "first_aid" | "fire" | "mcpd" | "induction" | "other";

export interface TrainingRecord extends Expiring {
  id: string;
  staffId: string;
  type: TrainingType;
  provider: string;
  date: string;
  hours: number | null;
  credits: number | null;
  certificateRef: string | null;
  verifiedById: string | null;
}

/** Derived from expiryDate and today (lib/staff/credentials.ts); never stored. */
export type CredentialStatus = "valid" | "expiring" | "expired" | "unknown";

// ---- Teaching links (from the classes amendment) ----

export type AssignmentRole = "homeroom" | "subject" | "co_teacher" | "cover";

export interface StaffAssignment {
  id: string;
  staffId: string;
  classId: string;
  className: string;
  subjectId: string | null;
  role: AssignmentRole;
  academicSession: string;
  term: string;
  startsOn: string;
  endsOn: string | null;
  periodsPerWeek: number | null;
  source: "manual" | "self_contained";
  teachingSetId: string | null;
}

// ---- Operational seams (types and demo data only; no screens yet) ----

export type AbsenceCategory = "SIC" | "PRG" | "MAT" | "PUB" | "SEC" | "TRN" | "UNA" | "UNP" | "OTH";
export type AbsenceStatus = "pending" | "approved" | "declined" | "cancelled";

export interface StaffAbsence {
  id: string;
  staffId: string;
  category: AbsenceCategory;
  localReason: string | null;
  startDate: string;
  endDate: string | null; // null = open
  halfDayValue: number; // 1 = full days, 0.5 = half
  status: AbsenceStatus;
  approverId: string | null;
  certificateRef: string | null;
  coverOnly: boolean;
}

export interface StaffAttendanceEvent {
  id: string;
  staffId: string;
  timestamp: string; // ISO datetime
  kind: "in" | "out";
  source: "register" | "app" | "biometric";
  deviceId: string | null;
}

export interface CoverAssignment {
  id: string;
  absenceId: string;
  date: string;
  periodLabel: string;
  teachingAssignmentId: string;
  coverStaffId: string;
  status: "requested" | "accepted" | "declined" | "cancelled";
  paid: boolean;
  rate: number | null;
  agencyId: string | null;
}

export interface WorkingPattern {
  staffId: string;
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  am: boolean;
  pm: boolean;
}

export interface SchedulingPrefs {
  staffId: string;
  maxPeriodsPerDay: number | null;
  maxPeriodsPerWeek: number | null;
  maxConsecutive: number | null;
  preferredRoom: string | null;
  campus: string | null;
}

export interface Duty {
  id: string;
  name: string;
  type: "break" | "gate" | "bus" | "assembly" | "invigilation" | "boarding" | "other";
  weekdays: number[];
  startTime: string;
  endTime: string;
}

export interface DutyAssignment {
  dutyId: string;
  staffId: string;
  weekday: number | null;
  date: string | null;
}

export interface BoardingPost {
  staffId: string;
  house: string;
  role: "housemaster" | "matron" | "assistant" | "other";
  liveIn: boolean;
  startDate: string;
  endDate: string | null;
}

export interface SchoolPosting {
  personId: string;
  school: string;
  letterReference: string | null;
  startDate: string;
  endDate: string | null;
}

export interface InductionStatus {
  staffId: string;
  route: string;
  startDate: string;
  termsCompleted: number;
  tutorId: string | null;
  mentorId: string | null;
  body: string | null;
}

export interface ExitChecklistItem {
  staffId: string;
  item: string;
  doneAt: string | null;
  doneById: string | null;
}

// ---- Read models ----

export type CoverRole = "provides" | "cover_supervisor" | "excluded";

export interface LoginIdentifier {
  type: "email" | "phone";
  value: string;
}

export interface Staff extends PersonFields {
  id: string;
  employeeNumber: string;
  /** Work email; optional, unique when present. Not the login identity. */
  email: string | null;
  staffCategory: StaffCategory;
  isTeacher: boolean;
  permissionRole: PermissionRole;
  qualifiedSubjectIds: string[];
  customFields: Record<string, string>;

  // Projections of events and of the current contract's primary post
  employmentStatus: EmploymentStatus;
  /** Last contract ended with no exit event recorded; shown as "Contract ended" and off the books. */
  contractLapsed: boolean;
  hireDate: string;
  exitDate: string | null;
  exitReason: ExitReason | null;
  designation: string;
  department: string;
  reportsToId: string | null;
  ftePercent: number; // 100 = full time
  contractType: ContractType;
  employer: Employer;
  isTermTimeOnly: boolean;
  gradeLevel: string | null;

  // Seams
  coverRole: CoverRole;
  coverPriority: number | null;
  appraiserId: string | null;
  appraisalCycleKey: string | null;
  careerStage: string | null;
  seniorLeadership: boolean;

  // Account
  canLogin: boolean;
  loginIdentifier: LoginIdentifier | null;
}

export interface StaffDetail extends Staff {
  contracts: StaffContract[];
  events: EmploymentEvent[];
  awards: EducationAward[];
  registrations: ProfessionalRegistration[];
  checks: VettingCheck[];
  training: TrainingRecord[];
  identifiers: PersonIdentifier[];
  consents: ConsentFlag[];
}

// ---- Display labels ----

export const EMPLOYMENT_STATUS_LABEL: Record<EmploymentStatus, string> = {
  onboarding: "Onboarding",
  active: "Active",
  suspended: "Suspended",
  inactive: "Inactive",
};

export const CONTRACT_TYPE_LABEL: Record<ContractType, string> = {
  permanent: "Permanent",
  fixed_term: "Fixed term",
  temporary: "Temporary",
  casual: "Casual",
  corps_member: "Corps member (NYSC)",
  trainee: "Trainee (teaching practice)",
  volunteer: "Volunteer",
  supply: "Supply or agency",
};

export const EMPLOYER_LABEL: Record<Employer, string> = {
  school: "School",
  government_board: "Government board",
  pta: "PTA",
  mission: "Mission",
  nysc: "NYSC",
  agency: "Agency",
  volunteer: "Volunteer",
  self: "Self-employed",
};

export const PERMISSION_ROLE_LABEL: Record<PermissionRole, string> = {
  school_admin: "School admin",
  teacher: "Teacher",
  bursar: "Bursar",
  registrar: "Registrar",
  support: "Support",
};

export const CREDENTIAL_STATUS_LABEL: Record<CredentialStatus, string> = {
  valid: "Valid",
  expiring: "Expiring soon",
  expired: "Expired",
  unknown: "Check date",
};

export const AWARD_LABEL: Record<AwardType, string> = {
  nce: "NCE",
  bed: "B.Ed",
  bsc: "B.Sc / B.A",
  hnd: "HND",
  pgde: "PGDE",
  msc: "M.Sc / M.Ed",
  phd: "PhD",
  other: "Other",
};

export const REGISTRATION_BODY_LABEL: Record<RegistrationBody, string> = {
  trcn: "TRCN",
  qts: "QTS",
  qtls: "QTLS",
  eyts: "EYTS",
  hlta: "HLTA",
  other: "Other",
};

export const VETTING_CHECK_LABEL: Record<VettingCheckType, string> = {
  identity: "Identity",
  police_character: "Police character certificate",
  dbs_enhanced: "Enhanced DBS",
  barred_list: "Barred list",
  prohibition: "Prohibition from teaching",
  section_128: "Section 128",
  overseas: "Overseas check",
  right_to_work: "Right to work",
  medical_fitness: "Medical fitness",
  safeguarding_policy_signed: "Safeguarding policy signed",
  code_of_conduct_signed: "Code of conduct signed",
  other: "Other",
};

export const TRAINING_TYPE_LABEL: Record<TrainingType, string> = {
  safeguarding: "Safeguarding",
  first_aid: "First aid",
  fire: "Fire safety",
  mcpd: "TRCN MCPD",
  induction: "Induction",
  other: "Other",
};

export const EXIT_REASON_LABEL: Record<ExitReason, string> = {
  resignation: "Resignation",
  dismissal: "Dismissal",
  end_of_contract: "End of contract",
  retirement: "Retirement",
  death: "Death in service",
  transfer_out: "Transferred out",
};

// ---- Helpers ----

/** Preferred name wins; otherwise title and names in display order. */
export function staffFullName(s: Pick<Staff, "firstName" | "lastName" | "preferredName"> & { title?: string | null }): string {
  if (s.preferredName) return s.preferredName;
  const base = `${s.firstName} ${s.lastName}`;
  return s.title ? `${s.title} ${base}` : base;
}
