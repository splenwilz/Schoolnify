"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Reusable sub-components (same pattern as bursar settings)
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
    <button onClick={() => onChange(!checked)} className={cn("relative w-11 h-6 rounded-full transition-colors", checked ? "bg-[#10B981]" : "bg-[var(--border)]")}>
      <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30" />;
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 text-[13px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#10B981]/30">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LibrarySettingsPage() {
  // General
  const [libraryName, setLibraryName] = useState("Greenwood Academy Library");
  const [operatingHours, setOperatingHours] = useState("7:30 AM - 4:00 PM");
  const [maxBorrowLimit, setMaxBorrowLimit] = useState("3");
  const [borrowDuration, setBorrowDuration] = useState("14");

  // Circulation
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [maxRenewals, setMaxRenewals] = useState("2");
  const [gracePeriod, setGracePeriod] = useState("1");

  // Fines
  const [finePerDay, setFinePerDay] = useState("0.50");
  const [maxFine, setMaxFine] = useState("25.00");
  const [fineCalculation, setFineCalculation] = useState("daily");

  // Notifications
  const [overdueReminders, setOverdueReminders] = useState(true);
  const [reservationNotify, setReservationNotify] = useState(true);
  const [returnConfirmation, setReturnConfirmation] = useState(true);
  const [dueDateReminder, setDueDateReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("2");

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
            href="/librarian"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Library Settings</h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">Configure library policies and preferences</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* General */}
        <SectionCard title="General" description="Basic library information and operating settings">
          <Field label="Library Name" description="Display name of the library"><TextInput value={libraryName} onChange={setLibraryName} /></Field>
          <Field label="Operating Hours" description="When the library is open"><TextInput value={operatingHours} onChange={setOperatingHours} /></Field>
          <Field label="Max Borrow Limit" description="Maximum books a member can borrow at once"><TextInput value={maxBorrowLimit} onChange={setMaxBorrowLimit} /></Field>
          <Field label="Borrow Duration (days)" description="Default loan period in days"><TextInput value={borrowDuration} onChange={setBorrowDuration} /></Field>
        </SectionCard>

        {/* Circulation */}
        <SectionCard title="Circulation" description="Rules for book issue, renewal, and return">
          <Field label="Auto-Renewal" description="Automatically renew books if no reservations exist"><Toggle checked={autoRenewal} onChange={setAutoRenewal} /></Field>
          <Field label="Max Renewals" description="Maximum number of times a book can be renewed"><TextInput value={maxRenewals} onChange={setMaxRenewals} /></Field>
          <Field label="Grace Period (days)" description="Number of days after due date before fines begin"><TextInput value={gracePeriod} onChange={setGracePeriod} /></Field>
        </SectionCard>

        {/* Fine Settings */}
        <SectionCard title="Fine Settings" description="Configure overdue fine calculation">
          <Field label="Fine Per Day ($)" description="Amount charged per day overdue"><TextInput value={finePerDay} onChange={setFinePerDay} /></Field>
          <Field label="Maximum Fine ($)" description="Cap on total fine amount per book"><TextInput value={maxFine} onChange={setMaxFine} /></Field>
          <Field label="Calculation Method" description="How fines are computed">
            <Select value={fineCalculation} onChange={setFineCalculation} options={[
              { label: "Daily (fixed rate)", value: "daily" },
              { label: "Graduated (increases over time)", value: "graduated" },
              { label: "Flat fee per overdue item", value: "flat" },
            ]} />
          </Field>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" description="Manage library notification preferences">
          <Field label="Overdue Reminders" description="Send reminders when books are overdue"><Toggle checked={overdueReminders} onChange={setOverdueReminders} /></Field>
          <Field label="Reservation Available" description="Notify when a reserved book becomes available"><Toggle checked={reservationNotify} onChange={setReservationNotify} /></Field>
          <Field label="Return Confirmation" description="Send confirmation when a book is returned"><Toggle checked={returnConfirmation} onChange={setReturnConfirmation} /></Field>
          <Field label="Due Date Reminder" description="Remind members before their books are due"><Toggle checked={dueDateReminder} onChange={setDueDateReminder} /></Field>
          <Field label="Reminder Days Before" description="How many days before due date to send reminder"><TextInput value={reminderDays} onChange={setReminderDays} /></Field>
        </SectionCard>
      </div>
    </motion.div>
  );
}
