"use client";

interface DocumentsData {
  documents: string[];
  notes: string;
}

interface StepDocumentsProps {
  data: DocumentsData;
  onChange: (field: string, value: string | string[]) => void;
}

const DOCUMENT_OPTIONS = [
  "Birth Certificate",
  "Previous School Transcript",
  "Recommendation Letter",
  "Medical Report",
  "Passport Photographs (2 copies)",
  "Transfer Certificate",
];

const inputClassName =
  "w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all";

const labelClassName = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

export function StepDocuments({ data, onChange }: StepDocumentsProps) {
  const handleCheckboxChange = (document: string) => {
    const updated = data.documents.includes(document)
      ? data.documents.filter((d) => d !== document)
      : [...data.documents, document];
    onChange("documents", updated);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Documents</h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Select the documents you have available. You&apos;ll need to submit physical copies
          during enrollment.
        </p>
      </div>

      {/* Document Checklist */}
      <div className="space-y-3">
        {DOCUMENT_OPTIONS.map((doc) => (
          <label
            key={doc}
            className="flex items-center gap-3 p-3.5 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] cursor-pointer hover:border-[#0891B2]/40 transition-all"
          >
            <input
              type="checkbox"
              checked={data.documents.includes(doc)}
              onChange={() => handleCheckboxChange(doc)}
              className="w-4 h-4 rounded border-[var(--border)] text-[#0891B2] focus:ring-[#0891B2]/30 accent-[#0891B2]"
            />
            <span className="text-sm text-[var(--foreground)]">{doc}</span>
          </label>
        ))}
      </div>

      {/* Additional Notes */}
      <div>
        <label className={labelClassName}>Additional Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Any additional information you'd like to share..."
          rows={4}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
