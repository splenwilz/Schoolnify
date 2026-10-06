import type { PersonPhone } from "@/types/person";

/**
 * Person helpers. Phone numbers are stored as E.164. We deliberately do not
 * ship libphonenumber (80 KB of metadata) for this: Zod's e164 check covers
 * validity for storage, and this normaliser handles the one thing users
 * actually type, a national number for their own country.
 */

const DIAL_CODE: Record<string, string> = { NG: "234", GB: "44", US: "1", GH: "233", KE: "254", ZA: "27", IE: "353", CA: "1" };
const E164 = /^\+[1-9]\d{6,14}$/;

/** Whether national numbers can be converted for this country; otherwise only international input is accepted. */
export function supportsNationalNumbers(country: string): boolean {
  return country.toUpperCase() in DIAL_CODE;
}

/** The validation message for a phone that could not be normalised, naming the limitation when the country is unsupported. */
export function phoneErrorMessage(country: string): string {
  return supportsNationalNumbers(country)
    ? "Enter a valid phone number, with the country code if outside the school's country"
    : `Enter the number in international format starting with +; national numbers for ${country.toUpperCase()} are not recognised yet`;
}

/**
 * "0803 123 4567" (NG) -> "+2348031234567"; "2348031234567" -> "+2348031234567";
 * already-international input passes through. Null when not plausible.
 */
export function normalizeToE164(input: string, defaultCountry: string): string | null {
  let s = input.trim().replace(/[\s().-]/g, "");
  if (s === "") return null;
  if (s.startsWith("00")) s = `+${s.slice(2)}`;
  if (s.startsWith("+")) {
    // Strip a UK-style trunk prefix written as "+44 (0)7..." which arrives here as "+440..."
    const code = Object.values(DIAL_CODE).find((c) => s.startsWith(`+${c}0`));
    if (code) s = `+${code}${s.slice(code.length + 2)}`;
    return E164.test(s) ? s : null;
  }
  const code = DIAL_CODE[defaultCountry.toUpperCase()];
  if (!code || !/^\d+$/.test(s)) return null;
  // Typed with the country code but no plus (common in spreadsheet exports).
  // National numbers never start with their own dialling code in the
  // supported countries once the trunk zero is dropped, so this is safe.
  if (!s.startsWith("0") && s.startsWith(code) && s.length - code.length >= 7 && E164.test(`+${s}`)) return `+${s}`;
  const national = s.startsWith("0") ? s.slice(1) : s;
  const candidate = `+${code}${national}`;
  return E164.test(candidate) && national.length >= 7 ? candidate : null;
}

/** Primary mobile, else any primary, else the first number on file. */
export function primaryPhone(phones: readonly PersonPhone[]): string | null {
  if (phones.length === 0) return null;
  return (
    phones.find((p) => p.isPrimary && p.type === "mobile")?.number ??
    phones.find((p) => p.isPrimary)?.number ??
    phones[0].number
  );
}

/** Exactly one primary when any contacts exist; returns a message or null. */
export function validateEmergencyContacts(contacts: readonly { isPrimary: boolean }[]): string | null {
  if (contacts.length === 0) return null;
  const primaries = contacts.filter((c) => c.isPrimary).length;
  if (primaries === 0) return "Mark one primary emergency contact";
  if (primaries > 1) return "Only one emergency contact can be primary";
  return null;
}
