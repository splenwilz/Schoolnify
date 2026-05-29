// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GradeRow {
  grade: string;
  minScore: string;
  maxScore: string;
  /** Human-readable descriptor (e.g. "Outstanding", "Distinction") */
  descriptor?: string;
  /** GPA points for this grade on a 4.0 or 10.0 scale */
  gpaPoints?: string;
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

export type FeeFrequency = "per_term" | "quarterly" | "semi_annual" | "annual" | "one_time" | "monthly";
export type FeeType = "tuition" | "facility" | "boarding" | "transport" | "exam" | "admin" | "co_curricular" | "one_time_onboarding";

export interface FeeCategory {
  name: string;
  mandatory: boolean;
  frequency: FeeFrequency;
  feeType: FeeType;
  appliesTo: "all" | "specific";
  gradeLevels: string[];
  /** amount per grade level. key is level name, value is amount string */
  amounts: Record<string, string>;
}

export interface DiscountType {
  name: string;
  /** Percentage off (e.g. "10" for 10%) */
  percentage: string;
  /** Which fee types this discount applies to */
  appliesTo: "tuition" | "all";
}

export interface PromotionRule {
  /** Per-group minimum subjects. Key = group name, value = count string. */
  minSubjectsToPass: Record<string, string>;
  overallPassPercentage: string;
  requiredSubjects: string[];
  allowRemedial: boolean;
  maxSubjectsForSupplementary: string;
  conditionalPromotion: boolean;
  maxRepeats: string;
}

export interface SetupData {
  // School Identity
  schoolType: string;
  ownershipType: string;
  motto: string;
  foundedYear: string;
  accreditationNumber: string;
  admissionNumberPrefix: string;
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
  /** Per-group section overrides. Key = group name, value = section letters. Empty array = no sections. */
  groupSections: Record<string, string[]>;
  /** Custom levels added to specific groups. Key = group name, value = custom level names. */
  customGroupLevels: Record<string, string[]>;
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
  feePaymentSchedule: "start_of_term" | "specific_date" | "monthly" | "";
  feePaymentDueDay: string;
  lateFeePercentage: string;
  lateFeeGraceDays: string;
  discountTypes: DiscountType[];
  // Report Card
  reportTemplate: string;
  // Academic section
  showAssessmentBreakdown: boolean;
  showClassAverage: boolean;
  showHighestLowest: boolean;
  showGradingLegend: boolean;
  // Ranking & performance
  showPosition: boolean;
  showGPA: boolean;
  showEffortGrades: boolean;
  // Behavioral assessment
  showBehaviorRating: boolean;
  showPsychomotor: boolean;
  psychomotorTraits: string[];
  showAffective: boolean;
  affectiveTraits: string[];
  // Comments & signatures
  showTeacherComments: boolean;
  showClassTeacherComment: boolean;
  showPrincipalSignature: boolean;
  showSubjectTeacherSignature: boolean;
  commentCharLimit: string;
  // Additional info
  showAttendanceSummary: boolean;
  showNextTermDates: boolean;
  showCoCurricular: boolean;
  // --- Policies ---
  // Attendance
  /** Per-group attendance tracking. Key = group name, value = method. Fallback to "daily". */
  attendanceTrackingMethods: Record<string, "daily" | "per_subject">;
  lateGracePeriod: string;
  attendanceThreshold: string;
  tardiesToAbsence: string;
  consecutiveAbsenceAlert: string;
  absenceCategories: string[];
  // Promotion
  promotionCriteria: string;
  promotionRules: PromotionRule;
  // Discipline
  disciplineFramework: string;
  offenseCategories: string[];
  consequenceLadder: string[];
  pointResetPeriod: string;
  // Notifications
  parentPortal: boolean;
  reportComments: boolean;
  attendanceAlerts: boolean;
  feeReminders: boolean;
  examResultNotify: boolean;
  behaviorAlerts: boolean;
  homeworkAlerts: boolean;
  notificationChannels: string[];
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
  ownershipType: "",
  motto: "",
  foundedYear: "",
  accreditationNumber: "",
  admissionNumberPrefix: "",
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
  currentAcademicYear: (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    // If August or later, academic year is current/next. Otherwise previous/current.
    return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  })(),
  gradeLevelStructureId: "",
  gradeLevels: [],
  groupSections: {},
  customGroupLevels: {},
  gradingPresetId: "",
  gradingScale: [],
  caWeight: "40",
  examWeight: "60",
  passmark: "40",
  gpaEnabled: false,
  assignmentWeight: "10",
  testWeight: "20",
  projectWeight: "10",
  // School Hours (per division)
  schedules: {},
  // Terms
  terms: [],
  // Subjects
  subjects: [],
  subjectDepartments: {},
  // Fee Categories
  feeCategories: [],
  feePaymentSchedule: "start_of_term",
  feePaymentDueDay: "1",
  lateFeePercentage: "0",
  lateFeeGraceDays: "7",
  discountTypes: [],
  // Report Card
  reportTemplate: "standard",
  // Academic
  showAssessmentBreakdown: true,
  showClassAverage: true,
  showHighestLowest: true,
  showGradingLegend: true,
  // Ranking
  showPosition: true,
  showGPA: false,
  showEffortGrades: false,
  // Behavioral
  showBehaviorRating: true,
  showPsychomotor: true,
  psychomotorTraits: ["Handwriting", "Verbal Fluency", "Creativity", "Sports", "Musical Skills"],
  showAffective: true,
  affectiveTraits: ["Punctuality", "Neatness", "Attentiveness", "Honesty", "Politeness", "Perseverance", "Sociability", "Self-control"],
  // Comments
  showTeacherComments: true,
  showClassTeacherComment: true,
  showPrincipalSignature: true,
  showSubjectTeacherSignature: false,
  commentCharLimit: "200",
  // Additional
  showAttendanceSummary: true,
  showNextTermDates: true,
  showCoCurricular: false,
  // Attendance Policy
  attendanceTrackingMethods: {},
  lateGracePeriod: "15",
  attendanceThreshold: "75",
  tardiesToAbsence: "3",
  consecutiveAbsenceAlert: "3",
  absenceCategories: ["Excused", "Unexcused", "Medical", "School Activity", "Suspended"],
  // Promotion Policy
  promotionCriteria: "automatic",
  promotionRules: {
    minSubjectsToPass: {},
    overallPassPercentage: "40",
    requiredSubjects: ["Mathematics", "English Language"],
    allowRemedial: true,
    maxSubjectsForSupplementary: "2",
    conditionalPromotion: true,
    maxRepeats: "1",
  },
  // Discipline Policy
  disciplineFramework: "merit_demerit",
  offenseCategories: ["Late to class", "Incomplete homework", "Dress code violation", "Disrespect", "Phone use", "Skipping class", "Fighting", "Bullying", "Vandalism"],
  consequenceLadder: ["Verbal warning", "Written warning", "Detention", "Parent meeting", "Suspension", "Expulsion hearing"],
  pointResetPeriod: "per_term",
  // Notifications
  parentPortal: true,
  reportComments: true,
  attendanceAlerts: true,
  feeReminders: true,
  examResultNotify: true,
  behaviorAlerts: true,
  homeworkAlerts: false,
  notificationChannels: ["email"],
};

// ---------------------------------------------------------------------------
// Completion helpers
// ---------------------------------------------------------------------------

export function isIdentityComplete(d: SetupData) {
  return !!(d.schoolType && d.ownershipType);
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
  return !!(d.attendanceThreshold && d.promotionCriteria && d.disciplineFramework && d.absenceCategories.length > 0);
}
