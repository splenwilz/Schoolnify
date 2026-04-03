// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GradeRow {
  grade: string;
  minScore: string;
  maxScore: string;
}

export interface TermDate {
  name: string;
  startDate: string;
  endDate: string;
}

export interface PeriodSlot {
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

export interface DivisionSchedule {
  startTime: string;
  endTime: string;
  periodDuration: string;
  periods: PeriodSlot[];
}

export interface FeeCategory {
  name: string;
  mandatory: boolean;
  appliesTo: "all" | "specific";
  gradeLevels: string[];
  /** amount per grade level — key is level name, value is amount string */
  amounts: Record<string, string>;
}

export interface PromotionRule {
  minSubjectsToPass: string;
  requiredSubjects: string[];
  allowRemedial: boolean;
  maxRepeats: string;
}

export interface SetupData {
  // School Identity
  schoolType: string;
  motto: string;
  foundedYear: string;
  accreditationNumber: string;
  // Branding & Appearance
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  // Location & Regional
  country: string;
  stateRegion: string;
  city: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  language: string;
  // Academic Structure
  calendarType: string;
  currentAcademicYear: string;
  gradeLevelStructureId: string;
  gradeLevels: string[];
  // Grading & Assessment
  gradingPresetId: string;
  gradingScale: GradeRow[];
  caWeight: string;
  examWeight: string;
  passmark: string;
  gpaEnabled: boolean;
  assignmentWeight: string;
  testWeight: string;
  projectWeight: string;
  // School Hours & Periods (per division)
  schedules: Record<string, DivisionSchedule>;
  // Term / Session Dates
  terms: TermDate[];
  // Subjects
  subjects: string[];
  subjectDepartments: Record<string, string>;
  // Fee Categories
  feeCategories: FeeCategory[];
  // Report Card
  reportTemplate: string;
  showPosition: boolean;
  showGPA: boolean;
  showTeacherComments: boolean;
  showPrincipalSignature: boolean;
  showAttendanceSummary: boolean;
  showBehaviorRating: boolean;
  showSubjectTeacherSignature: boolean;
  // Communication & Notifications
  parentPortal: boolean;
  reportComments: boolean;
  attendanceAlerts: boolean;
  feeReminders: boolean;
  examResultNotify: boolean;
  // Policies & Promotion
  lateGracePeriod: string;
  attendanceThreshold: string;
  promotionCriteria: string;
  promotionRules: PromotionRule;
  disciplineSystem: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SUBJECT_DEPARTMENTS = [
  { label: "Science", value: "science" },
  { label: "Arts", value: "arts" },
  { label: "Commercial", value: "commercial" },
  { label: "Technology", value: "technology" },
  { label: "Languages", value: "languages" },
  { label: "Humanities", value: "humanities" },
  { label: "Vocational", value: "vocational" },
  { label: "General", value: "general" },
];

export const DEFAULT_DATA: SetupData = {
  schoolType: "",
  motto: "",
  foundedYear: "",
  accreditationNumber: "",
  logoUrl: "",
  primaryColor: "#0891B2",
  secondaryColor: "#10B981",
  country: "",
  stateRegion: "",
  city: "",
  timezone: "",
  currency: "",
  dateFormat: "DD/MM/YYYY",
  language: "en",
  calendarType: "",
  currentAcademicYear: "",
  gradeLevelStructureId: "",
  gradeLevels: [],
  gradingPresetId: "",
  gradingScale: [],
  caWeight: "40",
  examWeight: "60",
  passmark: "40",
  gpaEnabled: false,
  assignmentWeight: "",
  testWeight: "",
  projectWeight: "",
  // School Hours (per division)
  schedules: {},
  // Terms
  terms: [],
  // Subjects
  subjects: [],
  subjectDepartments: {},
  // Fee Categories
  feeCategories: [],
  // Report Card
  reportTemplate: "standard",
  showPosition: true,
  showGPA: true,
  showTeacherComments: true,
  showPrincipalSignature: true,
  showAttendanceSummary: false,
  showBehaviorRating: false,
  showSubjectTeacherSignature: false,
  // Communication
  parentPortal: true,
  reportComments: true,
  attendanceAlerts: true,
  feeReminders: true,
  examResultNotify: true,
  // Policies
  lateGracePeriod: "15",
  attendanceThreshold: "75",
  promotionCriteria: "automatic",
  promotionRules: {
    minSubjectsToPass: "5",
    requiredSubjects: [],
    allowRemedial: true,
    maxRepeats: "1",
  },
  disciplineSystem: true,
};

// ---------------------------------------------------------------------------
// Completion helpers
// ---------------------------------------------------------------------------

export function isIdentityComplete(d: SetupData) {
  return !!(d.schoolType && d.motto);
}

export function isBrandingComplete(d: SetupData) {
  return !!(d.primaryColor && d.secondaryColor);
}

export function isLocationComplete(d: SetupData) {
  return !!(d.country && d.timezone && d.currency);
}

export function isAcademicComplete(d: SetupData) {
  return !!(d.calendarType && d.currentAcademicYear && d.gradeLevelStructureId && d.gradeLevels.length > 0);
}

export function isGradingComplete(d: SetupData) {
  return !!(d.gradingPresetId && d.gradingScale.length > 0 && d.caWeight && d.examWeight && d.passmark);
}

export function isScheduleComplete(d: SetupData) {
  const keys = Object.keys(d.schedules);
  return keys.length > 0 && keys.every((k) => {
    const s = d.schedules[k];
    return s.startTime && s.endTime && s.periods.length > 0;
  });
}

export function isTermsComplete(d: SetupData) {
  return d.terms.length > 0 && d.terms.every((t) => t.name && t.startDate && t.endDate);
}

export function isSubjectsComplete(d: SetupData) {
  return d.subjects.length > 0;
}

export function isFeesComplete(d: SetupData) {
  return d.feeCategories.length > 0;
}

export function isReportCardComplete(d: SetupData) {
  return !!d.reportTemplate;
}

export function isCommsComplete(_d: SetupData) {
  return true;
}

export function isPoliciesComplete(d: SetupData) {
  return !!(d.lateGracePeriod && d.attendanceThreshold && d.promotionCriteria);
}
