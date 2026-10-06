import type { ProfessionalRegistration, Staff, TrainingRecord, VettingCheck } from "@/types/staff";
import { staffFullName } from "@/types/staff";
import { credentialHealth, expiringItemsOf, type CredentialHealth, type ExpiringItem } from "./credentials";
import { awayStaffIds, type AbsenceLike } from "./leave";

export interface ComplianceInput {
  registrations: readonly ProfessionalRegistration[];
  checks: readonly VettingCheck[];
  training: readonly TrainingRecord[];
}

/** A staff record plus the derived columns the directory table shows. */
export interface DirectoryRow extends Staff {
  health: CredentialHealth;
  awayToday: boolean;
  managerName: string | null;
}

export function buildDirectoryRows(
  staff: readonly Staff[],
  compliance: ComplianceInput,
  absences: readonly AbsenceLike[],
  todayISO: string
): DirectoryRow[] {
  const byId = new Map(staff.map((s) => [s.id, s]));
  const credsByStaff = new Map<string, ExpiringItem[]>();
  for (const item of expiringItemsOf(compliance)) {
    const list = credsByStaff.get(item.staffId) ?? [];
    list.push(item);
    credsByStaff.set(item.staffId, list);
  }
  const away = awayStaffIds(absences, todayISO);

  return staff.map((s) => {
    const manager = s.reportsToId ? byId.get(s.reportsToId) : undefined;
    return {
      ...s,
      health: credentialHealth(credsByStaff.get(s.id) ?? [], todayISO),
      awayToday: away.has(s.id),
      managerName: manager ? staffFullName(manager) : null,
    };
  });
}
