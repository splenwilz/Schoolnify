/**
 * Person: the human behind a staff member, guardian or (later) student.
 * See docs/12A-STAFF-MODEL-AMENDMENT.md. A person can exist with no login.
 */

export type PhoneType = "mobile" | "home" | "work";

export interface PersonPhone {
  type: PhoneType;
  number: string; // E.164
  isPrimary: boolean;
  verifiedAt: string | null;
}

export interface PersonAddress {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string; // ISO 3166-1 alpha-2
  validFrom: string;
  validTo: string | null;
  isCurrent: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string; // E.164
  altPhone: string | null;
  email: string | null;
  priority: number; // 1 = first to call
  isPrimary: boolean;
}

export type PersonIdentifierType =
  | "nin"
  | "bvn"
  | "tin"
  | "rsa_pin"
  | "nhis"
  | "state_payroll_number"
  | "ippis"
  | "nysc_call_up"
  | "ni_number"
  | "teacher_reference_number"
  | "passport"
  | "other";

/** The client only ever receives a masked value; the API holds the encrypted original. */
export interface PersonIdentifier {
  type: PersonIdentifierType;
  valueMasked: string; // e.g. "****1234"
  issuer: string | null;
  validTo: string | null;
}

export type ConsentPurpose = "id_card" | "website" | "directory";

export interface ConsentFlag {
  purpose: ConsentPurpose;
  grantedAt: string | null;
  withdrawnAt: string | null;
  basis: "consent" | "legitimate_interest";
}

export type PreferredChannel = "sms" | "whatsapp" | "email" | "push";

export const PERSON_IDENTIFIER_LABEL: Record<PersonIdentifierType, string> = {
  nin: "NIN",
  bvn: "BVN",
  tin: "TIN",
  rsa_pin: "Pension RSA PIN",
  nhis: "Health insurance number",
  state_payroll_number: "State payroll number",
  ippis: "IPPIS number",
  nysc_call_up: "NYSC call-up number",
  ni_number: "NI number",
  teacher_reference_number: "Teacher reference number",
  passport: "Passport number",
  other: "Other",
};

/** Fields of a person as flattened onto read models such as Staff. */
export interface PersonFields {
  personId: string;
  title: string | null; // Mr, Dr, Rev. Fr., Alhaji
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  preferredName: string | null;
  formerNames: string[];
  gender: "male" | "female" | "other" | null;
  dateOfBirth: string | null;
  photoUrl: string | null;
  personalEmail: string | null;
  preferredChannel: PreferredChannel;
  preferredLanguage: string | null;
  /** Primary mobile number, E.164, or null when the person has no phone on file. */
  phone: string | null;
  phones: PersonPhone[];
  addresses: PersonAddress[];
  emergencyContacts: EmergencyContact[];
}
