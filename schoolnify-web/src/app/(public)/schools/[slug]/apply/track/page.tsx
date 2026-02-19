"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { admissionApplications } from "@/lib/demo-data";
import { getSchoolBySlug } from "@/lib/school-lookup";

type ApplicationStatus =
  | "inquiry"
  | "applied"
  | "under_review"
  | "accepted"
  | "enrolled"
  | "rejected"
  | "waitlisted";

interface StatusHistoryEntry {
  status: ApplicationStatus;
  date: string;
  note: string;
}

interface Application {
  id: string;
  trackingCode: string;
  studentName: string;
  email: string;
  phone: string;
  grade: string;
  appliedDate: string;
  status: ApplicationStatus;
  parentName: string;
  parentEmail: string;
  previousSchool: string;
  documents: string[];
  notes?: string;
  statusHistory: StatusHistoryEntry[];
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  inquiry: "Inquiry Received",
  applied: "Application Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  enrolled: "Enrolled",
  rejected: "Application Declined",
  waitlisted: "Waitlisted",
};

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  inquiry: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  applied: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  under_review: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
  accepted: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  enrolled: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
  rejected: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  waitlisted: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
};

const PIPELINE_STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "under_review", label: "Under Review" },
  { key: "accepted", label: "Decision" },
  { key: "enrolled", label: "Enrollment" },
];

function getStageIndex(status: ApplicationStatus): number {
  switch (status) {
    case "inquiry":
      return -1;
    case "applied":
      return 0;
    case "under_review":
      return 1;
    case "accepted":
    case "rejected":
    case "waitlisted":
      return 2;
    case "enrolled":
      return 3;
    default:
      return -1;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TrackApplicationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const school = getSchoolBySlug(slug);

  const [trackingCode, setTrackingCode] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Application | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingCode.trim() || !email.trim()) return;

    setIsLoading(true);

    setTimeout(() => {
      const normalizedCode = trackingCode.trim().toUpperCase();
      const normalizedEmail = email.trim().toLowerCase();

      let found: Application | null = null;

      // 1. Check localStorage first
      try {
        const stored = localStorage.getItem("schoolnify_applications");
        if (stored) {
          const localApps: Application[] = JSON.parse(stored);
          found =
            localApps.find(
              (app) =>
                app.trackingCode.toUpperCase() === normalizedCode &&
                (app.email.toLowerCase() === normalizedEmail ||
                  app.parentEmail.toLowerCase() === normalizedEmail)
            ) || null;
        }
      } catch {
        // localStorage not available
      }

      // 2. Fall back to demo data
      if (!found) {
        found =
          (admissionApplications as Application[]).find(
            (app) =>
              app.trackingCode.toUpperCase() === normalizedCode &&
              (app.email.toLowerCase() === normalizedEmail ||
                app.parentEmail.toLowerCase() === normalizedEmail)
          ) || null;
      }

      setResult(found);
      setSearched(true);
      setIsLoading(false);
    }, 600);
  };

  const currentStageIndex = result ? getStageIndex(result.status) : -1;
  const contactEmail = school?.email || "admissions@greenwood.edu";

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0891B2]/10 border border-[#0891B2]/20 mb-5">
            <svg
              className="w-7 h-7 text-[#0891B2]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">
            Track Your Application
          </h1>
          <p className="text-[var(--muted)] text-base max-w-md mx-auto">
            Enter your tracking code and email to check your application status.
          </p>
        </div>

        {/* Lookup Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Tracking Code
              </label>
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="GA-2026-XXXX"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Email Address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student or parent email"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30 focus:border-[#0891B2] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !trackingCode.trim() || !email.trim()}
            className="mt-5 w-full py-2.5 px-4 rounded-lg bg-[#0891B2] text-white text-sm font-semibold hover:bg-[#0E7490] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Track Application
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {searched && !isLoading && (
          <>
            {!result ? (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  No Application Found
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
                  We could not find an application matching that tracking code and email.
                  Please double-check your tracking code and ensure you are using the
                  email address associated with the application.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Student Info Card */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#0891B2]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#0891B2] font-bold text-sm">
                        {result.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {result.studentName}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mt-0.5">{result.grade}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-[var(--muted)] bg-[var(--background-secondary)] px-2 py-1 rounded">
                        {result.trackingCode}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-0.5">Email</p>
                      <p className="text-sm text-[var(--foreground)]">{result.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-0.5">Applied Date</p>
                      <p className="text-sm text-[var(--foreground)]">{formatDate(result.appliedDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-0.5">Parent</p>
                      <p className="text-sm text-[var(--foreground)]">{result.parentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-0.5">Previous School</p>
                      <p className="text-sm text-[var(--foreground)]">{result.previousSchool}</p>
                    </div>
                  </div>
                </div>

                {/* Current Status Badge */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
                    Current Status
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${STATUS_COLORS[result.status].bg} ${STATUS_COLORS[result.status].text}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${STATUS_COLORS[result.status].dot} ${
                          result.status !== "enrolled" && result.status !== "rejected" ? "animate-pulse" : ""
                        }`}
                      />
                      {STATUS_LABELS[result.status]}
                    </span>
                  </div>

                  {/* Pipeline progress bar */}
                  <div className="mt-5 flex items-center gap-1">
                    {PIPELINE_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const isTerminalDecision =
                        idx === 1 && (result.status === "rejected" || result.status === "waitlisted");

                      return (
                        <div key={stage.key} className="flex-1">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isCompleted || isCurrent
                                ? isTerminalDecision
                                  ? result.status === "rejected"
                                    ? "bg-red-400"
                                    : "bg-orange-400"
                                  : "bg-[#0891B2]"
                                : "bg-[var(--border)]"
                            }`}
                          />
                          <p
                            className={`text-[10px] mt-1.5 ${
                              isCompleted || isCurrent
                                ? "text-[var(--foreground)] font-medium"
                                : "text-[var(--muted)]"
                            }`}
                          >
                            {stage.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-5">
                    Application Timeline
                  </p>

                  <div className="relative">
                    {result.statusHistory.map((entry, idx) => {
                      const isLast = idx === result.statusHistory.length - 1;

                      return (
                        <div key={idx} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              <div className="w-3 h-3 rounded-full border-2 border-[#0891B2] bg-[#0891B2]" />
                              {isLast && (
                                <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#0891B2] animate-ping opacity-40" />
                              )}
                            </div>
                            {!isLast && <div className="w-0.5 flex-1 mt-1 bg-[#0891B2]/30" />}
                          </div>
                          <div className="flex-1 -mt-0.5 pb-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-medium text-[var(--foreground)]">
                                {STATUS_LABELS[entry.status]}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--muted)] mb-1">{formatDate(entry.date)}</p>
                            {entry.note && (
                              <p className="text-sm text-[var(--muted)]">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Future stages */}
                    {PIPELINE_STAGES.filter((_, idx) => idx > currentStageIndex).map((stage, idx) => {
                      if (result.status === "rejected" || result.status === "waitlisted") return null;

                      return (
                        <div key={stage.key} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full border-2 border-[var(--border)] bg-transparent" />
                            {idx < PIPELINE_STAGES.filter((_, i) => i > currentStageIndex).length - 1 && (
                              <div className="w-0.5 flex-1 mt-1 border-l-2 border-dashed border-[var(--border)]" />
                            )}
                          </div>
                          <div className="flex-1 -mt-0.5">
                            <span className="text-sm text-[var(--muted)]">{stage.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Note */}
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0891B2] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <p className="text-sm text-[var(--muted)]">
                    Questions about your application? Contact{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-[#0891B2] hover:underline font-medium"
                    >
                      {contactEmail}
                    </a>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
