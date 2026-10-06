"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

/** Segment error boundary (must be a Client Component). On Next 16.1 the recovery prop is `reset`. */
export default function StaffError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[staff] route error", error);
  }, [error]);

  return (
    <div role="alert" className="max-w-[1200px] mx-auto py-24 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--error)]/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-[var(--error)]" aria-hidden="true" />
      </div>
      <h1 className="text-lg font-semibold text-[var(--foreground)]">Something went wrong loading staff</h1>
      <p className="text-sm text-[var(--muted)] mt-1 max-w-md">
        {error.digest ? `Reference ${error.digest}. ` : ""}Try again, and if it keeps happening let an administrator know.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 px-4 py-2 text-sm font-medium text-white bg-[var(--brand)] rounded-lg hover:bg-[var(--brand-dark)]"
      >
        Try again
      </button>
    </div>
  );
}
