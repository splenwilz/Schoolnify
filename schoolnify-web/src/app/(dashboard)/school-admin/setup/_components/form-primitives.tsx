"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// UI Primitives
// ---------------------------------------------------------------------------

export function SectionCard({
  id,
  title,
  description,
  icon,
  isComplete,
  isExpanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--background-secondary)] transition-colors"
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isComplete
            ? "bg-[#10B981]/10 text-[#10B981]"
            : "bg-[#0891B2]/10 text-[#0891B2]"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold text-[var(--foreground)]">{title}</h3>
            {isComplete && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
          </div>
          <p className="text-[14px] text-[var(--muted)]">{description}</p>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-[var(--muted)] transition-transform shrink-0",
          isExpanded && "rotate-180"
        )} />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] as const }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]">
              <div className="space-y-5 mt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Field({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <p className="text-[15px] font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="text-[13px] text-[var(--muted)] mt-0.5">{description}</p>}
      </div>
      <div className="sm:w-72">{children}</div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        checked ? "bg-[#0891B2]" : "bg-[var(--border)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30"
      >
        <span className={selected ? "" : "text-[var(--muted)]"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl max-h-60 overflow-hidden">
          <div className="p-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[var(--background-secondary)] rounded-md">
              <Search className="w-3.5 h-3.5 text-[var(--muted)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 text-[14px] bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X className="w-3 h-3 text-[var(--muted)]" />
                </button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[14px] text-[var(--muted)]">No results</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[14px] rounded-md transition-colors",
                    o.value === value
                      ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                      : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                  )}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ChipSelect({
  selected,
  onChange,
  options,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  options: string[];
}) {
  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((s) => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => toggle(o)}
          className={cn(
            "px-3.5 py-2 text-[14px] font-medium rounded-lg border transition-colors",
            selected.includes(o)
              ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
              : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
