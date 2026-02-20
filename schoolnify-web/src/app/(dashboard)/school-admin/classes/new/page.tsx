"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, CheckCircle2 } from "lucide-react";
import { staff } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";

const schedulePresets = [
  "Mon-Fri 8:00-2:30",
  "Mon-Fri 8:00-3:00",
  "Mon-Fri 8:00-3:30",
  "Mon-Fri 8:00-4:00",
];

export default function AddClassPage() {
  const router = useRouter();
  const { customRules, fmtGrade, sections } = useSchoolConfig();

  // Build grade level options from the custom rules
  const levelOptions: { level: number; label: string }[] = [];
  for (const rule of customRules) {
    for (let l = rule.minLevel; l <= rule.maxLevel; l++) {
      levelOptions.push({ level: l, label: fmtGrade(String(l)) });
    }
  }

  const teachers = staff
    .filter((s) => s.role === "Teacher" || s.department)
    .map((s) => ({ id: s.id, name: `${s.firstName} ${s.lastName}` }));

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [section, setSection] = useState("");
  const [customSection, setCustomSection] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState(schedulePresets[0]);
  const [customSchedule, setCustomSchedule] = useState("");
  const [useCustomSchedule, setUseCustomSchedule] = useState(false);
  const [status, setStatus] = useState("active");
  const [capacity, setCapacity] = useState("30");
  const [created, setCreated] = useState(false);

  const activeSection = customSection || section;
  const gradeCode = selectedLevel
    ? `${selectedLevel}${activeSection}`
    : "";
  const displayName = gradeCode ? fmtGrade(gradeCode) : "";
  const isValid = selectedLevel && activeSection && teacher && room;

  const handleCreate = () => {
    if (!isValid) return;
    setCreated(true);
    setTimeout(() => {
      router.push("/school-admin/classes");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/school-admin/classes"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Add New Class
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Create a new class and assign a teacher
          </p>
        </div>
      </div>

      {/* Success state */}
      {created ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Class Created
          </h2>
          <p className="text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">{displayName}</span>{" "}
            has been created. Redirecting...
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Class Identity */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
              Class Details
            </h2>

            {/* Live preview badge */}
            <AnimatePresence>
              {displayName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0891B2]/5 border border-[#0891B2]/20">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#0891B2] to-[#22D3EE] flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {selectedLevel}{activeSection}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {displayName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        This is how the class name will appear across the system
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Grade Level */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedLevel ?? ""}
                  onChange={(e) => setSelectedLevel(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                >
                  <option value="">Select grade level</option>
                  {levelOptions.map((opt) => (
                    <option key={opt.level} value={opt.level}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Section <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    {sections.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSection(s);
                          setCustomSection("");
                        }}
                        className={`w-9 h-9 text-sm font-semibold rounded-lg border transition-all ${
                          section === s && !customSection
                            ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2]"
                            : "border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <div className="relative">
                      <input
                        type="text"
                        value={customSection}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
                          setCustomSection(val);
                          if (val) setSection("");
                        }}
                        placeholder="or type"
                        className={`w-20 h-9 px-2.5 text-sm text-center rounded-lg border transition-all ${
                          customSection
                            ? "border-[#0891B2] bg-[#0891B2]/5 text-[#0891B2] font-semibold"
                            : "border-dashed border-[var(--border)] bg-[var(--background-secondary)] text-[var(--foreground)] placeholder:text-[var(--muted)]"
                        } focus:outline-none focus:border-[#0891B2]`}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--muted)] mt-1.5">
                  Pick an existing section or type a new one
                </p>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Class Teacher <span className="text-red-500">*</span>
                </label>
                <select
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Room <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. 101, Lab A"
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">
              Schedule
            </h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {schedulePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setSchedule(preset);
                      setUseCustomSchedule(false);
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      !useCustomSchedule && schedule === preset
                        ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                        : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <button
                  onClick={() => setUseCustomSchedule(true)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    useCustomSchedule
                      ? "border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] font-medium"
                      : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--muted)]"
                  }`}
                >
                  Custom
                </button>
              </div>
              <AnimatePresence>
                {useCustomSchedule && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={customSchedule}
                      onChange={(e) => setCustomSchedule(e.target.value)}
                      placeholder="e.g. Mon,Wed,Fri 9:00-1:00"
                      className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/school-admin/classes"
              className="px-4 py-2.5 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleCreate}
              disabled={!isValid}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-[#0891B2]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Class
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
