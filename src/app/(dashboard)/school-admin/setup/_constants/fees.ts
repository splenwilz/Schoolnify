/**
 * Fee configuration presets and common categories.
 *
 * FEE_PRESETS define category structures (no amounts) by school type.
 * COMMON_FEE_CATEGORIES is a flat list for quick-add.
 * DEFAULT_DISCOUNTS provides common discount templates.
 */

import type { FeeFrequency, FeeType, DiscountType } from "../_components/setup-types";

// ---------------------------------------------------------------------------
// Fee preset item (no amounts -- admin fills those in)
// ---------------------------------------------------------------------------

export interface FeePresetItem {
  name: string;
  mandatory: boolean;
  frequency: FeeFrequency;
  feeType: FeeType;
}

export interface FeePreset {
  id: string;
  label: string;
  description: string;
  items: FeePresetItem[];
}

export const FEE_PRESETS: FeePreset[] = [
  {
    id: "day_school",
    label: "Day School",
    description: "Standard day school fee structure",
    items: [
      { name: "Tuition", mandatory: true, frequency: "per_term", feeType: "tuition" },
      { name: "Registration", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Books & Materials", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Examination Fee", mandatory: true, frequency: "per_term", feeType: "exam" },
      { name: "ICT / Computer", mandatory: false, frequency: "per_term", feeType: "facility" },
      { name: "Sports", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Library", mandatory: false, frequency: "per_term", feeType: "facility" },
      { name: "PTA Levy", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Development Levy", mandatory: true, frequency: "annual", feeType: "admin" },
    ],
  },
  {
    id: "boarding_school",
    label: "Boarding School",
    description: "Day + boarding, feeding, and accommodation fees",
    items: [
      { name: "Tuition", mandatory: true, frequency: "per_term", feeType: "tuition" },
      { name: "Registration", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Boarding", mandatory: true, frequency: "per_term", feeType: "boarding" },
      { name: "Feeding", mandatory: true, frequency: "per_term", feeType: "boarding" },
      { name: "Books & Materials", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Examination Fee", mandatory: true, frequency: "per_term", feeType: "exam" },
      { name: "Laboratory", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "ICT / Computer", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Uniform", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Medical / Insurance", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Sports", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Library", mandatory: false, frequency: "per_term", feeType: "facility" },
      { name: "PTA Levy", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Development Levy", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Transport", mandatory: false, frequency: "per_term", feeType: "transport" },
    ],
  },
  {
    id: "nursery",
    label: "Nursery / Pre-primary",
    description: "Simplified structure for early years",
    items: [
      { name: "Tuition", mandatory: true, frequency: "per_term", feeType: "tuition" },
      { name: "Registration", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Feeding", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Uniform", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Books & Materials", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Activity Fee", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Transport", mandatory: false, frequency: "per_term", feeType: "transport" },
    ],
  },
  {
    id: "international",
    label: "International / IB School",
    description: "International school with enrollment deposit and EAL support",
    items: [
      { name: "Tuition", mandatory: true, frequency: "per_term", feeType: "tuition" },
      { name: "Application Fee", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Enrollment Deposit", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Capital / Development Fund", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Technology Fee", mandatory: true, frequency: "annual", feeType: "facility" },
      { name: "Examination Fee", mandatory: true, frequency: "annual", feeType: "exam" },
      { name: "EAL Support", mandatory: false, frequency: "per_term", feeType: "tuition" },
      { name: "Extra-curricular", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Transport", mandatory: false, frequency: "per_term", feeType: "transport" },
      { name: "Lunch Program", mandatory: false, frequency: "per_term", feeType: "facility" },
      { name: "Insurance", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Re-enrollment Deposit", mandatory: true, frequency: "annual", feeType: "admin" },
    ],
  },
  {
    id: "uk_independent",
    label: "UK Independent School",
    description: "UK independent school with termly billing and extras",
    items: [
      { name: "Tuition", mandatory: true, frequency: "per_term", feeType: "tuition" },
      { name: "Registration Fee", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Acceptance Deposit", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Boarding Supplement", mandatory: false, frequency: "per_term", feeType: "boarding" },
      { name: "Music Tuition", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Individual Learning Support", mandatory: false, frequency: "per_term", feeType: "tuition" },
      { name: "Trips & Excursions", mandatory: false, frequency: "per_term", feeType: "co_curricular" },
      { name: "Lunch", mandatory: true, frequency: "per_term", feeType: "facility" },
      { name: "Insurance", mandatory: true, frequency: "annual", feeType: "admin" },
    ],
  },
  {
    id: "us_private",
    label: "US Private School",
    description: "US private school with financial aid model",
    items: [
      { name: "Tuition", mandatory: true, frequency: "annual", feeType: "tuition" },
      { name: "Enrollment Deposit", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Technology Fee", mandatory: true, frequency: "annual", feeType: "facility" },
      { name: "Activity Fee", mandatory: true, frequency: "annual", feeType: "co_curricular" },
      { name: "Books & Materials", mandatory: true, frequency: "annual", feeType: "facility" },
      { name: "Lunch Program", mandatory: false, frequency: "monthly", feeType: "facility" },
      { name: "Transport", mandatory: false, frequency: "monthly", feeType: "transport" },
      { name: "After-School Care", mandatory: false, frequency: "monthly", feeType: "co_curricular" },
      { name: "Graduation Fee", mandatory: false, frequency: "one_time", feeType: "admin" },
    ],
  },
  {
    id: "india_cbse",
    label: "India CBSE / ICSE",
    description: "Indian private school with quarterly/monthly billing",
    items: [
      { name: "Tuition", mandatory: true, frequency: "monthly", feeType: "tuition" },
      { name: "Admission Fee", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Annual Charges", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Development Fee", mandatory: true, frequency: "annual", feeType: "admin" },
      { name: "Computer Fee", mandatory: true, frequency: "annual", feeType: "facility" },
      { name: "Laboratory Fee", mandatory: true, frequency: "annual", feeType: "facility" },
      { name: "Examination Fee", mandatory: true, frequency: "annual", feeType: "exam" },
      { name: "Transport", mandatory: false, frequency: "monthly", feeType: "transport" },
      { name: "Uniform", mandatory: true, frequency: "one_time", feeType: "one_time_onboarding" },
      { name: "Books & Stationery", mandatory: true, frequency: "annual", feeType: "facility" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Common fee categories (flat list for quick-add UI)
// ---------------------------------------------------------------------------

export const COMMON_FEE_CATEGORIES: { name: string; frequency: FeeFrequency; feeType: FeeType }[] = [
  { name: "Tuition", frequency: "per_term", feeType: "tuition" },
  { name: "Registration", frequency: "one_time", feeType: "one_time_onboarding" },
  { name: "Admission Fee", frequency: "one_time", feeType: "one_time_onboarding" },
  { name: "Boarding", frequency: "per_term", feeType: "boarding" },
  { name: "Feeding", frequency: "per_term", feeType: "boarding" },
  { name: "Transport", frequency: "per_term", feeType: "transport" },
  { name: "Uniform", frequency: "one_time", feeType: "one_time_onboarding" },
  { name: "Books & Materials", frequency: "per_term", feeType: "facility" },
  { name: "Laboratory", frequency: "per_term", feeType: "facility" },
  { name: "ICT / Computer", frequency: "per_term", feeType: "facility" },
  { name: "Sports", frequency: "per_term", feeType: "co_curricular" },
  { name: "Library", frequency: "per_term", feeType: "facility" },
  { name: "PTA Levy", frequency: "annual", feeType: "admin" },
  { name: "Development Levy", frequency: "annual", feeType: "admin" },
  { name: "Examination Fee", frequency: "per_term", feeType: "exam" },
  { name: "Extra-curricular", frequency: "per_term", feeType: "co_curricular" },
  { name: "Medical / Insurance", frequency: "annual", feeType: "admin" },
  { name: "Graduation Fee", frequency: "one_time", feeType: "admin" },
  { name: "Technology Fee", frequency: "annual", feeType: "facility" },
  { name: "Activity Fee", frequency: "per_term", feeType: "co_curricular" },
  { name: "Field Trips", frequency: "per_term", feeType: "co_curricular" },
  { name: "Maintenance Levy", frequency: "annual", feeType: "admin" },
  { name: "ID Card", frequency: "one_time", feeType: "admin" },
  { name: "Lunch Program", frequency: "per_term", feeType: "facility" },
  { name: "After-School Care", frequency: "monthly", feeType: "co_curricular" },
  { name: "Music Tuition", frequency: "per_term", feeType: "co_curricular" },
];

// ---------------------------------------------------------------------------
// Default discount templates
// ---------------------------------------------------------------------------

export const DEFAULT_DISCOUNT_TYPES: DiscountType[] = [
  { name: "Sibling (2nd child)", percentage: "10", appliesTo: "tuition" },
  { name: "Sibling (3rd child)", percentage: "15", appliesTo: "tuition" },
  { name: "Staff Child", percentage: "50", appliesTo: "tuition" },
  { name: "Early Payment", percentage: "5", appliesTo: "all" },
];

// ---------------------------------------------------------------------------
// Fee type and frequency labels (for display)
// ---------------------------------------------------------------------------

export const FEE_TYPE_LABELS: Record<string, string> = {
  tuition: "Tuition",
  facility: "Facility & Resources",
  boarding: "Boarding & Accommodation",
  transport: "Transport",
  exam: "Examination",
  admin: "Administrative",
  co_curricular: "Co-curricular",
  one_time_onboarding: "One-time / Onboarding",
};

export const FEE_FREQUENCY_OPTIONS: { value: string; label: string }[] = [
  { value: "one_time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "per_term", label: "Per Term" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi_annual", label: "Semi-Annual" },
  { value: "annual", label: "Annually" },
];

export const FEE_FREQUENCY_LABELS: Record<string, string> = Object.fromEntries(
  FEE_FREQUENCY_OPTIONS.map((o) => [o.value, o.label])
);
