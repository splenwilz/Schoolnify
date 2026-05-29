"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, Plus, CornerDownLeft } from "lucide-react";
import { classes } from "@/lib/demo-data";
import { compareClasses, classShortCode } from "@/types/class";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  label: string;
  sublabel?: string;
  badge?: string;
  kind: "action" | "class";
  run: () => void;
}

/**
 * Cmd-K command palette for fast class navigation. Opens with ⌘K / Ctrl-K,
 * filters classes + a couple of actions, arrow-key navigable. Mounted on the
 * classes pages; could be promoted app-wide later.
 */
export function ClassCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Global ⌘K / Ctrl-K toggle. Reset happens here (in the event handler, not an
  // effect) so the query/selection clear on each open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setActive(0);
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while open (no state writes here).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const items: Item[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const classItems: Item[] = [...classes]
      .sort(compareClasses)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q))
      .map((c) => ({
        id: c.id,
        label: c.name,
        sublabel: c.teacher,
        badge: classShortCode(c),
        kind: "class" as const,
        run: () => router.push(`/school-admin/classes/${c.id}`),
      }));

    const actions: Item[] = [
      {
        id: "new-class",
        label: "Create new class",
        kind: "action" as const,
        run: () => router.push("/school-admin/classes/new"),
      },
    ].filter((a) => !q || a.label.toLowerCase().includes(q));

    return [...actions, ...classItems];
  }, [query, router]);

  const clampedActive = Math.min(active, Math.max(0, items.length - 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[clampedActive];
      if (item) {
        setOpen(false);
        item.run();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (typeof window === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Class command palette"
        className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 px-4 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Jump to a class or action..."
            aria-label="Search classes and actions"
            className="flex-1 py-3.5 text-[14px] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          <kbd className="text-[10px] text-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1.5">
          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--muted)]">No matches.</p>
          )}
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                setOpen(false);
                item.run();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                i === clampedActive ? "bg-[var(--background-secondary)]" : ""
              )}
            >
              {item.kind === "class" ? (
                <span className="w-7 h-7 rounded-md bg-[var(--background-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-secondary)] text-[9px] font-semibold flex-shrink-0">
                  {item.badge}
                </span>
              ) : (
                <span className="w-7 h-7 rounded-md bg-[var(--brand)]/10 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4 text-[var(--brand)]" />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] font-medium text-[var(--foreground)] truncate">{item.label}</span>
                {item.sublabel && <span className="block text-[11px] text-[var(--muted)] truncate">{item.sublabel}</span>}
              </span>
              {i === clampedActive && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--muted)] flex-shrink-0" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
