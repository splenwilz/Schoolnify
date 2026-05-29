"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, Download, ArrowRight } from "lucide-react";
import type { BatchValidationResult } from "../_utils/validators";
import type { ImportError } from "@/types/student-api";
import { downloadCSV } from "../_utils/template-generator";
import { escapeCsvCell } from "../../_utils/csv";

interface StepResultsProps {
  importedCount: number;
  skippedCount: number;
  validationResult: BatchValidationResult | null;
  serverErrors?: ImportError[];
  fatalError?: string | null;
}

export function StepResults({ importedCount, skippedCount, validationResult, serverErrors, fatalError }: StepResultsProps) {
  const handleDownloadErrors = () => {
    const lines = [["Row", "Field", "Error"].map(escapeCsvCell).join(",")];
    if (validationResult) {
      const errorRows = validationResult.results.filter((r) => !r.valid);
      for (const r of errorRows) {
        for (const e of r.errors) {
          lines.push([r.rowIndex + 1, e.field, e.message].map(escapeCsvCell).join(","));
        }
      }
    }
    if (serverErrors && serverErrors.length > 0) {
      for (const e of serverErrors) {
        lines.push([e.row, e.field, e.message].map(escapeCsvCell).join(","));
      }
    }
    if (lines.length <= 1) return;
    downloadCSV(lines.join("\n"), "import_errors.csv");
  };

  const showFatal = !!fatalError;

  return (
    <div className="space-y-8 text-center py-8">
      {/* Status icon */}
      <div className="flex justify-center">
        {showFatal ? (
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
          </div>
        )}
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
          {showFatal ? "Import Failed" : "Import Complete"}
        </h2>
        {showFatal ? (
          <p className="text-[14px] text-red-600 dark:text-red-400 max-w-md mx-auto">{fatalError}</p>
        ) : (
          <p className="text-[15px] text-[var(--muted)]">
            {importedCount} student{importedCount !== 1 ? "s" : ""} imported successfully
            {skippedCount > 0 && `, ${skippedCount} skipped due to errors`}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="px-6 py-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20">
          <p className="text-2xl font-bold text-[#10B981]">{importedCount}</p>
          <p className="text-[13px] text-[var(--muted)]">Imported</p>
        </div>
        {skippedCount > 0 && (
          <div className="px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-2xl font-bold text-red-500">{skippedCount}</p>
            <p className="text-[13px] text-[var(--muted)]">Skipped</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        {skippedCount > 0 && (
          <button
            type="button"
            onClick={handleDownloadErrors}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Error Report
          </button>
        )}
        <Link
          href="/school-admin/students"
          className="inline-flex items-center gap-1.5 px-6 py-2 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
        >
          View Students
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
