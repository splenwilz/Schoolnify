"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  TrendingUp,
  AlertTriangle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Clock,
  ChevronDown,
  AlertCircle,
  Info,
  CalendarClock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  examSummary,
  examSchedule,
  termlyTrend,
  examGradeDistribution,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "subject" | "class" | "date" | "venue";
type SortDirection = "asc" | "desc";
type ExamFilter = "all" | "completed" | "in_progress" | "scheduled" | "postponed";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  completed: { dot: "#10B981", bg: "rgba(16,185,129,0.1)", text: "#10B981" },
  in_progress: { dot: "#3B82F6", bg: "rgba(59,130,246,0.1)", text: "#3B82F6" },
  scheduled: { dot: "#F59E0B", bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  postponed: { dot: "#EF4444", bg: "rgba(239,68,68,0.1)", text: "#EF4444" },
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  scheduled: "Scheduled",
  postponed: "Postponed",
};

const ITEMS_PER_PAGE = 5;

const SEVERITY_STYLES: Record<string, { border: string; icon: string; bg: string }> = {
  critical: { border: "#EF4444", icon: "#EF4444", bg: "rgba(239,68,68,0.06)" },
  warning: { border: "#F59E0B", icon: "#F59E0B", bg: "rgba(245,158,11,0.06)" },
  info: { border: "#3B82F6", icon: "#3B82F6", bg: "rgba(59,130,246,0.06)" },
};

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

function buildSparkPath(values: number[], w: number, h: number): string {
  if (values.length < 2) return "";
  const max = Math.max(...values, 1);
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => ({ x: i * step, y: h - (v / max) * h * 0.8 - h * 0.1 }));
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = pts[i - 1].x + step * 0.35;
    const cp1y = pts[i - 1].y;
    const cp2x = pts[i].x - step * 0.35;
    const cp2y = pts[i].y;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OverviewTab() {
  const [statusFilter, setStatusFilter] = useState<ExamFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Exam health
  const examHealth = useMemo(() => {
    const rate = examSummary.passRate;
    if (rate >= 80) return { label: "On Track", color: "#10B981", bg: "rgba(16,185,129,0.15)" };
    if (rate >= 65) return { label: "Needs Attention", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" };
    return { label: "Critical", color: "#EF4444", bg: "rgba(239,68,68,0.15)" };
  }, []);

  // Alerts
  const alerts = useMemo(() => {
    const items: { id: string; severity: "critical" | "warning" | "info"; title: string; description: string }[] = [];
    if (examSummary.pendingGrades > 0) items.push({ id: "pending-grades", severity: "warning", title: `${examSummary.pendingGrades} pending grade submissions`, description: "Some subjects still have ungraded scores. Please remind teachers to submit grades." });
    if (examSummary.scheduledExams > 0) items.push({ id: "upcoming-exams", severity: "info", title: `${examSummary.scheduledExams} exams scheduled`, description: "Ensure venues and invigilators are confirmed for all upcoming exams." });
    if (examSummary.reportsPending > 0) items.push({ id: "reports-due", severity: "critical", title: `${examSummary.reportsPending} report cards pending`, description: "Report cards need to be generated and published before the end of term." });
    return items.filter(a => !dismissedAlerts.has(a.id));
  }, [dismissedAlerts]);

  // Table filtering
  const statusCounts = useMemo(() => ({
    all: examSchedule.length,
    completed: examSchedule.filter(e => e.status === "completed").length,
    in_progress: examSchedule.filter(e => e.status === "in_progress").length,
    scheduled: examSchedule.filter(e => e.status === "scheduled").length,
    postponed: examSchedule.filter(e => e.status === "postponed").length,
  }), []);

  const filtered = useMemo(() => {
    let data = [...examSchedule];
    if (statusFilter !== "all") data = data.filter(e => e.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(e => e.subject.toLowerCase().includes(q) || e.class.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      const m = sortDirection === "asc" ? 1 : -1;
      return a[sortField] < b[sortField] ? -m : a[sortField] > b[sortField] ? m : 0;
    });
    return data;
  }, [statusFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDirection("asc"); }
  };

  // Chart data
  const caValues = termlyTrend.map(t => t.caAvg);
  const examValues = termlyTrend.map(t => t.examAvg);
  const chartW = 400;
  const chartH = 180;
  const caPath = buildCurvePath(caValues, chartW, chartH, 12);
  const caArea = buildAreaPath(caValues, chartW, chartH, 12);
  const examPath = buildCurvePath(examValues, chartW, chartH, 12);
  const examArea = buildAreaPath(examValues, chartW, chartH, 12);

  // Donut
  const totalGrades = examGradeDistribution.reduce((s, g) => s + g.count, 0);
  let donutOffset = 0;
  const donutSegments = examGradeDistribution.map(g => {
    const pct = g.count / totalGrades;
    const seg = { ...g, pct, offset: donutOffset };
    donutOffset += pct;
    return seg;
  });

  // Pass rate arc for banner
  const passRateAngle = (examSummary.passRate / 100) * 180;
  const arcRadius = 60;
  const arcCx = 70;
  const arcCy = 70;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX1 = arcCx + arcRadius * Math.cos(toRad(180));
  const arcY1 = arcCy + arcRadius * Math.sin(toRad(180));
  const arcX2 = arcCx + arcRadius * Math.cos(toRad(180 + passRateAngle));
  const arcY2 = arcCy + arcRadius * Math.sin(toRad(180 + passRateAngle));
  const largeArc = passRateAngle > 180 ? 1 : 0;

  // Spark values for KPI cards
  const sparkExams = [35, 38, 42, 40, 45, 48];
  const sparkAvg = [62.1, 63.8, 65.2, 67.0, 68.7, 69.5];

  return (
    <div className="space-y-6">
      {/* -------- Row 1: Banner + KPI -------- */}
      <div className="grid grid-cols-12 gap-4">
        {/* Exam Season Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 md:col-span-5 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">Exam Season</p>
              <h3 className="text-lg font-bold text-[var(--foreground)]">Term 2 Examinations</h3>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full" style={{ background: examHealth.bg, color: examHealth.color }}>
              {examHealth.label}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Arc */}
            <svg width="140" height="80" viewBox="0 0 140 80">
              <path d={`M ${arcCx - arcRadius},${arcCy} A ${arcRadius},${arcRadius} 0 0 1 ${arcCx + arcRadius},${arcCy}`} fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" />
              <motion.path
                d={`M ${arcX1},${arcY1} A ${arcRadius},${arcRadius} 0 ${largeArc} 1 ${arcX2},${arcY2}`}
                fill="none"
                stroke="#6366F1"
                strokeWidth="10"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <text x={arcCx} y={arcCy - 8} textAnchor="middle" className="text-[18px] font-bold fill-[var(--foreground)]">{examSummary.passRate}%</text>
              <text x={arcCx} y={arcCy + 6} textAnchor="middle" className="text-[9px] fill-[var(--muted)]">Pass Rate</text>
            </svg>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[var(--muted)]">Completed</span>
                <span className="font-semibold text-[var(--foreground)] ml-auto">{examSummary.completedExams}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[var(--muted)]">Scheduled</span>
                <span className="font-semibold text-[var(--foreground)] ml-auto">{examSummary.scheduledExams}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[var(--muted)]">Pending Grades</span>
                <span className="font-semibold text-[var(--foreground)] ml-auto">{examSummary.pendingGrades}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 KPI Cards */}
        <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Exams", value: examSummary.totalExams, icon: ClipboardCheck, color: "#6366F1", spark: sparkExams },
            { label: "Average Score", value: `${examSummary.avgScore}%`, icon: TrendingUp, color: "#10B981", spark: sparkAvg },
            { label: "Pending Grades", value: examSummary.pendingGrades, icon: Clock, color: "#F59E0B", spark: null, ring: { current: examSummary.totalExams - examSummary.pendingGrades, total: examSummary.totalExams } },
          ].map((kpi, idx) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-l-[3px]"
              style={{ borderColor: kpi.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                  <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                {kpi.spark && (
                  <svg width="60" height="28" viewBox="0 0 60 28">
                    <motion.path
                      d={buildSparkPath(kpi.spark, 60, 28)}
                      fill="none"
                      stroke={kpi.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.2 + 0.1 * idx }}
                    />
                  </svg>
                )}
                {kpi.ring && (
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="4" />
                    <motion.circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke={kpi.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(kpi.ring.current / kpi.ring.total) * 88} 88`}
                      transform="rotate(-90 18 18)"
                      initial={{ strokeDasharray: "0 88" }}
                      animate={{ strokeDasharray: `${(kpi.ring.current / kpi.ring.total) * 88} 88` }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                )}
              </div>
              <p className="text-[11px] font-medium text-[var(--muted)] mb-0.5">{kpi.label}</p>
              <p className="text-[20px] font-bold text-[var(--foreground)]">{kpi.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* -------- Row 2: Performance Trend + Grade Distribution -------- */}
      <div className="grid grid-cols-12 gap-4">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-12 md:col-span-8 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Performance Trend</h3>
              <p className="text-[11px] text-[var(--muted)]">CA Average vs Exam Average across terms</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#6366F1]" /> CA Avg</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#10B981]" /> Exam Avg</span>
            </div>
          </div>

          <div className="relative">
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" className="w-full h-[180px]">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                <line key={f} x1={0} x2={chartW} y1={12 + (chartH - 24) * f} y2={12 + (chartH - 24) * f} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
              ))}
              {/* CA line */}
              <motion.path d={caArea} fill="url(#caGrad)" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }} />
              <motion.path d={caPath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
              {/* Exam line */}
              <motion.path d={examArea} fill="url(#examGrad)" initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 1 }} />
              <motion.path d={examPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
              {/* Dots */}
              {caValues.map((v, i) => {
                const max = Math.max(...caValues, 1);
                const x = (i * chartW) / (caValues.length - 1);
                const y = 12 + (chartH - 24) - (v / max) * (chartH - 24);
                return <circle key={`ca-${i}`} cx={x} cy={y} r="4" fill="#6366F1" stroke="var(--card)" strokeWidth="2" />;
              })}
              {examValues.map((v, i) => {
                const max = Math.max(...examValues, 1);
                const x = (i * chartW) / (examValues.length - 1);
                const y = 12 + (chartH - 24) - (v / max) * (chartH - 24);
                return <circle key={`ex-${i}`} cx={x} cy={y} r="4" fill="#10B981" stroke="var(--card)" strokeWidth="2" />;
              })}
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#6366F1" stopOpacity="0" /></linearGradient>
                <linearGradient id="examGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient>
              </defs>
            </svg>
            {/* X axis labels */}
            <div className="flex justify-between mt-2 px-1">
              {termlyTrend.map(t => (
                <span key={t.term} className="text-[10px] text-[var(--muted)]">{t.term}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grade Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 md:col-span-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        >
          <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Grade Distribution</h3>
          <p className="text-[11px] text-[var(--muted)] mb-4">Student grade breakdown</p>

          <div className="flex justify-center mb-4">
            <svg width="140" height="140" viewBox="0 0 140 140">
              {donutSegments.map((seg, i) => {
                const circumference = 2 * Math.PI * 50;
                return (
                  <motion.circle
                    key={seg.grade}
                    cx="70" cy="70" r="50"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={`${seg.pct * circumference} ${circumference}`}
                    strokeDashoffset={-seg.offset * circumference}
                    transform="rotate(-90 70 70)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                  />
                );
              })}
              <text x="70" y="66" textAnchor="middle" className="text-[18px] font-bold fill-[var(--foreground)]">{totalGrades}</text>
              <text x="70" y="80" textAnchor="middle" className="text-[9px] fill-[var(--muted)]">Students</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {examGradeDistribution.map(g => (
              <div key={g.grade} className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="text-[var(--muted)]">Grade {g.grade}</span>
                <span className="ml-auto font-medium text-[var(--foreground)]">{g.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* -------- Row 3: Alerts -------- */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
            {alerts.map(alert => {
              const sev = SEVERITY_STYLES[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  className="flex items-start gap-3 p-4 rounded-xl border-l-[3px]"
                  style={{ borderColor: sev.border, background: sev.bg }}
                >
                  {alert.severity === "critical" ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: sev.icon }} /> :
                   alert.severity === "warning" ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: sev.icon }} /> :
                   <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: sev.icon }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-[var(--foreground)]">{alert.title}</p>
                    <p className="text-[11px] text-[var(--muted)]">{alert.description}</p>
                  </div>
                  <button onClick={() => setDismissedAlerts(s => new Set(s).add(alert.id))} className="p-1 rounded-lg hover:bg-[var(--background-secondary)]">
                    <X className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- Row 4: Upcoming Exams Table -------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--background-secondary)] overflow-x-auto">
            {(["all", "scheduled", "in_progress", "completed", "postponed"] as ExamFilter[]).map(f => (
              <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }} className={cn("px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap", statusFilter === f ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]")}>
                {f === "all" ? "All" : STATUS_LABELS[f]} ({statusCounts[f]})
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" />
            <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search..." className="pl-9 pr-3 py-2 text-[12px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg w-full sm:w-48 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {(
                  [
                    { key: "subject", label: "Subject" },
                    { key: "class", label: "Class" },
                    { key: "date", label: "Date" },
                    { key: "venue", label: "Venue" },
                    { key: "time", label: "Time" },
                    { key: "invigilator", label: "Invigilator" },
                    { key: "status", label: "Status" },
                    { key: "actions", label: "" },
                  ] as const
                ).map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== "time" && col.key !== "invigilator" && col.key !== "status" && col.key !== "actions" && handleSort(col.key as SortField)}
                    className={cn("py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider", (col.key === "subject" || col.key === "class" || col.key === "date" || col.key === "venue") && "cursor-pointer hover:text-[var(--foreground)]")}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && <ChevronDown className={cn("w-3 h-3 transition-transform", sortDirection === "asc" && "rotate-180")} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(exam => {
                const ss = STATUS_COLORS[exam.status];
                return (
                  <tr key={exam.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                    <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{exam.subject}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--foreground)]">{exam.class}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{new Date(exam.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.venue}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.startTime} - {exam.endTime}</td>
                    <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{exam.invigilator}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: ss.bg, color: ss.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ss.dot }} />
                        {STATUS_LABELS[exam.status]}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="relative">
                        <button onClick={() => setOpenActionMenu(openActionMenu === exam.id ? null : exam.id)} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-[var(--muted)]" />
                        </button>
                        {openActionMenu === exam.id && (
                          <div className="absolute right-0 top-8 z-20 w-40 py-1 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg">
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Eye className="w-3.5 h-3.5" /> View Details</button>
                            <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                            {exam.status === "scheduled" && (
                              <button onClick={() => setOpenActionMenu(null)} className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[var(--background-secondary)]"><CalendarClock className="w-3.5 h-3.5" /> Postpone</button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-[11px] text-[var(--muted)]">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronLeft className="w-4 h-4 text-[var(--muted)]" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={cn("w-7 h-7 rounded-lg text-[11px] font-medium transition-all", p === currentPage ? "bg-[#6366F1] text-white" : "text-[var(--muted)] hover:bg-[var(--background-secondary)]")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-[var(--background-secondary)] disabled:opacity-40"><ChevronRight className="w-4 h-4 text-[var(--muted)]" /></button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
