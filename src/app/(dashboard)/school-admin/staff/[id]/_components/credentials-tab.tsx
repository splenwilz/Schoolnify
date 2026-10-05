"use client";

import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { Award, ClipboardCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CredentialStatus, EducationAward, ProfessionalRegistration, TrainingRecord, VettingCheck } from "@/types/staff";
import { AWARD_LABEL, CREDENTIAL_STATUS_LABEL, REGISTRATION_BODY_LABEL, TRAINING_TYPE_LABEL, VETTING_CHECK_LABEL } from "@/types/staff";
import { complianceSummary, credentialStatus, daysUntilExpiry, expiringItemsOf } from "@/lib/staff/credentials";
import { formatDate } from "@/lib/staff/dates";

interface CredentialsTabProps {
  registrations: readonly ProfessionalRegistration[];
  checks: readonly VettingCheck[];
  training: readonly TrainingRecord[];
  awards: readonly EducationAward[];
  today: string;
  staffDirectory: readonly { id: string; name: string }[];
}

const STATUS_PILL: Record<CredentialStatus, string> = {
  valid: "bg-[var(--success)]/10 text-[var(--success)]",
  expiring: "bg-[var(--warning)]/10 text-[var(--warning)]",
  expired: "bg-[var(--error)]/10 text-[var(--error)]",
  unknown: "bg-[var(--warning)]/10 text-[var(--warning)]",
};
const STATUS_RANK: Record<CredentialStatus, number> = { expired: 0, unknown: 1, expiring: 2, valid: 3 };
const card = "rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden";
const th = "px-4 py-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider";

function expiryText(expiryDate: string | null, today: string): string {
  if (expiryDate === null) return "Does not expire";
  const days = daysUntilExpiry(expiryDate, today);
  if (days === null) return `Stored as "${expiryDate}"; not a date`;
  if (days < 0) return `${Math.abs(days)} days ago`;
  if (days === 0) return "Today";
  return `in ${days} days`;
}

function StatusPill({ status }: { status: CredentialStatus }) {
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full", STATUS_PILL[status])}>{CREDENTIAL_STATUS_LABEL[status]}</span>;
}

function SummaryTile({ label, value, tone }: { label: string; value: number; tone: CredentialStatus }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex-1 min-w-[120px] p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <span id={id} className="block text-[11px] uppercase tracking-wider text-[var(--muted)]">{label}</span>
      <span className={cn("block mt-1 text-xl font-semibold tabular-nums", value > 0 && tone !== "valid" ? (tone === "expired" ? "text-[var(--error)]" : "text-[var(--warning)]") : "text-[var(--foreground)]")}>{value}</span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count }: { icon: typeof Award; title: string; count: number }) {
  return (
    <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
      <Icon className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
      <h3 className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h3>
      <span className="text-[12px] text-[var(--muted)]">{count}</span>
    </div>
  );
}

function Empty({ what }: { what: string }) {
  return <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">No {what} recorded</p>;
}

function Verified({ byId, at, names }: { byId: string | null; at: string | null; names: Map<string, string> }) {
  if (!byId || !at) return <span className="text-[var(--warning)]">Unverified</span>;
  return (
    <>
      <span className="text-[var(--foreground)]">{names.get(byId) ?? "Unknown"}</span>
      <span className="block text-[11px] text-[var(--muted)]">{formatDate(at, "short")}</span>
    </>
  );
}

export function CredentialsTab({ registrations, checks, training, awards, today, staffDirectory }: CredentialsTabProps) {
  const names = useMemo(() => new Map(staffDirectory.map((p) => [p.id, p.name])), [staffDirectory]);
  const summary = useMemo(() => complianceSummary(expiringItemsOf({ registrations, checks, training }), today), [registrations, checks, training, today]);
  const byUrgency = <T extends { expiryDate: string | null }>(items: readonly T[], pendingOf: (t: T) => boolean = () => false) =>
    [...items]
      .map((item) => ({ item, status: pendingOf(item) ? ("unknown" as const) : credentialStatus(item.expiryDate, today), days: daysUntilExpiry(item.expiryDate, today) }))
      .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || (a.days ?? Infinity) - (b.days ?? Infinity));

  const regRows = byUrgency(registrations);
  const checkRows = byUrgency(checks, (c) => c.outcome === "pending");
  const trainingRows = byUrgency(training);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <SummaryTile label="Expired" value={summary.expired} tone="expired" />
        <SummaryTile label="Expiring soon" value={summary.expiring} tone="expiring" />
        <SummaryTile label="To check" value={summary.unknown} tone="unknown" />
        <SummaryTile label="Valid" value={summary.valid} tone="valid" />
      </div>

      <section className={card} aria-label="Professional registrations">
        <SectionHeader icon={ShieldCheck} title="Registrations" count={registrations.length} />
        {regRows.length === 0 ? (
          <Empty what="registrations" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Registrations">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={th}>Registration</th>
                  <th scope="col" className={th}>Valid from</th>
                  <th scope="col" className={th}>Expires</th>
                  <th scope="col" className={th}>Status</th>
                  <th scope="col" className={th}>Verified by</th>
                </tr>
              </thead>
              <tbody>
                {regRows.map(({ item: r, status }) => (
                  <tr key={r.id} className="border-b border-[var(--border)]/50 last:border-b-0 text-[13px]">
                    <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--foreground)]">
                      {REGISTRATION_BODY_LABEL[r.body]} <span className="font-mono text-[var(--muted)]">{r.number}</span>
                      <span className="block text-[11px] font-normal text-[var(--muted)]">
                        {[r.category ? `Category ${r.category}` : null, r.cpdCredits !== null ? `${r.cpdCredits} credits` : null].filter(Boolean).join(" · ")}
                      </span>
                    </th>
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{formatDate(r.validFrom, "short")}</td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className="text-[var(--foreground)]">{r.expiryDate === null ? "Never" : formatDate(r.expiryDate, "short")}</span>
                      <span className="block text-[11px] text-[var(--muted)]">{expiryText(r.expiryDate, today)}</span>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={status} /></td>
                    <td className="px-4 py-3"><Verified byId={r.verifiedById} at={r.verifiedAt} names={names} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={card} aria-label="Vetting checks">
        <SectionHeader icon={ClipboardCheck} title="Checks" count={checks.length} />
        {checkRows.length === 0 ? (
          <Empty what="checks" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Checks">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={th}>Check</th>
                  <th scope="col" className={th}>Completed</th>
                  <th scope="col" className={th}>Outcome</th>
                  <th scope="col" className={th}>Expires</th>
                  <th scope="col" className={th}>Status</th>
                  <th scope="col" className={th}>Checked by</th>
                </tr>
              </thead>
              <tbody>
                {checkRows.map(({ item: c, status }) => (
                  <tr key={c.id} className="border-b border-[var(--border)]/50 last:border-b-0 text-[13px]">
                    <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--foreground)]">
                      {VETTING_CHECK_LABEL[c.type]}
                      {c.reference && <span className="block text-[11px] font-normal font-mono text-[var(--muted)]">{c.reference}</span>}
                      {c.agencyAssuranceReceivedOn && <span className="block text-[11px] font-normal text-[var(--muted)]">Agency assurance {formatDate(c.agencyAssuranceReceivedOn, "short")}</span>}
                    </th>
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{formatDate(c.completedOn, "short")}</td>
                    <td className="px-4 py-3 capitalize text-[var(--muted)]">{c.outcome}</td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className="text-[var(--foreground)]">{c.expiryDate === null ? "Never" : formatDate(c.expiryDate, "short")}</span>
                      <span className="block text-[11px] text-[var(--muted)]">{expiryText(c.expiryDate, today)}</span>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={status} /></td>
                    <td className="px-4 py-3"><Verified byId={c.checkedById} at={c.checkedById ? c.completedOn : null} names={names} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={card} aria-label="Qualifications">
        <SectionHeader icon={GraduationCap} title="Qualifications" count={awards.length} />
        {awards.length === 0 ? (
          <Empty what="qualifications" />
        ) : (
          <ul className="divide-y divide-[var(--border)]/50">
            {[...awards].sort((a, b) => b.year - a.year).map((a) => (
              <li key={a.id} className="px-5 py-3 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
                <div>
                  <span className="font-medium text-[var(--foreground)]">{AWARD_LABEL[a.award]} {a.subject}</span>
                  <span className="block text-[11px] text-[var(--muted)]">{a.institution}{a.classOfAward ? ` · ${a.classOfAward}` : ""}</span>
                </div>
                <span className="text-[var(--muted)] tabular-nums">{a.year}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={card} aria-label="Training">
        <SectionHeader icon={Award} title="Training" count={training.length} />
        {trainingRows.length === 0 ? (
          <Empty what="training" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" aria-label="Training records">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className={th}>Training</th>
                  <th scope="col" className={th}>Date</th>
                  <th scope="col" className={th}>Renews</th>
                  <th scope="col" className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {trainingRows.map(({ item: t, status }) => (
                  <tr key={t.id} className="border-b border-[var(--border)]/50 last:border-b-0 text-[13px]">
                    <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--foreground)]">
                      {TRAINING_TYPE_LABEL[t.type]}
                      <span className="block text-[11px] font-normal text-[var(--muted)]">
                        {[t.provider, t.hours !== null ? `${t.hours} hours` : null, t.credits !== null ? `${t.credits} credits` : null].filter(Boolean).join(" · ")}
                      </span>
                    </th>
                    <td className="px-4 py-3 text-[var(--muted)] tabular-nums">{formatDate(t.date, "short")}</td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className="text-[var(--foreground)]">{t.expiryDate === null ? "Never" : formatDate(t.expiryDate, "short")}</span>
                      <span className="block text-[11px] text-[var(--muted)]">{expiryText(t.expiryDate, today)}</span>
                    </td>
                    <td className="px-4 py-3"><StatusPill status={status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </motion.div>
  );
}
