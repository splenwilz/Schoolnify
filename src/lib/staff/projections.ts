import type { ContractRole, ContractType, Employer, EmploymentEvent, EmploymentStatus, ExitReason, StaffContract } from "@/types/staff";

/**
 * Read-model projections from contracts, roles and employment events. The
 * API returns these for list rendering; the demo computes them here. Every
 * function takes the reference date explicitly.
 */

const within = (start: string, end: string | null, dateISO: string) => start <= dateISO && (end === null || end >= dateISO);

/** The contract whose window contains the date; the latest-starting one if several overlap. */
export function currentContractOn(contracts: readonly StaffContract[], dateISO: string): StaffContract | null {
  let best: StaffContract | null = null;
  for (const c of contracts) {
    if (!within(c.startDate, c.endDate, dateISO)) continue;
    if (!best || c.startDate > best.startDate) best = c;
  }
  return best;
}

/** The primary post active on the date within a contract. */
export function primaryRoleOn(contract: StaffContract, dateISO: string): ContractRole | null {
  return contract.roles.find((r) => r.isPrimary && r.roleKind === "post" && within(r.startDate, r.endDate, dateISO)) ?? null;
}

/** Posts and responsibilities active on the date across all contracts. */
export function activeRolesOn(contracts: readonly StaffContract[], dateISO: string): ContractRole[] {
  return contracts.flatMap((c) => (within(c.startDate, c.endDate, dateISO) ? c.roles.filter((r) => within(r.startDate, r.endDate, dateISO)) : []));
}

export interface ExitInfo {
  date: string;
  reason: ExitReason | null;
  eligibleForRehire: boolean | null;
}

/** The exit that still stands: the last exit not followed by a rehire. */
export function exitOf(events: readonly EmploymentEvent[]): ExitInfo | null {
  const ordered = [...events].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  let exit: ExitInfo | null = null;
  for (const e of ordered) {
    if (e.type === "exit") exit = { date: e.effectiveDate, reason: (e.reason as ExitReason | null) ?? null, eligibleForRehire: e.eligibleForRehire };
    if (e.type === "rehire") exit = null;
  }
  return exit;
}

/** First hire, or the latest rehire after an exit. */
export function employmentStartOf(events: readonly EmploymentEvent[]): string | null {
  const ordered = [...events].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  let start: string | null = null;
  for (const e of ordered) {
    if (e.type === "hire" && start === null) start = e.effectiveDate;
    if (e.type === "rehire") start = e.effectiveDate;
  }
  return start;
}

/**
 * Status on a date, from events in order:
 *  - inactive from an exit until a rehire;
 *  - suspended inside a suspension window, cut short by a reinstatement;
 *  - onboarding before the (re)hire date, active from it;
 *  - an explicit status_change (outcome = status) overrides from its date.
 */
export function employmentStatusOn(events: readonly EmploymentEvent[], dateISO: string): EmploymentStatus {
  const ordered = [...events].filter((e) => e.effectiveDate <= dateISO).sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  let status: EmploymentStatus = "onboarding";
  let suspendedUntil: string | null = null;
  for (const e of ordered) {
    switch (e.type) {
      case "hire":
      case "rehire":
        status = "active";
        suspendedUntil = null;
        break;
      case "exit":
        status = "inactive";
        break;
      case "suspension":
        suspendedUntil = e.endDate;
        status = "suspended";
        break;
      case "reinstatement":
        suspendedUntil = null;
        status = "active";
        break;
      case "status_change":
        if (e.outcome === "onboarding" || e.outcome === "active" || e.outcome === "suspended" || e.outcome === "inactive") status = e.outcome;
        break;
      default:
        break;
    }
  }
  if (status === "suspended" && suspendedUntil !== null && suspendedUntil < dateISO) status = "active";
  return status;
}

export interface EmploymentProjection {
  employmentStatus: EmploymentStatus;
  /** The last contract has ended, no exit was recorded and the events still say employed. */
  contractLapsed: boolean;
  /** End of the contract current on the date, else of the last one that had started by then; null when open ended or none. */
  contractEndDate: string | null;
  hireDate: string;
  exitDate: string | null;
  exitReason: ExitReason | null;
  designation: string;
  department: string;
  reportsToId: string | null;
  ftePercent: number;
  contractType: ContractType;
  employer: Employer;
  isTermTimeOnly: boolean;
  gradeLevel: string | null;
}

export const UNASSIGNED = "Unassigned";

export function projectEmployment(contracts: readonly StaffContract[], events: readonly EmploymentEvent[], dateISO: string): EmploymentProjection {
  const current = currentContractOn(contracts, dateISO);
  // A contract that has not started yet must not stand in for the gap before it.
  const latest = latestContract(contracts.filter((c) => c.startDate <= dateISO)) ?? latestContract(contracts);
  const contract = current ?? latest;
  const role = contract ? primaryRoleOn(contract, dateISO) ?? contract.roles.find((r) => r.isPrimary) ?? null : null;
  const exit = exitOf(events);
  const start = employmentStartOf(events) ?? contract?.startDate ?? dateISO;
  const status = employmentStatusOn(events, dateISO);
  // Job shares: FTE is the sum over every contract active on the date.
  const activeFte = contracts.reduce((sum, c) => sum + (within(c.startDate, c.endDate, dateISO) ? c.fte : 0), 0);
  return {
    employmentStatus: status,
    contractLapsed: current === null && latest !== null && latest.endDate !== null && latest.endDate < dateISO && status !== "inactive",
    contractEndDate: contract?.endDate ?? null,
    hireDate: start,
    exitDate: exit?.date ?? null,
    exitReason: exit?.reason ?? null,
    designation: role?.designation ?? UNASSIGNED,
    department: role?.department ?? UNASSIGNED,
    reportsToId: role?.reportsToId ?? null,
    ftePercent: Math.round((current ? activeFte : contract?.fte ?? 0) * 100),
    contractType: contract?.contractType ?? "temporary",
    employer: contract?.employer ?? "school",
    isTermTimeOnly: contract?.isTermTimeOnly ?? false,
    gradeLevel: role?.payStructure?.gradeLevel ?? null,
  };
}

function latestContract(contracts: readonly StaffContract[]): StaffContract | null {
  return contracts.reduce<StaffContract | null>((best, c) => (!best || c.startDate > best.startDate ? c : best), null);
}
