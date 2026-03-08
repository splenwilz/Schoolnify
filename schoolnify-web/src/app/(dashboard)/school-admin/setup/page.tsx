"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  ChevronDown,
  CheckCircle2,
  Building2,
  Globe,
  GraduationCap,
  BarChart3,
  Bell,
  Shield,
  Search,
  X,
  Plus,
  Trash2,
  Clock,
  CalendarDays,
  BookOpen,
  Wallet,
  FileText,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSchoolConfig } from "@/lib/school-config-context";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCHOOL_TYPES = [
  { label: "Primary School", value: "primary" },
  { label: "Secondary School", value: "secondary" },
  { label: "K-12 (Primary & Secondary)", value: "k12" },
  { label: "Tertiary / University", value: "tertiary" },
  { label: "Vocational / Technical", value: "vocational" },
];

const COUNTRIES = [
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

const TIMEZONES = [
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

const CURRENCIES = [
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

const DATE_FORMATS = [
  { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
];

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Portuguese", value: "pt" },
  { label: "Spanish", value: "es" },
  { label: "Swahili", value: "sw" },
];

const CALENDAR_TYPES = [
  { label: "Semester (2 terms)", value: "semester" },
  { label: "Trimester (3 terms)", value: "trimester" },
  { label: "Quarter (4 terms)", value: "quarter" },
  { label: "Term-based (custom)", value: "term" },
];

// ---------------------------------------------------------------------------
// Regional Grade Level Structures
// ---------------------------------------------------------------------------

interface GradeLevelStructure {
  id: string;
  label: string;
  region: string;
  description: string;
  groups: { name: string; levels: string[] }[];
}

const GRADE_LEVEL_STRUCTURES: GradeLevelStructure[] = [
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

const PROMOTION_CRITERIA = [
  { label: "Automatic (based on scores)", value: "automatic" },
  { label: "Manual (teacher decision)", value: "manual" },
  { label: "Hybrid (auto + teacher review)", value: "hybrid" },
];

const REPORT_CARD_TEMPLATES = [
  { label: "Standard", value: "standard" },
  { label: "Detailed (with remarks)", value: "detailed" },
  { label: "Minimal (scores only)", value: "minimal" },
];

const COMMON_SUBJECTS = [
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

const COMMON_FEE_CATEGORIES = [
  "Tuition", "Registration", "Boarding", "Feeding", "Transport", "Uniform",
  "Books & Materials", "Laboratory", "ICT / Computer", "Sports",
  "PTA Levy", "Development Levy", "Examination Fee", "Extra-curricular",
  "Medical", "Library", "Graduation", "Technology Fee", "Activity Fee",
  "Field Trips", "Insurance", "Maintenance Levy",
];

interface FeePresetItem {
  name: string;
  mandatory: boolean;
  /** Default amount per currency (used as starting point — schools adjust) */
  defaults: Record<string, string>;
}

// Helper: common fee defaults across currencies
// Keyed by: NGN, USD, GBP, EUR, GHS, KES, ZAR, INR
const fd = (ngn: string, usd: string, gbp: string, eur: string, ghs: string, kes: string, zar: string, inr: string): Record<string, string> =>
  ({ NGN: ngn, USD: usd, GBP: gbp, EUR: eur, GHS: ghs, KES: kes, ZAR: zar, INR: inr, CAD: usd, AUD: usd });

const FEE_PRESETS: { id: string; label: string; fees: FeePresetItem[] }[] = [
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

interface GradingPreset {
  id: string;
  label: string;
  region: string;
  description: string;
  passmark: string;
  grades: GradeRow[];
}

const GRADING_PRESETS: GradingPreset[] = [
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

const STORAGE_KEY = "schoolnify_school_setup";

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

function SectionCard({
  id,
  title,
  description,
  icon,
  isComplete,
  isExpanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--background-secondary)] transition-colors"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isComplete
            ? "bg-[#10B981]/10 text-[#10B981]"
            : "bg-[#0891B2]/10 text-[#0891B2]"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h3>
            {isComplete && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
          </div>
          <p className="text-[12px] text-[var(--muted)]">{description}</p>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-[var(--muted)] transition-transform shrink-0",
          isExpanded && "rotate-180"
        )} />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]">
              <div className="space-y-5 mt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <p className="text-[13px] font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="text-[11px] text-[var(--muted)]">{description}</p>}
      </div>
      <div className="sm:w-64">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        checked ? "bg-[#0891B2]" : "bg-[var(--border)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
      >
        <span className={selected ? "" : "text-[var(--muted)]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[var(--background-secondary)] rounded-md">
              <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 text-[12px] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-3 h-3 text-[var(--muted)]" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[12px] text-[var(--muted)]">No results</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[12px] rounded-md transition-colors",
                    o.value === value
                      ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                      : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                  )}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChipSelect({
  selected,
  onChange,
  options,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => toggle(o)}
          className={cn(
            "px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-colors",
            selected.includes(o)
              ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
              : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Schedule Presets
// ---------------------------------------------------------------------------

interface SchedulePreset {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  periodDuration: string;
  periods: { label: string; startTime: string; endTime: string; isBreak: boolean }[];
}

const SCHEDULE_PRESETS: SchedulePreset[] = [
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GradeRow {
  grade: string;
  minScore: string;
  maxScore: string;
}

interface TermDate {
  name: string;
  startDate: string;
  endDate: string;
}

interface PeriodSlot {
  label: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
}

interface DivisionSchedule {
  startTime: string;
  endTime: string;
  periodDuration: string;
  periods: PeriodSlot[];
}

interface FeeCategory {
  name: string;
  mandatory: boolean;
  appliesTo: "all" | "specific";
  gradeLevels: string[];
  /** amount per grade level — key is level name, value is amount string */
  amounts: Record<string, string>;
}

interface PromotionRule {
  minSubjectsToPass: string;
  requiredSubjects: string[];
  allowRemedial: boolean;
  maxRepeats: string;
}

interface SetupData {
  // School Identity
  schoolType: string;
  motto: string;
  foundedYear: string;
  accreditationNumber: string;
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

const SUBJECT_DEPARTMENTS = [
  { label: "Science", value: "science" },
  { label: "Arts", value: "arts" },
  { label: "Commercial", value: "commercial" },
  { label: "Technology", value: "technology" },
  { label: "Languages", value: "languages" },
  { label: "Humanities", value: "humanities" },
  { label: "Vocational", value: "vocational" },
  { label: "General", value: "general" },
];

const DEFAULT_DATA: SetupData = {
  schoolType: "",
  motto: "",
  foundedYear: "",
  accreditationNumber: "",
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

function isIdentityComplete(d: SetupData) {
  return !!(d.schoolType && d.motto);
}

function isLocationComplete(d: SetupData) {
  return !!(d.country && d.timezone && d.currency);
}

function isAcademicComplete(d: SetupData) {
  return !!(d.calendarType && d.currentAcademicYear && d.gradeLevelStructureId && d.gradeLevels.length > 0);
}

function isGradingComplete(d: SetupData) {
  return !!(d.gradingPresetId && d.gradingScale.length > 0 && d.caWeight && d.examWeight && d.passmark);
}

function isScheduleComplete(d: SetupData) {
  const keys = Object.keys(d.schedules);
  return keys.length > 0 && keys.every((k) => {
    const s = d.schedules[k];
    return s.startTime && s.endTime && s.periods.length > 0;
  });
}

function isTermsComplete(d: SetupData) {
  return d.terms.length > 0 && d.terms.every((t) => t.name && t.startDate && t.endDate);
}

function isSubjectsComplete(d: SetupData) {
  return d.subjects.length > 0;
}

function isFeesComplete(d: SetupData) {
  return d.feeCategories.length > 0;
}

function isReportCardComplete(d: SetupData) {
  return !!d.reportTemplate;
}

function isCommsComplete(_d: SetupData) {
  return true;
}

function isPoliciesComplete(d: SetupData) {
  return !!(d.lateGracePeriod && d.attendanceThreshold && d.promotionCriteria);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SchoolSetupPage() {
  const [data, setData] = useState<SetupData>(DEFAULT_DATA);
  const [expanded, setExpanded] = useState<string>("identity");
  const [saveMessage, setSaveMessage] = useState(false);
  const [customLevelInput, setCustomLevelInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [feeCategoryInput, setFeeCategoryInput] = useState("");
  const [newSection, setNewSection] = useState("");

  // Class sections context (shared with rest of app)
  const { sections, setSections } = useSchoolConfig();

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Silently continue
    }
  }, []);

  const update = <K extends keyof SetupData>(key: K, value: SetupData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const selectGradeLevelStructure = (structureId: string) => {
    const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === structureId);
    if (structure) {
      const allLevels = structure.groups.flatMap((g) => g.levels);
      setData((prev) => ({
        ...prev,
        gradeLevelStructureId: structureId,
        gradeLevels: allLevels,
      }));
    }
  };

  const addCustomLevel = () => {
    const trimmed = customLevelInput.trim();
    if (trimmed && !data.gradeLevels.includes(trimmed)) {
      update("gradeLevels", [...data.gradeLevels, trimmed]);
      setCustomLevelInput("");
    }
  };

  const removeLevel = (level: string) => {
    update("gradeLevels", data.gradeLevels.filter((l) => l !== level));
  };

  const updateGradeRow = (index: number, field: keyof GradeRow, value: string) => {
    setData((prev) => {
      const updated = [...prev.gradingScale];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, gradingScale: updated };
    });
  };

  const addGradeRow = () => {
    setData((prev) => ({
      ...prev,
      gradingScale: [...prev.gradingScale, { grade: "", minScore: "", maxScore: "" }],
    }));
  };

  const removeGradeRow = (index: number) => {
    setData((prev) => ({
      ...prev,
      gradingScale: prev.gradingScale.filter((_, i) => i !== index),
    }));
  };

  const selectGradingPreset = (presetId: string) => {
    const preset = GRADING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setData((prev) => ({
        ...prev,
        gradingPresetId: presetId,
        gradingScale: preset.grades.map((g) => ({ ...g })),
        passmark: preset.passmark,
      }));
    }
  };

  // --- Schedule helpers (per division) ---
  const getScheduleDivisions = (): string[] => {
    const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
    if (structure && structure.groups.length > 0) {
      return structure.groups.map((g) => g.name);
    }
    return ["All Levels"];
  };

  const getOrCreateSchedule = (division: string): DivisionSchedule => {
    return data.schedules[division] || { startTime: "08:00", endTime: "15:00", periodDuration: "40", periods: [] };
  };

  /** Recalculate period start/end times. Keeps break durations as-is, applies `periodMins` to lesson slots. */
  const recalcPeriods = (periods: PeriodSlot[], startTime: string, periodMins: number): PeriodSlot[] => {
    if (periods.length === 0 || !startTime || !periodMins) return periods;
    const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
    const toTime = (m: number) => { const h = Math.floor(m / 60) % 24; const mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };
    let cursor = toMins(startTime);
    return periods.map((p) => {
      const dur = p.isBreak ? (toMins(p.endTime) - toMins(p.startTime)) || 15 : periodMins;
      const start = cursor;
      const end = cursor + dur;
      cursor = end;
      return { ...p, startTime: toTime(start), endTime: toTime(end) };
    });
  };

  const updateScheduleField = (division: string, field: keyof Omit<DivisionSchedule, "periods">, value: string) => {
    setData((prev) => {
      const schedule = { ...getOrCreateSchedule(division), ...prev.schedules[division], [field]: value };
      // Recalculate period times when startTime or periodDuration changes
      if ((field === "periodDuration" || field === "startTime") && schedule.periods.length > 0) {
        const mins = parseInt(field === "periodDuration" ? value : schedule.periodDuration, 10);
        const start = field === "startTime" ? value : schedule.startTime;
        if (mins > 0 && start) {
          schedule.periods = recalcPeriods(schedule.periods, start, mins);
          // Update endTime to match last period
          const last = schedule.periods[schedule.periods.length - 1];
          if (last) schedule.endTime = last.endTime;
        }
      }
      return { ...prev, schedules: { ...prev.schedules, [division]: schedule } };
    });
  };

  const updateDivisionPeriod = (division: string, index: number, field: keyof PeriodSlot, value: string | boolean) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      const updated = schedule.periods.map((p) => ({ ...p }));
      updated[index] = { ...updated[index], [field]: value };

      // Cascade: when a time changes, shift all subsequent periods
      if (field === "startTime" || field === "endTime") {
        const toMins = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };
        const toTime = (m: number) => { const h = Math.floor(m / 60) % 24; const mm = m % 60; return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`; };

        // If startTime changed, recalc endTime of this period keeping its duration
        if (field === "startTime") {
          const oldDur = toMins(schedule.periods[index].endTime) - toMins(schedule.periods[index].startTime);
          const dur = oldDur > 0 ? oldDur : parseInt(schedule.periodDuration, 10) || 40;
          updated[index].endTime = toTime(toMins(value as string) + dur);
        }

        // Cascade all periods after the edited one
        for (let j = index + 1; j < updated.length; j++) {
          const prevEnd = toMins(updated[j - 1].endTime);
          const oldDur = toMins(schedule.periods[j].endTime) - toMins(schedule.periods[j].startTime);
          const dur = oldDur > 0 ? oldDur : parseInt(schedule.periodDuration, 10) || 40;
          updated[j].startTime = toTime(prevEnd);
          updated[j].endTime = toTime(prevEnd + dur);
        }

        // Auto-update division end time
        const last = updated[updated.length - 1];
        const newEndTime = last ? last.endTime : schedule.endTime;
        return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: updated, endTime: newEndTime } } };
      }

      return { ...prev, schedules: { ...prev.schedules, [division]: { ...schedule, periods: updated } } };
    });
  };

  const addDivisionPeriod = (division: string) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      const last = schedule.periods[schedule.periods.length - 1];
      return {
        ...prev,
        schedules: {
          ...prev.schedules,
          [division]: {
            ...schedule,
            periods: [...schedule.periods, { label: "", startTime: last?.endTime || schedule.startTime || "", endTime: "", isBreak: false }],
          },
        },
      };
    });
  };

  const removeDivisionPeriod = (division: string, index: number) => {
    setData((prev) => {
      const schedule = prev.schedules[division] || getOrCreateSchedule(division);
      return {
        ...prev,
        schedules: {
          ...prev.schedules,
          [division]: { ...schedule, periods: schedule.periods.filter((_, i) => i !== index) },
        },
      };
    });
  };

  const copyScheduleTo = (fromDivision: string, toDivision: string) => {
    setData((prev) => {
      const source = prev.schedules[fromDivision];
      if (!source) return prev;
      return { ...prev, schedules: { ...prev.schedules, [toDivision]: { ...source, periods: source.periods.map((p) => ({ ...p })) } } };
    });
  };

  const applySchedulePreset = (division: string, presetId: string) => {
    const preset = SCHEDULE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setData((prev) => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [division]: {
          startTime: preset.startTime,
          endTime: preset.endTime,
          periodDuration: preset.periodDuration,
          periods: preset.periods.map((p) => ({ ...p })),
        },
      },
    }));
  };

  // --- Term presets ---
  const TERM_PRESETS: { id: string; label: string; calendarTypes?: string[]; terms: { name: string }[] }[] = [
    { id: "2_semester", label: "2 Semesters", calendarTypes: ["semester"], terms: [{ name: "First Semester" }, { name: "Second Semester" }] },
    { id: "3_term", label: "3 Terms", calendarTypes: ["trimester", "term"], terms: [{ name: "First Term" }, { name: "Second Term" }, { name: "Third Term" }] },
    { id: "4_quarter", label: "4 Quarters", calendarTypes: ["quarter"], terms: [{ name: "Quarter 1" }, { name: "Quarter 2" }, { name: "Quarter 3" }, { name: "Quarter 4" }] },
    { id: "2_term", label: "2 Terms", terms: [{ name: "First Term" }, { name: "Second Term" }] },
    { id: "6_half", label: "6 Half-Terms", terms: [{ name: "Autumn 1" }, { name: "Autumn 2" }, { name: "Spring 1" }, { name: "Spring 2" }, { name: "Summer 1" }, { name: "Summer 2" }] },
  ];

  const getRelevantTermPresets = () => {
    if (!data.calendarType) return TERM_PRESETS;
    // Show matching presets first, then others
    const matching = TERM_PRESETS.filter((p) => p.calendarTypes?.includes(data.calendarType));
    const others = TERM_PRESETS.filter((p) => !p.calendarTypes?.includes(data.calendarType));
    return [...matching, ...others];
  };

  const applyTermPreset = (presetId: string) => {
    const preset = TERM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setData((prev) => ({
      ...prev,
      terms: preset.terms.map((t) => ({ name: t.name, startDate: "", endDate: "" })),
    }));
  };

  // --- Term handlers ---
  const addTerm = () => {
    const termNum = data.terms.length + 1;
    setData((prev) => ({
      ...prev,
      terms: [...prev.terms, { name: `Term ${termNum}`, startDate: "", endDate: "" }],
    }));
  };

  const updateTerm = (index: number, field: keyof TermDate, value: string) => {
    setData((prev) => {
      const updated = [...prev.terms];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, terms: updated };
    });
  };

  const removeTerm = (index: number) => {
    setData((prev) => ({ ...prev, terms: prev.terms.filter((_, i) => i !== index) }));
  };

  // --- Subject handlers ---
  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !data.subjects.includes(trimmed)) {
      update("subjects", [...data.subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const toggleSubject = (subject: string) => {
    if (data.subjects.includes(subject)) {
      update("subjects", data.subjects.filter((s) => s !== subject));
    } else {
      update("subjects", [...data.subjects, subject]);
    }
  };

  // --- Fee category handlers ---
  const addFeeCategory = (name?: string) => {
    const catName = name || feeCategoryInput.trim();
    if (catName && !data.feeCategories.find((f) => f.name === catName)) {
      setData((prev) => ({
        ...prev,
        feeCategories: [...prev.feeCategories, { name: catName, mandatory: true, appliesTo: "all", gradeLevels: [], amounts: {} }],
      }));
      if (!name) setFeeCategoryInput("");
    }
  };

  const updateFeeCategory = (index: number, field: keyof FeeCategory, value: string | boolean | string[] | Record<string, string>) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      updated[index] = { ...updated[index], [field]: value };
      // Reset gradeLevels when switching to "all"
      if (field === "appliesTo" && value === "all") {
        updated[index].gradeLevels = [];
      }
      return { ...prev, feeCategories: updated };
    });
  };

  const toggleFeeCategoryLevel = (index: number, level: string) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      const current = updated[index].gradeLevels;
      updated[index] = {
        ...updated[index],
        gradeLevels: current.includes(level) ? current.filter((l) => l !== level) : [...current, level],
      };
      return { ...prev, feeCategories: updated };
    });
  };

  const updateFeeCategoryAmount = (index: number, level: string, amount: string) => {
    setData((prev) => {
      const updated = [...prev.feeCategories];
      updated[index] = {
        ...updated[index],
        amounts: { ...updated[index].amounts, [level]: amount },
      };
      return { ...prev, feeCategories: updated };
    });
  };

  const removeFeeCategory = (index: number) => {
    setData((prev) => ({ ...prev, feeCategories: prev.feeCategories.filter((_, i) => i !== index) }));
  };

  const applyFeePreset = (presetId: string) => {
    const preset = FEE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setData((prev) => {
      const currency = prev.currency || "USD";
      const levels = prev.gradeLevels.length > 0 ? prev.gradeLevels : [];
      const newFees = preset.fees.map((f) => {
        const defaultAmount = f.defaults[currency] || f.defaults["USD"] || "0";
        const amounts: Record<string, string> = {};
        amounts["_flat"] = defaultAmount;
        for (const level of levels) {
          amounts[level] = defaultAmount;
        }
        return { name: f.name, mandatory: f.mandatory, appliesTo: "all" as const, gradeLevels: [] as string[], amounts };
      });
      return { ...prev, feeCategories: newFees };
    });
  };

  // --- Promotion rule handlers ---
  const updatePromotionRule = <K extends keyof PromotionRule>(field: K, value: PromotionRule[K]) => {
    setData((prev) => ({
      ...prev,
      promotionRules: { ...prev.promotionRules, [field]: value },
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveMessage(true);
      setTimeout(() => setSaveMessage(false), 2000);
    } catch {
      // Silently continue
    }
  };

  const toggleSection = (id: string) => {
    setExpanded((prev) => (prev === id ? "" : id));
  };

  const setupSections = useMemo(
    () => [
      { id: "identity", complete: isIdentityComplete(data) },
      { id: "location", complete: isLocationComplete(data) },
      { id: "academic", complete: isAcademicComplete(data) },
      { id: "schedule", complete: isScheduleComplete(data) },
      { id: "terms", complete: isTermsComplete(data) },
      { id: "subjects", complete: isSubjectsComplete(data) },
      { id: "grading", complete: isGradingComplete(data) },
      { id: "fees", complete: isFeesComplete(data) },
      { id: "reportcard", complete: isReportCardComplete(data) },
      { id: "comms", complete: isCommsComplete(data) },
      { id: "policies", complete: isPoliciesComplete(data) },
    ],
    [data]
  );

  const completedCount = setupSections.filter((s) => s.complete).length;

  const countryOptions = COUNTRIES.map((c) => ({ label: c, value: c }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[900px] mx-auto pb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/school-admin"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">School Setup</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              {completedCount} of {setupSections.length} sections completed
            </p>
          </div>
        </div>
        {/* Progress indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {setupSections.map((s) => (
            <div
              key={s.id}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                s.complete ? "bg-[#10B981]" : "bg-[var(--border)]"
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* ----------------------------------------------------------------- */}
        {/* 1. School Identity */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="identity"
          title="School Identity"
          description="Basic information about your institution"
          icon={<Building2 className="w-5 h-5" />}
          isComplete={isIdentityComplete(data)}
          isExpanded={expanded === "identity"}
          onToggle={() => toggleSection("identity")}
        >
          <Field label="School Type" description="What kind of institution is this?">
            <Select value={data.schoolType} onChange={(v) => update("schoolType", v)} options={SCHOOL_TYPES} />
          </Field>
          <Field label="School Motto" description="Your school's motto or tagline">
            <TextInput value={data.motto} onChange={(v) => update("motto", v)} placeholder="e.g. Excellence in Education" />
          </Field>
          <Field label="Founded Year" description="Year the school was established">
            <TextInput value={data.foundedYear} onChange={(v) => update("foundedYear", v)} placeholder="e.g. 1995" type="number" />
          </Field>
          <Field label="Accreditation Number" description="Official accreditation or registration number">
            <TextInput value={data.accreditationNumber} onChange={(v) => update("accreditationNumber", v)} placeholder="e.g. SCH/2024/001" />
          </Field>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 2. Location & Regional */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="location"
          title="Location & Regional"
          description="Geographic and regional preferences"
          icon={<Globe className="w-5 h-5" />}
          isComplete={isLocationComplete(data)}
          isExpanded={expanded === "location"}
          onToggle={() => toggleSection("location")}
        >
          <Field label="Country" description="Country where the school is located">
            <SearchableSelect
              value={data.country}
              onChange={(v) => update("country", v)}
              options={countryOptions}
              placeholder="Search country..."
            />
          </Field>
          <Field label="State / Region" description="State, province, or region">
            <TextInput value={data.stateRegion} onChange={(v) => update("stateRegion", v)} placeholder="e.g. Lagos" />
          </Field>
          <Field label="City" description="City or town">
            <TextInput value={data.city} onChange={(v) => update("city", v)} placeholder="e.g. Ikeja" />
          </Field>
          <Field label="Timezone" description="Your school's timezone">
            <SearchableSelect
              value={data.timezone}
              onChange={(v) => update("timezone", v)}
              options={TIMEZONES}
              placeholder="Search timezone..."
            />
          </Field>
          <Field label="Currency" description="Currency for fee management">
            <Select value={data.currency} onChange={(v) => update("currency", v)} options={CURRENCIES} />
          </Field>
          <Field label="Date Format" description="How dates are displayed">
            <Select value={data.dateFormat} onChange={(v) => update("dateFormat", v)} options={DATE_FORMATS} />
          </Field>
          <Field label="Language" description="Primary language of instruction">
            <Select value={data.language} onChange={(v) => update("language", v)} options={LANGUAGES} />
          </Field>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 3. Academic Structure */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="academic"
          title="Academic Structure"
          description="Calendar type, grade levels, and academic year"
          icon={<GraduationCap className="w-5 h-5" />}
          isComplete={isAcademicComplete(data)}
          isExpanded={expanded === "academic"}
          onToggle={() => toggleSection("academic")}
        >
          <Field label="Calendar Type" description="How your academic year is divided">
            <Select value={data.calendarType} onChange={(v) => update("calendarType", v)} options={CALENDAR_TYPES} />
          </Field>
          <Field label="Current Academic Year" description="e.g. 2025/2026">
            <TextInput value={data.currentAcademicYear} onChange={(v) => update("currentAcademicYear", v)} placeholder="e.g. 2025/2026" />
          </Field>

          {/* Grade Level Structure — regional presets */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
              Start from preset
            </label>
            <div className="flex flex-wrap gap-2">
              {GRADE_LEVEL_STRUCTURES.map((structure) => (
                <button
                  key={structure.id}
                  onClick={() => selectGradeLevelStructure(structure.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg border transition-all",
                    data.gradeLevelStructureId === structure.id
                      ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                      : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                  )}
                >
                  {structure.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level groups — Settings-style editable list */}
          {data.gradeLevelStructureId && (
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Level groups
              </label>
              {(() => {
                const structure = GRADE_LEVEL_STRUCTURES.find((s) => s.id === data.gradeLevelStructureId);
                if (structure && structure.groups.length > 0) {
                  return (
                    <div className="space-y-2">
                      {structure.groups.map((group) => {
                        const activeLevels = group.levels.filter((l) => data.gradeLevels.includes(l));
                        const removedLevels = group.levels.filter((l) => !data.gradeLevels.includes(l));
                        return (
                          <div
                            key={group.name}
                            className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
                          >
                            <div className="flex-1 min-w-0">
                              <label className="block text-[10px] text-[var(--muted)] mb-1">{group.name}</label>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {group.levels.map((level) => {
                                  const isActive = data.gradeLevels.includes(level);
                                  return (
                                    <span
                                      key={level}
                                      className={cn(
                                        "inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg border",
                                        isActive
                                          ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                                          : "bg-transparent border-dashed border-[var(--border)] text-[var(--muted)] opacity-40"
                                      )}
                                    >
                                      {level}
                                      <button
                                        onClick={() => {
                                          if (isActive) {
                                            removeLevel(level);
                                          } else {
                                            update("gradeLevels", [...data.gradeLevels, level]);
                                          }
                                        }}
                                        className={cn(
                                          "ml-0.5 transition-colors",
                                          isActive ? "text-[var(--muted)] hover:text-red-500" : "text-[#0891B2] hover:text-[#0E7490]"
                                        )}
                                      >
                                        {isActive ? (
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        ) : (
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                          </svg>
                                        )}
                                      </button>
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                // Custom structure — show flat list of added levels
                return (
                  <div className="flex flex-wrap items-center gap-2">
                    {data.gradeLevels.map((level) => (
                      <span
                        key={level}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {level}
                        <button
                          onClick={() => removeLevel(level)}
                          className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                );
              })()}
              {/* Add custom level */}
              <div className="flex items-center gap-1 mt-2">
                <input
                  type="text"
                  value={customLevelInput}
                  onChange={(e) => setCustomLevelInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustomLevel(); }}
                  placeholder="+"
                  className="w-24 px-2 py-1 text-sm text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                />
                {customLevelInput.trim() && (
                  <button
                    onClick={addCustomLevel}
                    className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] mt-1.5">
                Type a level name and press Enter to add. Click <strong>&times;</strong> to remove a level.
              </p>
            </div>
          )}

          {/* ---- Class Sections ---- */}
          {data.gradeLevels.length > 0 && (
            <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-4">
              <div>
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-1">Class Sections</p>
                <p className="text-xs text-[var(--muted)]">
                  Define section letters (A, B, C...) appended to each grade level to form class names
                </p>
              </div>

              {/* Sections Editor */}
              <div className="flex flex-wrap items-center gap-2">
                {sections.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    {s}
                    <button
                      onClick={() => setSections(sections.filter((x) => x !== s))}
                      className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value.toUpperCase().slice(0, 2))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newSection && !sections.includes(newSection)) {
                        setSections([...sections, newSection]);
                        setNewSection("");
                      }
                    }}
                    placeholder="+"
                    className="w-10 px-2 py-1 text-sm text-center bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
                  />
                  {newSection && !sections.includes(newSection) && (
                    <button
                      onClick={() => {
                        setSections([...sections, newSection]);
                        setNewSection("");
                      }}
                      className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Preview using actual grade levels + sections */}
              {sections.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Preview
                  </label>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {data.gradeLevels.slice(0, 4).map((level) => (
                        sections.map((s) => (
                          <span
                            key={`${level}-${s}`}
                            className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]"
                          >
                            {level}{s}
                          </span>
                        ))
                      ))}
                      {data.gradeLevels.length > 4 && (
                        <span className="px-2 py-0.5 text-xs text-[var(--muted)]">
                          +{(data.gradeLevels.length - 4) * sections.length} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 4. School Hours & Periods */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="schedule"
          title="School Hours & Periods"
          description="Bell times and break schedule — configured per division"
          icon={<Clock className="w-5 h-5" />}
          isComplete={isScheduleComplete(data)}
          isExpanded={expanded === "schedule"}
          onToggle={() => toggleSection("schedule")}
        >
          {(() => {
            const divisions = getScheduleDivisions();
            const hasDivisions = data.gradeLevelStructureId && divisions.length > 1;
            return (
              <div className="space-y-4">
                {!data.gradeLevelStructureId && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/20">
                    <Clock className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" />
                    <p className="text-xs text-[var(--muted)]">
                      Select a <span className="font-medium text-[var(--foreground)]">Grade Level Structure</span> in the Academic Structure section above to configure separate schedules per division (e.g. Primary, Junior Secondary, Senior Secondary). Without it, a single schedule applies to all levels.
                    </p>
                  </div>
                )}
                {hasDivisions && (
                  <p className="text-xs text-[var(--muted)]">
                    Each division can have its own start/end times, period lengths, and break schedule. Use a preset to get started quickly.
                  </p>
                )}
                {divisions.map((division, divIdx) => {
                  const schedule = getOrCreateSchedule(division);
                  const current = data.schedules[division] || schedule;
                  return (
                    <div key={division} className="rounded-lg border border-[var(--border)] overflow-hidden">
                      {/* Division header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-[var(--background-secondary)]">
                        <span className="text-[13px] font-medium text-[var(--foreground)]">{division}</span>
                        <div className="flex items-center gap-2">
                          {divIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => copyScheduleTo(divisions[0], division)}
                              className="text-[11px] text-[#0891B2] hover:underline"
                            >
                              Copy from {divisions[0]}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-3 space-y-3">
                        {/* Preset selector */}
                        <div>
                          <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
                          <div className="flex flex-wrap gap-1.5">
                            {SCHEDULE_PRESETS.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => applySchedulePreset(division, preset.id)}
                                className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time settings */}
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] text-[var(--muted)] mb-1">Start</label>
                            <input
                              type="time"
                              value={current.startTime}
                              onChange={(e) => updateScheduleField(division, "startTime", e.target.value)}
                              className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[var(--muted)] mb-1">End <span className="text-[9px] font-normal opacity-70">(auto)</span></label>
                            <div className="w-full px-2 py-1.5 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-md text-[var(--muted)]">
                              {current.endTime || "—"}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] text-[var(--muted)] mb-1">Period (mins)</label>
                            <input
                              type="number"
                              value={current.periodDuration}
                              onChange={(e) => updateScheduleField(division, "periodDuration", e.target.value)}
                              placeholder="40"
                              className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                            />
                          </div>
                        </div>

                        {/* Period table */}
                        {current.periods.length > 0 && (
                          <div className="rounded-md border border-[var(--border)] overflow-hidden">
                            <div className="grid grid-cols-[1fr_100px_100px_60px_36px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
                              <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Label</span>
                              <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Start</span>
                              <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">End</span>
                              <span className="px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)] uppercase">Break</span>
                              <span />
                            </div>
                            {current.periods.map((p, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "grid grid-cols-[1fr_100px_100px_60px_36px] gap-0 items-center",
                                  i < current.periods.length - 1 && "border-b border-[var(--border)]",
                                  p.isBreak && "bg-[#F59E0B]/5"
                                )}
                              >
                                <input
                                  value={p.label}
                                  onChange={(e) => updateDivisionPeriod(division, i, "label", e.target.value)}
                                  className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                                  placeholder="Period name"
                                />
                                <input
                                  value={p.startTime}
                                  onChange={(e) => updateDivisionPeriod(division, i, "startTime", e.target.value)}
                                  placeholder="08:00"
                                  className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                                />
                                <input
                                  value={p.endTime}
                                  onChange={(e) => updateDivisionPeriod(division, i, "endTime", e.target.value)}
                                  placeholder="08:40"
                                  className="px-2 py-2 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                                />
                                <div className="flex items-center justify-center border-l border-[var(--border)]">
                                  <Toggle checked={p.isBreak} onChange={(v) => updateDivisionPeriod(division, i, "isBreak", v)} />
                                </div>
                                <button
                                  onClick={() => removeDivisionPeriod(division, i)}
                                  className="flex items-center justify-center p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors border-l border-[var(--border)]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => addDivisionPeriod(division)}
                          className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Add Period
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 5. Term / Session Dates */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="terms"
          title="Term / Session Dates"
          description="Term structure and dates for the current academic year"
          icon={<CalendarDays className="w-5 h-5" />}
          isComplete={isTermsComplete(data)}
          isExpanded={expanded === "terms"}
          onToggle={() => toggleSection("terms")}
        >
          {/* Year context note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0891B2]/5 border border-[#0891B2]/20">
            <CalendarDays className="w-4 h-4 text-[#0891B2] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--muted)]">
              {data.currentAcademicYear ? (
                <>Dates below are for the <span className="font-medium text-[var(--foreground)]">{data.currentAcademicYear}</span> academic year. </>
              ) : (
                <>Set your current academic year in Academic Structure above. </>
              )}
              The term structure (names and count) stays the same each year — only the dates need updating when a new session begins.
            </p>
          </div>

          {/* Term presets */}
          <div>
            <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
            <div className="flex flex-wrap gap-1.5">
              {getRelevantTermPresets().map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyTermPreset(preset.id)}
                  className={cn(
                    "px-2.5 py-1.5 text-[11px] font-medium rounded-md border transition-colors",
                    preset.calendarTypes?.includes(data.calendarType)
                      ? "border-[#0891B2]/30 bg-[#0891B2]/5 text-[#0891B2] hover:bg-[#0891B2]/10"
                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5"
                  )}
                >
                  {preset.label}
                  {preset.calendarTypes?.includes(data.calendarType) && (
                    <span className="ml-1 text-[9px] opacity-70">recommended</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {data.terms.length > 0 ? (
            <div className="space-y-2">
              {data.terms.map((term, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]"
                >
                  <div className="flex-1 min-w-0">
                    <label className="block text-[10px] text-[var(--muted)] mb-1">Name</label>
                    <input
                      value={term.name}
                      onChange={(e) => updateTerm(i, "name", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                      placeholder="e.g. First Term"
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-[10px] text-[var(--muted)] mb-1">Start Date</label>
                    <input
                      type="date"
                      value={term.startDate}
                      onChange={(e) => updateTerm(i, "startDate", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-[10px] text-[var(--muted)] mb-1">End Date</label>
                    <input
                      type="date"
                      value={term.endDate}
                      onChange={(e) => updateTerm(i, "endDate", e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    />
                  </div>
                  <button
                    onClick={() => removeTerm(i)}
                    className="self-end mb-0.5 p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--muted)]">No terms added yet. Add your first term below.</p>
          )}
          <button
            onClick={addTerm}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Term
          </button>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 6. Subjects Offered */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="subjects"
          title="Subjects Offered"
          description="Core and elective subjects taught at your school"
          icon={<BookOpen className="w-5 h-5" />}
          isComplete={isSubjectsComplete(data)}
          isExpanded={expanded === "subjects"}
          onToggle={() => toggleSection("subjects")}
        >
          {/* Subject presets */}
          {(() => {
            // Known department for each subject
            const SUBJECT_DEPT_MAP: Record<string, string> = {
              // Science
              "Mathematics": "science", "Further Mathematics": "science", "Biology": "science",
              "Chemistry": "science", "Physics": "science", "Science": "science",
              "Agricultural Science": "science", "Health Education": "science",
              "Algebra": "science", "Geometry": "science", "Calculus": "science",
              "Statistics": "science", "Earth Science": "science", "Environmental Science": "science",
              // Languages
              "English Language": "languages", "French": "languages", "Arabic": "languages",
              "Spanish": "languages", "German": "languages", "Mandarin": "languages",
              "Portuguese": "languages", "Swahili": "languages",
              "Yoruba": "languages", "Igbo": "languages", "Hausa": "languages",
              "English Literature": "languages", "Literature in English": "languages",
              // Arts
              "Fine Art": "arts", "Art": "arts", "Music": "arts", "Drama": "arts",
              "Media Studies": "arts",
              // Humanities
              "History": "humanities", "Geography": "humanities", "Social Studies": "humanities",
              "Civic Education": "humanities", "Religious Studies": "humanities",
              "Religious Education": "humanities", "Government": "humanities",
              "Citizenship": "humanities", "US History": "humanities", "World History": "humanities",
              "Psychology": "humanities", "Sociology": "humanities",
              // Commercial
              "Economics": "commercial", "Commerce": "commercial", "Accounting": "commercial",
              "Business Studies": "commercial",
              // Technology
              "Computer Science": "technology", "Technical Drawing": "technology",
              "ICT": "technology", "Design & Technology": "technology",
              "Food Technology": "technology",
              // General / Vocational
              "Physical Education": "general", "Health": "general",
              "Home Economics": "vocational",
            };
            const SUBJECT_PRESETS: { id: string; label: string; subjects: string[] }[] = [
              {
                id: "primary_core",
                label: "Primary Core",
                subjects: ["Mathematics", "English Language", "Science", "Social Studies", "Geography", "History", "Art", "Music", "Physical Education", "Health", "Religious Education", "French"],
              },
              {
                id: "us_high",
                label: "US High School",
                subjects: ["Algebra", "Geometry", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "US History", "World History", "Geography", "Economics", "Computer Science", "Spanish", "Art", "Music", "Drama", "Physical Education", "Health", "Psychology", "Environmental Science", "Statistics"],
              },
              {
                id: "uk_gcse",
                label: "UK Secondary (GCSE)",
                subjects: ["Mathematics", "English Language", "English Literature", "Biology", "Chemistry", "Physics", "Geography", "History", "French", "Spanish", "Religious Education", "Art", "Music", "Drama", "Design & Technology", "Computer Science", "Physical Education", "Citizenship", "Business Studies", "Food Technology", "Media Studies"],
              },
              {
                id: "ng_science",
                label: "West Africa — Science",
                subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Further Mathematics", "Computer Science", "Geography", "Civic Education", "Agricultural Science", "Literature in English", "Economics"],
              },
              {
                id: "ng_arts",
                label: "West Africa — Arts",
                subjects: ["Mathematics", "English Language", "Literature in English", "Government", "History", "Economics", "Civic Education", "Religious Studies", "French", "Fine Art", "Music", "Geography"],
              },
              {
                id: "ng_commercial",
                label: "West Africa — Commercial",
                subjects: ["Mathematics", "English Language", "Economics", "Commerce", "Accounting", "Business Studies", "Government", "Civic Education", "Computer Science", "Geography", "Literature in English"],
              },
            ];
            return (
              <div>
                <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {SUBJECT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setData((prev) => {
                          const merged = Array.from(new Set([...prev.subjects, ...preset.subjects]));
                          const depts = { ...prev.subjectDepartments };
                          for (const subj of preset.subjects) {
                            if (!depts[subj] && SUBJECT_DEPT_MAP[subj]) {
                              depts[subj] = SUBJECT_DEPT_MAP[subj];
                            }
                          }
                          return { ...prev, subjects: merged, subjectDepartments: depts };
                        });
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
              Common subjects — click to add
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SUBJECTS.map((subject) => {
                const isSelected = data.subjects.includes(subject);
                return (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={cn(
                      "px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-colors",
                      isSelected
                        ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                        : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          </div>

          {data.subjects.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Selected subjects ({data.subjects.length})
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {data.subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
                  >
                    {s}
                    <button
                      onClick={() => toggleSubject(s)}
                      className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addSubject(); }}
              placeholder="Add custom subject..."
              className="w-48 px-2 py-1 text-sm bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
            />
            {subjectInput.trim() && (
              <button
                onClick={addSubject}
                className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            )}
          </div>

          {/* Subject Departments */}
          {data.subjects.length > 0 && (
            <div className="mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50">
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                Assign departments <span className="normal-case font-normal">(optional — helps with timetabling and reporting)</span>
              </p>
              <div className="space-y-1.5">
                {data.subjects.map((subj) => (
                  <div key={subj} className="flex items-center gap-3">
                    <span className="text-[13px] text-[var(--foreground)] w-40 truncate shrink-0" title={subj}>{subj}</span>
                    <select
                      value={data.subjectDepartments[subj] || ""}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          subjectDepartments: { ...prev.subjectDepartments, [subj]: e.target.value },
                        }));
                      }}
                      className="px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[#0891B2]"
                    >
                      <option value="">No department</option>
                      {SUBJECT_DEPARTMENTS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 7. Grading & Assessment */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="grading"
          title="Grading & Assessment"
          description="Choose a regional standard, then customize to fit your school"
          icon={<BarChart3 className="w-5 h-5" />}
          isComplete={isGradingComplete(data)}
          isExpanded={expanded === "grading"}
          onToggle={() => toggleSection("grading")}
        >
          {/* Step 1: Choose a regional preset */}
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
              Start from preset
            </label>
            <div className="flex flex-wrap gap-2">
              {GRADING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectGradingPreset(preset.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg border transition-all",
                    data.gradingPresetId === preset.id
                      ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                      : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Editable grading table (shown after selecting a preset) */}
          {data.gradingPresetId && data.gradingScale.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[13px] font-medium text-[var(--foreground)]">Grade Boundaries</p>
                  <p className="text-[11px] text-[var(--muted)]">
                    Customize the scale to match your school&apos;s requirements
                  </p>
                </div>
                <button
                  onClick={() => selectGradingPreset(data.gradingPresetId)}
                  className="text-[11px] font-medium text-[#0891B2] hover:underline"
                >
                  Reset to default
                </button>
              </div>

              <div className="rounded-lg border border-[var(--border)] overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_40px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)]">
                  <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Grade</span>
                  <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Min %</span>
                  <span className="px-3 py-2 text-[11px] font-semibold text-[var(--muted)] uppercase">Max %</span>
                  <span />
                </div>
                {/* Table rows */}
                {data.gradingScale.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      "grid grid-cols-[minmax(80px,1.2fr)_1fr_1fr_40px] gap-0 items-center",
                      i < data.gradingScale.length - 1 && "border-b border-[var(--border)]"
                    )}
                  >
                    <input
                      value={row.grade}
                      onChange={(e) => updateGradeRow(i, "grade", e.target.value)}
                      className="px-3 py-2.5 text-[12px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5"
                    />
                    <input
                      value={row.minScore}
                      onChange={(e) => updateGradeRow(i, "minScore", e.target.value)}
                      type="number"
                      className="px-3 py-2.5 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                    />
                    <input
                      value={row.maxScore}
                      onChange={(e) => updateGradeRow(i, "maxScore", e.target.value)}
                      type="number"
                      className="px-3 py-2.5 text-[12px] bg-transparent text-[var(--foreground)] focus:outline-none focus:bg-[#0891B2]/5 border-l border-[var(--border)]"
                    />
                    <button
                      onClick={() => removeGradeRow(i)}
                      className="flex items-center justify-center p-2 text-[var(--muted)] hover:text-red-500 transition-colors border-l border-[var(--border)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addGradeRow}
                className="flex items-center gap-1.5 px-3 py-2 mt-2 text-[12px] font-medium text-[#0891B2] hover:bg-[#0891B2]/5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Grade
              </button>

              {/* Live preview */}
              <div className="mt-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] p-3">
                <p className="text-[11px] font-semibold text-[var(--muted)] uppercase mb-2">Preview: Score → Grade</p>
                <div className="flex flex-wrap gap-1.5">
                  {[95, 80, 72, 65, 55, 45, 35, 20].map((score) => {
                    const match = data.gradingScale.find(
                      (g) => score >= Number(g.minScore) && score <= Number(g.maxScore)
                    );
                    return (
                      <span
                        key={score}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-[var(--card)] border border-[var(--border)]"
                      >
                        <span className="text-[var(--muted)]">{score}%</span>
                        <span className="font-semibold text-[var(--foreground)]">→ {match?.grade || "—"}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Assessment weights & pass mark */}
          <Field label="CA Weight (%)" description="Weight of continuous assessment">
            <TextInput value={data.caWeight} onChange={(v) => update("caWeight", v)} type="number" />
          </Field>
          <Field label="Exam Weight (%)" description="Weight of exam in final score">
            <TextInput value={data.examWeight} onChange={(v) => update("examWeight", v)} type="number" />
          </Field>
          <Field label="Pass Mark (%)" description="Minimum percentage to pass">
            <TextInput value={data.passmark} onChange={(v) => update("passmark", v)} type="number" />
          </Field>
          <Field label="GPA Scale" description="Enable 4.0 GPA scale">
            <Toggle checked={data.gpaEnabled} onChange={(v) => update("gpaEnabled", v)} />
          </Field>

          {/* CA Breakdown */}
          <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-3">
            <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
              CA Breakdown <span className="normal-case font-normal">(how the {data.caWeight || 40}% CA is split)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Assignments (%)" description="Weight for assignments">
                <TextInput value={data.assignmentWeight} onChange={(v) => update("assignmentWeight", v)} placeholder="e.g. 10" type="number" />
              </Field>
              <Field label="Tests (%)" description="Weight for class tests">
                <TextInput value={data.testWeight} onChange={(v) => update("testWeight", v)} placeholder="e.g. 20" type="number" />
              </Field>
              <Field label="Projects (%)" description="Weight for projects">
                <TextInput value={data.projectWeight} onChange={(v) => update("projectWeight", v)} placeholder="e.g. 10" type="number" />
              </Field>
            </div>
            {(() => {
              const total = (parseInt(data.assignmentWeight) || 0) + (parseInt(data.testWeight) || 0) + (parseInt(data.projectWeight) || 0);
              const caTotal = parseInt(data.caWeight) || 40;
              if (total > 0 && total !== caTotal) {
                return (
                  <p className={cn("text-xs font-medium", total > caTotal ? "text-red-500" : "text-amber-500")}>
                    Total: {total}% — {total > caTotal ? `exceeds CA weight of ${caTotal}%` : `should add up to ${caTotal}%`}
                  </p>
                );
              }
              if (total > 0 && total === caTotal) {
                return <p className="text-xs font-medium text-[#10B981]">Total: {total}% — matches CA weight</p>;
              }
              return null;
            })()}
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 8. Fee Categories */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="fees"
          title="Fee Categories"
          description="Define the types of fees your school charges"
          icon={<Wallet className="w-5 h-5" />}
          isComplete={isFeesComplete(data)}
          isExpanded={expanded === "fees"}
          onToggle={() => toggleSection("fees")}
        >
          {/* Fee presets */}
          <div>
            <label className="block text-[10px] text-[var(--muted)] mb-1.5">Quick Start — Apply a Preset</label>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {FEE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyFeePreset(preset.id)}
                  className="px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
                >
                  {preset.label}
                  <span className="ml-1 text-[9px] opacity-60">({preset.fees.length})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
              Common categories — click to add
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_FEE_CATEGORIES.map((cat) => {
                const isAdded = data.feeCategories.some((f) => f.name === cat);
                return (
                  <button
                    key={cat}
                    onClick={() => { if (!isAdded) addFeeCategory(cat); }}
                    disabled={isAdded}
                    className={cn(
                      "px-2.5 py-1 text-[12px] font-medium rounded-lg border transition-colors",
                      isAdded
                        ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2] cursor-default"
                        : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {data.feeCategories.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                Your fee structure
              </label>
              <p className="text-xs text-[var(--muted)] mb-3">
                Define fee categories, which grade levels they apply to, and set amounts per level.
              </p>
              <div className="space-y-2">
                {data.feeCategories.map((fee, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-[var(--border)] overflow-hidden"
                  >
                    {/* Category header row */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--background-secondary)]">
                      <input
                        value={fee.name}
                        onChange={(e) => updateFeeCategory(i, "name", e.target.value)}
                        className="flex-1 text-[13px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[var(--muted)]">Required</span>
                        <Toggle checked={fee.mandatory} onChange={(v) => updateFeeCategory(i, "mandatory", v)} />
                      </div>
                      <button
                        onClick={() => removeFeeCategory(i)}
                        className="p-1 text-[var(--muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Applies to row */}
                    <div className="px-3 py-2.5 flex items-start gap-3">
                      <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider shrink-0 pt-1">Applies to</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateFeeCategory(i, "appliesTo", "all")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors",
                            fee.appliesTo === "all"
                              ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                          )}
                        >
                          All Levels
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFeeCategory(i, "appliesTo", "specific")}
                          className={cn(
                            "px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors",
                            fee.appliesTo === "specific"
                              ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                              : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                          )}
                        >
                          Specific Levels
                        </button>
                        {fee.appliesTo === "specific" && data.gradeLevels.length > 0 && (
                          <>
                            <span className="text-[var(--border)] self-center">|</span>
                            {data.gradeLevels.map((level) => {
                              const selected = fee.gradeLevels.includes(level);
                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => toggleFeeCategoryLevel(i, level)}
                                  className={cn(
                                    "px-2 py-1 text-[11px] font-medium rounded-md border transition-colors",
                                    selected
                                      ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                                      : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                                  )}
                                >
                                  {level}
                                </button>
                              );
                            })}
                          </>
                        )}
                        {fee.appliesTo === "specific" && data.gradeLevels.length === 0 && (
                          <span className="text-[11px] text-[var(--muted)] italic self-center">
                            Add grade levels in Academic Structure first
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Amounts per grade level */}
                    {(() => {
                      const levels =
                        fee.appliesTo === "all"
                          ? data.gradeLevels
                          : fee.gradeLevels;
                      const hasLevels = levels.length > 0;
                      const allSame = hasLevels && levels.length > 1 && levels.every((l) => fee.amounts[l] && fee.amounts[l] === fee.amounts[levels[0]]);
                      return (
                        <div className="px-3 py-2.5 border-t border-[var(--border)] space-y-2">
                          {!hasLevels ? (
                            <>
                              <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">Amount</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={fee.amounts["_flat"] || ""}
                                  onChange={(e) => updateFeeCategoryAmount(i, "_flat", e.target.value)}
                                  placeholder="0"
                                  className="w-48 px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                                />
                                <span className="text-[10px] text-[var(--muted)]">
                                  Set grade levels in Academic Structure for per-level pricing
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider block">
                                Amount per level
                              </span>
                              {/* Set all at once */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[var(--muted)] shrink-0">Set all:</span>
                                <input
                                  type="number"
                                  placeholder="Same amount for all levels"
                                  className="w-48 px-2 py-1.5 text-[12px] bg-[var(--card)] border border-dashed border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const val = (e.target as HTMLInputElement).value;
                                      if (val) {
                                        const newAmounts = { ...fee.amounts };
                                        levels.forEach((l) => { newAmounts[l] = val; });
                                        updateFeeCategory(i, "amounts", newAmounts);
                                      }
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const val = e.target.value;
                                    if (val) {
                                      const newAmounts = { ...fee.amounts };
                                      levels.forEach((l) => { newAmounts[l] = val; });
                                      updateFeeCategory(i, "amounts", newAmounts);
                                    }
                                  }}
                                />
                                <span className="text-[10px] text-[var(--muted)]">
                                  {allSame ? `All set to ${fee.amounts[levels[0]]}` : "Then adjust individual levels below"}
                                </span>
                              </div>
                              {/* Per-level amounts */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {levels.map((level) => (
                                  <div key={level} className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-[var(--muted)] w-16 truncate shrink-0" title={level}>
                                      {level}
                                    </span>
                                    <input
                                      type="number"
                                      value={fee.amounts[level] || ""}
                                      onChange={(e) => updateFeeCategoryAmount(i, level, e.target.value)}
                                      placeholder="0"
                                      className="w-full px-2 py-1.5 text-[12px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                                    />
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <input
              type="text"
              value={feeCategoryInput}
              onChange={(e) => setFeeCategoryInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addFeeCategory(); }}
              placeholder="Add custom category..."
              className="w-48 px-2 py-1 text-sm bg-[var(--card)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
            />
            {feeCategoryInput.trim() && (
              <button
                onClick={() => addFeeCategory()}
                className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            )}
          </div>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 9. Report Card */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="reportcard"
          title="Report Card"
          description="Configure report card generation and layout"
          icon={<FileText className="w-5 h-5" />}
          isComplete={isReportCardComplete(data)}
          isExpanded={expanded === "reportcard"}
          onToggle={() => toggleSection("reportcard")}
        >
          <Field label="Default Template" description="Template used for generating report cards">
            <Select value={data.reportTemplate} onChange={(v) => update("reportTemplate", v)} options={REPORT_CARD_TEMPLATES} />
          </Field>
          <Field label="Show Class Position" description="Display student ranking in class">
            <Toggle checked={data.showPosition} onChange={(v) => update("showPosition", v)} />
          </Field>
          <Field label="Show GPA" description="Display GPA on report card">
            <Toggle checked={data.showGPA} onChange={(v) => update("showGPA", v)} />
          </Field>
          <Field label="Teacher Comments" description="Include teacher comments section">
            <Toggle checked={data.showTeacherComments} onChange={(v) => update("showTeacherComments", v)} />
          </Field>
          <Field label="Principal Signature" description="Include principal signature line">
            <Toggle checked={data.showPrincipalSignature} onChange={(v) => update("showPrincipalSignature", v)} />
          </Field>
          <Field label="Attendance Summary" description="Show term attendance record on report card">
            <Toggle checked={data.showAttendanceSummary} onChange={(v) => update("showAttendanceSummary", v)} />
          </Field>
          <Field label="Behavior / Conduct Rating" description="Include behavior or conduct assessment">
            <Toggle checked={data.showBehaviorRating} onChange={(v) => update("showBehaviorRating", v)} />
          </Field>
          <Field label="Subject Teacher Signatures" description="Include signature line per subject teacher">
            <Toggle checked={data.showSubjectTeacherSignature} onChange={(v) => update("showSubjectTeacherSignature", v)} />
          </Field>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 10. Communication & Notifications */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="comms"
          title="Communication & Notifications"
          description="Notification preferences and communication channels"
          icon={<Bell className="w-5 h-5" />}
          isComplete={isCommsComplete(data)}
          isExpanded={expanded === "comms"}
          onToggle={() => toggleSection("comms")}
        >
          <Field label="Parent Portal" description="Allow parents to view student information">
            <Toggle checked={data.parentPortal} onChange={(v) => update("parentPortal", v)} />
          </Field>
          <Field label="Report Card Comments" description="Enable teacher comments on report cards">
            <Toggle checked={data.reportComments} onChange={(v) => update("reportComments", v)} />
          </Field>
          <Field label="Attendance Alerts" description="Notify parents of student absences">
            <Toggle checked={data.attendanceAlerts} onChange={(v) => update("attendanceAlerts", v)} />
          </Field>
          <Field label="Fee Reminders" description="Send automated fee payment reminders">
            <Toggle checked={data.feeReminders} onChange={(v) => update("feeReminders", v)} />
          </Field>
          <Field label="Exam Result Notifications" description="Notify when exam results are published">
            <Toggle checked={data.examResultNotify} onChange={(v) => update("examResultNotify", v)} />
          </Field>
        </SectionCard>

        {/* ----------------------------------------------------------------- */}
        {/* 6. Policies */}
        {/* ----------------------------------------------------------------- */}
        <SectionCard
          id="policies"
          title="Policies"
          description="School policies for attendance, promotion, and discipline"
          icon={<Shield className="w-5 h-5" />}
          isComplete={isPoliciesComplete(data)}
          isExpanded={expanded === "policies"}
          onToggle={() => toggleSection("policies")}
        >
          <Field label="Late Arrival Grace Period" description="Minutes allowed before marked late">
            <TextInput value={data.lateGracePeriod} onChange={(v) => update("lateGracePeriod", v)} placeholder="e.g. 15" type="number" />
          </Field>
          <Field label="Attendance Threshold (%)" description="Minimum attendance percentage before flagging">
            <TextInput value={data.attendanceThreshold} onChange={(v) => update("attendanceThreshold", v)} placeholder="e.g. 75" type="number" />
          </Field>
          <Field label="Promotion Criteria" description="How students are promoted to the next level">
            <Select value={data.promotionCriteria} onChange={(v) => update("promotionCriteria", v)} options={PROMOTION_CRITERIA} />
          </Field>

          {/* Detailed Promotion Rules */}
          {data.promotionCriteria && (
            <div className="col-span-full mt-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-4">
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Promotion Rules</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Min. Subjects to Pass" description="Minimum number of subjects a student must pass">
                  <TextInput
                    value={data.promotionRules.minSubjectsToPass}
                    onChange={(v) => updatePromotionRule("minSubjectsToPass", v)}
                    placeholder="e.g. 5"
                    type="number"
                  />
                </Field>
                <Field label="Max Repeats Allowed" description="Maximum times a student can repeat a level">
                  <TextInput
                    value={data.promotionRules.maxRepeats}
                    onChange={(v) => updatePromotionRule("maxRepeats", v)}
                    placeholder="e.g. 1"
                    type="number"
                  />
                </Field>
              </div>

              <Field label="Required Subjects" description="Subjects that must be passed for promotion (select from your subjects list)">
                <div className="flex flex-wrap gap-2">
                  {data.subjects.length === 0 && (
                    <p className="text-xs text-[var(--muted)] italic">Add subjects in the &ldquo;Subjects Offered&rdquo; section first</p>
                  )}
                  {data.subjects.map((subj) => {
                    const isSelected = data.promotionRules.requiredSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => {
                          const current = data.promotionRules.requiredSubjects;
                          updatePromotionRule(
                            "requiredSubjects",
                            isSelected ? current.filter((s) => s !== subj) : [...current, subj],
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                            : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)]/20"
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Allow Remedial Exams" description="Students who fail can retake exams before being held back">
                <Toggle
                  checked={data.promotionRules.allowRemedial}
                  onChange={(v) => updatePromotionRule("allowRemedial", v)}
                />
              </Field>
            </div>
          )}

          <Field label="Discipline System" description="Enable disciplinary tracking and records">
            <Toggle checked={data.disciplineSystem} onChange={(v) => update("disciplineSystem", v)} />
          </Field>
        </SectionCard>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 bg-[var(--card)]/95 backdrop-blur-sm border-t border-[var(--border)] px-6 py-4">
        <div className="max-w-[900px] mx-auto flex items-center justify-between">
          <p className="text-[13px] text-[var(--muted)]">
            {completedCount === setupSections.length
              ? "All sections completed!"
              : `${setupSections.length - completedCount} section${setupSections.length - completedCount !== 1 ? "s" : ""} remaining`}
          </p>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveMessage && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] font-medium text-[#10B981]"
                >
                  Changes saved!
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
