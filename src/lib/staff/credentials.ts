import type { CredentialStatus, ProfessionalRegistration, TrainingRecord, VettingCheck } from "@/types/staff";
import { diffDays, isValidISODate } from "./dates";

/**
 * Compliance rules shared by professional registrations, vetting checks and
 * training records. Status is derived from the expiry date and "today"; it is
 * never stored. 60 day window, 30 day urgent tier, both tenant settings in
 * the spec. A vetting check whose outcome is not clear (pending, or a concern
 * raised) needs review and counts as unknown even without an expiry.
 */
export const CREDENTIAL_EXPIRY_WINDOW_DAYS = 60;
export const CREDENTIAL_URGENT_DAYS = 30;

export type ExpiringKind = "registration" | "check" | "training";

/** One row of the compliance list, whichever table it came from. */
export interface ExpiringItem {
  kind: ExpiringKind;
  id: string;
  staffId: string;
  label: string;
  expiryDate: string | null;
  /** Checks only: an outcome other than clear (pending, or a concern raised) needs attention regardless of expiry. */
  needsReview: boolean;
}

/** A vetting check needs review unless its outcome is clear: still pending, or a concern was raised. */
export function checkNeedsReview(check: Pick<VettingCheck, "outcome">): boolean {
  return check.outcome !== "clear";
}

export function expiringItemsOf(input: {
  registrations?: readonly ProfessionalRegistration[];
  checks?: readonly VettingCheck[];
  training?: readonly TrainingRecord[];
}): ExpiringItem[] {
  return [
    ...(input.registrations ?? []).map((r) => ({ kind: "registration" as const, id: r.id, staffId: r.staffId, label: `${r.body.toUpperCase()} ${r.number}`, expiryDate: r.expiryDate, needsReview: false })),
    ...(input.checks ?? []).map((c) => ({ kind: "check" as const, id: c.id, staffId: c.staffId, label: c.type, expiryDate: c.expiryDate, needsReview: checkNeedsReview(c) })),
    ...(input.training ?? []).map((t) => ({ kind: "training" as const, id: t.id, staffId: t.staffId, label: t.type, expiryDate: t.expiryDate, needsReview: false })),
  ];
}

/** Days from today until expiry. Negative once expired; null if it never expires or the value is not a date. */
export function daysUntilExpiry(expiryDate: string | null, todayISO: string): number | null {
  if (expiryDate === null || !isValidISODate(expiryDate) || !isValidISODate(todayISO)) return null;
  return diffDays(todayISO, expiryDate);
}

export function credentialStatus(expiryDate: string | null, todayISO: string, windowDays: number = CREDENTIAL_EXPIRY_WINDOW_DAYS): CredentialStatus {
  if (expiryDate === null) return "valid";
  const days = daysUntilExpiry(expiryDate, todayISO);
  if (days === null) return "unknown";
  if (days < 0) return "expired";
  return days <= windowDays ? "expiring" : "valid";
}

function statusOf(item: ExpiringItem, todayISO: string, windowDays: number): CredentialStatus {
  if (item.needsReview) return "unknown";
  return credentialStatus(item.expiryDate, todayISO, windowDays);
}

export type CredentialHealth = "none" | "ok" | "unknown" | "expiring" | "expired";

const HEALTH_RANK: Record<CredentialHealth, number> = { none: 0, ok: 1, unknown: 2, expiring: 3, expired: 4 };

export function credentialHealth(items: readonly ExpiringItem[], todayISO: string, windowDays: number = CREDENTIAL_EXPIRY_WINDOW_DAYS): CredentialHealth {
  if (items.length === 0) return "none";
  let worst: CredentialHealth = "ok";
  for (const item of items) {
    const status = statusOf(item, todayISO, windowDays);
    const health: CredentialHealth = status === "valid" ? "ok" : status;
    if (HEALTH_RANK[health] > HEALTH_RANK[worst]) worst = health;
  }
  return worst;
}

export interface ComplianceSummary {
  total: number;
  valid: number;
  expiring: number;
  expired: number;
  unknown: number;
  staffWithIssues: number;
}

export function complianceSummary(items: readonly ExpiringItem[], todayISO: string, windowDays: number = CREDENTIAL_EXPIRY_WINDOW_DAYS): ComplianceSummary {
  const summary: ComplianceSummary = { total: items.length, valid: 0, expiring: 0, expired: 0, unknown: 0, staffWithIssues: 0 };
  const flagged = new Set<string>();
  for (const item of items) {
    const status = statusOf(item, todayISO, windowDays);
    summary[status] += 1;
    if (status !== "valid") flagged.add(item.staffId);
  }
  summary.staffWithIssues = flagged.size;
  return summary;
}

export interface CredentialAttention {
  item: ExpiringItem;
  status: Exclude<CredentialStatus, "valid">;
  daysUntilExpiry: number | null;
  urgent: boolean;
}

const ATTENTION_RANK: Record<Exclude<CredentialStatus, "valid">, number> = { expired: 0, unknown: 1, expiring: 2 };

/** Expired first, then unknown, then expiring soonest first. */
export function credentialsNeedingAttention(items: readonly ExpiringItem[], todayISO: string, windowDays: number = CREDENTIAL_EXPIRY_WINDOW_DAYS): CredentialAttention[] {
  const out: CredentialAttention[] = [];
  for (const item of items) {
    const status = statusOf(item, todayISO, windowDays);
    if (status === "valid") continue;
    const days = daysUntilExpiry(item.expiryDate, todayISO);
    out.push({ item, status, daysUntilExpiry: days, urgent: days === null || days <= CREDENTIAL_URGENT_DAYS });
  }
  return out.sort((a, b) => ATTENTION_RANK[a.status] - ATTENTION_RANK[b.status] || (a.daysUntilExpiry ?? 0) - (b.daysUntilExpiry ?? 0));
}
