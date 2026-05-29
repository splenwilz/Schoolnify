"use client";

import { Users, Loader2, AlertCircle } from "lucide-react";
import type { StudentField } from "../_constants/student-fields";
import type { BatchValidationResult } from "../_utils/validators";

interface StepPreviewProps {
  validationResult: BatchValidationResult;
  fields: StudentField[];
  onBack: () => void;
  onImport: () => void;
  importing?: boolean;
  error?: string | null;
}

export function StepPreview({ validationResult, fields, onBack, onImport, importing, error }: StepPreviewProps) {
  const validRows = validationResult.results.filter((r) => r.valid);

  // Key columns to show in preview
  const previewFields = ["first_name", "last_name", "date_of_birth", "gender", "grade_level", "section", "admission_number", "guardian1_first_name"];
  const columns = previewFields
    .map((key) => fields.find((f) => f.key === key))
    .filter(Boolean) as StudentField[];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
        <Users className="w-5 h-5 text-[#10B981]" />
        <div>
          <p className="text-[15px] font-medium text-[var(--foreground)]">
            {validRows.length} student{validRows.length !== 1 ? "s" : ""} ready to import
          </p>
          {validationResult.errorCount > 0 && (
            <p className="text-[13px] text-[var(--muted)]">
              {validationResult.errorCount} row{validationResult.errorCount !== 1 ? "s" : ""} with errors will be skipped
            </p>
          )}
        </div>
      </div>

      {/* Preview table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase w-12">#</th>
                {columns.map((f) => (
                  <th key={f.key} className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">{f.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validRows.slice(0, 50).map((result, i) => (
                <tr key={result.rowIndex} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-3 py-2 text-[var(--muted)]">{i + 1}</td>
                  {columns.map((f) => (
                    <td key={f.key} className="px-3 py-2 text-[var(--foreground)] max-w-[150px] truncate">
                      {result.normalized[f.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {validRows.length > 50 && (
          <div className="px-4 py-2 bg-[var(--background-secondary)] text-[12px] text-[var(--muted)] text-center">
            Showing first 50 of {validRows.length} students
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} disabled={importing} className="px-4 py-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50">
          Back
        </button>
        <button
          type="button"
          onClick={onImport}
          disabled={importing || validRows.length === 0}
          className="px-6 py-2.5 text-[14px] font-medium rounded-lg bg-[#10B981] text-white hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {importing && <Loader2 className="w-4 h-4 animate-spin" />}
          Import {validRows.length} Students
        </button>
      </div>
    </div>
  );
}
