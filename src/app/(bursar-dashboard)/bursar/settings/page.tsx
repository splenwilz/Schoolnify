"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Settings,
  CreditCard,
  FileText,
  Bell,
  Wallet,
  X,
  Pencil,
} from "lucide-react";

// ─── Toggle Switch ──────────────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-all duration-200 ${
        checked ? "bg-[#0891B2]" : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-all duration-200 mt-0.5 ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─── Select Dropdown ────────────────────────────────────────────────────────
function Select({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all appearance-none pr-9"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
    </div>
  );
}

// ─── Chip ───────────────────────────────────────────────────────────────────
function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-[#0891B2]/10 text-[#0891B2]">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:text-[#0E7490] transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

// ─── Section Card ───────────────────────────────────────────────────────────
function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 * index }}
      className="rounded-2xl bg-[var(--card)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-4"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0891B2]/10">
          <Icon className="w-[18px] h-[18px] text-[#0891B2]" />
        </div>
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-[12px] text-[var(--muted)]">{description}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}

// ─── Field Row ──────────────────────────────────────────────────────────────
function Field({
  label,
  description,
  children,
  horizontal = false,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  horizontal?: boolean;
}) {
  if (horizontal) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <label className="text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
          {description && (
            <p className="text-[12px] text-[var(--muted)] mt-0.5">
              {description}
            </p>
          )}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    );
  }
  return (
    <div>
      <label className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      {description && (
        <p className="text-[12px] text-[var(--muted)] mt-0.5">{description}</p>
      )}
      <div className="mt-2">{children}</div>
    </div>
  );
}

// ─── Checkbox ───────────────────────────────────────────────────────────────
function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={`flex items-center justify-center w-[18px] h-[18px] rounded border transition-all ${
          checked
            ? "bg-[#0891B2] border-[#0891B2]"
            : "bg-[var(--background-secondary)] border-[var(--border)] group-hover:border-[#0891B2]/40"
        }`}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="text-sm text-[var(--foreground)]">{label}</span>
    </label>
  );
}

// ─── Radio ──────────────────────────────────────────────────────────────────
function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border-2 transition-all ${
          checked
            ? "border-[#0891B2]"
            : "border-[var(--border)] group-hover:border-[#0891B2]/40"
        }`}
        onClick={(e) => {
          e.preventDefault();
          onChange();
        }}
      >
        {checked && (
          <div className="w-2.5 h-2.5 rounded-full bg-[#0891B2]" />
        )}
      </div>
      <span className="text-sm text-[var(--foreground)]">{label}</span>
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function SettingsPage() {
  // ── General ──
  const [fiscalYear, setFiscalYear] = useState("2025-2026");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  // ── Payment ──
  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    bank: true,
    mobile: true,
    cash: true,
  });
  const [paymentGateway, setPaymentGateway] = useState("paystack");
  const [autoReceipts, setAutoReceipts] = useState(true);
  const [latePenalty, setLatePenalty] = useState(true);
  const [penaltyType, setPenaltyType] = useState<"percentage" | "fixed">(
    "percentage"
  );
  const [penaltyValue, setPenaltyValue] = useState("5");
  const [gracePeriod, setGracePeriod] = useState("7");

  // ── Invoice ──
  const [invoicePrefix, setInvoicePrefix] = useState("INV");
  const [autoSendInvoices, setAutoSendInvoices] = useState(true);
  const [invoiceDuePeriod, setInvoiceDuePeriod] = useState("30");
  const [invoiceFooter, setInvoiceFooter] = useState(
    "Payment is due within 30 days. Late payments may incur additional charges."
  );

  // ── Notifications ──
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [reminderDays, setReminderDays] = useState<string[]>(["7", "3", "1"]);
  const [reminderChannels, setReminderChannels] = useState({
    email: true,
    sms: true,
    inApp: true,
  });
  const [overdueNotifications, setOverdueNotifications] = useState(true);
  const [overdueFrequency, setOverdueFrequency] = useState("weekly");
  const [paymentConfirmation, setPaymentConfirmation] = useState(true);
  const [confirmationRecipients, setConfirmationRecipients] = useState({
    parent: true,
    student: false,
    bursar: true,
  });

  // ── Budget ──
  const [budgetThreshold, setBudgetThreshold] = useState("80");
  const [approvalThreshold, setApprovalThreshold] = useState("5000");

  // ── Handlers ──
  const togglePaymentMethod = (key: keyof typeof paymentMethods) =>
    setPaymentMethods((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleReminderChannel = (key: keyof typeof reminderChannels) =>
    setReminderChannels((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleConfirmationRecipient = (
    key: keyof typeof confirmationRecipients
  ) =>
    setConfirmationRecipients((prev) => ({ ...prev, [key]: !prev[key] }));

  const removeReminderDay = (day: string) =>
    setReminderDays((prev) => prev.filter((d) => d !== day));

  const handleSave = () => {
    // no-op – local state only
  };

  // ── Render ──────────────────────────────────────────────────────────────
  const SaveButton = () => (
    <button
      onClick={handleSave}
      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0891B2] rounded-xl hover:bg-[#0E7490] shadow-sm shadow-[#0891B2]/25 transition-all"
    >
      <Check className="w-4 h-4" />
      Save Changes
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1200px] mx-auto"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/bursar"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--background-secondary)] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Settings
            </h1>
            <p className="text-[13px] text-[var(--muted)] mt-0.5">
              Configure financial settings and preferences
            </p>
          </div>
        </div>
        <SaveButton />
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto">
        {/* ═══ 1. General Settings ════════════════════════════════════════ */}
        <SectionCard
          icon={Settings}
          title="General Settings"
          description="School-wide financial configuration"
          index={0}
        >
          <Field label="School Fiscal Year">
            <Select
              value={fiscalYear}
              onChange={setFiscalYear}
              options={[
                { value: "2024-2025", label: "2024-2025" },
                { value: "2025-2026", label: "2025-2026" },
                { value: "2026-2027", label: "2026-2027" },
              ]}
            />
          </Field>

          <Field label="Currency">
            <Select
              value={currency}
              onChange={setCurrency}
              options={[
                { value: "USD", label: "USD - US Dollar" },
                { value: "GBP", label: "GBP - British Pound" },
                { value: "NGN", label: "NGN - Nigerian Naira" },
                { value: "EUR", label: "EUR - Euro" },
              ]}
            />
          </Field>

          <Field label="Date Format">
            <div className="flex flex-wrap gap-4">
              {["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"].map((fmt) => (
                <Radio
                  key={fmt}
                  label={fmt}
                  checked={dateFormat === fmt}
                  onChange={() => setDateFormat(fmt)}
                />
              ))}
            </div>
          </Field>

          <Field
            label="Academic Terms"
            description="3 terms configured"
          >
            <div className="space-y-1.5">
              {[
                { name: "Term 1", period: "Sep - Dec" },
                { name: "Term 2", period: "Jan - Mar" },
                { name: "Term 3", period: "Apr - Jul" },
              ].map((t) => (
                <div
                  key={t.name}
                  className="flex items-center justify-between px-3 py-2 text-sm bg-[var(--background-secondary)] rounded-lg"
                >
                  <span className="font-medium text-[var(--foreground)]">
                    {t.name}
                  </span>
                  <span className="text-[var(--muted)]">{t.period}</span>
                </div>
              ))}
            </div>
          </Field>
        </SectionCard>

        {/* ═══ 2. Payment Settings ════════════════════════════════════════ */}
        <SectionCard
          icon={CreditCard}
          title="Payment Settings"
          description="Payment methods, gateways, and penalties"
          index={1}
        >
          <Field label="Accepted Payment Methods">
            <div className="flex flex-wrap gap-4">
              <Checkbox
                label="Credit/Debit Card"
                checked={paymentMethods.card}
                onChange={() => togglePaymentMethod("card")}
              />
              <Checkbox
                label="Bank Transfer"
                checked={paymentMethods.bank}
                onChange={() => togglePaymentMethod("bank")}
              />
              <Checkbox
                label="Mobile Money"
                checked={paymentMethods.mobile}
                onChange={() => togglePaymentMethod("mobile")}
              />
              <Checkbox
                label="Cash"
                checked={paymentMethods.cash}
                onChange={() => togglePaymentMethod("cash")}
              />
            </div>
          </Field>

          <Field label="Payment Gateway">
            <Select
              value={paymentGateway}
              onChange={setPaymentGateway}
              options={[
                { value: "paystack", label: "Paystack" },
                { value: "flutterwave", label: "Flutterwave" },
                { value: "stripe", label: "Stripe" },
                { value: "manual", label: "Manual Only" },
              ]}
            />
          </Field>

          <Field
            label="Auto-generate Receipts"
            description="Automatically generate receipts after payment"
            horizontal
          >
            <Toggle checked={autoReceipts} onChange={setAutoReceipts} />
          </Field>

          <div>
            <Field
              label="Late Payment Penalty"
              description="Charge a penalty for late payments"
              horizontal
            >
              <Toggle checked={latePenalty} onChange={setLatePenalty} />
            </Field>

            {latePenalty && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 ml-4 pl-4 border-l-2 border-[var(--border)] space-y-4"
              >
                <Field label="Penalty Type">
                  <div className="flex gap-4">
                    <Radio
                      label="Percentage"
                      checked={penaltyType === "percentage"}
                      onChange={() => setPenaltyType("percentage")}
                    />
                    <Radio
                      label="Fixed Amount"
                      checked={penaltyType === "fixed"}
                      onChange={() => setPenaltyType("fixed")}
                    />
                  </div>
                </Field>

                <Field label="Penalty Value">
                  <div className="relative max-w-[200px]">
                    <input
                      type="text"
                      value={penaltyValue}
                      onChange={(e) => setPenaltyValue(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                      {penaltyType === "percentage" ? "%" : "$"}
                    </span>
                  </div>
                </Field>

                <Field label="Grace Period">
                  <div className="relative max-w-[200px]">
                    <input
                      type="text"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all pr-14"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                      days
                    </span>
                  </div>
                </Field>
              </motion.div>
            )}
          </div>
        </SectionCard>

        {/* ═══ 3. Invoice Settings ════════════════════════════════════════ */}
        <SectionCard
          icon={FileText}
          title="Invoice Settings"
          description="Invoice numbering, delivery, and defaults"
          index={2}
        >
          <Field label="Invoice Prefix">
            <input
              type="text"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
              className="w-full max-w-[200px] px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all"
            />
          </Field>

          <Field
            label="Next Invoice Number"
            description="Auto-generated based on prefix and sequence"
          >
            <input
              type="text"
              value="2026-011"
              readOnly
              className="w-full max-w-[200px] px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--muted)] cursor-not-allowed opacity-60"
            />
          </Field>

          <Field
            label="Auto-send Invoices"
            description="Automatically email invoices when generated"
            horizontal
          >
            <Toggle
              checked={autoSendInvoices}
              onChange={setAutoSendInvoices}
            />
          </Field>

          <Field label="Invoice Due Period">
            <div className="relative max-w-[200px]">
              <input
                type="text"
                value={invoiceDuePeriod}
                onChange={(e) => setInvoiceDuePeriod(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                days
              </span>
            </div>
          </Field>

          <Field label="Invoice Footer Text">
            <textarea
              value={invoiceFooter}
              onChange={(e) => setInvoiceFooter(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all resize-none"
            />
          </Field>
        </SectionCard>

        {/* ═══ 4. Notification Settings ═══════════════════════════════════ */}
        <SectionCard
          icon={Bell}
          title="Notification Settings"
          description="Payment reminders, alerts, and confirmations"
          index={3}
        >
          {/* Payment Reminders */}
          <div>
            <Field
              label="Payment Reminders"
              description="Send reminders before payment due dates"
              horizontal
            >
              <Toggle
                checked={paymentReminders}
                onChange={setPaymentReminders}
              />
            </Field>

            {paymentReminders && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 ml-4 pl-4 border-l-2 border-[var(--border)] space-y-4"
              >
                <Field label="Days before due">
                  <div className="flex flex-wrap items-center gap-2">
                    {reminderDays.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        onRemove={() => removeReminderDay(day)}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Reminder channels">
                  <div className="flex flex-wrap gap-4">
                    <Checkbox
                      label="Email"
                      checked={reminderChannels.email}
                      onChange={() => toggleReminderChannel("email")}
                    />
                    <Checkbox
                      label="SMS"
                      checked={reminderChannels.sms}
                      onChange={() => toggleReminderChannel("sms")}
                    />
                    <Checkbox
                      label="In-App"
                      checked={reminderChannels.inApp}
                      onChange={() => toggleReminderChannel("inApp")}
                    />
                  </div>
                </Field>
              </motion.div>
            )}
          </div>

          {/* Overdue Notifications */}
          <div>
            <Field
              label="Overdue Notifications"
              description="Notify when payments are past due"
              horizontal
            >
              <Toggle
                checked={overdueNotifications}
                onChange={setOverdueNotifications}
              />
            </Field>

            {overdueNotifications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 ml-4 pl-4 border-l-2 border-[var(--border)] space-y-4"
              >
                <Field label="Frequency">
                  <Select
                    value={overdueFrequency}
                    onChange={setOverdueFrequency}
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "biweekly", label: "Bi-weekly" },
                    ]}
                    className="max-w-[240px]"
                  />
                </Field>
              </motion.div>
            )}
          </div>

          {/* Payment Confirmation */}
          <div>
            <Field
              label="Payment Confirmation"
              description="Send confirmation after payment is received"
              horizontal
            >
              <Toggle
                checked={paymentConfirmation}
                onChange={setPaymentConfirmation}
              />
            </Field>

            {paymentConfirmation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 ml-4 pl-4 border-l-2 border-[var(--border)] space-y-4"
              >
                <Field label="Send to">
                  <div className="flex flex-wrap gap-4">
                    <Checkbox
                      label="Parent"
                      checked={confirmationRecipients.parent}
                      onChange={() => toggleConfirmationRecipient("parent")}
                    />
                    <Checkbox
                      label="Student"
                      checked={confirmationRecipients.student}
                      onChange={() => toggleConfirmationRecipient("student")}
                    />
                    <Checkbox
                      label="Bursar"
                      checked={confirmationRecipients.bursar}
                      onChange={() => toggleConfirmationRecipient("bursar")}
                    />
                  </div>
                </Field>
              </motion.div>
            )}
          </div>
        </SectionCard>

        {/* ═══ 5. Budget Settings ═════════════════════════════════════════ */}
        <SectionCard
          icon={Wallet}
          title="Budget Settings"
          description="Budget limits, alerts, and approval thresholds"
          index={4}
        >
          <Field label="Fiscal Year Budget">
            <div className="relative max-w-[280px]">
              <input
                type="text"
                value="$2,800,000"
                readOnly
                className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] cursor-default pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[#0891B2] transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </Field>

          <Field
            label="Budget Alert Threshold"
            description="Alert when category spending exceeds this percentage"
          >
            <div className="relative max-w-[200px]">
              <input
                type="text"
                value={budgetThreshold}
                onChange={(e) => setBudgetThreshold(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 focus:border-[#0891B2] transition-all pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                %
              </span>
            </div>
          </Field>

          <Field label="Require Approval For">
            <Select
              value={approvalThreshold}
              onChange={setApprovalThreshold}
              className="max-w-[280px]"
              options={[
                { value: "1000", label: "Expenses over $1,000" },
                { value: "5000", label: "Expenses over $5,000" },
                { value: "10000", label: "Expenses over $10,000" },
                { value: "all", label: "All expenses" },
              ]}
            />
          </Field>
        </SectionCard>

        {/* ── Bottom Save Button ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 * 5 }}
          className="flex justify-end pb-8"
        >
          <SaveButton />
        </motion.div>
      </div>
    </motion.div>
  );
}
