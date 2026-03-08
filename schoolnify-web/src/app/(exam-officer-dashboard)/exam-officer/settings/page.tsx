"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-0.5">{title}</h3>
      <p className="text-[12px] text-[var(--muted)] mb-5">{description}</p>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <p className="text-[13px] font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="text-[11px] text-[var(--muted)]">{description}</p>}
      </div>
      <div className="sm:w-64">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-[#6366F1]" : "bg-[var(--border)]")}>
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30" />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#6366F1]/30">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExamSettingsPage() {
  // Grading Scale
  const [gradingSystem, setGradingSystem] = useState("letter");
  const [passmark, setPassmark] = useState("40");
  const [gradeA, setGradeA] = useState("70");
  const [gradeB, setGradeB] = useState("60");
  const [gradeC, setGradeC] = useState("50");
  const [gradeD, setGradeD] = useState("45");

  // Assessment Weights
  const [caWeight, setCaWeight] = useState("40");
  const [examWeight, setExamWeight] = useState("60");
  const [maxCA, setMaxCA] = useState("40");
  const [maxExam, setMaxExam] = useState("60");

  // Report Card
  const [defaultTemplate, setDefaultTemplate] = useState("standard");
  const [showPosition, setShowPosition] = useState(true);
  const [showGPA, setShowGPA] = useState(true);
  const [showTeacherComments, setShowTeacherComments] = useState(true);
  const [showPrincipalSignature, setShowPrincipalSignature] = useState(true);

  // Notifications
  const [gradeSubmissionReminder, setGradeSubmissionReminder] = useState(true);
  const [resultPublishedNotify, setResultPublishedNotify] = useState(true);
  const [reportCardReady, setReportCardReady] = useState(true);
  const [examScheduleNotify, setExamScheduleNotify] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/exam-officer"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Exam Settings</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">Configure grading, assessment, and report card preferences</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Grading Scale */}
        <SectionCard title="Grading Scale" description="Define the grading system and pass marks">
          <Field label="Grading System" description="Type of grading scale to use">
            <Select value={gradingSystem} onChange={setGradingSystem} options={[
              { label: "Letter Grades (A-F)", value: "letter" },
              { label: "GPA (4.0 Scale)", value: "gpa" },
              { label: "Percentage Only", value: "percentage" },
            ]} />
          </Field>
          <Field label="Pass Mark (%)" description="Minimum percentage to pass"><TextInput value={passmark} onChange={setPassmark} /></Field>
          <Field label="Grade A (min %)" description="Minimum score for grade A"><TextInput value={gradeA} onChange={setGradeA} /></Field>
          <Field label="Grade B (min %)" description="Minimum score for grade B"><TextInput value={gradeB} onChange={setGradeB} /></Field>
          <Field label="Grade C (min %)" description="Minimum score for grade C"><TextInput value={gradeC} onChange={setGradeC} /></Field>
          <Field label="Grade D (min %)" description="Minimum score for grade D"><TextInput value={gradeD} onChange={setGradeD} /></Field>
        </SectionCard>

        {/* Assessment Weights */}
        <SectionCard title="Assessment Weights" description="Configure the weight of continuous assessment and exams">
          <Field label="CA Weight (%)" description="Weight of continuous assessment in final score"><TextInput value={caWeight} onChange={setCaWeight} /></Field>
          <Field label="Exam Weight (%)" description="Weight of exam in final score"><TextInput value={examWeight} onChange={setExamWeight} /></Field>
          <Field label="Max CA Score" description="Maximum mark obtainable in CA"><TextInput value={maxCA} onChange={setMaxCA} /></Field>
          <Field label="Max Exam Score" description="Maximum mark obtainable in exam"><TextInput value={maxExam} onChange={setMaxExam} /></Field>
        </SectionCard>

        {/* Report Card */}
        <SectionCard title="Report Card" description="Configure report card generation settings">
          <Field label="Default Template" description="Template used for generating report cards">
            <Select value={defaultTemplate} onChange={setDefaultTemplate} options={[
              { label: "Standard", value: "standard" },
              { label: "Detailed", value: "detailed" },
              { label: "Minimal", value: "minimal" },
            ]} />
          </Field>
          <Field label="Show Position" description="Display class position on report card"><Toggle checked={showPosition} onChange={setShowPosition} /></Field>
          <Field label="Show GPA" description="Display GPA on report card"><Toggle checked={showGPA} onChange={setShowGPA} /></Field>
          <Field label="Teacher Comments" description="Include teacher comments section"><Toggle checked={showTeacherComments} onChange={setShowTeacherComments} /></Field>
          <Field label="Principal Signature" description="Include principal signature line"><Toggle checked={showPrincipalSignature} onChange={setShowPrincipalSignature} /></Field>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" description="Manage exam-related notification preferences">
          <Field label="Grade Submission Reminders" description="Remind teachers to submit grades"><Toggle checked={gradeSubmissionReminder} onChange={setGradeSubmissionReminder} /></Field>
          <Field label="Results Published" description="Notify when exam results are published"><Toggle checked={resultPublishedNotify} onChange={setResultPublishedNotify} /></Field>
          <Field label="Report Card Ready" description="Notify when report cards are generated"><Toggle checked={reportCardReady} onChange={setReportCardReady} /></Field>
          <Field label="Exam Schedule Updates" description="Notify about exam schedule changes"><Toggle checked={examScheduleNotify} onChange={setExamScheduleNotify} /></Field>
          <Field label="Reminder Days Before" description="Days before deadline to send reminders"><TextInput value={reminderDays} onChange={setReminderDays} /></Field>
        </SectionCard>
      </div>
    </motion.div>
  );
}
