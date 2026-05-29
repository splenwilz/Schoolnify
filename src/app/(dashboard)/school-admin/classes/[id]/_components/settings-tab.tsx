"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, Archive, Trash2 } from "lucide-react";
import type { Class, ClassStatus, SssStream } from "@/types/class";
import { staff } from "@/lib/demo-data";

/**
 * Settings tab -- edit class metadata + danger zone.
 *
 * Edits live in local component state until class management is wired to the
 * backend; "Save" applies them for the session (not persisted). Archive/Delete
 * are stubbed with confirmation. No fake server success is shown.
 */
const inputCls =
  "w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]";

const STREAMS: (SssStream | "")[] = ["", "Science", "Arts", "Commercial", "Technical"];
const STATUSES: ClassStatus[] = ["active", "draft", "archived"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">{label}</label>
      {children}
    </div>
  );
}

export function SettingsTab({ classData }: { classData: Class }) {
  const teachers = staff.filter((s) => s.role === "Teacher");
  const [form, setForm] = useState({
    name: classData.name,
    arm: classData.arm,
    room: classData.room,
    capacity: String(classData.capacity),
    stream: (classData.stream ?? "") as SssStream | "",
    status: classData.status,
    classTeacherId: classData.classTeacherId,
  });
  const [savedTick, setSavedTick] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const onSave = () => {
    // Local-only for now; clears the indicator after a moment.
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 max-w-2xl"
    >
      <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-5">
          <Settings2 className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-[15px] font-semibold text-[var(--foreground)]">Class Settings</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Class name">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Arm">
            <input value={form.arm} onChange={(e) => set("arm", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Room">
            <input value={form.room} onChange={(e) => set("room", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Capacity">
            <input
              type="number"
              min={0}
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Stream">
            <select value={form.stream} onChange={(e) => set("stream", e.target.value as SssStream | "")} className={inputCls}>
              {STREAMS.map((s) => (
                <option key={s || "none"} value={s}>{s || "None"}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value as ClassStatus)} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </Field>
          <Field label="Class teacher">
            <select value={form.classTeacherId} onChange={(e) => set("classTeacherId", e.target.value)} className={inputCls}>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
              ))}
            </select>
          </Field>
          <Field label="Grade level">
            <input value={classData.gradeLevel} readOnly className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </Field>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)]">
          <p className="text-[12px] text-[var(--muted)]">Changes apply to this session only until class management is wired.</p>
          <div className="flex items-center gap-3">
            {savedTick && <span className="text-[12px] text-[#10B981] font-medium">Saved</span>}
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0891B2] rounded-lg hover:bg-[#0E7490] transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-1">Danger zone</h3>
        <p className="text-[12px] text-[var(--muted)] mb-4">Archiving hides the class from active lists; deleting requires an empty roster.</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[var(--foreground)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Archive className="w-4 h-4" />
            Archive class
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete class
          </button>
        </div>
      </div>
    </motion.div>
  );
}
