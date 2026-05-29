"use client";

import { useState } from "react";
import Link from "next/link";

interface ApplicationSuccessProps {
  trackingCode: string;
  studentName: string;
  onReset: () => void;
  trackUrl: string;
}

export function ApplicationSuccess({
  trackingCode,
  studentName,
  onReset,
  trackUrl,
}: ApplicationSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = trackingCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center py-8">
      {/* Checkmark Icon */}
      <div className="mx-auto w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-[#10B981] flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-[#10B981]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-3">
        Application Submitted Successfully!
      </h2>

      <p className="text-[var(--muted)] text-base mb-8 max-w-md mx-auto">
        Thank you, {studentName}. Your application has been received.
      </p>

      {/* Tracking Code Box */}
      <div className="inline-block rounded-lg border-2 border-dashed border-[#0891B2]/40 bg-[#0891B2]/5 px-8 py-5 mb-4">
        <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-medium mb-2">
          Your Tracking Code
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl sm:text-3xl font-mono font-bold text-[#0891B2] tracking-wider">
            {trackingCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md border border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[#0891B2]/10 transition-colors"
            title="Copy tracking code"
          >
            {copied ? (
              <svg
                className="w-4 h-4 text-[#10B981]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-[var(--muted)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-10">
        Save this tracking code to check your application status.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={trackUrl}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0891B2] text-white font-medium hover:bg-[#0E7490] transition-colors text-sm"
        >
          Track Application
        </Link>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-medium hover:bg-[var(--background-secondary)] transition-colors text-sm"
        >
          Submit Another
        </button>
      </div>
    </div>
  );
}
