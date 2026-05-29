"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownUp,
  BookOpen,
  Users,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  monthlyCirculation,
  categoryDistribution,
  libraryMembers,
  libraryLoans,
  librarySummary,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType = "circulation" | "collection" | "member_activity" | "overdue_analysis";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildCurvePath(points: number[], width: number, height: number, padding = 0): string {
  if (points.length < 2) return "";
  const max = Math.max(...points, 1);
  const h = height - padding * 2;
  const step = width / (points.length - 1);
  const pts = points.map((v, i) => ({ x: i * step, y: padding + h - (v / max) * h }));
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + step * 0.4;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - step * 0.4;
    const cp2y = pts[i].y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
}

function buildAreaPath(points: number[], width: number, height: number, padding = 0): string {
  const curve = buildCurvePath(points, width, height, padding);
  if (!curve) return "";
  return `${curve} L ${width},${height} L 0,${height} Z`;
}

// ---------------------------------------------------------------------------
// Report Type Config
// ---------------------------------------------------------------------------

const REPORT_TYPES: { id: ReportType; label: string; description: string; icon: typeof BarChart3; color: string }[] = [
  { id: "circulation", label: "Circulation Report", description: "Monthly issue/return trends and daily averages", icon: ArrowDownUp, color: "#10B981" },
  { id: "collection", label: "Collection Report", description: "Category breakdown, total volumes, growth rate", icon: BookOpen, color: "#3B82F6" },
  { id: "member_activity", label: "Member Activity", description: "Most active borrowers and engagement metrics", icon: Users, color: "#8B5CF6" },
  { id: "overdue_analysis", label: "Overdue Analysis", description: "Aging analysis and repeat offenders", icon: AlertTriangle, color: "#EF4444" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReportsTab() {
  const [activeReport, setActiveReport] = useState<ReportType>("circulation");

  return (
    <div className="space-y-4">
      {/* ── Report Type Selector ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TYPES.map((report, i) => {
          const isActive = activeReport === report.id;
          return (
            <motion.button key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setActiveReport(report.id)} className={cn("rounded-2xl p-5 text-left transition-all relative overflow-hidden", isActive ? "shadow-md" : "bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md")} style={isActive ? { outline: `2px solid ${report.color}`, outlineOffset: "-2px", background: `${report.color}08` } : {}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${report.color}15` }}>
                  <report.icon className="w-5 h-5" style={{ color: report.color }} />
                </div>
                <h4 className="text-[13px] font-semibold text-[var(--foreground)]">{report.label}</h4>
              </div>
              <p className="text-[11px] text-[var(--muted)]">{report.description}</p>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: report.color }} />}
            </motion.button>
          );
        })}
      </div>

      {/* ── Dynamic Content ────────────────────────────────────── */}
      {activeReport === "circulation" && <CirculationReport />}
      {activeReport === "collection" && <CollectionReport />}
      {activeReport === "member_activity" && <MemberActivityReport />}
      {activeReport === "overdue_analysis" && <OverdueAnalysisReport />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circulation Report
// ---------------------------------------------------------------------------

function CirculationReport() {
  const issuedValues = monthlyCirculation.map(d => d.issued);
  const returnedValues = monthlyCirculation.map(d => d.returned);
  const totalIssued = issuedValues.reduce((s, v) => s + v, 0);
  const totalReturned = returnedValues.reduce((s, v) => s + v, 0);
  const avgDaily = Math.round(totalIssued / (monthlyCirculation.length * 30));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Issued", value: totalIssued.toLocaleString(), color: "#10B981" },
          { label: "Total Returned", value: totalReturned.toLocaleString(), color: "#3B82F6" },
          { label: "Avg Daily Circulation", value: avgDaily.toString(), color: "#8B5CF6" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{kpi.label}</p>
            <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Monthly Circulation Trend</h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[11px] text-[var(--muted)]">Issued</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span className="text-[11px] text-[var(--muted)]">Returned</span></div>
        </div>
        <div className="relative h-[200px]">
          <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rep-area-i" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity="0.2" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient>
              <linearGradient id="rep-area-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
            </defs>
            {[0, 50, 100, 150].map(y => (<line key={y} x1="0" y1={y} x2="500" y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />))}
            <path d={buildAreaPath(issuedValues, 500, 200, 10)} fill="url(#rep-area-i)" />
            <path d={buildAreaPath(returnedValues, 500, 200, 10)} fill="url(#rep-area-r)" />
            <path d={buildCurvePath(issuedValues, 500, 200, 10)} fill="none" stroke="#10B981" strokeWidth="2.5" />
            <path d={buildCurvePath(returnedValues, 500, 200, 10)} fill="none" stroke="#3B82F6" strokeWidth="2.5" />
          </svg>
          <div className="flex justify-between mt-1 px-1">
            {monthlyCirculation.map(d => (<span key={d.month} className="text-[10px] text-[var(--muted)]">{d.month}</span>))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collection Report
// ---------------------------------------------------------------------------

function CollectionReport() {
  const totalVolumes = categoryDistribution.reduce((s, c) => s + c.count, 0);
  const maxCount = Math.max(...categoryDistribution.map(c => c.count));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Volumes", value: totalVolumes.toLocaleString(), color: "#3B82F6" },
          { label: "Categories", value: categoryDistribution.length.toString(), color: "#10B981" },
          { label: "Growth Rate", value: "+4.2%", color: "#8B5CF6" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{kpi.label}</p>
            <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Collection by Category</h3>
        <div className="space-y-3">
          {categoryDistribution.map(cat => (
            <div key={cat.category} className="flex items-center gap-3">
              <span className="text-[12px] font-medium text-[var(--muted)] w-24 truncate">{cat.category}</span>
              <div className="flex-1 h-6 rounded-lg bg-[var(--background-secondary)] relative overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.count / maxCount) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-lg flex items-center justify-end pr-2" style={{ backgroundColor: cat.color }}>
                  <span className="text-[10px] font-bold text-white">{cat.count}</span>
                </motion.div>
              </div>
              <span className="text-[11px] text-[var(--muted)] w-10 text-right">{Math.round((cat.count / totalVolumes) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Member Activity Report
// ---------------------------------------------------------------------------

function MemberActivityReport() {
  const topBorrowers = [...libraryMembers].sort((a, b) => b.totalBorrowed - a.totalBorrowed).slice(0, 5);
  const maxBorrowed = topBorrowers[0]?.totalBorrowed ?? 1;

  const gradeActivity = useMemo(() => {
    const grades: Record<string, number> = {};
    libraryMembers.forEach(m => { grades[m.grade] = (grades[m.grade] || 0) + m.totalBorrowed; });
    return Object.entries(grades).sort(([, a], [, b]) => b - a).map(([grade, count]) => ({ grade, count }));
  }, []);
  const maxGrade = gradeActivity[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Members", value: librarySummary.activeMembers.toLocaleString(), color: "#10B981" },
          { label: "Total Members", value: librarySummary.totalMembers.toLocaleString(), color: "#3B82F6" },
          { label: "Engagement Rate", value: `${Math.round((librarySummary.activeMembers / librarySummary.totalMembers) * 100)}%`, color: "#8B5CF6" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{kpi.label}</p>
            <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Borrowers */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Top Borrowers</h3>
          <div className="space-y-3">
            {topBorrowers.map((member, i) => (
              <div key={member.id} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[var(--muted)] w-4">{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-[var(--foreground)] truncate">{member.name}</p>
                  <p className="text-[10px] text-[var(--muted)]">{member.grade}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full bg-[var(--background-secondary)]">
                    <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${(member.totalBorrowed / maxBorrowed) * 100}%` }} />
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--foreground)] w-6 text-right">{member.totalBorrowed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Activity by Grade */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Activity by Grade</h3>
          <div className="space-y-2.5">
            {gradeActivity.map(g => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-[var(--muted)] w-10">{g.grade}</span>
                <div className="flex-1 h-5 rounded-md bg-[var(--background-secondary)] relative overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(g.count / maxGrade) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-md" style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
                </div>
                <span className="text-[11px] font-semibold text-[var(--foreground)] w-8 text-right">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overdue Analysis Report
// ---------------------------------------------------------------------------

function OverdueAnalysisReport() {
  const overdueLoans = libraryLoans.filter(l => l.status === "overdue");

  const agingData = useMemo(() => {
    const now = new Date("2026-03-03");
    const buckets = [
      { range: "0-7 days", count: 0, color: "#F59E0B" },
      { range: "7-14 days", count: 0, color: "#F97316" },
      { range: "14-30 days", count: 0, color: "#EF4444" },
      { range: "30+ days", count: 0, color: "#DC2626" },
    ];
    overdueLoans.forEach(l => {
      const days = Math.ceil((now.getTime() - new Date(l.dueDate).getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 7) buckets[0].count++;
      else if (days <= 14) buckets[1].count++;
      else if (days <= 30) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [overdueLoans]);

  const maxAging = Math.max(...agingData.map(a => a.count), 1);

  const repeatOffenders = useMemo(() => {
    const counts: Record<string, { name: string; count: number; totalFine: number }> = {};
    overdueLoans.forEach(l => {
      if (!counts[l.memberId]) counts[l.memberId] = { name: l.memberName, count: 0, totalFine: 0 };
      counts[l.memberId].count++;
      counts[l.memberId].totalFine += l.fineAmount;
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [overdueLoans]);

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Overdue", value: overdueLoans.length.toString(), color: "#EF4444" },
          { label: "Overdue Rate", value: `${Math.round((librarySummary.overdueBooks / librarySummary.booksCheckedOut) * 100)}%`, color: "#F59E0B" },
          { label: "Avg Days Overdue", value: overdueLoans.length > 0 ? Math.round(overdueLoans.reduce((s, l) => s + Math.ceil((new Date("2026-03-03").getTime() - new Date(l.dueDate).getTime()) / (1000 * 60 * 60 * 24)), 0) / overdueLoans.length).toString() : "0", color: "#8B5CF6" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-medium text-[var(--muted)] mb-1">{kpi.label}</p>
            <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Aging Analysis */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Aging Analysis</h3>
          <div className="space-y-3">
            {agingData.map(bucket => (
              <div key={bucket.range} className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-[var(--muted)] w-20">{bucket.range}</span>
                <div className="flex-1 h-6 rounded-lg bg-[var(--background-secondary)] relative overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(bucket.count / maxAging) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-lg flex items-center justify-end pr-2" style={{ backgroundColor: bucket.color }}>
                    {bucket.count > 0 && <span className="text-[10px] font-bold text-white">{bucket.count}</span>}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Repeat Offenders */}
        <div className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Repeat Offenders</h3>
          {repeatOffenders.length === 0 ? (
            <p className="text-[12px] text-[var(--muted)] text-center py-8">No repeat offenders found</p>
          ) : (
            <div className="space-y-3">
              {repeatOffenders.map((offender, i) => (
                <div key={offender.name} className="flex items-center justify-between p-3 rounded-xl bg-[var(--background-secondary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444] text-[10px] font-bold">{i + 1}</div>
                    <div>
                      <p className="text-[12px] font-medium text-[var(--foreground)]">{offender.name}</p>
                      <p className="text-[10px] text-[var(--muted)]">{offender.count} overdue book{offender.count > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-[#EF4444]">{fmt.format(offender.totalFine)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
