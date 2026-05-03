"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
  const { data: setupData } = useSchoolSetup();
  const importMutation = useImportStudents();
  const [step, setStep] = useState(0);

  // Step 1: Upload
  const [parsedCSV, setParsedCSV] = useState<ParsedCSV | null>(null);

  // Step 2: Mapping
  const [mapping, setMapping] = useState<Record<string, string>>({});

  // Step 3: Validation
  const [validationResult, setValidationResult] = useState<BatchValidationResult | null>(null);

  // Step 5: Import results (filled from backend response)
  const [importedCount, setImportedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [serverErrors, setServerErrors] = useState<ImportError[]>([]);

  const country = setupData?.country ?? "";
  const gradeLevels = setupData?.gradeLevels ?? [];
  const dateFormat = setupData?.dateFormat ?? "DD/MM/YYYY";
  const fields = getAllFields(country);

  const handleParsed = (csv: ParsedCSV) => {
    // A new file invalidates everything downstream: prior validation results,
    // server response counts, mutation state. Reset before stepping forward.
    setValidationResult(null);
    setImportedCount(0);
    setSkippedCount(0);
    setServerErrors([]);
    importMutation.reset();

    setParsedCSV(csv);
    const autoMap: Record<string, string> = {};
    for (const header of csv.headers) {
      const match = fuzzyMatchField(header, fields);
      autoMap[header] = match?.key ?? "_ignore";
    }
    setMapping(autoMap);
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

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/school-admin/students" className="p-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted)]" />
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
              onMappingChange={setMapping}
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
