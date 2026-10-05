"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Download, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseCsvFile, parseCsvText, type ParsedCsv } from "@/lib/import/csv";

interface StepUploadProps {
  onParsed: (parsed: ParsedCsv) => void;
  onDownloadTemplate: () => void;
}

const button =
  "inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]";

export function StepUpload({ onParsed, onDownloadTemplate }: StepUploadProps) {
  const [tab, setTab] = useState<"file" | "paste">("file");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const headingId = useId();
  const panelId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const TABS = ["file", "paste"] as const;

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowLeft" ? (index === 0 ? 1 : 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? 1
      : null;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    setTab(TABS[next]);
  };

  const finish = (parsed: ParsedCsv) => {
    if (parsed.rows.length === 0) {
      setErrors(parsed.errors.length ? parsed.errors : ["No rows found in the file"]);
      return;
    }
    // Non-fatal notices travel with the parse result and show on the map step.
    onParsed(parsed);
  };

  return (
    <section aria-labelledby={headingId} className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={headingId} className="text-[15px] font-semibold text-[var(--foreground)]">Upload a CSV</h2>
          <p className="text-[12.5px] text-[var(--muted)] mt-0.5">
            One row per person. Required columns: first name, last name, work email, designation, category, department, hire date.
          </p>
        </div>
        <button type="button" onClick={onDownloadTemplate} className={button}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Download template
        </button>
      </div>

      <div role="tablist" aria-label="Source" className="flex gap-1 border-b border-[var(--border)]">
        {TABS.map((t, index) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${panelId}-tab-${t}`}
            aria-selected={tab === t}
            aria-controls={panelId}
            tabIndex={tab === t ? 0 : -1}
            ref={(el) => { tabRefs.current[index] = el; }}
            onKeyDown={(e) => onTabKeyDown(e, index)}
            onClick={() => setTab(t)}
            className={cn("px-3 py-2 text-sm font-medium border-b-2 -mb-px", tab === t ? "border-[var(--brand)] text-[var(--foreground)]" : "border-transparent text-[var(--muted)]")}
          >
            {t === "file" ? "Upload file" : "Paste"}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={`${panelId}-tab-${tab}`}>
      {tab === "file" ? (
        <label className="flex flex-col items-center justify-center gap-2 p-10 rounded-xl border-2 border-dashed border-[var(--border)] cursor-pointer hover:border-[var(--brand)]/50">
          <FileUp className="w-6 h-6 text-[var(--muted)]" aria-hidden="true" />
          <span className="text-sm text-[var(--foreground)]">Choose a CSV file</span>
          <span className="text-xs text-[var(--muted)]">Export from Excel or Sheets as CSV first; .xlsx is not accepted.</span>
          <input
            type="file"
            accept=".csv,text/csv"
            aria-label="CSV file"
            className="sr-only"
            onChange={async (e) => {
              const input = e.target;
              const file = input.files?.[0];
              if (file) finish(await parseCsvFile(file));
              // Allow the same file to be chosen again after Back.
              input.value = "";
            }}
          />
        </label>
      ) : (
        <div className="space-y-3">
          <textarea
            aria-label="Paste CSV"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder={"first_name,last_name,email,...\nAda,Lovelace,ada@school.edu,..."}
            className="w-full p-3 text-[13px] font-mono rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={text.trim() === ""}
              onClick={() => finish(parseCsvText(text))}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)] disabled:opacity-60"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      </div>

      {errors.length > 0 && (
        <ul role="alert" className="text-[12.5px] text-[var(--error)] space-y-1">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
