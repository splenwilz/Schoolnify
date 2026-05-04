"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSchoolSetup } from "@/hooks/use-school-setup";
import { useImportStudents } from "@/hooks/use-students";
import type { ImportError } from "@/types/student-api";
import { escapeCsvCell } from "../_utils/csv";
import { getAllFields, fuzzyMatchField } from "./_constants/student-fields";
import type { ParsedCSV } from "./_utils/csv-parser";
import type { BatchValidationResult } from "./_utils/validators";
import { StepUpload } from "./_components/step-upload";
import { StepMapping } from "./_components/step-mapping";
import { StepValidate } from "./_components/step-validate";
import { StepPreview } from "./_components/step-preview";
import { StepResults } from "./_components/step-results";

const STEPS = ["Upload", "Map Columns", "Validate", "Preview", "Results"] as const;

// Build a CSV blob from normalized rows. Headers = field keys (snake_case),
// matching what the backend expects in identity mapping.
function buildCsvFromNormalizedRows(rows: Record<string, string>[], headers: string[]): File {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((r) => headers.map((h) => escapeCsvCell(r[h] ?? "")).join(",")),
  ];
  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  return new File([blob], "students_import.csv", { type: "text/csv" });
}

export default function StudentImportPage() {
  const { data: setupData, isLoading: setupLoading } = useSchoolSetup();
  const importMutation = useImportStudents();
  const [step, setStep] = useState(0);

  // Step 1: Upload
  const [parsedCSV, setParsedCSV] = useState<ParsedCSV | null>(null);

  // Step 2: Mapping. We also track which columns the user manually changed
  // so a re-upload of the same headers preserves their custom mapping instead
  // of overwriting it with a fresh fuzzy match.
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const userEditedColumnsRef = useRef<Set<string>>(new Set());

  const handleMappingChange = (next: Record<string, string>) => {
    // Record any column whose value differs from the current mapping — those
    // are user-driven edits we want to keep on subsequent re-uploads.
    for (const [col, value] of Object.entries(next)) {
      if (mapping[col] !== value) userEditedColumnsRef.current.add(col);
    }
    setMapping(next);
    // Mapping changes invalidate any prior validation result -- StepValidate
    // will recompute when the user advances.
    setValidationResult(null);
  };

  // Step 3: Validation
  const [validationResult, setValidationResult] = useState<BatchValidationResult | null>(null);

  // Step 5: Import results (filled from backend response)
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [serverErrors, setServerErrors] = useState<ImportError[]>([]);

  // We deliberately read these only when setupData is present below. Computing
  // `fields` against a stub country would let the user upload, map, and import
  // against a wrong field set before setup finishes loading.
  const country = setupData?.country;
  const gradeLevels = setupData?.gradeLevels ?? [];
  const dateFormat = setupData?.dateFormat ?? "DD/MM/YYYY";
  const fields = country ? getAllFields(country) : null;

  const handleParsed = (csv: ParsedCSV) => {
    // The setup-loading guard above prevents StepUpload from rendering when
    // `fields` is null, so this is unreachable at runtime. Defensive guard for
    // type-narrowing.
    if (!fields) return;

    // A new file invalidates everything downstream: prior validation results,
    // server response counts, mutation state. Reset before stepping forward.
    setValidationResult(null);
    setImportedCount(0);
    setSkippedCount(0);
    setServerErrors([]);
    importMutation.reset();

    setParsedCSV(csv);

    // Auto-map only the columns the user hasn't already customized. If headers
    // changed entirely (different file), every column is "new" so all get
    // auto-mapped.
    const edited = userEditedColumnsRef.current;
    const next: Record<string, string> = {};
    for (const header of csv.headers) {
      if (edited.has(header) && mapping[header]) {
        next[header] = mapping[header];
        continue;
      }
      const match = fuzzyMatchField(header, fields);
      next[header] = match?.key ?? "_ignore";
    }
    setMapping(next);
    // Drop edits for columns that no longer exist.
    for (const col of [...edited]) {
      if (!csv.headers.includes(col)) edited.delete(col);
    }
    setStep(1);
  };

  const handleImport = () => {
    if (!validationResult || importMutation.isPending) return;
    const validRows = validationResult.results.filter((r) => r.valid).map((r) => r.normalized);
    if (validRows.length === 0) {
      setImportedCount(0);
      setSkippedCount(validationResult.errorCount);
      setServerErrors([]);
      setStep(4);
      return;
    }

    // Use the union of all field keys present in normalized rows as CSV headers
    const headerSet = new Set<string>();
    for (const r of validRows) {
      for (const k of Object.keys(r)) headerSet.add(k);
    }
    const headers = [...headerSet];
    const file = buildCsvFromNormalizedRows(validRows, headers);
    const identityMapping: Record<string, string> = Object.fromEntries(headers.map((h) => [h, h]));

    importMutation.mutate(
      { file, mapping: identityMapping, skipInvalid: true },
      {
        onSuccess: (res) => {
          setImportedCount(res.imported);
          setSkippedCount(res.skipped + validationResult.errorCount);
          setServerErrors(res.errors ?? []);
          setStep(4);
        },
        onError: () => {
          setStep(4);
        },
      }
    );
  };

  // Block the entire flow until school setup loads. Without it `fields` is
  // null and we'd otherwise let the user upload + map against a wrong/empty
  // field set, leading to silent data loss on import.
  if (setupLoading || !setupData || !fields) {
    return (
      <div className="max-w-[960px] mx-auto py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-[#0891B2] animate-spin" />
        <p className="text-[13px] text-[var(--muted)]">Loading school configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/school-admin/students"
          aria-label="Back to students"
          className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Import Students</h1>
          <p className="text-[14px] text-[var(--muted)]">Bulk import student records from a CSV file</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 flex-1">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
              i === step ? "bg-[#0891B2]/10 text-[#0891B2]"
                : i < step ? "text-[#10B981]"
                  : "text-[var(--muted)]"
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                i === step ? "bg-[#0891B2] text-white"
                  : i < step ? "bg-[#10B981] text-white"
                    : "bg-[var(--background-secondary)] border border-[var(--border)]"
              }`}>
                {i < step ? "\u2713" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? "bg-[#10B981]" : "bg-[var(--border)]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <StepUpload
              country={country}
              gradeLevels={gradeLevels}
              dateFormat={dateFormat}
              onParsed={handleParsed}
            />
          )}
          {step === 1 && parsedCSV && (
            <StepMapping
              headers={parsedCSV.headers}
              sampleRows={parsedCSV.rows.slice(0, 3)}
              fields={fields}
              mapping={mapping}
              onMappingChange={handleMappingChange}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && parsedCSV && (
            <StepValidate
              rows={parsedCSV.rows}
              mapping={mapping}
              fields={fields}
              gradeLevels={gradeLevels}
              dateFormat={dateFormat}
              validationResult={validationResult}
              onValidated={setValidationResult}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && validationResult && (
            <StepPreview
              validationResult={validationResult}
              fields={fields}
              onBack={() => setStep(2)}
              onImport={handleImport}
              importing={importMutation.isPending}
              error={importMutation.error ? (importMutation.error as Error).message : null}
            />
          )}
          {step === 4 && (
            <StepResults
              importedCount={importedCount}
              skippedCount={skippedCount}
              validationResult={validationResult}
              serverErrors={serverErrors}
              fatalError={importMutation.isError ? (importMutation.error as Error).message : null}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
