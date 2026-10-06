"use client";

import { History } from "lucide-react";
import type { EmploymentEvent, EmploymentEventType } from "@/types/staff";
import { EXIT_REASON_LABEL, type ExitReason } from "@/types/staff";
import { formatDate } from "@/lib/staff/dates";

const EVENT_LABEL: Record<EmploymentEventType, string> = {
  hire: "Hired",
  probation_end: "Probation ended",
  confirmation: "Appointment confirmed",
  promotion: "Promoted",
  transfer: "Transferred",
  suspension: "Suspended",
  reinstatement: "Reinstated",
  contract_renewal: "Contract renewed",
  status_change: "Status changed",
  exit: "Left",
  rehire: "Rehired",
};

function detail(e: EmploymentEvent): string | null {
  if (e.type === "exit" && e.reason) return EXIT_REASON_LABEL[e.reason as ExitReason] ?? e.reason;
  if (e.type === "suspension") return `${e.reason ?? "No reason recorded"}${e.endDate ? ` · until ${formatDate(e.endDate, "short")}` : ""}`;
  if (e.type === "status_change") return `${e.outcome ?? ""}${e.reason ? ` · ${e.reason}` : ""}`;
  if (e.type === "probation_end") return e.outcome;
  return e.reason;
}

export function EmploymentTimeline({ events, names }: { events: readonly EmploymentEvent[]; names: ReadonlyMap<string, string> }) {
  const ordered = [...events].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate) || b.recordedAt.localeCompare(a.recordedAt));
  return (
    <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
          <History className="w-3.5 h-3.5 text-[#0891B2]" aria-hidden="true" />
        </div>
        <h3 className="text-[14px] font-semibold text-[var(--foreground)]">Employment history</h3>
      </div>
      {ordered.length === 0 ? (
        <p className="text-[13px] text-[var(--muted)]">No events recorded.</p>
      ) : (
        <ol className="space-y-3">
          {ordered.map((e) => (
            <li key={e.id} className="flex gap-3 text-[13px]">
              <span className="w-24 shrink-0 text-[var(--muted)] tabular-nums">{formatDate(e.effectiveDate, "short")}</span>
              <div>
                <span className="font-medium text-[var(--foreground)]">{EVENT_LABEL[e.type]}</span>
                {detail(e) && <span className="text-[var(--muted)]"> · {detail(e)}</span>}
                {e.recordedById && <span className="block text-[11px] text-[var(--muted)]">Recorded by {names.get(e.recordedById) ?? "Unknown"}</span>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
