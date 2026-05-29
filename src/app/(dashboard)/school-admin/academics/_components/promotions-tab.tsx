"use client";

/**
 * Promotions Rules Tab
 * Displays promotion criteria between grades with management actions
 */

interface PromotionRule {
  id: string;
  fromGrade: string;
  toGrade: string;
  minAttendance: number;
  minGPA: number;
  autoPromote: boolean;
}

interface PromotionsTabProps {
  rules: PromotionRule[];
}

export function PromotionsTab({ rules }: PromotionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="rounded-lg border border-[#0891B2]/20 bg-[#0891B2]/5 p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-[#0891B2] flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-[#0891B2]">
              Promotion Criteria
            </h4>
            <p className="text-xs text-[#0891B2]/80 mt-1">
              Students must meet the minimum attendance and GPA requirements to
              be promoted to the next grade. When auto-promote is enabled,
              eligible students are promoted automatically at the end of the
              term. Otherwise, promotion requires manual approval by the admin.
            </p>
          </div>
        </div>
      </div>

      {/* Add Rule Button */}
      <div className="flex justify-end">
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
          Add Rule
        </button>
      </div>

      {/* Rules Table */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  From Grade
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  To Grade
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Min Attendance (%)
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Min GPA
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Auto-Promote
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {rule.fromGrade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {rule.toGrade}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[var(--background-secondary)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0891B2]"
                          style={{ width: `${rule.minAttendance}%` }}
                        />
                      </div>
                      <span className="text-sm text-[var(--foreground)]">
                        {rule.minAttendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {rule.minGPA.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {rule.autoPromote ? (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[rgba(16,185,129,0.1)] text-[#10B981]">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[rgba(245,158,11,0.1)] text-[#F59E0B]">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <button
                        className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        title="Edit rule"
                      >
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
                      </button>
                      {/* Delete */}
                      <button
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--muted)] hover:text-red-500 transition-colors"
                        title="Delete rule"
                      >
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>{rules.length} promotion rules configured</span>
        <span>
          {rules.filter((r) => r.autoPromote).length} with auto-promotion
          enabled
        </span>
      </div>
    </div>
  );
}
