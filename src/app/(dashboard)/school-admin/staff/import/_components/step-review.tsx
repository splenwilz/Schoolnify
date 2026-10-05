"use client";

import { useId } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BatchResult, ImportField, RowResult } from "@/lib/import/types";

export type ImportMode = "upsert" | "create";

interface StepReviewProps {
  result: BatchResult;
  fields: readonly ImportField[];
  mode: ImportMode;
  committing: boolean;
  commitError: string | null;
  onModeChange: (mode: ImportMode) => void;
  onDownloadErrors: () => void;
  onBack: () => void;
  onCommit: () => void;
}

function Count({ label, value, tone }: { label: string; value: number; tone?: "ok" | "info" | "error" }) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex-1 min-w-[140px] p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <span id={id} className="block text-[11px] uppercase tracking-wider text-[var(--muted)]">{label}</span>
      <span className={cn("block mt-1 text-xl font-semibold tabular-nums", tone === "error" && value > 0 ? "text-[var(--error)]" : tone === "ok" ? "text-[var(--success)]" : "text-[var(--foreground)]")}>
        {value}
      </span>
    </div>
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function StepReview({ result, fields, mode, committing, commitError, onModeChange, onDownloadErrors, onBack, onCommit }: StepReviewProps) {
  const headingId = useId();
  const modeId = useId();
  const { summary } = result;
  const labelFor = new Map(fields.map((f) => [f.key, f.label]));
  const keyFields = ["first_name", "last_name", "email"].filter((k) => labelFor.has(k));
  const ordered: RowResult[] = [...result.rows].sort((a, b) => Number(a.valid) - Number(b.valid) || a.index - b.index);

  return (
    <section aria-labelledby={headingId} className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
      <div>
        <h2 id={headingId} className="text-[15px] font-semibold text-[var(--foreground)]">Review</h2>
        <p className="text-[12.5px] text-[var(--muted)] mt-0.5">Only valid rows are imported. Fix the rest in your file and import them separately.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Count label="Ready to create" value={summary.create} tone="ok" />
        <Count label="Will update" value={summary.update} tone="info" />
        <Count label="Errors" value={summary.invalid} tone="error" />
      </div>

      <fieldset className="flex flex-wrap items-center gap-4">
        <legend id={modeId} className="text-[12.5px] font-medium text-[var(--foreground)] mb-1.5">Existing people (matched on email, then employee number)</legend>
        {(
          [
            ["upsert", "Create and update"],
            ["create", "Create only"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="inline-flex items-center gap-2 text-[13px] text-[var(--foreground)] cursor-pointer">
            <input type="radio" name="import-mode" value={value} checked={mode === value} onChange={() => onModeChange(value)} className="accent-[var(--brand)]" />
            {label}
          </label>
        ))}
      </fieldset>

      {ordered.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] max-h-[420px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[var(--card)]">
              <tr className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
                <th scope="col" className="px-3 py-2">Row</th>
                {keyFields.map((k) => (
                  <th key={k} scope="col" className="px-3 py-2">{labelFor.get(k)}</th>
                ))}
                <th scope="col" className="px-3 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((r) => (
                <tr key={r.index} className={cn("border-b border-[var(--border)]/50 last:border-b-0 align-top", !r.valid && "bg-[var(--error)]/5")}>
                  <td className="px-3 py-2 text-[12px] text-[var(--muted)] tabular-nums">{r.index + 1}</td>
                  {keyFields.map((k) => (
                    <td key={k} className="px-3 py-2 text-[12.5px] text-[var(--foreground)]">{r.normalized[k] || "None"}</td>
                  ))}
                  <td className="px-3 py-2 text-[12px]">
                    {r.valid ? (
                      <>
                        <span className={r.match === "existing" ? "text-[var(--brand)]" : "text-[var(--success)]"}>{r.match === "existing" ? "Update" : "Create"}</span>
                        {r.warnings.length > 0 && (
                          <ul className="mt-0.5 space-y-0.5 text-[var(--warning)]">
                            {r.warnings.map((w, i) => (
                              <li key={i}>
                                <span className="font-medium">{labelFor.get(w.field) ?? w.field}:</span> {w.message}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <ul className="space-y-0.5 text-[var(--error)]">
                        {r.errors.map((e, i) => (
                          <li key={i}>
                            <span className="font-medium">{labelFor.get(e.field) ?? e.field}:</span> {e.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {commitError && (
        <p role="alert" className="text-[12.5px] text-[var(--error)]">{commitError}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} disabled={committing} className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-60">
            Back
          </button>
          {summary.invalid > 0 && (
            <button type="button" onClick={onDownloadErrors} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
              <Download className="w-4 h-4" aria-hidden="true" />
              Download {plural(summary.invalid, "row")} with errors
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onCommit}
          disabled={committing || summary.valid === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] disabled:opacity-60"
        >
          {committing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {committing ? "Importing…" : `Import ${plural(summary.valid, "row")}`}
        </button>
      </div>
    </section>
  );
}
