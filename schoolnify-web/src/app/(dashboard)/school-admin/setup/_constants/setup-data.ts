import type { GradeRow } from "../_components/setup-types";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const SCHOOL_TYPES = [
  { label: "Primary School", value: "primary" },
  { label: "Secondary School", value: "secondary" },
  { label: "K-12 (Primary & Secondary)", value: "k12" },
  { label: "Tertiary / University", value: "tertiary" },
  { label: "Vocational / Technical", value: "vocational" },
];

export const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Benin", "Botswana", "Brazil", "Burkina Faso", "Burundi",
  "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Congo", "Côte d'Ivoire",
  "Denmark", "Egypt", "Ethiopia", "Finland", "France", "Gabon", "Gambia", "Germany",
  "Ghana", "Greece", "Guinea", "India", "Indonesia", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kenya", "Lebanon", "Liberia", "Libya", "Madagascar",
  "Malawi", "Malaysia", "Mali", "Mexico", "Morocco", "Mozambique", "Namibia", "Nepal",
  "Netherlands", "New Zealand", "Niger", "Nigeria", "Norway", "Pakistan", "Peru",
  "Philippines", "Poland", "Portugal", "Rwanda", "Saudi Arabia", "Senegal",
  "Sierra Leone", "Singapore", "Somalia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Tanzania", "Thailand", "Togo",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Zambia", "Zimbabwe",
];

export const TIMEZONES = [
  { label: "UTC-12:00 Baker Island", value: "Etc/GMT+12" },
  { label: "UTC-11:00 Samoa", value: "Pacific/Samoa" },
  { label: "UTC-10:00 Hawaii", value: "Pacific/Honolulu" },
  { label: "UTC-09:00 Alaska", value: "America/Anchorage" },
  { label: "UTC-08:00 Pacific Time (US)", value: "America/Los_Angeles" },
  { label: "UTC-07:00 Mountain Time (US)", value: "America/Denver" },
  { label: "UTC-06:00 Central Time (US)", value: "America/Chicago" },
  { label: "UTC-05:00 Eastern Time (US)", value: "America/New_York" },
  { label: "UTC-04:00 Atlantic Time", value: "America/Halifax" },
  { label: "UTC-03:00 Buenos Aires", value: "America/Argentina/Buenos_Aires" },
  { label: "UTC-01:00 Azores", value: "Atlantic/Azores" },
  { label: "UTC+00:00 London, Dublin", value: "Europe/London" },
  { label: "UTC+01:00 Lagos, Berlin", value: "Africa/Lagos" },
  { label: "UTC+02:00 Cairo, Johannesburg", value: "Africa/Johannesburg" },
  { label: "UTC+03:00 Nairobi, Moscow", value: "Africa/Nairobi" },
  { label: "UTC+04:00 Dubai", value: "Asia/Dubai" },
  { label: "UTC+05:00 Karachi", value: "Asia/Karachi" },
  { label: "UTC+05:30 Mumbai, Kolkata", value: "Asia/Kolkata" },
  { label: "UTC+06:00 Dhaka", value: "Asia/Dhaka" },
  { label: "UTC+07:00 Bangkok, Jakarta", value: "Asia/Bangkok" },
  { label: "UTC+08:00 Singapore, Beijing", value: "Asia/Singapore" },
  { label: "UTC+09:00 Tokyo, Seoul", value: "Asia/Tokyo" },
  { label: "UTC+10:00 Sydney", value: "Australia/Sydney" },
  { label: "UTC+12:00 Auckland", value: "Pacific/Auckland" },
];

export const CURRENCIES = [
  { label: "NGN (₦) — Nigerian Naira", value: "NGN" },
  { label: "USD ($) — US Dollar", value: "USD" },
  { label: "GBP (£) — British Pound", value: "GBP" },
  { label: "EUR (€) — Euro", value: "EUR" },
  { label: "GHS (₵) — Ghanaian Cedi", value: "GHS" },
  { label: "KES (KSh) — Kenyan Shilling", value: "KES" },
  { label: "ZAR (R) — South African Rand", value: "ZAR" },
  { label: "INR (₹) — Indian Rupee", value: "INR" },
  { label: "CAD ($) — Canadian Dollar", value: "CAD" },
  { label: "AUD ($) — Australian Dollar", value: "AUD" },
];

export const DATE_FORMATS = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
];

export const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Portuguese", value: "pt" },
  { label: "Spanish", value: "es" },
  { label: "Swahili", value: "sw" },
];

export const CALENDAR_TYPES = [
  { label: "Semester (2 terms)", value: "semester" },
  { label: "Trimester (3 terms)", value: "trimester" },
  { label: "Quarter (4 terms)", value: "quarter" },
  { label: "Term-based (custom)", value: "term" },
];

// ---------------------------------------------------------------------------
// Regional Grade Level Structures
// ---------------------------------------------------------------------------

export interface GradeLevelStructure {
  id: string;
  label: string;
  region: string;
  description: string;
  groups: { name: string; levels: string[] }[];
}

export const GRADE_LEVEL_STRUCTURES: GradeLevelStructure[] = [
  {
    id: "ng_6334",
    label: "6-3-3-4 System",
    region: "Nigeria",
    description: "Primary 1–6, JSS 1–3, SSS 1–3",
    groups: [
      { name: "Nursery", levels: ["Nursery 1", "Nursery 2", "Nursery 3"] },
      { name: "Primary", levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
      { name: "Junior Secondary", levels: ["JSS 1", "JSS 2", "JSS 3"] },
      { name: "Senior Secondary", levels: ["SSS 1", "SSS 2", "SSS 3"] },
    ],
  },
  {
    id: "us_k12",
    label: "K-12 System",
    region: "United States",
    description: "Kindergarten through Grade 12",
    groups: [
      { name: "Elementary", levels: ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"] },
      { name: "Middle School", levels: ["Grade 6", "Grade 7", "Grade 8"] },
      { name: "High School", levels: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"] },
    ],
  },
  {
    id: "uk_year",
    label: "Year System",
    region: "United Kingdom",
    description: "Reception through Year 13",
    groups: [
      { name: "Early Years", levels: ["Reception"] },
      { name: "Primary (KS1–KS2)", levels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"] },
      { name: "Secondary (KS3–KS4)", levels: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11"] },
      { name: "Sixth Form", levels: ["Year 12", "Year 13"] },
    ],
  },
  {
    id: "gh_jhs_shs",
    label: "JHS / SHS System",
    region: "Ghana",
    description: "Primary 1–6, JHS 1–3, SHS 1–3",
    groups: [
      { name: "Kindergarten", levels: ["KG 1", "KG 2"] },
      { name: "Primary", levels: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
      { name: "Junior High", levels: ["JHS 1", "JHS 2", "JHS 3"] },
      { name: "Senior High", levels: ["SHS 1", "SHS 2", "SHS 3"] },
    ],
  },
  {
    id: "ke_844",
    label: "8-4-4 / CBC System",
    region: "Kenya",
    description: "Class 1–8, Form 1–4",
    groups: [
      { name: "Pre-Primary", levels: ["PP 1", "PP 2"] },
      { name: "Lower Primary", levels: ["Class 1", "Class 2", "Class 3"] },
      { name: "Upper Primary", levels: ["Class 4", "Class 5", "Class 6"] },
      { name: "Junior Secondary", levels: ["Class 7", "Class 8"] },
      { name: "Senior Secondary", levels: ["Form 1", "Form 2", "Form 3", "Form 4"] },
    ],
  },
  {
    id: "za_grade",
    label: "Grade R–12",
    region: "South Africa",
    description: "Grade R through Grade 12 (CAPS)",
    groups: [
      { name: "Foundation Phase", levels: ["Grade R", "Grade 1", "Grade 2", "Grade 3"] },
      { name: "Intermediate Phase", levels: ["Grade 4", "Grade 5", "Grade 6"] },
      { name: "Senior Phase", levels: ["Grade 7", "Grade 8", "Grade 9"] },
      { name: "FET Phase", levels: ["Grade 10", "Grade 11", "Grade 12"] },
    ],
  },
  {
    id: "fr_cycle",
    label: "French System",
    region: "Francophone Africa",
    description: "CI–CM2, 6ème–Terminale",
    groups: [
      { name: "Préscolaire", levels: ["Petite Section", "Moyenne Section", "Grande Section"] },
      { name: "Primaire", levels: ["CI", "CP", "CE1", "CE2", "CM1", "CM2"] },
      { name: "Collège", levels: ["6ème", "5ème", "4ème", "3ème"] },
      { name: "Lycée", levels: ["Seconde", "Première", "Terminale"] },
    ],
  },
  {
    id: "custom_levels",
    label: "Custom",
    region: "Any",
    description: "Define your own grade levels",
    groups: [],
  },
];

export const PROMOTION_CRITERIA = [
  { label: "Automatic (based on scores)", value: "automatic" },
  { label: "Manual (teacher decision)", value: "manual" },
  { label: "Hybrid (auto + teacher review)", value: "hybrid" },
];

export const REPORT_CARD_TEMPLATES = [
  { label: "Standard", value: "standard" },
  { label: "Detailed (with remarks)", value: "detailed" },
  { label: "Minimal (scores only)", value: "minimal" },
];

export const COMMON_SUBJECTS = [
  // Core / universal
  "Mathematics", "English Language", "Science", "Social Studies", "Biology",
  "Chemistry", "Physics", "Geography", "History", "Economics",
  "Computer Science", "Physical Education", "Music", "Art",
  // Languages
  "French", "Spanish", "Arabic", "German", "Mandarin", "Portuguese", "Swahili",
  // US-common
  "Algebra", "Geometry", "Calculus", "Statistics", "US History", "World History",
  "English Literature", "Earth Science", "Environmental Science", "Psychology",
  "Sociology", "Health", "Drama",
  // UK-common
  "Design & Technology", "Religious Education", "Citizenship", "Media Studies",
  "Food Technology", "Business Studies", "ICT",
  // Nigeria / West Africa
  "Further Mathematics", "Civic Education", "Government", "Literature in English",
  "Agricultural Science", "Home Economics", "Technical Drawing", "Commerce",
  "Accounting", "Religious Studies", "Yoruba", "Igbo", "Hausa",
  // General
  "Fine Art", "Health Education",
];

export const COMMON_FEE_CATEGORIES = [
  "Tuition", "Registration", "Boarding", "Feeding", "Transport", "Uniform",
  "Books & Materials", "Laboratory", "ICT / Computer", "Sports",
  "PTA Levy", "Development Levy", "Examination Fee", "Extra-curricular",
  "Medical", "Library", "Graduation", "Technology Fee", "Activity Fee",
  "Field Trips", "Insurance", "Maintenance Levy",
];

// ---------------------------------------------------------------------------
// Fee Presets
// ---------------------------------------------------------------------------

export interface FeePresetItem {
  name: string;
  mandatory: boolean;
  /** Default amount per currency (used as starting point — schools adjust) */
  defaults: Record<string, string>;
}

// Helper: common fee defaults across currencies
// Keyed by: NGN, USD, GBP, EUR, GHS, KES, ZAR, INR
export const fd = (ngn: string, usd: string, gbp: string, eur: string, ghs: string, kes: string, zar: string, inr: string): Record<string, string> =>
  ({ NGN: ngn, USD: usd, GBP: gbp, EUR: eur, GHS: ghs, KES: kes, ZAR: zar, INR: inr, CAD: usd, AUD: usd });

export const FEE_PRESETS: { id: string; label: string; fees: FeePresetItem[] }[] = [
  {
    id: "day_basic",
    label: "Day School — Basic",
    fees: [
      { name: "Tuition", mandatory: true, defaults: fd("50000", "500", "400", "450", "2000", "30000", "5000", "25000") },
      { name: "Registration", mandatory: true, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Books & Materials", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "10000", "1500", "8000") },
      { name: "Examination Fee", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "ICT / Computer", mandatory: false, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Sports", mandatory: false, defaults: fd("3000", "30", "25", "28", "120", "2000", "300", "1500") },
    ],
  },
  {
    id: "day_full",
    label: "Day School — Full",
    fees: [
      { name: "Tuition", mandatory: true, defaults: fd("75000", "800", "600", "700", "3500", "50000", "8000", "40000") },
      { name: "Registration", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "800", "5000") },
      { name: "Books & Materials", mandatory: true, defaults: fd("20000", "200", "150", "170", "800", "15000", "2000", "10000") },
      { name: "Examination Fee", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
      { name: "Laboratory", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "ICT / Computer", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Sports", mandatory: false, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Library", mandatory: false, defaults: fd("3000", "30", "25", "28", "120", "2000", "300", "1500") },
      { name: "PTA Levy", mandatory: true, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Development Levy", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Extra-curricular", mandatory: false, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
    ],
  },
  {
    id: "boarding",
    label: "Boarding School",
    fees: [
      { name: "Tuition", mandatory: true, defaults: fd("100000", "1500", "1200", "1300", "5000", "80000", "15000", "60000") },
      { name: "Registration", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "800", "5000") },
      { name: "Boarding", mandatory: true, defaults: fd("80000", "1000", "800", "900", "4000", "60000", "10000", "50000") },
      { name: "Feeding", mandatory: true, defaults: fd("60000", "800", "600", "700", "3000", "40000", "7000", "35000") },
      { name: "Books & Materials", mandatory: true, defaults: fd("20000", "200", "150", "170", "800", "15000", "2000", "10000") },
      { name: "Examination Fee", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
      { name: "Laboratory", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "ICT / Computer", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Uniform", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "10000", "1500", "8000") },
      { name: "Medical", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Sports", mandatory: false, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Library", mandatory: false, defaults: fd("3000", "30", "25", "28", "120", "2000", "300", "1500") },
      { name: "PTA Levy", mandatory: true, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Development Levy", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Extra-curricular", mandatory: false, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Transport", mandatory: false, defaults: fd("20000", "200", "150", "170", "800", "15000", "2000", "10000") },
    ],
  },
  {
    id: "private_premium",
    label: "Private School — Premium",
    fees: [
      { name: "Tuition", mandatory: true, defaults: fd("200000", "3000", "2500", "2800", "10000", "150000", "25000", "100000") },
      { name: "Registration", mandatory: true, defaults: fd("20000", "200", "150", "170", "800", "10000", "1500", "10000") },
      { name: "Books & Materials", mandatory: true, defaults: fd("30000", "300", "250", "270", "1200", "20000", "3000", "15000") },
      { name: "Examination Fee", mandatory: true, defaults: fd("20000", "200", "150", "170", "800", "10000", "2000", "10000") },
      { name: "Laboratory", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
      { name: "ICT / Computer", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
      { name: "Technology Fee", mandatory: true, defaults: fd("20000", "200", "150", "170", "800", "10000", "2000", "10000") },
      { name: "Sports", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Library", mandatory: true, defaults: fd("5000", "50", "40", "45", "200", "3000", "500", "2500") },
      { name: "Activity Fee", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Field Trips", mandatory: false, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
      { name: "Transport", mandatory: false, defaults: fd("30000", "300", "250", "270", "1200", "20000", "3000", "15000") },
      { name: "Uniform", mandatory: true, defaults: fd("25000", "250", "200", "220", "1000", "15000", "2500", "12000") },
      { name: "Insurance", mandatory: true, defaults: fd("10000", "100", "80", "90", "400", "5000", "1000", "5000") },
      { name: "Maintenance Levy", mandatory: true, defaults: fd("15000", "150", "120", "130", "600", "8000", "1500", "7000") },
    ],
  },
];

// ---------------------------------------------------------------------------
// Regional Grading Presets
// ---------------------------------------------------------------------------

export interface GradingPreset {
  id: string;
  label: string;
  region: string;
  description: string;
  passmark: string;
  grades: GradeRow[];
}

export const GRADING_PRESETS: GradingPreset[] = [
  {
    id: "waec",
    label: "WAEC / NECO",
    region: "Nigeria",
    description: "West African Examinations Council standard (A1–F9)",
    passmark: "40",
    grades: [
      { grade: "A1", minScore: "75", maxScore: "100" },
      { grade: "B2", minScore: "70", maxScore: "74" },
      { grade: "B3", minScore: "65", maxScore: "69" },
      { grade: "C4", minScore: "60", maxScore: "64" },
      { grade: "C5", minScore: "55", maxScore: "59" },
      { grade: "C6", minScore: "50", maxScore: "54" },
      { grade: "D7", minScore: "45", maxScore: "49" },
      { grade: "E8", minScore: "40", maxScore: "44" },
      { grade: "F9", minScore: "0", maxScore: "39" },
    ],
  },
  {
    id: "ng_primary",
    label: "Primary (A–F)",
    region: "Nigeria",
    description: "Common Nigerian primary & junior secondary grading",
    passmark: "40",
    grades: [
      { grade: "A", minScore: "70", maxScore: "100" },
      { grade: "B", minScore: "60", maxScore: "69" },
      { grade: "C", minScore: "50", maxScore: "59" },
      { grade: "D", minScore: "45", maxScore: "49" },
      { grade: "E", minScore: "40", maxScore: "44" },
      { grade: "F", minScore: "0", maxScore: "39" },
    ],
  },
  {
    id: "us_letter",
    label: "US Letter Grade",
    region: "United States",
    description: "Standard A–F letter grading with plus/minus",
    passmark: "60",
    grades: [
      { grade: "A+", minScore: "97", maxScore: "100" },
      { grade: "A", minScore: "93", maxScore: "96" },
      { grade: "A-", minScore: "90", maxScore: "92" },
      { grade: "B+", minScore: "87", maxScore: "89" },
      { grade: "B", minScore: "83", maxScore: "86" },
      { grade: "B-", minScore: "80", maxScore: "82" },
      { grade: "C+", minScore: "77", maxScore: "79" },
      { grade: "C", minScore: "73", maxScore: "76" },
      { grade: "C-", minScore: "70", maxScore: "72" },
      { grade: "D+", minScore: "67", maxScore: "69" },
      { grade: "D", minScore: "63", maxScore: "66" },
      { grade: "D-", minScore: "60", maxScore: "62" },
      { grade: "F", minScore: "0", maxScore: "59" },
    ],
  },
  {
    id: "uk_gcse",
    label: "GCSE (9–1)",
    region: "United Kingdom",
    description: "England GCSE numerical grading scale",
    passmark: "40",
    grades: [
      { grade: "9", minScore: "90", maxScore: "100" },
      { grade: "8", minScore: "80", maxScore: "89" },
      { grade: "7", minScore: "70", maxScore: "79" },
      { grade: "6", minScore: "60", maxScore: "69" },
      { grade: "5", minScore: "50", maxScore: "59" },
      { grade: "4", minScore: "40", maxScore: "49" },
      { grade: "3", minScore: "30", maxScore: "39" },
      { grade: "2", minScore: "20", maxScore: "29" },
      { grade: "1", minScore: "0", maxScore: "19" },
    ],
  },
  {
    id: "gh_waec",
    label: "Ghana WASSCE",
    region: "Ghana",
    description: "WASSCE grading for Ghanaian schools (A1–F9)",
    passmark: "50",
    grades: [
      { grade: "A1", minScore: "80", maxScore: "100" },
      { grade: "B2", minScore: "75", maxScore: "79" },
      { grade: "B3", minScore: "70", maxScore: "74" },
      { grade: "C4", minScore: "65", maxScore: "69" },
      { grade: "C5", minScore: "60", maxScore: "64" },
      { grade: "C6", minScore: "55", maxScore: "59" },
      { grade: "D7", minScore: "50", maxScore: "54" },
      { grade: "E8", minScore: "40", maxScore: "49" },
      { grade: "F9", minScore: "0", maxScore: "39" },
    ],
  },
  {
    id: "ke_kcse",
    label: "KCSE",
    region: "Kenya",
    description: "Kenya Certificate of Secondary Education (A–E)",
    passmark: "30",
    grades: [
      { grade: "A", minScore: "80", maxScore: "100" },
      { grade: "A-", minScore: "75", maxScore: "79" },
      { grade: "B+", minScore: "70", maxScore: "74" },
      { grade: "B", minScore: "65", maxScore: "69" },
      { grade: "B-", minScore: "60", maxScore: "64" },
      { grade: "C+", minScore: "55", maxScore: "59" },
      { grade: "C", minScore: "50", maxScore: "54" },
      { grade: "C-", minScore: "45", maxScore: "49" },
      { grade: "D+", minScore: "40", maxScore: "44" },
      { grade: "D", minScore: "35", maxScore: "39" },
      { grade: "D-", minScore: "30", maxScore: "34" },
      { grade: "E", minScore: "0", maxScore: "29" },
    ],
  },
  {
    id: "za_nsc",
    label: "NSC",
    region: "South Africa",
    description: "National Senior Certificate (7–1 levels)",
    passmark: "30",
    grades: [
      { grade: "7 (Outstanding)", minScore: "80", maxScore: "100" },
      { grade: "6 (Meritorious)", minScore: "70", maxScore: "79" },
      { grade: "5 (Substantial)", minScore: "60", maxScore: "69" },
      { grade: "4 (Adequate)", minScore: "50", maxScore: "59" },
      { grade: "3 (Moderate)", minScore: "40", maxScore: "49" },
      { grade: "2 (Elementary)", minScore: "30", maxScore: "39" },
      { grade: "1 (Not achieved)", minScore: "0", maxScore: "29" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    region: "Any",
    description: "Start from scratch with your own grading scale",
    passmark: "40",
    grades: [
      { grade: "A", minScore: "70", maxScore: "100" },
      { grade: "B", minScore: "60", maxScore: "69" },
      { grade: "C", minScore: "50", maxScore: "59" },
      { grade: "D", minScore: "40", maxScore: "49" },
      { grade: "F", minScore: "0", maxScore: "39" },
    ],
  },
];

export const STORAGE_KEY = "schoolnify_school_setup";

// ---------------------------------------------------------------------------
// Schedule Presets
// ---------------------------------------------------------------------------

export interface SchedulePreset {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  periodDuration: string;
  periods: { label: string; startTime: string; endTime: string; isBreak: boolean }[];
}

export const SCHEDULE_PRESETS: SchedulePreset[] = [
  {
    id: "6_period_35",
    label: "6 Periods × 35 min",
    startTime: "08:00",
    endTime: "12:30",
    periodDuration: "35",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:35", isBreak: false },
      { label: "Period 2", startTime: "08:35", endTime: "09:10", isBreak: false },
      { label: "Period 3", startTime: "09:10", endTime: "09:45", isBreak: false },
      { label: "Short Break", startTime: "09:45", endTime: "10:00", isBreak: true },
      { label: "Period 4", startTime: "10:00", endTime: "10:35", isBreak: false },
      { label: "Period 5", startTime: "10:35", endTime: "11:10", isBreak: false },
      { label: "Long Break", startTime: "11:10", endTime: "11:30", isBreak: true },
      { label: "Period 6", startTime: "11:30", endTime: "12:05", isBreak: false },
    ],
  },
  {
    id: "7_period_40",
    label: "7 Periods × 40 min",
    startTime: "08:00",
    endTime: "13:40",
    periodDuration: "40",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:40", isBreak: false },
      { label: "Period 2", startTime: "08:40", endTime: "09:20", isBreak: false },
      { label: "Period 3", startTime: "09:20", endTime: "10:00", isBreak: false },
      { label: "Short Break", startTime: "10:00", endTime: "10:20", isBreak: true },
      { label: "Period 4", startTime: "10:20", endTime: "11:00", isBreak: false },
      { label: "Period 5", startTime: "11:00", endTime: "11:40", isBreak: false },
      { label: "Long Break", startTime: "11:40", endTime: "12:20", isBreak: true },
      { label: "Period 6", startTime: "12:20", endTime: "13:00", isBreak: false },
      { label: "Period 7", startTime: "13:00", endTime: "13:40", isBreak: false },
    ],
  },
  {
    id: "8_period_40",
    label: "8 Periods × 40 min",
    startTime: "08:00",
    endTime: "14:30",
    periodDuration: "40",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:40", isBreak: false },
      { label: "Period 2", startTime: "08:40", endTime: "09:20", isBreak: false },
      { label: "Period 3", startTime: "09:20", endTime: "10:00", isBreak: false },
      { label: "Short Break", startTime: "10:00", endTime: "10:30", isBreak: true },
      { label: "Period 4", startTime: "10:30", endTime: "11:10", isBreak: false },
      { label: "Period 5", startTime: "11:10", endTime: "11:50", isBreak: false },
      { label: "Long Break", startTime: "11:50", endTime: "12:30", isBreak: true },
      { label: "Period 6", startTime: "12:30", endTime: "13:10", isBreak: false },
      { label: "Period 7", startTime: "13:10", endTime: "13:50", isBreak: false },
      { label: "Period 8", startTime: "13:50", endTime: "14:30", isBreak: false },
    ],
  },
  {
    id: "5_lesson_60",
    label: "5 Lessons × 60 min",
    startTime: "08:30",
    endTime: "15:10",
    periodDuration: "60",
    periods: [
      { label: "Lesson 1", startTime: "08:30", endTime: "09:30", isBreak: false },
      { label: "Lesson 2", startTime: "09:30", endTime: "10:30", isBreak: false },
      { label: "Morning Break", startTime: "10:30", endTime: "10:50", isBreak: true },
      { label: "Lesson 3", startTime: "10:50", endTime: "11:50", isBreak: false },
      { label: "Lunch", startTime: "11:50", endTime: "12:50", isBreak: true },
      { label: "Lesson 4", startTime: "12:50", endTime: "13:50", isBreak: false },
      { label: "Lesson 5", startTime: "13:50", endTime: "14:50", isBreak: false },
    ],
  },
  {
    id: "4_block_90",
    label: "4 Blocks × 90 min",
    startTime: "08:00",
    endTime: "15:10",
    periodDuration: "90",
    periods: [
      { label: "Block 1", startTime: "08:00", endTime: "09:30", isBreak: false },
      { label: "Block 2", startTime: "09:35", endTime: "11:05", isBreak: false },
      { label: "Lunch", startTime: "11:05", endTime: "11:45", isBreak: true },
      { label: "Block 3", startTime: "11:45", endTime: "13:15", isBreak: false },
      { label: "Break", startTime: "13:15", endTime: "13:25", isBreak: true },
      { label: "Block 4", startTime: "13:25", endTime: "14:55", isBreak: false },
    ],
  },
];
