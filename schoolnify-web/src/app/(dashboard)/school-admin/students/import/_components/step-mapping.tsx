"use client";

import { Check, AlertTriangle, Minus } from "lucide-react";
import type { StudentField } from "../_constants/student-fields";
import { cn } from "@/lib/utils";

interface StepMappingProps {
  headers: string[];
  sampleRows: Record<string, string>[];
  fields: StudentField[];
  mapping: Record<string, string>;
  onMappingChange: (m: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

type MappingStatus = "matched" | "required_missing" | "ignored";

function getStatus(fieldKey: string, fields: StudentField[]): MappingStatus {
  if (fieldKey === "_ignore") return "ignored";
  const field = fields.find((f) => f.key === fieldKey);
  return field ? "matched" : "ignored";
}

export function StepMapping({ headers, sampleRows, fields, mapping, onMappingChange, onBack, onNext }: StepMappingProps) {
  const updateMapping = (csvCol: string, fieldKey: string) => {
    onMappingChange({ ...mapping, [csvCol]: fieldKey });
  };

  // Check if all required fields are mapped
  const requiredFields = fields.filter((f) => f.required);
  const mappedFieldKeys = new Set(Object.values(mapping).filter((v) => v !== "_ignore"));
  const missingRequired = requiredFields.filter((f) => !mappedFieldKeys.has(f.key));

  const matchedCount = Object.values(mapping).filter((v) => v !== "_ignore").length;
  const ignoredCount = Object.values(mapping).filter((v) => v === "_ignore").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5 text-[13px]">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[var(--foreground)] font-medium">{matchedCount} mapped</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px]">
          <div className="w-2 h-2 rounded-full bg-[var(--muted)]" />
          <span className="text-[var(--muted)]">{ignoredCount} ignored</span>
        </div>
        {missingRequired.length > 0 && (
          <div className="flex items-center gap-1.5 text-[13px] text-red-500">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{missingRequired.length} required field{missingRequired.length > 1 ? "s" : ""} unmapped: {missingRequired.map((f) => f.label).join(", ")}</span>
          </div>
        )}
      </div>

      {/* Mapping table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[200px_40px_1fr_200px] gap-0 bg-[var(--background-secondary)] border-b border-[var(--border)] px-4 py-2">
          <span className="text-[12px] font-semibold text-[var(--muted)] uppercase">CSV Column</span>
          <span />
          <span className="text-[12px] font-semibold text-[var(--muted)] uppercase">Maps To</span>
          <span className="text-[12px] font-semibold text-[var(--muted)] uppercase">Sample Data</span>
        </div>

        {/* Rows */}
        {headers.map((header) => {
          const fieldKey = mapping[header] ?? "_ignore";
          const status = getStatus(fieldKey, fields);
          const samples = sampleRows.map((r) => r[header] ?? "").filter(Boolean).slice(0, 3);

          return (
            <div
              key={header}
              className={cn(
                "grid grid-cols-[200px_40px_1fr_200px] gap-0 items-center px-4 py-2.5 border-b border-[var(--border)] last:border-0",
                status === "matched" ? "bg-[#10B981]/5" : status === "ignored" ? "opacity-50" : ""
              )}
            >
              {/* CSV column name */}
              <span className="text-[14px] font-medium text-[var(--foreground)] truncate" title={header}>
                {header}
              </span>

              {/* Status icon */}
              <div className="flex items-center justify-center">
                {status === "matched" ? (
                  <Check className="w-4 h-4 text-[#10B981]" />
                ) : status === "ignored" ? (
                  <Minus className="w-4 h-4 text-[var(--muted)]" />
                ) : null}
              </div>

              {/* Field selector */}
              <select
                value={fieldKey}
                onChange={(e) => updateMapping(header, e.target.value)}
                className={cn(
                  "w-full max-w-[280px] px-3 py-1.5 text-[13px] rounded-lg border bg-[var(--card)] focus:outline-none focus:border-[#0891B2] transition-colors",
                  status === "matched"
                    ? "border-[#10B981]/30 text-[var(--foreground)]"
                    : "border-[var(--border)] text-[var(--muted)]"
                )}
              >
                <option value="_ignore">-- Ignore this column --</option>
                <optgroup label="Required">
                  {fields.filter((f) => f.required).map((f) => (
                    <option key={f.key} value={f.key}>{f.label} *</option>
                  ))}
                </optgroup>
                <optgroup label="Optional">
                  {fields.filter((f) => !f.required).map((f) => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </optgroup>
              </select>

              {/* Sample data */}
              <div className="text-[12px] text-[var(--muted)] truncate" title={samples.join(", ")}>
                {samples.join(" | ") || "-"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={missingRequired.length > 0}
          className="px-6 py-2.5 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Validate
        </button>
      </div>
    </div>
  );
}
