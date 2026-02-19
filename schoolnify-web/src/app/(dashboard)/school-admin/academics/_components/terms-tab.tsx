"use client";

/**
 * Terms & Sessions Tab
 * Displays academic terms with status, dates, and duration
 */

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface TermsTabProps {
  terms: Term[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeeksDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
}

function getTermStatus(
  term: Term
): { label: string; color: string; bg: string } {
  if (term.isCurrent) {
    return { label: "Current", color: "#0891B2", bg: "rgba(8,145,178,0.1)" };
  }
  const now = new Date();
  const start = new Date(term.startDate);
  if (start > now) {
    return { label: "Upcoming", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  }
  return { label: "Completed", color: "#10B981", bg: "rgba(16,185,129,0.1)" };
}

export function TermsTab({ terms }: TermsTabProps) {
  return (
    <div className="space-y-6">
      {/* Academic Year Header */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Academic Year: 2025-2026
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              3 terms configured for this academic year
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Academic Year
          </button>
        </div>
      </div>

      {/* Term Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terms.map((term) => {
          const status = getTermStatus(term);
          const weeks = getWeeksDuration(term.startDate, term.endDate);

          return (
            <div
              key={term.id}
              className={`rounded-lg border bg-[var(--card)] p-5 transition-all ${
                term.isCurrent
                  ? "border-[#0891B2] shadow-sm"
                  : "border-[var(--border)]"
              }`}
            >
              {/* Term Name + Status */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  {term.name}
                </h4>
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    color: status.color,
                    backgroundColor: status.bg,
                  }}
                >
                  {status.label}
                </span>
              </div>

              {/* Dates */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Start Date</p>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {formatDate(term.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <div>
                    <p className="text-xs text-[var(--muted)]">End Date</p>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {formatDate(term.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--background-secondary)]">
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
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="text-sm text-[var(--foreground)]">
                  {weeks} weeks
                </span>
              </div>

              {/* Edit Button */}
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                Edit Term
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
