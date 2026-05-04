"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolApi } from "@/api/endpoints/school";
import type { ApiError } from "@/api/client";
import type {
  SetupApiData,
  GetSetupResponse,
  PatchSetupRequest,
  PublicSchoolBranding,
} from "@/types/school";
import type { SetupData, GradeRow, TermDate, DivisionSchedule, PeriodSlot, FeeCategory, PromotionRule } from "@/app/(dashboard)/school-admin/setup/_components/setup-types";
import { DEFAULT_DATA } from "@/app/(dashboard)/school-admin/setup/_components/setup-types";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const SETUP_QUERY_KEY = ["school-setup"] as const;
export const BRANDING_QUERY_KEY = (slug: string) => ["school-branding", slug] as const;

// ---------------------------------------------------------------------------
// API → Frontend mapper (sectioned snake_case → flat camelCase)
// ---------------------------------------------------------------------------

function apiToSetupData(api: SetupApiData): Partial<SetupData> {
  const result: Partial<SetupData> = {};

  if (api.identity) {
    result.schoolType = api.identity.school_type ?? "";
    result.ownershipType = api.identity.ownership_type ?? "";
    result.motto = api.identity.motto ?? "";
    result.foundedYear = api.identity.founded_year ?? "";
    result.accreditationNumber = api.identity.accreditation_number ?? "";
    result.admissionNumberPrefix = api.identity.admission_number_prefix ?? "";
  }

  if (api.branding) {
    result.logoUrl = api.branding.logo_url ?? "";
    result.primaryColor = api.branding.primary_color ?? "#0891B2";
    result.secondaryColor = api.branding.secondary_color ?? "#10B981";
  }

  if (api.location) {
    result.country = api.location.country ?? "";
    result.stateRegion = api.location.state_region ?? "";
    result.city = api.location.city ?? "";
    result.timezone = api.location.timezone ?? "";
  }

  if (api.localization) {
    result.currency = api.localization.currency ?? "";
    result.dateFormat = api.localization.date_format ?? "DD/MM/YYYY";
    result.language = api.localization.language ?? "en";
  }

  if (api.academic_calendar) {
    result.calendarType = api.academic_calendar.calendar_type ?? "";
    result.currentAcademicYear = api.academic_calendar.current_academic_year ?? "";
    result.terms = (api.academic_calendar.terms ?? []).map((t) => ({
      name: t.name,
      startDate: t.start_date,
      endDate: t.end_date,
    }));
  }

  if (api.grade_levels) {
    result.gradeLevelStructureId = api.grade_levels.grade_level_structure_id ?? "";
    result.gradeLevels = api.grade_levels.grade_levels ?? [];
    result.groupSections = api.grade_levels.group_sections ?? {};
    result.customGroupLevels = api.grade_levels.custom_group_levels ?? {};
  }

  if (api.grading) {
    result.gradingPresetId = api.grading.grading_preset_id ?? "";
    result.gradingScale = (api.grading.grading_scale ?? []).map((g) => ({
      grade: g.grade ?? "",
      minScore: g.min_score ?? "",
      maxScore: g.max_score ?? "",
      descriptor: g.descriptor,
      gpaPoints: g.gpa_points,
    }));
    result.caWeight = String(api.grading.ca_weight ?? "40");
    result.examWeight = String(api.grading.exam_weight ?? "60");
    result.passmark = String(api.grading.passmark ?? "40");
    result.gpaEnabled = api.grading.gpa_enabled ?? false;
    if (api.grading.assignment_weight != null) result.assignmentWeight = String(api.grading.assignment_weight);
    if (api.grading.test_weight != null) result.testWeight = String(api.grading.test_weight);
    if (api.grading.project_weight != null) result.projectWeight = String(api.grading.project_weight);
  }

  if (api.schedule) {
    const schedules: Record<string, DivisionSchedule> = {};
    for (const [div, s] of Object.entries(api.schedule.schedules ?? {})) {
      schedules[div] = {
        startTime: s.start_time,
        endTime: s.end_time,
        periodDuration: String(s.period_duration),
        periods: (s.periods ?? []).map((p) => ({
          label: p.label,
          startTime: p.start_time,
          endTime: p.end_time,
          isBreak: p.is_break,
        })),
      };
    }
    result.schedules = schedules;
  }

  if (api.subjects) {
    result.subjects = api.subjects.subjects ?? [];
    result.subjectDepartments = api.subjects.subject_departments ?? {};
  }

  if (api.fees) {
    result.feeCategories = (api.fees.fee_categories ?? []).map((f) => ({
      name: f.name,
      mandatory: f.mandatory,
      frequency: (f.frequency ?? "per_term") as FeeCategory["frequency"],
      feeType: (f.fee_type ?? "tuition") as FeeCategory["feeType"],
      appliesTo: f.applies_to as "all" | "specific",
      gradeLevels: f.grade_levels,
      amounts: f.amounts,
    }));
    result.feePaymentSchedule = (api.fees.fee_payment_schedule ?? "start_of_term") as SetupData["feePaymentSchedule"];
    result.feePaymentDueDay = api.fees.fee_payment_due_day ?? "";
    result.lateFeePercentage = api.fees.late_fee_percentage ?? "";
    result.lateFeeGraceDays = api.fees.late_fee_grace_days ?? "7";
    result.discountTypes = (api.fees.discount_types ?? []).map((d) => ({
      name: d.name, percentage: d.percentage, appliesTo: d.applies_to as "tuition" | "all",
    }));
  }

  if (api.report_card) {
    result.reportTemplate = api.report_card.report_template ?? "standard";
    result.showAssessmentBreakdown = api.report_card.show_assessment_breakdown ?? true;
    result.showClassAverage = api.report_card.show_class_average ?? true;
    result.showHighestLowest = api.report_card.show_highest_lowest ?? true;
    result.showGradingLegend = api.report_card.show_grading_legend ?? true;
    result.showPosition = api.report_card.show_position ?? true;
    result.showGPA = api.report_card.show_gpa ?? false;
    result.showEffortGrades = api.report_card.show_effort_grades ?? false;
    result.showBehaviorRating = api.report_card.show_behavior_rating ?? true;
    result.showPsychomotor = api.report_card.show_psychomotor ?? true;
    result.psychomotorTraits = api.report_card.psychomotor_traits ?? ["Handwriting", "Verbal Fluency", "Creativity", "Sports", "Musical Skills"];
    result.showAffective = api.report_card.show_affective ?? true;
    result.affectiveTraits = api.report_card.affective_traits ?? ["Punctuality", "Neatness", "Attentiveness", "Honesty", "Politeness", "Perseverance", "Sociability", "Self-control"];
    result.showTeacherComments = api.report_card.show_teacher_comments ?? true;
    result.showClassTeacherComment = api.report_card.show_class_teacher_comment ?? true;
    result.showPrincipalSignature = api.report_card.show_principal_signature ?? true;
    result.showSubjectTeacherSignature = api.report_card.show_subject_teacher_signature ?? false;
    result.commentCharLimit = api.report_card.comment_char_limit ?? "200";
    result.showAttendanceSummary = api.report_card.show_attendance_summary ?? true;
    result.showNextTermDates = api.report_card.show_next_term_dates ?? true;
    result.showCoCurricular = api.report_card.show_co_curricular ?? false;
  }

  if (api.policies) {
    // Attendance
    result.attendanceTrackingMethods = (api.policies.attendance_tracking_methods ?? {}) as Record<string, "daily" | "per_subject">;
    result.lateGracePeriod = String(api.policies.late_grace_period ?? "15");
    result.attendanceThreshold = String(api.policies.attendance_threshold ?? "75");
    result.tardiesToAbsence = String(api.policies.tardies_to_absence ?? "3");
    result.consecutiveAbsenceAlert = String(api.policies.consecutive_absence_alert ?? "3");
    result.absenceCategories = api.policies.absence_categories ?? ["Excused", "Unexcused", "Medical", "School Activity", "Suspended"];
    // Promotion
    result.promotionCriteria = api.policies.promotion_criteria ?? "automatic";
    result.promotionRules = {
      minSubjectsToPass: (typeof api.policies.promotion_rules?.min_subjects_to_pass === "object" && api.policies.promotion_rules?.min_subjects_to_pass !== null ? api.policies.promotion_rules.min_subjects_to_pass as Record<string, string> : {}),
      overallPassPercentage: String(api.policies.promotion_rules?.overall_pass_percentage ?? "40"),
      requiredSubjects: api.policies.promotion_rules?.required_subjects ?? [],
      allowRemedial: api.policies.promotion_rules?.allow_remedial ?? true,
      maxSubjectsForSupplementary: String(api.policies.promotion_rules?.max_subjects_for_supplementary ?? "2"),
      conditionalPromotion: api.policies.promotion_rules?.conditional_promotion ?? true,
      maxRepeats: String(api.policies.promotion_rules?.max_repeats ?? "1"),
    };
    // Discipline
    result.disciplineFramework = api.policies.discipline_framework ?? "merit_demerit";
    result.offenseCategories = api.policies.offense_categories ?? [];
    result.consequenceLadder = api.policies.consequence_ladder ?? [];
    result.pointResetPeriod = api.policies.point_reset_period ?? "per_term";
    // Notifications
    result.parentPortal = api.policies.parent_portal ?? true;
    result.reportComments = api.policies.report_comments ?? true;
    result.attendanceAlerts = api.policies.attendance_alerts ?? true;
    result.feeReminders = api.policies.fee_reminders ?? true;
    result.examResultNotify = api.policies.exam_result_notify ?? true;
    result.behaviorAlerts = api.policies.behavior_alerts ?? true;
    result.homeworkAlerts = api.policies.homework_alerts ?? false;
    result.notificationChannels = api.policies.notification_channels ?? ["email"];
  }

  return result;
}

// ---------------------------------------------------------------------------
// Frontend → API mapper (flat camelCase → sectioned snake_case)
// ---------------------------------------------------------------------------

type SectionExtractor = (d: SetupData) => Record<string, unknown>;

const SECTION_EXTRACTORS: Record<string, SectionExtractor> = {
  identity: (d) => ({
    school_type: d.schoolType,
    ownership_type: d.ownershipType,
    motto: d.motto,
    founded_year: d.foundedYear,
    accreditation_number: d.accreditationNumber,
    admission_number_prefix: d.admissionNumberPrefix,
  }),
  branding: (d) => ({
    logo_url: d.logoUrl,
    primary_color: d.primaryColor,
    secondary_color: d.secondaryColor,
  }),
  location: (d) => ({
    country: d.country,
    state_region: d.stateRegion,
    city: d.city,
    timezone: d.timezone,
  }),
  localization: (d) => ({
    currency: d.currency,
    date_format: d.dateFormat,
    language: d.language,
  }),
  academic_calendar: (d) => ({
    calendar_type: d.calendarType,
    current_academic_year: d.currentAcademicYear,
    terms: d.terms.map((t) => ({
      name: t.name,
      start_date: t.startDate,
      end_date: t.endDate,
    })),
  }),
  grade_levels: (d) => ({
    grade_level_structure_id: d.gradeLevelStructureId,
    grade_levels: d.gradeLevels,
    group_sections: d.groupSections,
    custom_group_levels: d.customGroupLevels,
  }),
  grading: (d) => ({
    grading_preset_id: d.gradingPresetId,
    grading_scale: d.gradingScale.map((g) => ({
      grade: g.grade,
      min_score: g.minScore,
      max_score: g.maxScore,
      descriptor: g.descriptor,
      gpa_points: g.gpaPoints,
    })),
    ca_weight: d.caWeight,
    exam_weight: d.examWeight,
    passmark: d.passmark,
    gpa_enabled: d.gpaEnabled,
    assignment_weight: d.assignmentWeight,
    test_weight: d.testWeight,
    project_weight: d.projectWeight,
  }),
  schedule: (d) => ({
    schedules: Object.fromEntries(
      Object.entries(d.schedules).map(([div, s]) => [
        div,
        {
          start_time: s.startTime,
          end_time: s.endTime,
          period_duration: s.periodDuration,
          periods: s.periods.map((p) => ({
            label: p.label,
            start_time: p.startTime,
            end_time: p.endTime,
            is_break: p.isBreak,
          })),
        },
      ])
    ),
  }),
  subjects: (d) => ({
    subjects: d.subjects,
    subject_departments: d.subjectDepartments,
  }),
  fees: (d) => ({
    fee_categories: d.feeCategories.map((f) => ({
      name: f.name,
      mandatory: f.mandatory,
      frequency: f.frequency,
      fee_type: f.feeType,
      applies_to: f.appliesTo,
      grade_levels: f.gradeLevels,
      amounts: f.amounts,
    })),
    fee_payment_schedule: d.feePaymentSchedule,
    fee_payment_due_day: d.feePaymentDueDay,
    late_fee_percentage: d.lateFeePercentage,
    late_fee_grace_days: d.lateFeeGraceDays,
    discount_types: d.discountTypes.map((dt) => ({
      name: dt.name, percentage: dt.percentage, applies_to: dt.appliesTo,
    })),
  }),
  report_card: (d) => ({
    report_template: d.reportTemplate,
    show_assessment_breakdown: d.showAssessmentBreakdown,
    show_class_average: d.showClassAverage,
    show_highest_lowest: d.showHighestLowest,
    show_grading_legend: d.showGradingLegend,
    show_position: d.showPosition,
    show_gpa: d.showGPA,
    show_effort_grades: d.showEffortGrades,
    show_behavior_rating: d.showBehaviorRating,
    show_psychomotor: d.showPsychomotor,
    psychomotor_traits: d.psychomotorTraits,
    show_affective: d.showAffective,
    affective_traits: d.affectiveTraits,
    show_teacher_comments: d.showTeacherComments,
    show_class_teacher_comment: d.showClassTeacherComment,
    show_principal_signature: d.showPrincipalSignature,
    show_subject_teacher_signature: d.showSubjectTeacherSignature,
    comment_char_limit: d.commentCharLimit,
    show_attendance_summary: d.showAttendanceSummary,
    show_next_term_dates: d.showNextTermDates,
    show_co_curricular: d.showCoCurricular,
  }),
  policies: (d) => ({
    // Attendance
    attendance_tracking_methods: d.attendanceTrackingMethods,
    late_grace_period: d.lateGracePeriod,
    attendance_threshold: d.attendanceThreshold,
    tardies_to_absence: d.tardiesToAbsence,
    consecutive_absence_alert: d.consecutiveAbsenceAlert,
    absence_categories: d.absenceCategories,
    // Promotion
    promotion_criteria: d.promotionCriteria,
    promotion_rules: {
      min_subjects_to_pass: d.promotionRules.minSubjectsToPass,
      overall_pass_percentage: d.promotionRules.overallPassPercentage,
      required_subjects: d.promotionRules.requiredSubjects,
      allow_remedial: d.promotionRules.allowRemedial,
      max_subjects_for_supplementary: d.promotionRules.maxSubjectsForSupplementary,
      conditional_promotion: d.promotionRules.conditionalPromotion,
      max_repeats: d.promotionRules.maxRepeats,
    },
    // Discipline
    discipline_framework: d.disciplineFramework,
    offense_categories: d.offenseCategories,
    consequence_ladder: d.consequenceLadder,
    point_reset_period: d.pointResetPeriod,
    // Notifications
    parent_portal: d.parentPortal,
    report_comments: d.reportComments,
    attendance_alerts: d.attendanceAlerts,
    fee_reminders: d.feeReminders,
    exam_result_notify: d.examResultNotify,
    behavior_alerts: d.behaviorAlerts,
    homework_alerts: d.homeworkAlerts,
    notification_channels: d.notificationChannels,
  }),
};

function setupDataToApiSections(current: SetupData, previous: SetupData): PatchSetupRequest {
  const patch: PatchSetupRequest = {};
  for (const [section, extract] of Object.entries(SECTION_EXTRACTORS)) {
    const currentSection = JSON.stringify(extract(current));
    const previousSection = JSON.stringify(extract(previous));
    if (currentSection !== previousSection) {
      (patch as Record<string, unknown>)[section] = extract(current);
    }
  }
  return patch;
}

// ---------------------------------------------------------------------------
// useSchoolSetup hook
// ---------------------------------------------------------------------------

export function useSchoolSetup() {
  const queryClient = useQueryClient();

  // Fetch saved draft from API
  const query = useQuery<GetSetupResponse, ApiError>({
    queryKey: SETUP_QUERY_KEY,
    queryFn: schoolApi.getSetup,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
  });

  // Derive flat SetupData from API response
  const serverData = useMemo<SetupData>(() => {
    if (!query.data?.data) return DEFAULT_DATA;
    return { ...DEFAULT_DATA, ...apiToSetupData(query.data.data) };
  }, [query.data]);

  // Local state for in-progress edits
  const [localData, setLocalData] = useState<SetupData>(DEFAULT_DATA);
  const [initialized, setInitialized] = useState(false);

  // Sync server data into local state on first load (success or error)
  useEffect(() => {
    if (!initialized && !query.isLoading) {
      setLocalData(query.isSuccess ? serverData : DEFAULT_DATA);
      setInitialized(true);
    }
  }, [query.isLoading, query.isSuccess, serverData, initialized]);

  // Track previous saved state for diffing
  const previousDataRef = useRef<SetupData>(DEFAULT_DATA);
  useEffect(() => {
    if (initialized) previousDataRef.current = serverData;
  }, [serverData, initialized]);

  // Save mutation
  const saveMutation = useMutation<GetSetupResponse, ApiError, SetupData>({
    mutationFn: (data: SetupData) => {
      const patch = setupDataToApiSections(data, previousDataRef.current);
      if (Object.keys(patch).length === 0) return Promise.resolve(query.data!);
      return schoolApi.patchSetup(patch);
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(SETUP_QUERY_KEY, response);
      previousDataRef.current = variables;
    },
  });

  // Update single field
  const update = useCallback(<K extends keyof SetupData>(key: K, value: SetupData[K]) => {
    setLocalData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Explicit save
  const save = useCallback(() => {
    saveMutation.mutate(localData);
  }, [localData, saveMutation]);

  // Auto-save safety net (2s after last edit)
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!initialized) return;
    clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      const patch = setupDataToApiSections(localData, previousDataRef.current);
      if (Object.keys(patch).length > 0) {
        saveMutation.mutate(localData);
      }
    }, 2_000);
    return () => clearTimeout(autoSaveRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData, initialized]);

  return {
    data: initialized ? localData : DEFAULT_DATA,
    setData: setLocalData,
    update,
    save,
    isLoading: !initialized && query.isLoading,
    isSaving: saveMutation.isPending,
    isSuccess: saveMutation.isSuccess,
    saveError: saveMutation.error,
    completion: query.data?.completion ?? null,
  };
}

// ---------------------------------------------------------------------------
// usePublicBranding hook
// ---------------------------------------------------------------------------

export function usePublicBranding(slug: string | null) {
  return useQuery<PublicSchoolBranding, ApiError>({
    queryKey: BRANDING_QUERY_KEY(slug ?? ""),
    queryFn: () => { if (!slug) throw new Error("missing slug"); return schoolApi.getPublicBranding(slug); },
    enabled: !!slug,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: 1,
  });
}
