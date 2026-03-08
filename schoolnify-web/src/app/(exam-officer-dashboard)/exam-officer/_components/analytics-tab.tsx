"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  subjectPerformance,
  classPerformance,
  topStudents,
  termlyTrend,
} from "@/lib/demo-data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType = "subject" | "class" | "student" | "trends";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REPORT_CARDS: {
  key: ReportType;
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
  color: string;
}[] = [
  { key: "subject", title: "Subject Analysis", subtitle: "Avg scores & pass rates", icon: BookOpen, color: "#6366F1" },
  { key: "class", title: "Class Comparison", subtitle: "Rankings & performance", icon: Users, color: "#10B981" },
  { key: "student", title: "Student Progress", subtitle: "Top performers & GPA", icon: TrendingUp, color: "#F59E0B" },
  { key: "trends", title: "Term Trends", subtitle: "Termly score analysis", icon: BarChart3, color: "#3B82F6" },
];

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnalyticsTab() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("subject");

  // Chart data for trends
  const avgScoreValues = termlyTrend.map(t => t.avgScore);
  const chartW = 400;
  const chartH = 180;
  const avgPath = buildCurvePath(avgScoreValues, chartW, chartH, 16);

  return (
    <div className="space-y-6">
      {/* -------- Report Type Selector Cards -------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {REPORT_CARDS.map((card, idx) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            onClick={() => setSelectedReport(card.key)}
            className={cn(
              "rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer transition-all",
            )}
            style={
              selectedReport === card.key
                ? { outline: "2px solid #6366F1", outlineOffset: "-2px", background: "rgba(99,102,241,0.04)" }
                : {}
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-[13px] font-semibold text-[var(--foreground)] mb-0.5">{card.title}</p>
            <p className="text-[11px] text-[var(--muted)]">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* -------- Dynamic Content -------- */}
      <AnimatePresence mode="wait">
        {/* ===== Subject Analysis ===== */}
        {selectedReport === "subject" && (
          <motion.div
            key="subject"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Subject Average Score Bars */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Subject Average Scores</h3>
              <p className="text-[11px] text-[var(--muted)] mb-5">Average score out of 100 per subject</p>

              <div className="space-y-4">
                {subjectPerformance.map((subj, idx) => (
                  <motion.div
                    key={subj.subject}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-[var(--foreground)]">{subj.subject}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-semibold text-[var(--foreground)]">{subj.avgScore}%</span>
                        <span className="text-[10px] text-[var(--muted)]">Pass: {subj.passRate}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--border)]">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: "#6366F1" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${subj.avgScore}%` }}
                        transition={{ duration: 0.8, delay: 0.08 * idx }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pass Rate Table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Pass Rate Summary</h3>
              <p className="text-[11px] text-[var(--muted)] mb-4">Subject pass rates and student counts</p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Subject</th>
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Pass Rate</th>
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Total Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectPerformance.map(subj => {
                      const rateColor = subj.passRate >= 85 ? "#10B981" : subj.passRate >= 75 ? "#F59E0B" : "#EF4444";
                      return (
                        <tr key={subj.subject} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                          <td className="py-3 px-3 text-[12px] font-medium text-[var(--foreground)]">{subj.subject}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${rateColor}15`, color: rateColor }}>
                              {subj.passRate}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{subj.totalStudents}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== Class Comparison ===== */}
        {selectedReport === "class" && (
          <motion.div
            key="class"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Class Average Bars */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Class Average Scores</h3>
              <p className="text-[11px] text-[var(--muted)] mb-5">Performance comparison across classes</p>

              <div className="space-y-4">
                {classPerformance.map((cls, idx) => (
                  <motion.div
                    key={cls.class}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-medium text-[var(--foreground)]">{cls.class}</span>
                      <span className="text-[12px] font-semibold text-[var(--foreground)]">{cls.avgScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--border)]">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: "#10B981" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cls.avgScore}%` }}
                        transition={{ duration: 0.8, delay: 0.08 * idx }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Class Rankings Table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Class Rankings</h3>
              <p className="text-[11px] text-[var(--muted)] mb-4">Detailed class performance breakdown</p>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Class</th>
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Avg Score</th>
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Pass Rate</th>
                      <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">Top Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...classPerformance]
                      .sort((a, b) => b.avgScore - a.avgScore)
                      .map((cls, idx) => {
                        const rateColor = cls.passRate >= 85 ? "#10B981" : cls.passRate >= 75 ? "#F59E0B" : "#EF4444";
                        return (
                          <tr key={cls.class} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-secondary)]/50 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold text-white" style={{ backgroundColor: idx === 0 ? "#6366F1" : idx === 1 ? "#10B981" : idx === 2 ? "#F59E0B" : "var(--muted)" }}>
                                  {idx + 1}
                                </span>
                                <span className="text-[12px] font-medium text-[var(--foreground)]">{cls.class}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[12px] font-semibold text-[var(--foreground)]">{cls.avgScore}%</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: `${rateColor}15`, color: rateColor }}>
                                {cls.passRate}%
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[12px] text-[var(--muted)]">{cls.topStudent}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== Student Progress ===== */}
        {selectedReport === "student" && (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Top 5 Students</h3>
              <p className="text-[11px] text-[var(--muted)] mb-5">Highest performing students across all classes</p>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {topStudents.map((student, idx) => {
                  const posColor = idx === 0 ? "#6366F1" : idx === 1 ? "#10B981" : idx === 2 ? "#F59E0B" : "#3B82F6";
                  return (
                    <motion.div
                      key={student.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * idx }}
                      className="rounded-xl border border-[var(--border)] p-4 text-center relative"
                    >
                      {/* Position Badge */}
                      <div
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: posColor }}
                      >
                        {idx === 0 ? <Trophy className="w-3 h-3" /> : `#${student.position}`}
                      </div>

                      <div className="mt-3 mb-2">
                        <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-[16px] font-bold text-white" style={{ backgroundColor: posColor }}>
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      </div>

                      <p className="text-[12px] font-semibold text-[var(--foreground)] mb-0.5">{student.name}</p>
                      <p className="text-[10px] text-[var(--muted)] mb-3">{student.class}</p>

                      <div className="text-[24px] font-bold text-[var(--foreground)] leading-none mb-1">{student.gpa.toFixed(1)}</div>
                      <p className="text-[10px] text-[var(--muted)] mb-2">GPA</p>

                      <div className="pt-2 border-t border-[var(--border)]">
                        <p className="text-[11px] text-[var(--muted)]">Avg Score</p>
                        <p className="text-[13px] font-semibold text-[var(--foreground)]">{student.avgScore}%</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== Term Trends ===== */}
        {selectedReport === "trends" && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Avg Score Trend Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Average Score Trend</h3>
                  <p className="text-[11px] text-[var(--muted)]">Termly average score progression</p>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded bg-[#3B82F6]" /> Avg Score</span>
                </div>
              </div>

              <div className="relative">
                <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" className="w-full h-[180px]">
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map(f => (
                    <line key={f} x1={0} x2={chartW} y1={16 + (chartH - 32) * f} y2={16 + (chartH - 32) * f} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
                  ))}
                  {/* Area fill */}
                  <motion.path
                    d={avgPath ? `${avgPath} L ${chartW},${chartH} L 0,${chartH} Z` : ""}
                    fill="url(#avgGrad)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Line */}
                  <motion.path
                    d={avgPath}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Dots */}
                  {avgScoreValues.map((v, i) => {
                    const max = Math.max(...avgScoreValues, 1);
                    const x = (i * chartW) / (avgScoreValues.length - 1);
                    const y = 16 + (chartH - 32) - (v / max) * (chartH - 32);
                    return (
                      <g key={`dot-${i}`}>
                        <circle cx={x} cy={y} r="5" fill="#3B82F6" stroke="var(--card)" strokeWidth="2" />
                        <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] font-semibold fill-[var(--foreground)]">{v}</text>
                      </g>
                    );
                  })}
                  <defs>
                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
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

            {/* CA vs Exam Comparison Bars */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl bg-[var(--card)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--foreground)]">CA vs Exam Comparison</h3>
                  <p className="text-[11px] text-[var(--muted)]">Continuous assessment vs exam scores per term</p>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6366F1]" /> CA Avg</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#10B981]" /> Exam Avg</span>
                </div>
              </div>

              <div className="space-y-5">
                {termlyTrend.map((term, idx) => (
                  <motion.div
                    key={term.term}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * idx }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-medium text-[var(--foreground)]">{term.term}</span>
                      <span className="text-[11px] text-[var(--muted)]">Total: {term.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* CA Bar */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[var(--muted)]">CA</span>
                          <span className="text-[10px] font-semibold text-[var(--foreground)]">{term.caAvg}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--border)]">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ backgroundColor: "#6366F1" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(term.caAvg / 40) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * idx }}
                          />
                        </div>
                      </div>
                      {/* Exam Bar */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-[var(--muted)]">Exam</span>
                          <span className="text-[10px] font-semibold text-[var(--foreground)]">{term.examAvg}</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--border)]">
                          <motion.div
                            className="h-2.5 rounded-full"
                            style={{ backgroundColor: "#10B981" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(term.examAvg / 60) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 * idx + 0.05 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
