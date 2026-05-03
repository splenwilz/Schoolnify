"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import type { StudentField } from "../_constants/student-fields";
import { validateAllRows, type BatchValidationResult } from "../_utils/validators";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

interface StepValidateProps {
  rows: Record<string, string>[];
  mapping: Record<string, string>;
  fields: StudentField[];
  gradeLevels: string[];
  validationResult: BatchValidationResult | null;
  onValidated: (result: BatchValidationResult) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepValidate({ rows, mapping, fields, gradeLevels, validationResult, onValidated, onBack, onNext }: StepValidateProps) {
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [editableRows, setEditableRows] = useState<Record<string, string>[]>([...rows]);
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const runValidation = useCallback(() => {
    const result = validateAllRows(editableRows, mapping, fields, gradeLevels);
    onValidated(result);
  }, [editableRows, mapping, fields, gradeLevels, onValidated]);

  useEffect(() => {
    if (!validationResult) runValidation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!validationResult) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[#0891B2] border-t-transparent animate-spin" />
        <span className="ml-3 text-[14px] text-[var(--muted)]">Validating {rows.length} rows...</span>
      </div>
    );
  }

  const { validCount, errorCount, results } = validationResult;
  const displayedResults = showErrorsOnly ? results.filter((r) => !r.valid) : results;

  // Pagination
  const totalPages = Math.ceil(displayedResults.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedResults = displayedResults.slice(start, start + PAGE_SIZE);

  // Reset page when toggling error filter
  const toggleErrorFilter = () => {
    setShowErrorsOnly((v) => !v);
    setCurrentPage(1);
  };

  const mappedFields = Object.entries(mapping)
    .filter(([, key]) => key !== "_ignore")
    .map(([csvCol, key]) => {
      const field = fields.find((f) => f.key === key);
      return { csvCol, key, label: field?.label ?? key, field };
    })
    .slice(0, 8);

  const handleCellEdit = (rowIndex: number, csvCol: string, newValue: string) => {
    const updated = [...editableRows];
    updated[rowIndex] = { ...updated[rowIndex], [csvCol]: newValue };
    setEditableRows(updated);
    setEditingCell(null);
    const result = validateAllRows(updated, mapping, fields, gradeLevels);
    onValidated(result);
  };

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#10B981]/10">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span className="text-[14px] font-medium text-[#10B981]">{validCount} valid</span>
        </div>
        {errorCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-[14px] font-medium text-red-500">{errorCount} with errors</span>
          </div>
        )}
        <p className="text-[13px] text-[var(--muted)]">
          Click any cell to edit
        </p>
        <div className="flex-1" />
        {errorCount > 0 && (
          <button
            type="button"
            onClick={toggleErrorFilter}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg border transition-colors",
              showErrorsOnly
                ? "bg-red-500/10 border-red-500/30 text-red-500"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            {showErrorsOnly ? "Showing errors only" : "Show errors only"}
          </button>
        )}
      </div>

      {/* Validation table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase w-12">Row</th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase w-16">Status</th>
                {mappedFields.map((f) => (
                  <th key={f.key} className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">{f.label}</th>
                ))}
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-[var(--muted)] uppercase">Errors</th>
              </tr>
            </thead>
            <tbody>
              {pagedResults.map((result) => (
                <tr
                  key={result.rowIndex}
                  className={cn(
                    "border-b border-[var(--border)] last:border-0",
                    !result.valid && "bg-red-500/5"
                  )}
                >
                  <td className="px-3 py-2 text-[var(--muted)]">{result.rowIndex + 1}</td>
                  <td className="px-3 py-2">
                    {result.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </td>
                  {mappedFields.map((f) => {
                    const hasError = result.errors.some((e) => e.field === f.key);
                    const isEditing = editingCell?.row === result.rowIndex && editingCell?.field === f.key;
                    const rawValue = editableRows[result.rowIndex]?.[f.csvCol] ?? "";
                    const displayValue = result.normalized[f.key] || rawValue || "-";

                    if (isEditing) {
                      return (
                        <td key={f.key} className="px-1 py-1">
                          {f.field?.type === "enum" && f.field.enumValues ? (
                            <select
                              autoFocus
                              defaultValue={rawValue.toLowerCase()}
                              onChange={(e) => handleCellEdit(result.rowIndex, f.csvCol, e.target.value)}
                              onBlur={() => setEditingCell(null)}
                              className="w-full px-2 py-1 text-[13px] bg-[var(--card)] border border-[#0891B2] rounded text-[var(--foreground)] focus:outline-none"
                            >
                              <option value="">Select...</option>
                              {f.field.enumValues.map((v) => (
                                <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              autoFocus
                              type={f.field?.type === "date" ? "date" : "text"}
                              defaultValue={rawValue}
                              onBlur={(e) => handleCellEdit(result.rowIndex, f.csvCol, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleCellEdit(result.rowIndex, f.csvCol, (e.target as HTMLInputElement).value);
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              className="w-full px-2 py-1 text-[13px] bg-[var(--card)] border border-[#0891B2] rounded text-[var(--foreground)] focus:outline-none"
                            />
                          )}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={f.key}
                        onClick={() => setEditingCell({ row: result.rowIndex, field: f.key })}
                        className={cn(
                          "px-3 py-2 max-w-[150px] truncate cursor-pointer hover:bg-[var(--background-secondary)] rounded transition-colors",
                          hasError ? "text-red-500 font-medium" : "text-[var(--foreground)]"
                        )}
                        title="Click to edit"
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-red-500 text-[12px]">
                    {result.errors.map((e) => e.message).join("; ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--background-secondary)] border-t border-[var(--border)] text-[13px] text-[var(--muted)]">
            <span>{start + 1}-{Math.min(start + PAGE_SIZE, displayedResults.length)} of {displayedResults.length} rows</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-[var(--card)] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-[var(--foreground)] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-[var(--card)] disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={validCount === 0}
          className="px-6 py-2.5 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Preview ({validCount} students)
        </button>
      </div>
    </div>
  );
}
