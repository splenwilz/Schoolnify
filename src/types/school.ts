// ---------------------------------------------------------------------------
// School Setup API Types (wire format. snake_case, sectioned)
// ---------------------------------------------------------------------------

// Section data interfaces. one per API section

export interface SetupIdentitySection {
  school_type: string;
  ownership_type: string;
  motto: string;
  founded_year: string;
  accreditation_number: string;
  admission_number_prefix?: string;
}

export interface SetupBrandingSection {
  logo_url: string;
  primary_color: string;
  secondary_color: string;
}

export interface SetupLocationSection {
  country: string;
  state_region: string;
  city: string;
  timezone: string;
}

export interface SetupLocalizationSection {
  currency: string;
  date_format: string;
  language: string;
}

export interface SetupAcademicCalendarSection {
  calendar_type: string;
  current_academic_year: string;
  terms: { name: string; start_date: string; end_date: string }[];
}

export interface SetupGradeLevelsSection {
  grade_level_structure_id: string;
  grade_levels: string[];
  group_sections: Record<string, string[]>;
  custom_group_levels: Record<string, string[]>;
}

export interface ApiGradeRow {
  grade: string;
  min_score: string;
  max_score: string;
  descriptor?: string;
  gpa_points?: string;
}

export interface SetupGradingSection {
  grading_preset_id: string;
  grading_scale: ApiGradeRow[];
  ca_weight: string;
  exam_weight: string;
  passmark: string;
  gpa_enabled: boolean;
  assignment_weight: string;
  test_weight: string;
  project_weight: string;
}

export interface ApiPeriodSlot {
  label: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
}

export interface ApiDivisionSchedule {
  start_time: string;
  end_time: string;
  period_duration: string;
  periods: ApiPeriodSlot[];
}

export interface SetupScheduleSection {
  schedules: Record<string, ApiDivisionSchedule>;
}

export interface SetupSubjectsSection {
  subjects: string[];
  subject_departments: Record<string, string>;
}

export interface ApiFeeCategory {
  name: string;
  mandatory: boolean;
  frequency?: string;
  fee_type?: string;
  applies_to: string;
  grade_levels: string[];
  amounts: Record<string, string>;
}

export interface ApiDiscountType {
  name: string;
  percentage: string;
  applies_to: string;
}

export interface SetupFeesSection {
  fee_categories: ApiFeeCategory[];
  fee_payment_schedule?: string;
  fee_payment_due_day?: string;
  late_fee_percentage?: string;
  late_fee_grace_days?: string;
  discount_types?: ApiDiscountType[];
}

export interface SetupReportCardSection {
  report_template?: string;
  show_assessment_breakdown?: boolean;
  show_class_average?: boolean;
  show_highest_lowest?: boolean;
  show_grading_legend?: boolean;
  show_position?: boolean;
  show_gpa?: boolean;
  show_effort_grades?: boolean;
  show_behavior_rating?: boolean;
  show_psychomotor?: boolean;
  psychomotor_traits?: string[];
  show_affective?: boolean;
  affective_traits?: string[];
  show_teacher_comments?: boolean;
  show_class_teacher_comment?: boolean;
  show_principal_signature?: boolean;
  show_subject_teacher_signature?: boolean;
  comment_char_limit?: string;
  show_attendance_summary?: boolean;
  show_next_term_dates?: boolean;
  show_co_curricular?: boolean;
}

export interface ApiPromotionRule {
  min_subjects_to_pass?: Record<string, string> | string;
  overall_pass_percentage?: string;
  required_subjects?: string[];
  allow_remedial?: boolean;
  max_subjects_for_supplementary?: string;
  conditional_promotion?: boolean;
  max_repeats?: string;
}

export interface SetupPoliciesSection {
  // Attendance
  attendance_tracking_methods?: Record<string, string>;
  late_grace_period?: string;
  attendance_threshold?: string;
  tardies_to_absence?: string;
  consecutive_absence_alert?: string;
  absence_categories?: string[];
  // Promotion
  promotion_criteria?: string;
  promotion_rules?: ApiPromotionRule;
  // Discipline
  discipline_framework?: string;
  offense_categories?: string[];
  consequence_ladder?: string[];
  point_reset_period?: string;
  // Notifications
  parent_portal?: boolean;
  report_comments?: boolean;
  attendance_alerts?: boolean;
  fee_reminders?: boolean;
  exam_result_notify?: boolean;
  behavior_alerts?: boolean;
  homework_alerts?: boolean;
  notification_channels?: string[];
}

// ---------------------------------------------------------------------------
// Aggregate types
// ---------------------------------------------------------------------------

export interface SetupApiData {
  identity?: SetupIdentitySection;
  branding?: SetupBrandingSection;
  location?: SetupLocationSection;
  localization?: SetupLocalizationSection;
  academic_calendar?: SetupAcademicCalendarSection;
  grade_levels?: SetupGradeLevelsSection;
  grading?: SetupGradingSection;
  schedule?: SetupScheduleSection;
  subjects?: SetupSubjectsSection;
  fees?: SetupFeesSection;
  report_card?: SetupReportCardSection;
  policies?: SetupPoliciesSection;
}

export type PatchSetupRequest = Partial<SetupApiData>;

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export interface SetupSectionCompletion {
  name: string;
  complete: boolean;
  required_fields: string[];
  missing_fields: string[];
}

export interface SetupCompletion {
  total_sections: number;
  completed_sections: number;
  sections: SetupSectionCompletion[];
}

export interface GetSetupResponse {
  data: SetupApiData | null;
  completion: SetupCompletion;
  updated_at: string | null;
}

export type PatchSetupResponse = GetSetupResponse;

// ---------------------------------------------------------------------------
// Public branding (no auth)
// ---------------------------------------------------------------------------

export interface PublicSchoolBranding {
  name: string;
  slug: string;
  logo_url: string | null;
  motto: string | null;
  primary_color: string | null;
  secondary_color: string | null;
}
