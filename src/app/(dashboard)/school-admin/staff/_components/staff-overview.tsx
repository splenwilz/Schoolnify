"use client";

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Check, Plus, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Staff } from "@/types/staff";
import type { AbsenceLike } from "@/lib/staff/leave";
import type { Granularity, RangeKey } from "@/lib/staff/metrics";
import { DEFAULT_VISIBLE_WIDGETS, OVERVIEW_WIDGETS, computeOverview, type OverviewWidget, type WidgetFormat } from "@/lib/staff/overview";
import { Sparkline } from "./sparkline";

interface StaffOverviewProps {
  staff: readonly Staff[];
  absences: readonly AbsenceLike[];
  today: string;
  termStart?: string;
}

const RANGE_LABEL: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  term: "This term",
};

const GRANULARITY_LABEL: Record<Granularity, string> = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

function fmt(value: number, format: WidgetFormat): string {
  if (format === "years") return `${value.toFixed(1)} yrs`;
  if (format === "fte") return `${value.toFixed(1)} FTE`;
  return `${Math.round(value)}`;
}

function pctChange(current: number, previous: number): string {
  if (previous === 0) return current === 0 ? "0%" : "+100%";
  const diff = ((current - previous) / previous) * 100;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
}

const selectClass =
  "h-8 pl-2 pr-7 text-sm rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30";

// Which widgets are shown is a per-viewer convenience, so it lives in
// localStorage. Read via useSyncExternalStore so the server snapshot
// (defaults) and the client agree at hydration, then the stored layout applies.
// Scoped by host so two schools on one browser (slug subdomains) keep their own layout.
const storageKey = () => `schoolnify.staff.overview.widgets:${window.location.hostname}`;
const listeners = new Set<() => void>();
function readRaw(): string {
  try {
    return window.localStorage.getItem(storageKey()) ?? "";
  } catch {
    return "";
  }
}
function writeVisible(ids: string[]): void {
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify(ids));
  } catch {
    // storage unavailable (private mode, quota): the layout just does not persist
  }
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
function parseVisible(raw: string): string[] {
  if (!raw) return DEFAULT_VISIBLE_WIDGETS;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string" && OVERVIEW_WIDGETS.some((w) => w.id === id))
      : DEFAULT_VISIBLE_WIDGETS;
  } catch {
    return DEFAULT_VISIBLE_WIDGETS;
  }
}

export function StaffOverview({ staff, absences, today, termStart }: StaffOverviewProps) {
  const [range, setRange] = useState<RangeKey>("7d");
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const [compare, setCompare] = useState(false);
  const rawVisible = useSyncExternalStore(subscribe, readRaw, () => "");
  const visible = useMemo(() => parseVisible(rawVisible), [rawVisible]);
  const setVisible = (update: (prev: string[]) => string[]) => writeVisible(update(visible));
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [menuFocus, setMenuFocus] = useState<number | null>(null);
  const addRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = { range: useId(), gran: useId(), heading: useId() };

  // Menu dismissal: Escape and clicks outside, per the WAI-ARIA menu button pattern.
  useEffect(() => {
    if (!addOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAddOpen(false);
        setMenuFocus(null);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: MouseEvent) => {
      if (addRef.current && !addRef.current.contains(e.target as Node)) {
        setAddOpen(false);
        setMenuFocus(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [addOpen]);

  // Focus follows the roving index once the menu has rendered.
  useEffect(() => {
    if (addOpen && menuFocus !== null) itemRefs.current[menuFocus]?.focus();
  }, [addOpen, menuFocus]);

  const closeMenu = (restoreFocus: boolean) => {
    setAddOpen(false);
    setMenuFocus(null);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const termAvailable = Boolean(termStart && termStart <= today);
  const rangeOptions = (Object.keys(RANGE_LABEL) as RangeKey[]).filter((k) => k !== "term" || termAvailable);

  const widgets = useMemo(
    () => computeOverview(staff, { today, range, granularity, absences, termStart }),
    [staff, today, range, granularity, absences, termStart]
  );
  const shown = visible.map((id) => widgets.find((w) => w.id === id)).filter((w): w is OverviewWidget => Boolean(w));
  const hidden = OVERVIEW_WIDGETS.filter((w) => !visible.includes(w.id));

  // WAI-ARIA menu button pattern: Down/Up open the menu on the first/last
  // item; inside, arrows wrap, Home/End jump, Escape closes and restores focus.
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (hidden.length === 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setAddOpen(true);
      setMenuFocus(e.key === "ArrowDown" ? 0 : hidden.length - 1);
    }
  };
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = hidden.length - 1;
    const current = menuFocus ?? 0;
    const next =
      e.key === "ArrowDown" ? (current === last ? 0 : current + 1)
      : e.key === "ArrowUp" ? (current === 0 ? last : current - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setMenuFocus(next);
  };

  return (
    <section aria-labelledby={ids.heading}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 id={ids.heading} className="text-xl font-semibold text-[var(--foreground)]">Your overview</h2>

        <div className="flex items-center gap-3 text-sm flex-wrap">
          <label htmlFor={ids.range} className="text-[var(--muted)]">Date range</label>
          <select id={ids.range} value={range} onChange={(e) => setRange(e.target.value as RangeKey)} className={selectClass}>
            {rangeOptions.map((k) => (
              <option key={k} value={k}>{RANGE_LABEL[k]}</option>
            ))}
          </select>

          <label htmlFor={ids.gran} className="sr-only">Granularity</label>
          <select id={ids.gran} value={granularity} onChange={(e) => setGranularity(e.target.value as Granularity)} className={selectClass}>
            {(Object.keys(GRANULARITY_LABEL) as Granularity[]).map((k) => (
              <option key={k} value={k}>{GRANULARITY_LABEL[k]}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} className="w-4 h-4 rounded border-[var(--border)] accent-[var(--brand)]" />
            <span className="text-[var(--muted)]">Compare to previous period</span>
          </label>

          <div className="relative" ref={addRef}>
            <button
              type="button"
              ref={triggerRef}
              aria-haspopup="menu"
              aria-expanded={addOpen}
              onClick={() => (addOpen ? closeMenu(false) : setAddOpen(true))}
              onKeyDown={onTriggerKeyDown}
              className="flex items-center gap-1 px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add widget
            </button>
            {addOpen && (
              <div role="menu" aria-label="Available widgets" onKeyDown={onMenuKeyDown} className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg z-30 py-1">
                {hidden.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-[var(--muted)]">All widgets are visible</p>
                ) : (
                  hidden.map((w, i) => (
                    <button
                      key={w.id}
                      type="button"
                      role="menuitem"
                      tabIndex={menuFocus === i || (menuFocus === null && i === 0) ? 0 : -1}
                      ref={(el) => { itemRefs.current[i] = el; }}
                      onClick={() => { setVisible((p) => [...p, w.id]); closeMenu(true); }}
                      className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[var(--brand)] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-medium text-[var(--foreground)]">{w.label}</span>
                        <span className="block text-xs text-[var(--muted)]">{w.description}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-pressed={editMode}
            onClick={() => setEditMode((v) => !v)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded border transition-colors",
              editMode
                ? "border-[var(--brand)] bg-[var(--brand)]/10 text-[var(--brand)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
            )}
          >
            {editMode ? <Check className="w-4 h-4" aria-hidden="true" /> : <Settings className="w-4 h-4" aria-hidden="true" />}
            {editMode ? "Done" : "Edit widgets"}
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="p-12 rounded-lg border-2 border-dashed border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted)] mb-2">No widgets visible</p>
          <button type="button" onClick={() => setVisible(() => DEFAULT_VISIBLE_WIDGETS)} className="text-sm text-[var(--brand)] hover:underline">
            Reset to defaults
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shown.map((w) => (
            <WidgetCard key={w.id} widget={w} compare={compare} editMode={editMode} onRemove={() => setVisible((p) => p.filter((id) => id !== w.id))} />
          ))}
        </div>
      )}
    </section>
  );
}

function WidgetCard({ widget: w, compare, editMode, onRemove }: { widget: OverviewWidget; compare: boolean; editMode: boolean; onRemove: () => void }) {
  const labelId = useId();
  const up = w.value >= w.previous;
  return (
    <div className="relative">
      {editMode && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${w.label}`}
          className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[var(--error)] text-white flex items-center justify-center shadow-md"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn(
          "p-4 rounded-lg border bg-[var(--card)] transition-all",
          editMode ? "border-dashed border-[var(--brand)]/40 ring-1 ring-[var(--brand)]/10" : "border-[var(--border)]"
        )}
      >
        <span id={labelId} className="block text-sm font-medium text-[var(--foreground)] mb-2">{w.label}</span>
        <div className="text-2xl font-semibold text-[var(--foreground)] tabular-nums">{fmt(w.value, w.format)}</div>
        <div className="flex items-center gap-1.5 text-xs mt-1">
          <span className={up ? "text-[var(--success)] font-medium" : "text-[var(--error)] font-medium"}>{pctChange(w.value, w.previous)}</span>
          <span className="text-[var(--muted)]">vs {fmt(w.previous, w.format)} prev</span>
        </div>
        <div className="mt-3">
          <Sparkline data={w.spark.map((p) => p.value)} compareData={compare ? w.compare.map((p) => p.value) : undefined} height={40} />
        </div>
      </div>
    </div>
  );
}
