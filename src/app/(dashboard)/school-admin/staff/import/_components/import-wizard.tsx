"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Staff } from "@/types/staff";
import type { ParsedCsv } from "@/lib/import/csv";
import { buildCsv } from "@/lib/import/csv";
import { autoMap } from "@/lib/import/mapping";
import { validateRows, withCreateOnly } from "@/lib/import/validate";
import type { BatchResult, ColumnMapping, DateFormat } from "@/lib/import/types";
import { downloadTextFile } from "@/lib/import/download";
import { STAFF_IMPORT_FIELDS, rowToStaffInput, staffImportRowRules, staffImportTemplate } from "@/lib/staff/import-fields";
import type { StaffCreateInput } from "@/lib/staff/schema";
import { StepUpload } from "./step-upload";
import { StepMap } from "./step-map";
import { StepReview, type ImportMode } from "./step-review";
import { StepDone, type CommitResult } from "./step-done";

export interface ImportPayload {
  create: StaffCreateInput[];
  update: { id: string; input: StaffCreateInput }[];
  /**
   * Rows whose manager is created in the same batch, so the id does not exist
   * yet. `index` points into `create` or `update` per `target`; the commit
   * resolves the manager's id after the batch and sets reportsToId in a
   * second pass. Only managers whose own row is valid are queued.
   */
  pendingManagerLinks: { target: "create" | "update"; index: number; reportsToEmail: string }[];
}

interface ImportWizardProps {
  existingStaff: readonly Staff[];
  /** Request-time date, for the age and contract rules. */
  today: string;
  /** ISO 3166-1 alpha-2 of the school, so national phone numbers are accepted. */
  country: string;
  onCommit: (payload: ImportPayload) => Promise<CommitResult>;
}

type Step = "upload" | "map" | "review" | "done";
const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Upload" },
  { id: "map", label: "Map columns" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

export function ImportWizard({ existingStaff, today, country, onCommit }: ImportWizardProps) {
  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [dateFormat, setDateFormat] = useState<DateFormat>("DD/MM/YYYY");
  const [mode, setMode] = useState<ImportMode>("upsert");
  const [validated, setValidated] = useState<BatchResult | null>(null);
  const [committing, setCommitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [done, setDone] = useState<CommitResult | null>(null);

  const existing = useMemo(() => {
    const byEmail = new Map<string, Staff>();
    const byNumber = new Map<string, Staff>();
    for (const s of existingStaff) {
      if (s.email) byEmail.set(s.email.toLowerCase(), s);
      if (s.employeeNumber) byNumber.set(s.employeeNumber, s);
    }
    return {
      byEmail,
      byNumber,
      sets: { email: new Set(byEmail.keys()), employee_number: new Set(byNumber.keys()) },
      ids: { email: new Map([...byEmail].map(([e, s]) => [e, s.id])), employee_number: new Map([...byNumber].map(([n, s]) => [n, s.id])) },
      staffIdByEmail: new Map([...byEmail].map(([e, s]) => [e, s.id])),
    };
  }, [existingStaff]);

  const result = useMemo(() => (validated && mode === "create" ? withCreateOnly(validated) : validated), [validated, mode]);

  const handleParsed = (p: ParsedCsv) => {
    setParsed(p);
    setMapping(autoMap(p.headers, STAFF_IMPORT_FIELDS));
    setStep("map");
  };

  const handleValidate = () => {
    if (!parsed) return;
    const rowErrors = new Map(parsed.badRows.map((i) => [i, "More values than columns, so the values may be in the wrong columns; fix the quoting in the file"]));
    setValidated(validateRows(parsed.rows, mapping, STAFF_IMPORT_FIELDS, { dateFormat, existing: existing.sets, existingIds: existing.ids, rowErrors, country, rowRules: staffImportRowRules(today) }));
    setCommitError(null);
    setStep("review");
  };

  const handleDownloadErrors = () => {
    if (!parsed || !result) return;
    const bad = result.rows.filter((r) => !r.valid);
    const headers = [...parsed.headers, "errors"];
    const labelFor = new Map(STAFF_IMPORT_FIELDS.map((f) => [f.key, f.label]));
    const rows = bad.map((r) => ({ ...parsed.rows[r.index], errors: r.errors.map((e) => `${e.field === "_row" ? "Row" : labelFor.get(e.field) ?? e.field}: ${e.message}`).join("; ") }));
    downloadTextFile("staff_import_errors.csv", buildCsv(headers, rows));
  };

  const handleCommit = async () => {
    if (!result) return;
    const payload: ImportPayload = { create: [], update: [], pendingManagerLinks: [] };
    const createdEmails = new Set(result.rows.filter((r) => r.valid && r.match === "new" && r.normalized.email).map((r) => r.normalized.email));
    for (const r of result.rows) {
      if (!r.valid) continue;
      const input = rowToStaffInput(r.normalized, { staffIdByEmail: existing.staffIdByEmail });
      const match = existing.byEmail.get(r.normalized.email) ?? (r.normalized.employee_number ? existing.byNumber.get(r.normalized.employee_number) : undefined);
      const isUpdate = r.match === "existing" && match !== undefined;
      if (isUpdate) payload.update.push({ id: match.id, input });
      else payload.create.push(input);
      const managerEmail = r.normalized.reports_to_email;
      if (managerEmail && !existing.staffIdByEmail.has(managerEmail) && createdEmails.has(managerEmail)) {
        const list = isUpdate ? payload.update : payload.create;
        payload.pendingManagerLinks.push({ target: isUpdate ? "update" : "create", index: list.length - 1, reportsToEmail: managerEmail });
      }
    }
    setCommitting(true);
    setCommitError(null);
    try {
      setDone(await onCommit(payload));
      setStep("done");
    } catch (e) {
      setCommitError(e instanceof Error ? e.message : "Import failed. Please try again.");
    } finally {
      setCommitting(false);
    }
  };

  const restart = () => {
    setStep("upload");
    setParsed(null);
    setMapping({});
    setValidated(null);
    setDone(null);
    setCommitError(null);
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="space-y-6">
      <ol className="flex items-center gap-2 text-[12.5px]" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.id} aria-current={s.id === step ? "step" : undefined} className="flex items-center gap-2">
            <span
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold",
                i < stepIndex ? "bg-[var(--success)] text-white" : i === stepIndex ? "bg-[var(--brand)] text-white" : "bg-[var(--background-secondary)] text-[var(--muted)]"
              )}
            >
              {i + 1}
            </span>
            <span className={i === stepIndex ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}>{s.label}</span>
            {i < STEPS.length - 1 && <span className="w-6 h-px bg-[var(--border)]" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      {step === "upload" && <StepUpload onParsed={handleParsed} onDownloadTemplate={() => downloadTextFile("staff_import_template.csv", staffImportTemplate())} />}
      {step === "map" && parsed && (
        <StepMap
          headers={parsed.headers}
          notices={parsed.errors}
          sampleRows={parsed.rows.slice(0, 3)}
          fields={STAFF_IMPORT_FIELDS}
          mapping={mapping}
          dateFormat={dateFormat}
          onMappingChange={setMapping}
          onDateFormatChange={setDateFormat}
          onBack={() => setStep("upload")}
          onValidate={handleValidate}
        />
      )}
      {step === "review" && result && (
        <StepReview
          result={result}
          fields={STAFF_IMPORT_FIELDS}
          mode={mode}
          committing={committing}
          commitError={commitError}
          onModeChange={setMode}
          onDownloadErrors={handleDownloadErrors}
          onBack={() => setStep("map")}
          onCommit={handleCommit}
        />
      )}
      {step === "done" && done && <StepDone result={done} onRestart={restart} />}
    </div>
  );
}
