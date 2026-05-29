"use client";

/**
 * Terms & Sessions Tab
 * Displays academic terms with status, dates, and duration
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Calendar, Clock, Pencil, CheckCircle2 } from "lucide-react";

interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface TermsTabProps {
  terms: Term[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeeksDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
}

function getTermStatus(
  term: Term
): { label: string; color: string; bg: string } {
  if (term.isCurrent) {
    return { label: "Current", color: "#0891B2", bg: "rgba(8,145,178,0.1)" };
  }
  const now = new Date();
  const start = new Date(term.startDate);
  if (start > now) {
    return { label: "Upcoming", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" };
  }
  return { label: "Completed", color: "#10B981", bg: "rgba(16,185,129,0.1)" };
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function TermsTab({ terms: initialTerms }: TermsTabProps) {
  const [terms, setTerms] = useState<Term[]>(initialTerms);
  const [showNewYear, setShowNewYear] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);

  // New Academic Year form state
  const [newYearLabel, setNewYearLabel] = useState("2026-2027");
  const [newTermCount, setNewTermCount] = useState(3);
  const [newYearCreated, setNewYearCreated] = useState(false);

  // Edit Term form state
  const [editName, setEditName] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editSaved, setEditSaved] = useState(false);

  const openEditTerm = (term: Term) => {
    setEditingTerm(term);
    setEditName(term.name);
    setEditStart(term.startDate);
    setEditEnd(term.endDate);
    setEditSaved(false);
  };

  const handleSaveEdit = () => {
    if (!editingTerm || !editName || !editStart || !editEnd) return;
    setTerms((prev) =>
      prev.map((t) =>
        t.id === editingTerm.id
          ? { ...t, name: editName, startDate: editStart, endDate: editEnd }
          : t
      )
    );
    setEditSaved(true);
    setTimeout(() => {
      setEditingTerm(null);
      setEditSaved(false);
    }, 1000);
  };

  const handleCreateYear = () => {
    if (!newYearLabel) return;
    // Generate terms for the new year
    const [startYear] = newYearLabel.split("-").map(Number);
    const termNames =
      newTermCount === 2
        ? ["Semester 1", "Semester 2"]
        : newTermCount === 4
          ? ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]
          : ["Term 1", "Term 2", "Term 3"];

    const monthsPerTerm = Math.floor(10 / newTermCount);
    const newTerms: Term[] = termNames.map((name, i) => {
      const startMonth = 8 + i * monthsPerTerm; // Aug start
      const endMonth = startMonth + monthsPerTerm;
      const sy = startMonth > 12 ? startYear + 1 : startYear;
      const ey = endMonth > 12 ? startYear + 1 : startYear;
      const sm = startMonth > 12 ? startMonth - 12 : startMonth;
      const em = endMonth > 12 ? endMonth - 12 : endMonth;
      return {
        id: `term_new_${i}`,
        name: `${name} (${newYearLabel})`,
        startDate: `${sy}-${String(sm).padStart(2, "0")}-01`,
        endDate: `${ey}-${String(em).padStart(2, "0")}-01`,
        isCurrent: false,
      };
    });

    setTerms((prev) => [...prev, ...newTerms]);
    setNewYearCreated(true);
    setTimeout(() => {
      setShowNewYear(false);
      setNewYearCreated(false);
      setNewYearLabel("2027-2028");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Academic Year Header */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              Academic Year: 2025-2026
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              {terms.length} terms configured
            </p>
          </div>
          <button
            onClick={() => {
              setNewYearCreated(false);
              setShowNewYear(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Academic Year
          </button>
        </div>
      </div>

      {/* Term Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {terms.map((term) => {
          const status = getTermStatus(term);
          const weeks = getWeeksDuration(term.startDate, term.endDate);

          return (
            <div
              key={term.id}
              className={`rounded-lg border bg-[var(--card)] p-5 transition-all ${
                term.isCurrent
                  ? "border-[#0891B2] shadow-sm"
                  : "border-[var(--border)]"
              }`}
            >
              {/* Term Name + Status */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-[var(--foreground)]">
                  {term.name}
                </h4>
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
                  style={{
                    color: status.color,
                    backgroundColor: status.bg,
                  }}
                >
                  {status.label}
                </span>
              </div>

              {/* Dates */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Start Date</p>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {formatDate(term.startDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <div>
                    <p className="text-xs text-[var(--muted)]">End Date</p>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {formatDate(term.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--background-secondary)]">
                <Clock className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-sm text-[var(--foreground)]">
                  {weeks} weeks
                </span>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => openEditTerm(term)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Term
              </button>
            </div>
          );
        })}
      </div>

      {/* New Academic Year Modal */}
      <AnimatePresence>
        {showNewYear && (
          <Overlay onClose={() => setShowNewYear(false)}>
            {newYearCreated ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                    Academic Year Created
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {newTermCount} terms have been added for {newYearLabel}
                  </p>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      New Academic Year
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-0.5">
                      Set up a new academic year with terms
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewYear(false)}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={newYearLabel}
                      onChange={(e) => setNewYearLabel(e.target.value)}
                      placeholder="e.g. 2026-2027"
                      className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Term Structure
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 2, label: "2 Semesters" },
                        { value: 3, label: "3 Terms" },
                        { value: 4, label: "4 Quarters" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setNewTermCount(opt.value)}
                          className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                            newTermCount === opt.value
                              ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2]"
                              : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-[var(--background-secondary)] p-3">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                      Preview
                    </p>
                    <div className="space-y-1.5">
                      {(newTermCount === 2
                        ? ["Semester 1", "Semester 2"]
                        : newTermCount === 4
                          ? ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]
                          : ["Term 1", "Term 2", "Term 3"]
                      ).map((name) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 text-sm text-[var(--foreground)]"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" />
                          {name} ({newYearLabel})
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-2">
                      You can edit dates for each term after creation.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 p-5 border-t border-[var(--border)]">
                  <button
                    onClick={() => setShowNewYear(false)}
                    className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateYear}
                    disabled={!newYearLabel}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Year
                  </button>
                </div>
              </>
            )}
          </Overlay>
        )}
      </AnimatePresence>

      {/* Edit Term Modal */}
      <AnimatePresence>
        {editingTerm && (
          <Overlay onClose={() => setEditingTerm(null)}>
            {editSaved ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                    Term Updated
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {editName} has been updated.
                  </p>
                </motion.div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      Edit Term
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-0.5">
                      Update term details and dates
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingTerm(null)}
                    className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--background-secondary)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                      Term Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editStart}
                        onChange={(e) => setEditStart(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editEnd}
                        onChange={(e) => setEditEnd(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                      />
                    </div>
                  </div>
                  {editStart && editEnd && new Date(editEnd) > new Date(editStart) && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--background-secondary)]">
                      <Clock className="w-4 h-4 text-[var(--muted)]" />
                      <span className="text-sm text-[var(--foreground)]">
                        {getWeeksDuration(editStart, editEnd)} weeks
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-end gap-2 p-5 border-t border-[var(--border)]">
                  <button
                    onClick={() => setEditingTerm(null)}
                    className="px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editName || !editStart || !editEnd}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </Overlay>
        )}
      </AnimatePresence>
    </div>
  );
}
