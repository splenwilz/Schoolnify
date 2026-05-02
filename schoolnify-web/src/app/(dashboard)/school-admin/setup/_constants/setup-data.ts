
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

export const OWNERSHIP_TYPES = [
  { label: "Public / Government", value: "public" },
  { label: "Private", value: "private" },
  { label: "Religious / Faith-based", value: "religious" },
  { label: "Charter / Semi-private", value: "charter" },
  { label: "Community / Non-profit", value: "community" },
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
  { label: "NGN (₦). Nigerian Naira", value: "NGN" },
  { label: "USD ($). US Dollar", value: "USD" },
  { label: "GBP (£). British Pound", value: "GBP" },
  { label: "EUR (€). Euro", value: "EUR" },
  { label: "GHS (₵). Ghanaian Cedi", value: "GHS" },
  { label: "KES (KSh). Kenyan Shilling", value: "KES" },
  { label: "ZAR (R). South African Rand", value: "ZAR" },
  { label: "INR (₹). Indian Rupee", value: "INR" },
  { label: "CAD ($). Canadian Dollar", value: "CAD" },
  { label: "AUD ($). Australian Dollar", value: "AUD" },
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
  { label: "Semester (2 terms per year)", value: "semester" },
  { label: "Trimester (3 terms per year)", value: "trimester" },
  { label: "Quarter (4 terms per year)", value: "quarter" },
  { label: "Custom (set your own term structure)", value: "term" },
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
    id: "ib",
    label: "International Baccalaureate (IB)",
    region: "International",
    description: "PYP, MYP, DP, and CP programs",
    groups: [
      { name: "Primary Years (PYP)", levels: ["PYP 1", "PYP 2", "PYP 3", "PYP 4", "PYP 5", "PYP 6"] },
      { name: "Middle Years (MYP)", levels: ["MYP 1", "MYP 2", "MYP 3", "MYP 4", "MYP 5"] },
      { name: "Diploma (DP)", levels: ["DP 1", "DP 2"] },
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

export const STORAGE_KEY = "schoolnify_school_setup";

// ---------------------------------------------------------------------------
// Country → Grade Level Structure mapping (ISO 3166-1 alpha-2 → structure ID)
// Grouped by education system family. Unmapped countries get no auto-suggestion.
// ---------------------------------------------------------------------------

export const COUNTRY_TO_STRUCTURE: Record<string, string> = {
  // Nigerian 6-3-3-4
  NG: "ng_6334", SL: "ng_6334", GM: "ng_6334",
  // Ghana JHS/SHS
  GH: "gh_jhs_shs",
  // Kenya 8-4-4 / CBC
  KE: "ke_844", UG: "ke_844", TZ: "ke_844", RW: "ke_844",
  // South Africa Grade R-12
  ZA: "za_grade", NA: "za_grade", BW: "za_grade", ZW: "za_grade", SZ: "za_grade", LS: "za_grade", MW: "za_grade", MZ: "za_grade", ZM: "za_grade",
  // US K-12
  US: "us_k12", PR: "us_k12", GU: "us_k12", VI: "us_k12", PH: "us_k12", LR: "us_k12",
  // Canada (similar to US)
  CA: "us_k12",
  // UK Year system
  GB: "uk_year", IE: "uk_year",
  // Australia / New Zealand (UK-derived)
  AU: "uk_year", NZ: "uk_year",
  // South & Southeast Asia (UK-derived)
  IN: "uk_year", PK: "uk_year", BD: "uk_year", LK: "uk_year", NP: "uk_year", MM: "uk_year",
  MY: "uk_year", SG: "uk_year", HK: "uk_year", BN: "uk_year",
  // Middle East / GCC (UK-influenced international schools dominate)
  AE: "uk_year", SA: "uk_year", QA: "uk_year", KW: "uk_year", OM: "uk_year", BH: "uk_year",
  JO: "uk_year", LB: "uk_year", IQ: "uk_year", EG: "uk_year",
  // Caribbean (UK-derived)
  JM: "uk_year", TT: "uk_year", BB: "uk_year", GY: "uk_year", BS: "uk_year",
  AG: "uk_year", DM: "uk_year", GD: "uk_year", KN: "uk_year", LC: "uk_year", VC: "uk_year", BZ: "uk_year",
  // French system
  FR: "fr_cycle",
  // Francophone West Africa
  SN: "fr_cycle", CI: "fr_cycle", ML: "fr_cycle", BF: "fr_cycle", NE: "fr_cycle",
  GN: "fr_cycle", TG: "fr_cycle", BJ: "fr_cycle", MR: "fr_cycle",
  // Francophone Central Africa
  CM: "fr_cycle", CD: "fr_cycle", CG: "fr_cycle", GA: "fr_cycle", TD: "fr_cycle", CF: "fr_cycle",
  // Francophone Indian Ocean & North Africa
  MG: "fr_cycle", DJ: "fr_cycle", KM: "fr_cycle",
  MA: "fr_cycle", DZ: "fr_cycle", TN: "fr_cycle",
  // Francophone others
  HT: "fr_cycle", VN: "fr_cycle",
  // Horn of Africa (varied, default to Kenya-style)
  ET: "ke_844", ER: "ke_844", SO: "ke_844",
};

// ---------------------------------------------------------------------------
// Country → Calendar type mapping
// ---------------------------------------------------------------------------

export const COUNTRY_TO_CALENDAR: Record<string, string> = {
  // Trimester / 3-term (most common globally)
  NG: "trimester", GH: "trimester", KE: "trimester", UG: "trimester", TZ: "trimester", RW: "trimester",
  SL: "trimester", GM: "trimester", LR: "trimester",
  GB: "trimester", IE: "trimester",
  IN: "trimester", PK: "trimester", BD: "trimester", LK: "trimester", NP: "trimester",
  AE: "trimester", SA: "trimester", QA: "trimester", KW: "trimester", OM: "trimester", BH: "trimester",
  JO: "trimester", LB: "trimester", EG: "trimester",
  JM: "trimester", TT: "trimester", BB: "trimester", GY: "trimester",
  MY: "trimester", SG: "trimester", HK: "trimester",
  ET: "trimester", ER: "trimester", SO: "trimester",
  // Quarter / 4-term
  ZA: "quarter", NA: "quarter", BW: "quarter", ZW: "quarter", ZM: "quarter",
  AU: "quarter", NZ: "quarter",
  // Semester / 2-term
  US: "semester", CA: "semester", PH: "semester",
  // Francophone trimester
  FR: "trimester",
  SN: "trimester", CI: "trimester", ML: "trimester", BF: "trimester", NE: "trimester",
  GN: "trimester", TG: "trimester", BJ: "trimester", MR: "trimester",
  CM: "trimester", CD: "trimester", CG: "trimester", GA: "trimester", TD: "trimester", CF: "trimester",
  MG: "trimester", MA: "trimester", DZ: "trimester", TN: "trimester",
  HT: "trimester", VN: "trimester",
};

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
  {
    id: "nursery_4_30",
    label: "Nursery / Pre-primary (4 × 30 min)",
    startTime: "08:00",
    endTime: "11:30",
    periodDuration: "30",
    periods: [
      { label: "Circle Time", startTime: "08:00", endTime: "08:30", isBreak: false },
      { label: "Activity 1", startTime: "08:30", endTime: "09:00", isBreak: false },
      { label: "Snack Break", startTime: "09:00", endTime: "09:30", isBreak: true },
      { label: "Activity 2", startTime: "09:30", endTime: "10:00", isBreak: false },
      { label: "Outdoor Play", startTime: "10:00", endTime: "10:30", isBreak: true },
      { label: "Activity 3", startTime: "10:30", endTime: "11:00", isBreak: false },
      { label: "Story / Review", startTime: "11:00", endTime: "11:30", isBreak: false },
    ],
  },
  {
    id: "us_traditional_7_50",
    label: "US Traditional (7 × 50 min)",
    startTime: "08:00",
    endTime: "14:50",
    periodDuration: "50",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:50", isBreak: false },
      { label: "Period 2", startTime: "08:55", endTime: "09:45", isBreak: false },
      { label: "Period 3", startTime: "09:50", endTime: "10:40", isBreak: false },
      { label: "Period 4", startTime: "10:45", endTime: "11:35", isBreak: false },
      { label: "Lunch", startTime: "11:35", endTime: "12:10", isBreak: true },
      { label: "Period 5", startTime: "12:10", endTime: "13:00", isBreak: false },
      { label: "Period 6", startTime: "13:05", endTime: "13:55", isBreak: false },
      { label: "Period 7", startTime: "14:00", endTime: "14:50", isBreak: false },
    ],
  },
  {
    id: "fr_split_day",
    label: "French Split-Day (7 × 55 min)",
    startTime: "08:00",
    endTime: "16:30",
    periodDuration: "55",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:55", isBreak: false },
      { label: "Period 2", startTime: "08:55", endTime: "09:50", isBreak: false },
      { label: "Break", startTime: "09:50", endTime: "10:05", isBreak: true },
      { label: "Period 3", startTime: "10:05", endTime: "11:00", isBreak: false },
      { label: "Period 4", startTime: "11:00", endTime: "11:55", isBreak: false },
      { label: "Lunch", startTime: "11:55", endTime: "13:30", isBreak: true },
      { label: "Period 5", startTime: "13:30", endTime: "14:25", isBreak: false },
      { label: "Period 6", startTime: "14:25", endTime: "15:20", isBreak: false },
      { label: "Break", startTime: "15:20", endTime: "15:35", isBreak: true },
      { label: "Period 7", startTime: "15:35", endTime: "16:30", isBreak: false },
    ],
  },
  {
    id: "me_early_7_45",
    label: "Middle East / Early Start (7 × 45 min)",
    startTime: "07:00",
    endTime: "13:00",
    periodDuration: "45",
    periods: [
      { label: "Period 1", startTime: "07:00", endTime: "07:45", isBreak: false },
      { label: "Period 2", startTime: "07:45", endTime: "08:30", isBreak: false },
      { label: "Break", startTime: "08:30", endTime: "08:45", isBreak: true },
      { label: "Period 3", startTime: "08:45", endTime: "09:30", isBreak: false },
      { label: "Period 4", startTime: "09:30", endTime: "10:15", isBreak: false },
      { label: "Break", startTime: "10:15", endTime: "10:45", isBreak: true },
      { label: "Period 5", startTime: "10:45", endTime: "11:30", isBreak: false },
      { label: "Period 6", startTime: "11:30", endTime: "12:15", isBreak: false },
      { label: "Period 7", startTime: "12:15", endTime: "13:00", isBreak: false },
    ],
  },
  {
    id: "boarding_extended",
    label: "Boarding School (8 periods + Prep)",
    startTime: "08:00",
    endTime: "21:00",
    periodDuration: "40",
    periods: [
      { label: "Period 1", startTime: "08:00", endTime: "08:40", isBreak: false },
      { label: "Period 2", startTime: "08:40", endTime: "09:20", isBreak: false },
      { label: "Period 3", startTime: "09:20", endTime: "10:00", isBreak: false },
      { label: "Short Break", startTime: "10:00", endTime: "10:20", isBreak: true },
      { label: "Period 4", startTime: "10:20", endTime: "11:00", isBreak: false },
      { label: "Period 5", startTime: "11:00", endTime: "11:40", isBreak: false },
      { label: "Period 6", startTime: "11:40", endTime: "12:20", isBreak: false },
      { label: "Lunch", startTime: "12:20", endTime: "13:20", isBreak: true },
      { label: "Period 7", startTime: "13:20", endTime: "14:00", isBreak: false },
      { label: "Period 8", startTime: "14:00", endTime: "14:40", isBreak: false },
      { label: "Sports / Activities", startTime: "14:40", endTime: "16:30", isBreak: true },
      { label: "Dinner", startTime: "16:30", endTime: "17:30", isBreak: true },
      { label: "Evening Prep 1", startTime: "19:00", endTime: "20:00", isBreak: false },
      { label: "Evening Prep 2", startTime: "20:00", endTime: "21:00", isBreak: false },
    ],
  },
  {
    id: "de_halfday_6_45",
    label: "German Half-Day (6 × 45 min)",
    startTime: "07:45",
    endTime: "12:50",
    periodDuration: "45",
    periods: [
      { label: "Stunde 1", startTime: "07:45", endTime: "08:30", isBreak: false },
      { label: "Stunde 2", startTime: "08:30", endTime: "09:15", isBreak: false },
      { label: "Gro\u00dfe Pause", startTime: "09:15", endTime: "09:35", isBreak: true },
      { label: "Stunde 3", startTime: "09:35", endTime: "10:20", isBreak: false },
      { label: "Stunde 4", startTime: "10:20", endTime: "11:05", isBreak: false },
      { label: "Pause", startTime: "11:05", endTime: "11:20", isBreak: true },
      { label: "Stunde 5", startTime: "11:20", endTime: "12:05", isBreak: false },
      { label: "Stunde 6", startTime: "12:05", endTime: "12:50", isBreak: false },
    ],
  },
  {
    id: "ab_block_85",
    label: "A/B Rotating Block (4 × 85 min)",
    startTime: "08:00",
    endTime: "14:35",
    periodDuration: "85",
    periods: [
      { label: "Block A1 / B1", startTime: "08:00", endTime: "09:25", isBreak: false },
      { label: "Block A2 / B2", startTime: "09:30", endTime: "10:55", isBreak: false },
      { label: "Lunch", startTime: "10:55", endTime: "11:35", isBreak: true },
      { label: "Block A3 / B3", startTime: "11:35", endTime: "13:00", isBreak: false },
      { label: "Break", startTime: "13:00", endTime: "13:10", isBreak: true },
      { label: "Block A4 / B4", startTime: "13:10", endTime: "14:35", isBreak: false },
    ],
  },
];
