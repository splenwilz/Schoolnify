"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Check, Search } from "lucide-react";
import { classes } from "@/lib/demo-data";
import { compareClasses, classBand, classShortCode } from "@/types/class";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb dropdown that lets a teacher hop between classes without going back
 * to the directory -- the PowerTeacher "period switcher" pattern. Grouped by
 * band, filterable.
 */
export function ClassSwitcher({ currentId, currentName }: { currentId: string; currentName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sorted = [...classes].sort(compareClasses);
  const filtered = query
    ? sorted.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.teacher.toLowerCase().includes(query.toLowerCase())
      )
    : sorted;

  // Group filtered classes by band, preserving order.
  const groups: { band: string; items: typeof sorted }[] = [];
  for (const c of filtered) {
    const band = classBand(c.gradeLevel);
    let g = groups.find((x) => x.band === band);
    if (!g) {
      g = { band, items: [] };
      groups.push(g);
    }
    g.items.push(c);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex items-center gap-1.5 rounded-lg px-1.5 -ml-1.5 py-0.5 hover:bg-[var(--background-secondary)] transition-colors"
      >
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">{currentName}</h1>
        <ChevronsUpDown className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--foreground)]" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-30 w-72 max-h-[70vh] flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)]" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Switch class..."
                aria-label="Search classes"
                className="w-full pl-8 pr-2 py-1.5 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2]"
              />
            </div>
          </div>
          <div className="overflow-y-auto py-1">
            {groups.length === 0 && (
              <p className="px-3 py-4 text-[13px] text-[var(--muted)] text-center">No classes match.</p>
            )}
            {groups.map((g) => (
              <div key={g.band}>
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">{g.band}</p>
                {g.items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (c.id !== currentId) router.push(`/school-admin/classes/${c.id}`);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[var(--background-secondary)] transition-colors",
                      c.id === currentId && "bg-[#0891B2]/5"
                    )}
                  >
                    <span className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                      {classShortCode(c)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[13px] font-medium text-[var(--foreground)] truncate">{c.name}</span>
                      <span className="block text-[11px] text-[var(--muted)] truncate">{c.teacher}</span>
                    </span>
                    {c.id === currentId && <Check className="w-4 h-4 text-[#0891B2] flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
