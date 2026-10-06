"use client";

import { useId } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export interface CommitResult {
  created: number;
  updated: number;
  failed: number;
}

export function StepDone({ result, onRestart }: { result: CommitResult; onRestart: () => void }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="rounded-2xl bg-[var(--card)] p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center text-center">
      <CheckCircle2 className="w-10 h-10 text-[var(--success)] mb-3" aria-hidden="true" />
      <h2 id={headingId} className="text-lg font-semibold text-[var(--foreground)]">Import complete</h2>
      <p className="text-sm text-[var(--muted)] mt-1">
        {result.created} created · {result.updated} updated · {result.failed} failed
      </p>
      <div className="flex items-center gap-3 mt-6">
        <button type="button" onClick={onRestart} className="px-4 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)]">
          Import another file
        </button>
        <Link href="/school-admin/staff" className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)]">
          Go to staff
        </Link>
      </div>
    </section>
  );
}
