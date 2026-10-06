import type {
  ContractRole,
  EducationAward,
  EmploymentEvent,
  ProfessionalRegistration,
  Staff,
  StaffContract,
  StaffDetail,
  TrainingRecord,
  VettingCheck,
} from "@/types/staff";
import type { EmergencyContact } from "@/types/person";

let seq = 0;
const next = (prefix: string) => `${prefix}_${String(++seq).padStart(3, "0")}`;

/** Minimal valid Staff read model; override what the test cares about. */
export function makeStaff(overrides: Partial<Staff> = {}): Staff {
  const id = overrides.id ?? next("stf");
  const base: Staff = {
    id,
    personId: `per_${id}`,
    employeeNumber: `EMP-${id.slice(-3)}`,
    title: null,
    firstName: "Ada",
    middleName: null,
    lastName: "Lovelace",
    suffix: null,
    preferredName: null,
    formerNames: [],
    gender: "female",
    dateOfBirth: "1990-01-01",
    photoUrl: null,
    personalEmail: null,
    preferredChannel: "sms",
    preferredLanguage: null,
    phone: "+2348030000000",
    phones: [{ type: "mobile", number: "+2348030000000", isPrimary: true, verifiedAt: null }],
    addresses: [],
    emergencyContacts: [],
    email: `${id}@school.test`,
    staffCategory: "academic",
    isTeacher: true,
    permissionRole: "teacher",
    qualifiedSubjectIds: [],
    customFields: {},
    employmentStatus: "active",
    contractLapsed: false,
    contractEndDate: null,
    hireDate: "2020-09-01",
    exitDate: null,
    exitReason: null,
    designation: "Teacher",
    department: "Mathematics",
    reportsToId: null,
    ftePercent: 100,
    contractType: "permanent",
    employer: "school",
    isTermTimeOnly: false,
    gradeLevel: null,
    coverRole: "provides",
    coverPriority: null,
    appraiserId: null,
    appraisalCycleKey: null,
    careerStage: null,
    seniorLeadership: false,
    canLogin: true,
    loginIdentifier: { type: "email", value: `${id}@school.test` },
  };
  return { ...base, ...overrides };
}

export function makeRole(overrides: Partial<ContractRole> = {}): ContractRole {
  return {
    id: next("role"),
    contractId: "ctr_001",
    designation: "Teacher",
    roleKind: "post",
    department: "Mathematics",
    reportsToId: null,
    fteShare: null,
    allowanceCode: null,
    allowanceAmount: null,
    isPrimary: true,
    startDate: "2020-09-01",
    endDate: null,
    payStructure: null,
    ...overrides,
  };
}

export function makeContract(overrides: Partial<StaffContract> = {}): StaffContract {
  const id = overrides.id ?? next("ctr");
  return {
    id,
    staffId: "stf_001",
    employer: "school",
    agencyId: null,
    contractType: "permanent",
    startDate: "2020-09-01",
    endDate: null,
    probationEndDate: null,
    confirmationDate: null,
    hoursPerWeek: null,
    weeksPerYear: null,
    fte: 1,
    isTermTimeOnly: false,
    noticePeriodDays: null,
    documentUrl: null,
    roles: overrides.roles ?? [makeRole({ contractId: id })],
    ...overrides,
  };
}

export function makeEvent(overrides: Partial<EmploymentEvent> = {}): EmploymentEvent {
  return {
    id: next("evt"),
    staffId: "stf_001",
    type: "hire",
    effectiveDate: "2020-09-01",
    endDate: null,
    outcome: null,
    reason: null,
    eligibleForRehire: null,
    notes: null,
    recordedById: null,
    recordedAt: "2020-09-01T00:00:00Z",
    ...overrides,
  };
}

export function makeRegistration(overrides: Partial<ProfessionalRegistration> = {}): ProfessionalRegistration {
  return {
    id: next("reg"),
    staffId: "stf_001",
    body: "trcn",
    number: "TRCN-0001",
    category: "C",
    validFrom: "2024-01-01",
    expiryDate: null,
    cpdCredits: null,
    verifiedById: null,
    verifiedAt: null,
    ...overrides,
  };
}

export function makeCheck(overrides: Partial<VettingCheck> = {}): VettingCheck {
  return {
    id: next("chk"),
    staffId: "stf_001",
    type: "police_character",
    completedOn: "2025-01-15",
    checkedById: null,
    outcome: "clear",
    expiryDate: null,
    reference: null,
    agencyAssuranceReceivedOn: null,
    ...overrides,
  };
}

export function makeTraining(overrides: Partial<TrainingRecord> = {}): TrainingRecord {
  return {
    id: next("trn"),
    staffId: "stf_001",
    type: "safeguarding",
    provider: "School",
    date: "2025-09-01",
    expiryDate: null,
    hours: null,
    credits: null,
    certificateRef: null,
    verifiedById: null,
    ...overrides,
  };
}

export function makeAward(overrides: Partial<EducationAward> = {}): EducationAward {
  return {
    id: next("awd"),
    staffId: "stf_001",
    award: "bed",
    subject: "Mathematics",
    institution: "University of Lagos",
    year: 2015,
    classOfAward: null,
    verifiedById: null,
    verifiedAt: null,
    ...overrides,
  };
}

export function makeEmergencyContact(overrides: Partial<EmergencyContact> = {}): EmergencyContact {
  return {
    id: next("ec"),
    name: "Grace Hopper",
    relationship: "Sister",
    phone: "+2348030000001",
    altPhone: null,
    email: null,
    priority: 1,
    isPrimary: true,
    ...overrides,
  };
}

export function makeStaffDetail(overrides: Partial<StaffDetail> = {}): StaffDetail {
  const staff = makeStaff(overrides);
  return {
    ...staff,
    contracts: [makeContract({ staffId: staff.id })],
    events: [makeEvent({ staffId: staff.id })],
    awards: [],
    registrations: [],
    checks: [],
    training: [],
    identifiers: [],
    consents: [],
    ...overrides,
  };
}
