"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, Download, AlertCircle } from "lucide-react";
import { parseFile, type ParsedCSV } from "../_utils/csv-parser";
import { generateTemplate, downloadCSV } from "../_utils/template-generator";

interface StepUploadProps {
  country: string;
  gradeLevels: string[];
  dateFormat: string;
  onParsed: (csv: ParsedCSV) => void;
}

export function StepUpload({ country, gradeLevels, dateFormat, onParsed }: StepUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext ?? "")) {
      setError("Please upload a CSV or Excel (.xlsx) file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }
    setError("");
    setParsing(true);
    try {
      const result = await parseFile(file);
      if (result.rowCount === 0) {
        setError("The file appears to be empty or could not be parsed.");
        setParsing(false);
        return;
      }
      if (result.rowCount > 5000) {
        setError(`File has ${result.rowCount.toLocaleString()} rows. Maximum is 5,000 per import. Split the file into smaller batches.`);
        setParsing(false);
        return;
      }
      onParsed(result);
    } catch {
      setError("Failed to parse the file. Please check the format.");
    }
    setParsing(false);
  }, [onParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDownloadTemplate = () => {
    const csv = generateTemplate(country, gradeLevels, dateFormat);
    downloadCSV(csv, "student_import_template.csv");
  };

  return (
    <div className="space-y-6">
      {/* Template download */}
      <div className="rounded-xl border border-[#0891B2]/20 bg-[#0891B2]/5 p-4">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-[#0891B2] mt-0.5 shrink-0" />
          <div>
            <p className="text-[14px] font-medium text-[var(--foreground)] mb-1">
              Start with our template
            </p>
            <p className="text-[13px] text-[var(--muted)] mb-3">
              Download a CSV template pre-configured with the right columns for your school.
              Fill it in with your student data, then upload it below.
            </p>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragging
            ? "border-[#0891B2] bg-[#0891B2]/5"
            : "border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[var(--background-secondary)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-3">
          {parsing ? (
            <>
              <div className="w-10 h-10 rounded-full border-2 border-[#0891B2] border-t-transparent animate-spin" />
              <p className="text-[14px] text-[var(--muted)]">Parsing file...</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--background-secondary)] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[var(--muted)]" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[var(--foreground)]">
                  Drag and drop your CSV file here
                </p>
                <p className="text-[13px] text-[var(--muted)] mt-1">
                  or click to browse. Maximum 10MB.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Accepted formats */}
      <div className="flex items-center gap-4 text-[12px] text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>CSV and Excel (.xlsx) supported · up to 5,000 rows · max 10MB</span>
        </div>
        <span>UTF-8 encoding recommended</span>
        <span>First row must be column headers</span>
      </div>
    </div>
  );
}
