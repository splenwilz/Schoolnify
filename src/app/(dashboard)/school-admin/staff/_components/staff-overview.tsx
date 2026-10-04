"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus, Settings, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";

type RangeKey = "Last 7 days" | "Last 30 days" | "Last 90 days" | "This term";
type GranKey = "Daily" | "Weekly" | "Monthly";

const RANGES: RangeKey[] = ["Last 7 days", "Last 30 days", "Last 90 days", "This term"];
const GRANS: GranKey[] = ["Daily", "Weekly", "Monthly"];

// Flow metrics (hires, onboarding) accumulate with a longer range; stock
// metrics (headcount, on leave, tenure, FTE) stay roughly constant.
const FLOW: Record<RangeKey, number> = {
  "Last 7 days": 1,
  "Last 30 days": 3,
  "Last 90 days": 7,
  "This term": 11,
};

type Format = "count" | "years" | "fte";

interface Widget {
  id: string;
  label: string;
  description: string;
  format: Format;
  kind: "stock" | "flow";
  base: number; // value for the shortest range
  prevBase: number;
  spark: number[];
}

const ALL_WIDGETS: Widget[] = [
  { id: "headcount", label: "Headcount", description: "Total staff on the books", format: "count", kind: "stock", base: 30, prevBase: 28, spark: [24, 25, 26, 27, 28, 28, 29, 30] },
  { id: "new_hires", label: "New hires", description: "People who joined this period", format: "count", kind: "flow", base: 2, prevBase: 1, spark: [0, 1, 0, 1, 1, 0, 1, 2] },
  { id: "on_leave", label: "On leave", description: "Staff currently away", format: "count", kind: "stock", base: 1, prevBase: 2, spark: [3, 2, 2, 1, 2, 1, 1, 1] },
  { id: "onboarding", label: "Onboarding", description: "Not yet active", format: "count", kind: "flow", base: 2, prevBase: 1, spark: [0, 1, 1, 1, 2, 1, 2, 2] },
  { id: "avg_tenure", label: "Avg tenure", description: "Average years of service", format: "years", kind: "stock", base: 6.9, prevBase: 6.5, spark: [6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9] },
  { id: "fte", label: "Full-time equivalent", description: "Total FTE across staff", format: "fte", kind: "stock", base: 28.7, prevBase: 27.9, spark: [26, 26.5, 27, 27.4, 27.9, 28.2, 28.5, 28.7] },
];

const DEFAULT_VISIBLE = ["headcount", "new_hires", "on_leave", "onboarding", "avg_tenure", "fte"];

function fmt(value: number, format: Format): string {
  if (format === "years") return `${value.toFixed(1)} yrs`;
  if (format === "fte") return `${value.toFixed(1)} FTE`;
  return `${Math.round(value)}`;
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return "+100%";
  const diff = ((current - previous) / previous) * 100;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
}

function valuesFor(w: Widget, range: RangeKey) {
  const factor = w.kind === "flow" ? FLOW[range] : 1;
  const value = w.base * factor;
  const previous = w.prevBase * factor;
  // Compare series: the same shape shifted toward the previous-period level.
  const ratio = value === 0 ? 1 : previous / value;
  const compare = w.spark.map((v) => v * ratio);
  return { value, previous, compare };
}

export function StaffOverview() {
  const [range, setRange] = useState<RangeKey>("Last 7 days");
  const [gran, setGran] = useState<GranKey>("Daily");
  const [compare, setCompare] = useState(false);
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE);
  const [editMode, setEditMode] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const [showGran, setShowGran] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const granRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) setShowRange(false);
      if (granRef.current && !granRef.current.contains(e.target as Node)) setShowGran(false);
      if (addRef.current && !addRef.current.contains(e.target as Node)) setShowAdd(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const widgets = visible
    .map((id) => ALL_WIDGETS.find((w) => w.id === id))
    .filter((w): w is Widget => Boolean(w));
  const availableToAdd = ALL_WIDGETS.filter((w) => !visible.includes(w.id));

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Your overview</h2>

        <div className="flex items-center gap-3 text-sm">
          {/* Date range */}
          <div className="flex items-center gap-2">
            <span className="text-[var(--muted)]">Date range</span>
            <div className="relative" ref={rangeRef}>
              <button
                onClick={() => setShowRange((v) => !v)}
                className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              >
                {range}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {showRange && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                  >
                    {RANGES.map((option) => (
                      <button
                        key={option}
                        onClick={() => { setRange(option); setShowRange(false); }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors",
                          range === option ? "text-[var(--brand)] font-medium" : "text-[var(--foreground)]"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Granularity */}
          <div className="relative" ref={granRef}>
            <button
              onClick={() => setShowGran((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            >
              {gran}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showGran && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1"
                >
                  {GRANS.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setGran(option); setShowGran(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-secondary)] transition-colors",
                        gran === option ? "text-[var(--brand)] font-medium" : "text-[var(--foreground)]"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compare */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={compare}
              onChange={(e) => setCompare(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] accent-[var(--brand)]"
            />
            <span className="text-[var(--muted)]">Compare</span>
          </label>
          {compare && <span className="text-[var(--brand)]">Previous period</span>}

          {/* Add */}
          <div className="relative" ref={addRef}>
            <button
              onClick={() => setShowAdd((v) => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1 max-h-72 overflow-y-auto"
                >
                  {availableToAdd.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-[var(--muted)]">
                      All widgets are visible
                    </div>
                  ) : (
                    availableToAdd.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => { setVisible((p) => [...p, w.id]); setShowAdd(false); }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[var(--background-secondary)] transition-colors"
                      >
                        <Plus className="w-4 h-4 text-[var(--brand)] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">{w.label}</p>
                          <p className="text-xs text-[var(--muted)]">{w.description}</p>
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit */}
          <button
            onClick={() => setEditMode((v) => !v)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded border transition-colors",
              editMode
                ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            )}
          >
            {editMode ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Widget grid */}
      {widgets.length === 0 ? (
        <div className="p-12 rounded-lg border-2 border-dashed border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)] mb-2">No widgets visible</p>
          <button
            onClick={() => setVisible(DEFAULT_VISIBLE)}
            className="text-sm text-[var(--brand)] hover:underline"
          >
            Reset to defaults
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {widgets.map((w) => {
            const { value, previous, compare: compareSpark } = valuesFor(w, range);
            const up = value >= previous;
            return (
              <div key={w.id} className="relative group">
                {editMode && (
                  <button
                    onClick={() => setVisible((p) => p.filter((id) => id !== w.id))}
                    aria-label={`Remove ${w.label}`}
                    className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[var(--error)] text-white flex items-center justify-center shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div
                  className={cn(
                    "p-4 rounded-lg border bg-[var(--card)] transition-all",
                    editMode ? "border-dashed border-[var(--brand)]/40 ring-1 ring-[var(--brand)]/10" : "border-[var(--border)]"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--foreground)]">{w.label}</span>
                  </div>
                  <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">
                    {fmt(value, w.format)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs mt-1">
                    <span className={up ? "text-[var(--success)] font-medium" : "text-[var(--error)] font-medium"}>
                      {pctChange(value, previous)}
                    </span>
                    <span className="text-[var(--muted)]">vs {fmt(previous, w.format)} prev</span>
                  </div>
                  <div className="mt-3">
                    <Sparkline data={w.spark} compareData={compare ? compareSpark : undefined} height={40} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
