"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// AcademicYearPicker — year range picker with auto-formatted label
// ---------------------------------------------------------------------------

/**
 * Format academic year label from a start/end year pair.
 * Same year → "2026". Different years → "2025/2026".
 */
function formatAcademicYear(start: number, end: number): string {
  if (start === end) return String(start);
  return `${start}/${end}`;
}

/** Parse a stored label back into start/end years. Falls back to current year. */
function parseAcademicYear(label: string): { start: number; end: number } {
  const now = new Date().getFullYear();
  if (!label) return { start: now, end: now + 1 };
  const match = label.match(/(\d{4})[^\d]*(\d{4})?/);
  if (!match) return { start: now, end: now + 1 };
  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : start;
  return { start, end };
}

export function AcademicYearPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (label: string) => void;
}) {
  const parsed = parseAcademicYear(value);
  const [start, setStart] = useState(parsed.start);
  const [end, setEnd] = useState(parsed.end);

  // Sync from external changes (e.g. rollover)
  useEffect(() => {
    const p = parseAcademicYear(value);
    setStart(p.start);
    setEnd(p.end);
  }, [value]);

  const update = (newStart: number, newEnd: number) => {
    setStart(newStart);
    setEnd(newEnd);
    onChange(formatAcademicYear(newStart, newEnd));
  };

  // Year options: current year ± 5, expanded to include parsed start/end
  const currentYear = new Date().getFullYear();
  const minYear = Math.min(currentYear - 5, isFinite(start) ? start : currentYear);
  const maxYear = Math.max(currentYear + 5, isFinite(end) ? end : currentYear);
  const yearOptions: number[] = [];
  for (let y = minYear; y <= maxYear; y++) yearOptions.push(y);

  const selectClass =
    "px-3 py-2 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={start}
        onChange={(e) => {
          const s = parseInt(e.target.value, 10);
          // Auto-adjust end if start > end
          update(s, end < s ? s : end);
        }}
        className={selectClass}
      >
        {yearOptions.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="text-[14px] text-[var(--muted)]">to</span>
      <select
        value={end}
        onChange={(e) => update(start, parseInt(e.target.value, 10))}
        className={selectClass}
      >
        {yearOptions.filter((y) => y >= start).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0891B2]/10 text-[#0891B2] text-[13px] font-medium">
        Label: {formatAcademicYear(start, end)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GroupLevelsEditor — per-group grade levels with toggle + add custom
// ---------------------------------------------------------------------------

/**
 * Detect the next level name from an existing sequence.
 * Looks at the last active level and increments a trailing number.
 * "Primary 6" → "Primary 7", "JSS 3" → "JSS 4", "Grade 12" → "Grade 13"
 * Returns null if no numeric pattern found.
 */
function suggestNextLevel(levels: string[]): string | null {
  if (levels.length === 0) return null;
  const last = levels[levels.length - 1];
  const match = last.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const prefix = match[1];
  const num = parseInt(match[2], 10);
  return `${prefix}${num + 1}`;
}

export function GroupLevelsEditor({
  groupName,
  presetLevels,
  activeGradeLevels,
  customLevels,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: {
  groupName: string;
  presetLevels: string[];
  activeGradeLevels: string[];
  customLevels: string[];
  onToggle: (level: string) => void;
  onAddCustom: (level: string) => void;
  onRemoveCustom: (level: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  // Combine preset (active) + custom levels to detect pattern
  const allActiveLevels = [
    ...presetLevels.filter((l) => activeGradeLevels.includes(l)),
    ...customLevels,
  ];
  const suggested = suggestNextLevel(allActiveLevels);

  const addLevel = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (activeGradeLevels.includes(trimmed) || customLevels.includes(trimmed)) return;
    onAddCustom(trimmed);
    setInput("");
    setShowInput(false);
  };

  return (
    <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)]">
      <label className="block text-[14px] text-[var(--muted)] mb-2">{groupName}</label>
      <div className="flex flex-wrap items-center gap-1.5">
        {presetLevels.map((level) => {
          const isActive = activeGradeLevels.includes(level);
          return (
            <span
              key={level}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg border",
                isActive
                  ? "bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
                  : "bg-transparent border-dashed border-[var(--border)] text-[var(--muted)] opacity-40"
              )}
            >
              {level}
              <button
                type="button"
                onClick={() => onToggle(level)}
                className={cn(
                  "ml-0.5 transition-colors",
                  isActive ? "text-[var(--muted)] hover:text-red-500" : "text-[#0891B2] hover:text-[#0E7490]"
                )}
              >
                {isActive ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
            </span>
          );
        })}

        {customLevels.map((level) => (
          <span
            key={level}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[#0891B2]/10 border border-[#0891B2]/30 text-[#0891B2]"
          >
            {level}
            <button
              type="button"
              onClick={() => onRemoveCustom(level)}
              className="ml-0.5 text-[#0891B2]/60 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Quick-add: click to add the suggested next level (e.g. "+ Add Primary 7") */}
        {!showInput && suggested && (
          <button
            type="button"
            onClick={() => addLevel(suggested)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg border border-dashed border-[#0891B2]/40 text-[#0891B2] hover:bg-[#0891B2]/10 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add {suggested}
          </button>
        )}

        {/* Toggle to custom name input */}
        {!showInput && (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="text-[13px] text-[var(--muted)] hover:text-[#0891B2] hover:underline"
          >
            {suggested ? "or custom name" : "+ Add level"}
          </button>
        )}

        {/* Custom name input */}
        {showInput && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addLevel(input); }
                if (e.key === "Escape") { setInput(""); setShowInput(false); }
              }}
              placeholder="Level name"
              autoFocus
              className="min-w-[130px] max-w-[180px] px-2.5 py-1 text-sm bg-[var(--card)] border border-[#0891B2] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => addLevel(input)}
              disabled={!input.trim()}
              className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => { setInput(""); setShowInput(false); }}
              className="p-1 text-[var(--muted)] hover:bg-[var(--background-secondary)] rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GroupSectionsEditor — per-group section suffixes with live preview
// ---------------------------------------------------------------------------

export function GroupSectionsEditor({
  groupName,
  groupLevels,
  sections,
  onChange,
}: {
  groupName: string;
  groupLevels: string[];
  sections: string[];
  onChange: (sections: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addSection = () => {
    const trimmed = input.trim();
    if (trimmed && !sections.includes(trimmed)) {
      onChange([...sections, trimmed]);
      setInput("");
    }
  };

  const removeSection = (s: string) => {
    onChange(sections.filter((x) => x !== s));
  };

  return (
    <div className="p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-[var(--foreground)]">{groupName}</p>
        <span className="text-[12px] text-[var(--muted)]">{groupLevels.length} level{groupLevels.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {sections.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)]"
          >
            {s}
            <button
              type="button"
              onClick={() => removeSection(s)}
              className="ml-0.5 text-[var(--muted)] hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSection(); } }}
          placeholder="e.g. A or Science"
          className="flex-1 min-w-[140px] max-w-[200px] px-3 py-1.5 text-sm bg-[var(--background-secondary)] border border-dashed border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
        />
        {input.trim() && !sections.includes(input.trim()) && (
          <button
            type="button"
            onClick={addSection}
            className="p-1.5 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {sections.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border)]">
          {groupLevels.slice(0, 3).map((level) =>
            sections.map((s) => (
              <span
                key={`${level}-${s}`}
                className="px-2 py-0.5 text-[13px] rounded bg-[#0891B2]/5 border border-[#0891B2]/20 text-[#0891B2]"
              >
                {level} {s}
              </span>
            ))
          )}
          {groupLevels.length > 3 && (
            <span className="px-2 py-0.5 text-[13px] text-[var(--muted)]">
              +{(groupLevels.length - 3) * sections.length} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-[13px] text-[var(--muted)] italic pt-2 border-t border-[var(--border)]">
          No sections. Classes will be named by level only (e.g. {groupLevels[0] ?? "Primary 1"}).
        </p>
      )}
    </div>
  );
}
