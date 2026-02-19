"use client";

import { admissionsAnalytics } from "@/lib/demo-data";
import { TrendingUp, BarChart3, PieChart, Globe } from "lucide-react";

const funnelStages = [
  { label: "Inquiry", count: 245 },
  { label: "Applied", count: 180 },
  { label: "Review", count: 142 },
  { label: "Accepted", count: 98 },
  { label: "Enrolled", count: 72 },
];

function conversionPercent(current: number, previous: number): string {
  if (previous === 0) return "0%";
  return `${Math.round((current / previous) * 100)}%`;
}

export function AnalyticsTab() {
  const {
    totalInquiries,
    conversionRate,
    topSources,
    monthlyApplications,
    gradeDistribution,
  } = admissionsAnalytics;

  const maxMonthly = Math.max(...monthlyApplications.map((m) => m.count));
  const maxGrade = Math.max(...gradeDistribution.map((g) => g.count));
  const maxSource = Math.max(...topSources.map((s) => s.count));
  const funnelMax = funnelStages[0].count;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-[#0891B2]" />
            </div>
            <div>
              <p className="text-[12px] text-[var(--muted)]">
                Total Inquiries
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {totalInquiries}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-[#10B981]" />
            </div>
            <div>
              <p className="text-[12px] text-[var(--muted)]">
                Conversion Rate
              </p>
              <p className="text-xl font-bold text-[var(--foreground)]">
                {conversionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions Funnel */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <PieChart className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Admissions Funnel
          </h3>
        </div>
        <div className="space-y-3">
          {funnelStages.map((stage, index) => {
            const widthPercent = Math.max(
              (stage.count / funnelMax) * 100,
              8
            );
            const conversion =
              index > 0
                ? conversionPercent(stage.count, funnelStages[index - 1].count)
                : null;
            return (
              <div key={stage.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-[var(--foreground)]">
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {conversion && (
                      <span className="text-[11px] text-[var(--muted)]">
                        {conversion}
                      </span>
                    )}
                    <span className="text-[13px] font-semibold text-[var(--foreground)] tabular-nums">
                      {stage.count}
                    </span>
                  </div>
                </div>
                <div className="h-7 w-full rounded-lg bg-[var(--background-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-[#0891B2] transition-all duration-500"
                    style={{ width: `${widthPercent}%`, opacity: 1 - index * 0.12 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Applications + Grade Distribution row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Applications */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[var(--muted)]" />
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Monthly Applications
            </h3>
          </div>
          <div className="space-y-2.5">
            {monthlyApplications.map((item) => {
              const widthPercent = Math.max(
                (item.count / maxMonthly) * 100,
                6
              );
              return (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="text-[12px] text-[var(--muted)] w-8 shrink-0">
                    {item.month}
                  </span>
                  <div className="flex-1 h-6 rounded-md bg-[var(--background-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-md bg-[#3B82F6] transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-[var(--foreground)] tabular-nums w-8 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-[var(--muted)]" />
            <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
              Grade Distribution
            </h3>
          </div>
          <div className="space-y-2.5">
            {gradeDistribution.map((item) => {
              const widthPercent = Math.max(
                (item.count / maxGrade) * 100,
                6
              );
              return (
                <div key={item.grade} className="flex items-center gap-3">
                  <span className="text-[12px] text-[var(--muted)] w-16 shrink-0">
                    {item.grade}
                  </span>
                  <div className="flex-1 h-6 rounded-md bg-[var(--background-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-md bg-[#A855F7] transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-medium text-[var(--foreground)] tabular-nums w-8 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Sources */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center gap-2 mb-5">
          <Globe className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">
            Top Sources
          </h3>
        </div>
        <div className="space-y-2.5">
          {topSources.map((item) => {
            const widthPercent = Math.max(
              (item.count / maxSource) * 100,
              6
            );
            return (
              <div key={item.source} className="flex items-center gap-3">
                <span className="text-[13px] text-[var(--foreground)] w-28 shrink-0">
                  {item.source}
                </span>
                <div className="flex-1 h-6 rounded-md bg-[var(--background-secondary)] overflow-hidden">
                  <div
                    className="h-full rounded-md bg-[#10B981] transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 text-[12px] font-medium text-[#10B981] bg-[#10B981]/10 rounded-full tabular-nums">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
