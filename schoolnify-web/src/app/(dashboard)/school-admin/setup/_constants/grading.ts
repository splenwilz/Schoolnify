/**
 * Grading scale presets and assessment structure presets.
 *
 * GRADING_PRESETS — 27 regional/curriculum grading scales.
 * ASSESSMENT_PRESETS — CA/Exam/component weight defaults by region.
 *
 * Each preset has `relevantFor` matching GRADE_LEVEL_STRUCTURES.id so the UI
 * can auto-recommend the right preset.
 */

import type { GradeRow } from "../_components/setup-types";

// ---------------------------------------------------------------------------
// Grading scale presets
// ---------------------------------------------------------------------------

export interface GradingPreset {
  id: string;
  label: string;
  region: string;
  description: string;
  passmark: string;
  /** Grade level structure IDs this preset is recommended for */
  relevantFor: string[];
  /**
   * "numeric" = percentage with letter/number grades (default)
   * "descriptive" = qualitative labels only (EY, PYP, Standards-based)
   */
  reportingMode?: "numeric" | "descriptive";
  grades: GradeRow[];
}

export const GRADING_PRESETS: GradingPreset[] = [
  // ----- West Africa -----
  {
    id: "waec",
    label: "WAEC / NECO",
    region: "Nigeria / West Africa",
    description: "West African Examinations Council (A1 to F9)",
    passmark: "40",
    relevantFor: ["ng_6334", "gh_jhs_shs"],
    grades: [
      { grade: "A1", minScore: "75", maxScore: "100", descriptor: "Excellent", gpaPoints: "4.0" },
      { grade: "B2", minScore: "70", maxScore: "74", descriptor: "Very Good", gpaPoints: "3.5" },
      { grade: "B3", minScore: "65", maxScore: "69", descriptor: "Good", gpaPoints: "3.0" },
      { grade: "C4", minScore: "60", maxScore: "64", descriptor: "Credit", gpaPoints: "2.5" },
      { grade: "C5", minScore: "55", maxScore: "59", descriptor: "Credit", gpaPoints: "2.0" },
      { grade: "C6", minScore: "50", maxScore: "54", descriptor: "Credit", gpaPoints: "1.5" },
      { grade: "D7", minScore: "45", maxScore: "49", descriptor: "Pass", gpaPoints: "1.0" },
      { grade: "E8", minScore: "40", maxScore: "44", descriptor: "Pass", gpaPoints: "0.5" },
      { grade: "F9", minScore: "0", maxScore: "39", descriptor: "Fail", gpaPoints: "0" },
    ],
  },
  {
    id: "ng_primary",
    label: "Nigerian Primary (A to F)",
    region: "Nigeria",
    description: "Common Nigerian primary and junior secondary grading",
    passmark: "40",
    relevantFor: ["ng_6334"],
    grades: [
      { grade: "A", minScore: "70", maxScore: "100", descriptor: "Excellent" },
      { grade: "B", minScore: "60", maxScore: "69", descriptor: "Very Good" },
      { grade: "C", minScore: "50", maxScore: "59", descriptor: "Good" },
      { grade: "D", minScore: "45", maxScore: "49", descriptor: "Fair" },
      { grade: "E", minScore: "40", maxScore: "44", descriptor: "Poor" },
      { grade: "F", minScore: "0", maxScore: "39", descriptor: "Fail" },
    ],
  },
  {
    id: "ng_nursery",
    label: "Nigerian Nursery (Descriptive)",
    region: "Nigeria",
    description: "Early years descriptive assessment",
    passmark: "0",
    relevantFor: ["ng_6334"],
    reportingMode: "descriptive",
    grades: [
      { grade: "Excellent", minScore: "80", maxScore: "100", descriptor: "Outstanding performance" },
      { grade: "Very Good", minScore: "65", maxScore: "79", descriptor: "Above expectations" },
      { grade: "Good", minScore: "50", maxScore: "64", descriptor: "Meets expectations" },
      { grade: "Fair", minScore: "40", maxScore: "49", descriptor: "Needs improvement" },
      { grade: "Poor", minScore: "0", maxScore: "39", descriptor: "Below expectations" },
    ],
  },
  {
    id: "gh_waec",
    label: "Ghana WASSCE",
    region: "Ghana",
    description: "WASSCE grading for Ghanaian schools (A1 to F9)",
    passmark: "50",
    relevantFor: ["gh_jhs_shs"],
    grades: [
      { grade: "A1", minScore: "80", maxScore: "100", descriptor: "Excellent", gpaPoints: "4.0" },
      { grade: "B2", minScore: "75", maxScore: "79", descriptor: "Very Good", gpaPoints: "3.5" },
      { grade: "B3", minScore: "70", maxScore: "74", descriptor: "Good", gpaPoints: "3.0" },
      { grade: "C4", minScore: "65", maxScore: "69", descriptor: "Credit", gpaPoints: "2.5" },
      { grade: "C5", minScore: "60", maxScore: "64", descriptor: "Credit", gpaPoints: "2.0" },
      { grade: "C6", minScore: "55", maxScore: "59", descriptor: "Credit", gpaPoints: "1.5" },
      { grade: "D7", minScore: "50", maxScore: "54", descriptor: "Pass", gpaPoints: "1.0" },
      { grade: "E8", minScore: "40", maxScore: "49", descriptor: "Weak Pass", gpaPoints: "0.5" },
      { grade: "F9", minScore: "0", maxScore: "39", descriptor: "Fail", gpaPoints: "0" },
    ],
  },

  // ----- East & Southern Africa -----
  {
    id: "ke_kcse",
    label: "Kenya KCSE",
    region: "Kenya",
    description: "Kenya Certificate of Secondary Education (A to E)",
    passmark: "30",
    relevantFor: ["ke_844"],
    grades: [
      { grade: "A", minScore: "80", maxScore: "100", descriptor: "Excellent" },
      { grade: "A-", minScore: "75", maxScore: "79", descriptor: "Very Good" },
      { grade: "B+", minScore: "70", maxScore: "74", descriptor: "Good" },
      { grade: "B", minScore: "65", maxScore: "69", descriptor: "Good" },
      { grade: "B-", minScore: "60", maxScore: "64", descriptor: "Above Average" },
      { grade: "C+", minScore: "55", maxScore: "59", descriptor: "Average" },
      { grade: "C", minScore: "50", maxScore: "54", descriptor: "Average" },
      { grade: "C-", minScore: "45", maxScore: "49", descriptor: "Below Average" },
      { grade: "D+", minScore: "40", maxScore: "44", descriptor: "Weak" },
      { grade: "D", minScore: "35", maxScore: "39", descriptor: "Weak" },
      { grade: "D-", minScore: "30", maxScore: "34", descriptor: "Very Weak" },
      { grade: "E", minScore: "0", maxScore: "29", descriptor: "Fail" },
    ],
  },
  {
    id: "za_nsc",
    label: "South Africa NSC (7-point)",
    region: "South Africa",
    description: "National Senior Certificate CAPS 7-point scale",
    passmark: "30",
    relevantFor: ["za_grade"],
    grades: [
      { grade: "7", minScore: "80", maxScore: "100", descriptor: "Outstanding" },
      { grade: "6", minScore: "70", maxScore: "79", descriptor: "Meritorious" },
      { grade: "5", minScore: "60", maxScore: "69", descriptor: "Substantial" },
      { grade: "4", minScore: "50", maxScore: "59", descriptor: "Adequate" },
      { grade: "3", minScore: "40", maxScore: "49", descriptor: "Moderate" },
      { grade: "2", minScore: "30", maxScore: "39", descriptor: "Elementary" },
      { grade: "1", minScore: "0", maxScore: "29", descriptor: "Not Achieved" },
    ],
  },

  // ----- United Kingdom -----
  {
    id: "uk_gcse",
    label: "UK GCSE (9 to 1)",
    region: "United Kingdom",
    description: "England GCSE numerical grading scale",
    passmark: "40",
    relevantFor: ["uk_year"],
    grades: [
      { grade: "9", minScore: "90", maxScore: "100", descriptor: "Exceptional" },
      { grade: "8", minScore: "80", maxScore: "89", descriptor: "Well Above Expected" },
      { grade: "7", minScore: "70", maxScore: "79", descriptor: "Above Expected" },
      { grade: "6", minScore: "60", maxScore: "69", descriptor: "Strong Pass" },
      { grade: "5", minScore: "50", maxScore: "59", descriptor: "Strong Pass" },
      { grade: "4", minScore: "40", maxScore: "49", descriptor: "Standard Pass" },
      { grade: "3", minScore: "30", maxScore: "39", descriptor: "Below Pass" },
      { grade: "2", minScore: "20", maxScore: "29", descriptor: "Low" },
      { grade: "1", minScore: "0", maxScore: "19", descriptor: "Very Low" },
    ],
  },
  {
    id: "uk_primary",
    label: "UK Primary (Descriptive)",
    region: "United Kingdom",
    description: "KS1/KS2 standards-based assessment",
    passmark: "0",
    relevantFor: ["uk_year"],
    reportingMode: "descriptive",
    grades: [
      { grade: "GDS", minScore: "85", maxScore: "100", descriptor: "Working at Greater Depth" },
      { grade: "EXS", minScore: "50", maxScore: "84", descriptor: "Working at Expected Standard" },
      { grade: "WTS", minScore: "20", maxScore: "49", descriptor: "Working Towards Expected Standard" },
      { grade: "PKS", minScore: "0", maxScore: "19", descriptor: "Pre-Key Stage / Below" },
    ],
  },

  // ----- Cambridge International -----
  {
    id: "cambridge_igcse",
    label: "Cambridge IGCSE",
    region: "International",
    description: "Cambridge International IGCSE (A* to G, U)",
    passmark: "30",
    relevantFor: ["uk_year", "ib"],
    grades: [
      { grade: "A*", minScore: "90", maxScore: "100", descriptor: "Exceptional" },
      { grade: "A", minScore: "80", maxScore: "89", descriptor: "Very Good" },
      { grade: "B", minScore: "70", maxScore: "79", descriptor: "Good" },
      { grade: "C", minScore: "60", maxScore: "69", descriptor: "Competent" },
      { grade: "D", minScore: "50", maxScore: "59", descriptor: "Satisfactory" },
      { grade: "E", minScore: "40", maxScore: "49", descriptor: "Sufficient" },
      { grade: "F", minScore: "30", maxScore: "39", descriptor: "Weak" },
      { grade: "G", minScore: "20", maxScore: "29", descriptor: "Very Weak" },
      { grade: "U", minScore: "0", maxScore: "19", descriptor: "Ungraded" },
    ],
  },
  {
    id: "cambridge_alevel",
    label: "Cambridge A-Level",
    region: "International",
    description: "Cambridge International A-Level (A* to E, U)",
    passmark: "40",
    relevantFor: ["uk_year"],
    grades: [
      { grade: "A*", minScore: "90", maxScore: "100", descriptor: "Exceptional" },
      { grade: "A", minScore: "80", maxScore: "89", descriptor: "Very Good" },
      { grade: "B", minScore: "70", maxScore: "79", descriptor: "Good" },
      { grade: "C", minScore: "60", maxScore: "69", descriptor: "Competent" },
      { grade: "D", minScore: "50", maxScore: "59", descriptor: "Satisfactory" },
      { grade: "E", minScore: "40", maxScore: "49", descriptor: "Minimum Pass" },
      { grade: "U", minScore: "0", maxScore: "39", descriptor: "Ungraded" },
    ],
  },

  // ----- United States -----
  {
    id: "us_letter",
    label: "US Letter Grade (4.0 GPA)",
    region: "United States",
    description: "Standard A to F letter grading with plus/minus",
    passmark: "60",
    relevantFor: ["us_k12"],
    grades: [
      { grade: "A+", minScore: "97", maxScore: "100", descriptor: "Exceptional", gpaPoints: "4.0" },
      { grade: "A", minScore: "93", maxScore: "96", descriptor: "Excellent", gpaPoints: "4.0" },
      { grade: "A-", minScore: "90", maxScore: "92", descriptor: "Excellent", gpaPoints: "3.7" },
      { grade: "B+", minScore: "87", maxScore: "89", descriptor: "Very Good", gpaPoints: "3.3" },
      { grade: "B", minScore: "83", maxScore: "86", descriptor: "Good", gpaPoints: "3.0" },
      { grade: "B-", minScore: "80", maxScore: "82", descriptor: "Good", gpaPoints: "2.7" },
      { grade: "C+", minScore: "77", maxScore: "79", descriptor: "Satisfactory", gpaPoints: "2.3" },
      { grade: "C", minScore: "73", maxScore: "76", descriptor: "Average", gpaPoints: "2.0" },
      { grade: "C-", minScore: "70", maxScore: "72", descriptor: "Below Average", gpaPoints: "1.7" },
      { grade: "D+", minScore: "67", maxScore: "69", descriptor: "Weak", gpaPoints: "1.3" },
      { grade: "D", minScore: "63", maxScore: "66", descriptor: "Barely Passing", gpaPoints: "1.0" },
      { grade: "D-", minScore: "60", maxScore: "62", descriptor: "Minimum Pass", gpaPoints: "0.7" },
      { grade: "F", minScore: "0", maxScore: "59", descriptor: "Fail", gpaPoints: "0" },
    ],
  },
  {
    id: "us_standards",
    label: "US Standards-Based",
    region: "United States",
    description: "Mastery-based assessment (Exceeds / Meets / Approaches / Below)",
    passmark: "0",
    relevantFor: ["us_k12"],
    reportingMode: "descriptive",
    grades: [
      { grade: "4", minScore: "90", maxScore: "100", descriptor: "Exceeds Standard" },
      { grade: "3", minScore: "70", maxScore: "89", descriptor: "Meets Standard" },
      { grade: "2", minScore: "50", maxScore: "69", descriptor: "Approaching Standard" },
      { grade: "1", minScore: "0", maxScore: "49", descriptor: "Below Standard" },
    ],
  },

  // ----- Canada -----
  {
    id: "ca_ontario",
    label: "Canada Ontario (4-Level)",
    region: "Canada",
    description: "Ontario achievement levels (Level 3 = provincial standard)",
    passmark: "50",
    relevantFor: [],
    grades: [
      { grade: "Level 4+", minScore: "95", maxScore: "100", descriptor: "Surpassing Standard" },
      { grade: "Level 4", minScore: "80", maxScore: "94", descriptor: "Above Standard" },
      { grade: "Level 3", minScore: "70", maxScore: "79", descriptor: "Provincial Standard" },
      { grade: "Level 2", minScore: "60", maxScore: "69", descriptor: "Approaching Standard" },
      { grade: "Level 1", minScore: "50", maxScore: "59", descriptor: "Below Standard" },
      { grade: "R", minScore: "0", maxScore: "49", descriptor: "Remediation Required" },
    ],
  },

  // ----- Australia -----
  {
    id: "au_ae",
    label: "Australia (A to E)",
    region: "Australia",
    description: "National reporting framework (A to E scale)",
    passmark: "50",
    relevantFor: [],
    grades: [
      { grade: "A", minScore: "85", maxScore: "100", descriptor: "Excellent" },
      { grade: "B", minScore: "70", maxScore: "84", descriptor: "Good" },
      { grade: "C", minScore: "50", maxScore: "69", descriptor: "Satisfactory" },
      { grade: "D", minScore: "25", maxScore: "49", descriptor: "Limited" },
      { grade: "E", minScore: "0", maxScore: "24", descriptor: "Very Limited" },
    ],
  },

  // ----- Europe -----
  {
    id: "fr_20point",
    label: "France / Francophone (20-point)",
    region: "France / Francophone Africa",
    description: "French barème sur 20 scale",
    passmark: "50",
    relevantFor: ["fr_cycle"],
    grades: [
      { grade: "Excellent", minScore: "80", maxScore: "100", descriptor: "16-20/20: Très Bien" },
      { grade: "Good", minScore: "70", maxScore: "79", descriptor: "14-15/20: Bien" },
      { grade: "Fair", minScore: "60", maxScore: "69", descriptor: "12-13/20: Assez Bien" },
      { grade: "Pass", minScore: "50", maxScore: "59", descriptor: "10-11/20: Passable" },
      { grade: "Fail", minScore: "0", maxScore: "49", descriptor: "Below 10/20: Insuffisant" },
    ],
  },
  {
    id: "de_6point",
    label: "Germany (1 to 6)",
    region: "Germany",
    description: "German Gymnasium scale (1 = best, 6 = fail)",
    passmark: "50",
    relevantFor: [],
    grades: [
      { grade: "1", minScore: "90", maxScore: "100", descriptor: "Sehr Gut (Very Good)" },
      { grade: "2", minScore: "75", maxScore: "89", descriptor: "Gut (Good)" },
      { grade: "3", minScore: "60", maxScore: "74", descriptor: "Befriedigend (Satisfactory)" },
      { grade: "4", minScore: "50", maxScore: "59", descriptor: "Ausreichend (Sufficient)" },
      { grade: "5", minScore: "30", maxScore: "49", descriptor: "Mangelhaft (Poor)" },
      { grade: "6", minScore: "0", maxScore: "29", descriptor: "Ungenügend (Insufficient)" },
    ],
  },
  {
    id: "ru_5point",
    label: "Russia / CIS (5-point)",
    region: "Russia / CIS",
    description: "Russian 5-point scale (5 = highest, 2 = fail)",
    passmark: "60",
    relevantFor: [],
    grades: [
      { grade: "5", minScore: "85", maxScore: "100", descriptor: "Excellent" },
      { grade: "4", minScore: "70", maxScore: "84", descriptor: "Good" },
      { grade: "3", minScore: "60", maxScore: "69", descriptor: "Satisfactory" },
      { grade: "2", minScore: "0", maxScore: "59", descriptor: "Unsatisfactory" },
    ],
  },
  {
    id: "es_10point",
    label: "Spain (10-point)",
    region: "Spain / Latin America",
    description: "10-point grading scale",
    passmark: "50",
    relevantFor: [],
    grades: [
      { grade: "MH", minScore: "95", maxScore: "100", descriptor: "Matrícula de Honor" },
      { grade: "SB", minScore: "90", maxScore: "94", descriptor: "Sobresaliente" },
      { grade: "NT", minScore: "70", maxScore: "89", descriptor: "Notable" },
      { grade: "BI", minScore: "60", maxScore: "69", descriptor: "Bien" },
      { grade: "SU", minScore: "50", maxScore: "59", descriptor: "Suficiente" },
      { grade: "IN", minScore: "0", maxScore: "49", descriptor: "Insuficiente" },
    ],
  },

  // ----- Asia -----
  {
    id: "jp_5point",
    label: "Japan (5-point)",
    region: "Japan",
    description: "Japanese primary/secondary 5-point scale",
    passmark: "40",
    relevantFor: [],
    grades: [
      { grade: "5", minScore: "85", maxScore: "100", descriptor: "Outstanding" },
      { grade: "4", minScore: "70", maxScore: "84", descriptor: "Good" },
      { grade: "3", minScore: "50", maxScore: "69", descriptor: "Satisfactory" },
      { grade: "2", minScore: "35", maxScore: "49", descriptor: "Needs Improvement" },
      { grade: "1", minScore: "0", maxScore: "34", descriptor: "Unsatisfactory" },
    ],
  },
  {
    id: "in_cbse",
    label: "CBSE India (9-point)",
    region: "India",
    description: "CBSE 9-point grading scale",
    passmark: "33",
    relevantFor: [],
    grades: [
      { grade: "A1", minScore: "91", maxScore: "100", descriptor: "Outstanding", gpaPoints: "10" },
      { grade: "A2", minScore: "81", maxScore: "90", descriptor: "Excellent", gpaPoints: "9" },
      { grade: "B1", minScore: "71", maxScore: "80", descriptor: "Very Good", gpaPoints: "8" },
      { grade: "B2", minScore: "61", maxScore: "70", descriptor: "Good", gpaPoints: "7" },
      { grade: "C1", minScore: "51", maxScore: "60", descriptor: "Above Average", gpaPoints: "6" },
      { grade: "C2", minScore: "41", maxScore: "50", descriptor: "Average", gpaPoints: "5" },
      { grade: "D", minScore: "33", maxScore: "40", descriptor: "Below Average", gpaPoints: "4" },
      { grade: "E1", minScore: "21", maxScore: "32", descriptor: "Needs Improvement", gpaPoints: "0" },
      { grade: "E2", minScore: "0", maxScore: "20", descriptor: "Fail", gpaPoints: "0" },
    ],
  },
  {
    id: "ph_k12",
    label: "Philippines K-12",
    region: "Philippines",
    description: "DepEd 4-level descriptive assessment",
    passmark: "75",
    relevantFor: [],
    grades: [
      { grade: "O", minScore: "90", maxScore: "100", descriptor: "Outstanding" },
      { grade: "VS", minScore: "85", maxScore: "89", descriptor: "Very Satisfactory" },
      { grade: "S", minScore: "80", maxScore: "84", descriptor: "Satisfactory" },
      { grade: "FS", minScore: "75", maxScore: "79", descriptor: "Fairly Satisfactory" },
      { grade: "DNM", minScore: "0", maxScore: "74", descriptor: "Did Not Meet Expectations" },
    ],
  },

  // ----- International -----
  {
    id: "ib_myp",
    label: "IB MYP (1 to 7)",
    region: "International (IB)",
    description: "IB Middle Years Programme 7-point scale",
    passmark: "30",
    relevantFor: ["ib"],
    grades: [
      { grade: "7", minScore: "90", maxScore: "100", descriptor: "Excellent" },
      { grade: "6", minScore: "75", maxScore: "89", descriptor: "Very Good" },
      { grade: "5", minScore: "60", maxScore: "74", descriptor: "Good" },
      { grade: "4", minScore: "50", maxScore: "59", descriptor: "Satisfactory" },
      { grade: "3", minScore: "35", maxScore: "49", descriptor: "Mediocre" },
      { grade: "2", minScore: "20", maxScore: "34", descriptor: "Poor" },
      { grade: "1", minScore: "0", maxScore: "19", descriptor: "Very Poor" },
    ],
  },
  {
    id: "ib_dp",
    label: "IB Diploma (1 to 7)",
    region: "International (IB)",
    description: "IB Diploma Programme 7-point scale (max 45 total)",
    passmark: "30",
    relevantFor: ["ib"],
    grades: [
      { grade: "7", minScore: "85", maxScore: "100", descriptor: "Excellent" },
      { grade: "6", minScore: "70", maxScore: "84", descriptor: "Very Good" },
      { grade: "5", minScore: "55", maxScore: "69", descriptor: "Good" },
      { grade: "4", minScore: "40", maxScore: "54", descriptor: "Satisfactory" },
      { grade: "3", minScore: "25", maxScore: "39", descriptor: "Mediocre" },
      { grade: "2", minScore: "10", maxScore: "24", descriptor: "Poor" },
      { grade: "1", minScore: "0", maxScore: "9", descriptor: "Very Poor" },
    ],
  },

  // ----- Caribbean -----
  {
    id: "csec",
    label: "Caribbean CSEC",
    region: "Caribbean",
    description: "CXC Caribbean Secondary Education Certificate (Grades I to VI)",
    passmark: "40",
    relevantFor: [],
    grades: [
      { grade: "I", minScore: "80", maxScore: "100", descriptor: "Distinction" },
      { grade: "II", minScore: "70", maxScore: "79", descriptor: "Upper Credit" },
      { grade: "III", minScore: "55", maxScore: "69", descriptor: "Lower Credit" },
      { grade: "IV", minScore: "40", maxScore: "54", descriptor: "General Proficiency" },
      { grade: "V", minScore: "25", maxScore: "39", descriptor: "Limited Proficiency" },
      { grade: "VI", minScore: "0", maxScore: "24", descriptor: "Not Awarded" },
    ],
  },

  // ----- Middle East -----
  {
    id: "uae_moe",
    label: "UAE MOE",
    region: "UAE / GCC",
    description: "UAE Ministry of Education grading",
    passmark: "60",
    relevantFor: [],
    grades: [
      { grade: "A+", minScore: "95", maxScore: "100", descriptor: "Outstanding" },
      { grade: "A", minScore: "85", maxScore: "94", descriptor: "Very Good" },
      { grade: "B", minScore: "70", maxScore: "84", descriptor: "Good" },
      { grade: "C", minScore: "60", maxScore: "69", descriptor: "Acceptable" },
      { grade: "D", minScore: "50", maxScore: "59", descriptor: "Weak" },
      { grade: "F", minScore: "0", maxScore: "49", descriptor: "Fail" },
    ],
  },

  // ----- Universal / Generic -----
  {
    id: "pass_fail",
    label: "Pass / Fail",
    region: "Universal",
    description: "Binary pass or fail",
    passmark: "50",
    relevantFor: [],
    grades: [
      { grade: "Pass", minScore: "50", maxScore: "100", descriptor: "Satisfactory" },
      { grade: "Fail", minScore: "0", maxScore: "49", descriptor: "Not Satisfactory" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    region: "Any",
    description: "Start from scratch with your own grading scale",
    passmark: "40",
    relevantFor: [],
    grades: [
      { grade: "A", minScore: "70", maxScore: "100", descriptor: "Excellent" },
      { grade: "B", minScore: "60", maxScore: "69", descriptor: "Good" },
      { grade: "C", minScore: "50", maxScore: "59", descriptor: "Average" },
      { grade: "D", minScore: "40", maxScore: "49", descriptor: "Below Average" },
      { grade: "F", minScore: "0", maxScore: "39", descriptor: "Fail" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Assessment structure presets (CA/Exam split + component weights)
// ---------------------------------------------------------------------------

export interface AssessmentPreset {
  id: string;
  label: string;
  region: string;
  description: string;
  /** Grade level structure IDs this assessment split is recommended for */
  relevantFor: string[];
  caWeight: string;
  examWeight: string;
  /** Breakdown of the CA portion */
  assignmentWeight: string;
  testWeight: string;
  projectWeight: string;
}

export const ASSESSMENT_PRESETS: AssessmentPreset[] = [
  {
    id: "wa_40_60",
    label: "West Africa Standard",
    region: "Nigeria / West Africa",
    description: "40% Continuous Assessment + 60% Exam",
    relevantFor: ["ng_6334", "gh_jhs_shs"],
    caWeight: "40",
    examWeight: "60",
    assignmentWeight: "10",
    testWeight: "20",
    projectWeight: "10",
  },
  {
    id: "wa_30_70",
    label: "West Africa (30/70)",
    region: "Nigeria / West Africa",
    description: "30% CA + 70% Exam (some senior secondary schools)",
    relevantFor: ["ng_6334"],
    caWeight: "30",
    examWeight: "70",
    assignmentWeight: "10",
    testWeight: "15",
    projectWeight: "5",
  },
  {
    id: "ke_cbc",
    label: "Kenya CBC",
    region: "Kenya",
    description: "60% Classroom Assessment + 40% National Exam",
    relevantFor: ["ke_844"],
    caWeight: "60",
    examWeight: "40",
    assignmentWeight: "20",
    testWeight: "25",
    projectWeight: "15",
  },
  {
    id: "za_sba",
    label: "South Africa CAPS",
    region: "South Africa",
    description: "25% School-Based Assessment + 75% End-of-Year",
    relevantFor: ["za_grade"],
    caWeight: "25",
    examWeight: "75",
    assignmentWeight: "10",
    testWeight: "10",
    projectWeight: "5",
  },
  {
    id: "us_weighted",
    label: "US Typical (Weighted)",
    region: "United States",
    description: "Homework, quizzes, tests, and final exams",
    relevantFor: ["us_k12"],
    caWeight: "60",
    examWeight: "40",
    assignmentWeight: "15",
    testWeight: "25",
    projectWeight: "20",
  },
  {
    id: "uk_terminal",
    label: "UK Terminal Exam",
    region: "United Kingdom",
    description: "Mostly terminal exams (NEA coursework varies by subject)",
    relevantFor: ["uk_year"],
    caWeight: "20",
    examWeight: "80",
    assignmentWeight: "5",
    testWeight: "10",
    projectWeight: "5",
  },
  {
    id: "in_cbse_secondary",
    label: "India CBSE (Secondary)",
    region: "India",
    description: "20% Internal + 80% Board Exam (Class 10)",
    relevantFor: [],
    caWeight: "20",
    examWeight: "80",
    assignmentWeight: "5",
    testWeight: "10",
    projectWeight: "5",
  },
  {
    id: "in_cbse_senior",
    label: "India CBSE (Senior Secondary)",
    region: "India",
    description: "30% Internal + 70% Board Exam (Class 11-12)",
    relevantFor: [],
    caWeight: "30",
    examWeight: "70",
    assignmentWeight: "10",
    testWeight: "15",
    projectWeight: "5",
  },
  {
    id: "ib_standard",
    label: "IB Internal / External",
    region: "International (IB)",
    description: "25% Internal Assessment + 75% External Exam (varies by subject)",
    relevantFor: ["ib"],
    caWeight: "25",
    examWeight: "75",
    assignmentWeight: "10",
    testWeight: "10",
    projectWeight: "5",
  },
  {
    id: "ph_deped",
    label: "Philippines DepEd",
    region: "Philippines",
    description: "Written Work 25%, Performance 50%, Quarterly Assessment 25%",
    relevantFor: [],
    caWeight: "75",
    examWeight: "25",
    assignmentWeight: "25",
    testWeight: "25",
    projectWeight: "25",
  },
  {
    id: "fr_controle",
    label: "France / Francophone",
    region: "France / Francophone",
    description: "60% Continuous Control + 40% Terminal Exam",
    relevantFor: ["fr_cycle"],
    caWeight: "60",
    examWeight: "40",
    assignmentWeight: "20",
    testWeight: "25",
    projectWeight: "15",
  },
  {
    id: "balanced_50_50",
    label: "Balanced (50/50)",
    region: "Universal",
    description: "Equal weight between continuous and exams",
    relevantFor: [],
    caWeight: "50",
    examWeight: "50",
    assignmentWeight: "15",
    testWeight: "20",
    projectWeight: "15",
  },
  {
    id: "ca_only",
    label: "100% Continuous Assessment",
    region: "Universal",
    description: "No terminal exam; all assessment is ongoing",
    relevantFor: [],
    caWeight: "100",
    examWeight: "0",
    assignmentWeight: "30",
    testWeight: "40",
    projectWeight: "30",
  },
];
