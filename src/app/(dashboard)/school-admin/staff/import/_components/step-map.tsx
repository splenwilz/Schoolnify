"use client";

import { useId } from "react";
import type { ColumnMapping, DateFormat, ImportField } from "@/lib/import/types";

interface StepMapProps {
  headers: string[];
  /** Non-fatal notices from parsing (extra cells ignored, row cap reached). */
  notices: string[];
  sampleRows: Record<string, string>[];
  fields: readonly ImportField[];
  mapping: ColumnMapping;
  dateFormat: DateFormat;
  onMappingChange: (next: ColumnMapping) => void;
  onDateFormatChange: (next: DateFormat) => void;
  onBack: () => void;
  onValidate: () => void;
}

const select =
  "h-9 w-full pl-2 pr-7 text-[13px] rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30";

export function StepMap({ headers, notices, sampleRows, fields, mapping, dateFormat, onMappingChange, onDateFormatChange, onBack, onValidate }: StepMapProps) {
  const headingId = useId();
  const dateId = useId();
  const used = new Set(Object.values(mapping).filter(Boolean));
  const unmappedRequired = fields.filter((f) => f.required && !used.has(f.key));

  return (
    <section aria-labelledby={headingId} className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-[15px] font-semibold text-[var(--foreground)]">Map columns</h2>
          <p className="text-[12.5px] text-[var(--muted)] mt-0.5">We matched what we could. Check each column, then validate.</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={dateId} className="text-[12.5px] text-[var(--muted)]">Dates in file</label>
          <select id={dateId} value={dateFormat} onChange={(e) => onDateFormatChange(e.target.value as DateFormat)} className={select + " w-auto"}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      {notices.length > 0 && (
        <ul role="status" className="rounded-lg border border-[var(--warning)]/40 bg-[var(--warning)]/5 px-4 py-3 text-[12.5px] text-[var(--foreground)] space-y-1">
          {notices.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider border-b border-[var(--border)]">
              <th scope="col" className="px-4 py-2.5">Column in file</th>
              <th scope="col" className="px-4 py-2.5">Sample values</th>
              <th scope="col" className="px-4 py-2.5 w-64">Import as</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((h) => {
              const current = mapping[h] ?? "";
              return (
                <tr key={h} className="border-b border-[var(--border)]/50 last:border-b-0">
                  <th scope="row" className="px-4 py-2.5 text-left text-[13px] font-medium text-[var(--foreground)]">{h}</th>
                  <td className="px-4 py-2.5 text-[12px] text-[var(--muted)] truncate max-w-xs">
                    {sampleRows.map((r) => r[h]).filter(Boolean).slice(0, 3).join(" · ") || "No values"}
                  </td>
                  <td className="px-4 py-2.5">
                    <select
                      aria-label={`Map "${h}"`}
                      value={current}
                      onChange={(e) => onMappingChange({ ...mapping, [h]: e.target.value })}
                      className={select}
                    >
                      <option value="">Ignore this column</option>
                      {fields.map((f) => (
                        <option key={f.key} value={f.key} disabled={used.has(f.key) && current !== f.key}>
                          {f.label}
                          {f.required ? " *" : ""}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {unmappedRequired.length > 0 && (
        <p role="alert" className="text-[12.5px] text-[var(--warning)]">
          Required but not mapped: {unmappedRequired.map((f) => f.label).join(", ")}. Each one is not mapped to a column yet.
        </p>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
          Back
        </button>
        <button
          type="button"
          onClick={onValidate}
          disabled={unmappedRequired.length > 0}
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Validate
        </button>
      </div>
    </section>
  );
}
