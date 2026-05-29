"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  DollarSign,
  CheckCircle2,
  User,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
} from "lucide-react";
import { students } from "@/lib/demo-data";
import { useSchoolConfig } from "@/lib/school-config-context";

const feeTypes = [
  { value: "tuition", label: "Tuition Fee", defaultAmount: 2500 },
  { value: "activity", label: "Activity Fee", defaultAmount: 150 },
  { value: "supplies", label: "Supplies Fee", defaultAmount: 75 },
  { value: "transport", label: "Transport Fee", defaultAmount: 350 },
  { value: "exam", label: "Exam Fee", defaultAmount: 200 },
  { value: "other", label: "Other", defaultAmount: 0 },
];

const paymentMethods = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "credit_card", label: "Credit Card", icon: CreditCard },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
  { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
];

export default function CollectFeePage() {
  const router = useRouter();
  const { fmtGrade } = useSchoolConfig();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return students
      .filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.gradeLevel.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery]);

  const handleFeeTypeChange = (type: string) => {
    setFeeType(type);
    const preset = feeTypes.find((f) => f.value === type);
    if (preset && preset.defaultAmount > 0) {
      setAmount(String(preset.defaultAmount));
    }
  };

  const isValid = selectedStudentId && feeType && amount && Number(amount) > 0 && paymentMethod;

  const handleSubmit = () => {
    if (!isValid) return;
    // In production, POST to API
    setSubmitted(true);
    setTimeout(() => {
      router.push("/school-admin/finances");
    }, 2000);
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
          href="/school-admin/finances"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--foreground)]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Collect Fee
          </h1>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            Record a fee payment from a student
          </p>
        </div>
      </div>

      {/* Success state */}
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            Payment Recorded
          </h2>
          <p className="text-sm text-[var(--muted)]">
            ${Number(amount).toLocaleString()} {feeType} fee from{" "}
            <span className="font-medium text-[var(--foreground)]">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </span>{" "}
            has been recorded. Redirecting...
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Step 1: Select Student */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#0891B2] text-white text-xs font-bold flex items-center justify-center">
                1
              </div>
              <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
                Select Student
              </h2>
            </div>

            {selectedStudent ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0891B2]/5 border border-[#0891B2]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0891B2]/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#0891B2]">
                      {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {fmtGrade(selectedStudent.gradeLevel)} &middot; {selectedStudent.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedStudentId(null);
                    setSearchQuery("");
                  }}
                  className="text-sm text-[#0891B2] hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name or ID..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                  autoFocus
                />
                <AnimatePresence>
                  {filteredStudents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg z-50 overflow-hidden"
                    >
                      {filteredStudents.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-secondary)] transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-[var(--muted)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-xs text-[var(--muted)]">
                              {fmtGrade(s.gradeLevel)} &middot; {s.id}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {searchQuery.trim() && filteredStudents.length === 0 && (
                  <p className="text-xs text-[var(--muted)] mt-2">
                    No students found for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Fee Details */}
          <div className={`rounded-xl border bg-[var(--card)] p-6 transition-opacity ${
            selectedStudentId ? "border-[var(--border)]" : "border-[var(--border)] opacity-50 pointer-events-none"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                selectedStudentId ? "bg-[#0891B2]" : "bg-[var(--muted)]"
              }`}>
                2
              </div>
              <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
                Fee Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fee Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Fee Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={feeType}
                  onChange={(e) => handleFeeTypeChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                >
                  <option value="">Select fee type</option>
                  {feeTypes.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                  />
                </div>
              </div>

              {/* Reference */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  Reference / Receipt No.
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. REC-2026-001"
                  className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className={`rounded-xl border bg-[var(--card)] p-6 transition-opacity ${
            selectedStudentId && feeType && amount ? "border-[var(--border)]" : "border-[var(--border)] opacity-50 pointer-events-none"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center ${
                selectedStudentId && feeType && amount ? "bg-[#0891B2]" : "bg-[var(--muted)]"
              }`}>
                3
              </div>
              <h2 className="text-[15px] font-semibold text-[var(--foreground)]">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all ${
                      paymentMethod === method.value
                        ? "border-[#0891B2] bg-[#0891B2]/5"
                        : "border-[var(--border)] hover:border-[var(--muted)]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      paymentMethod === method.value ? "text-[#0891B2]" : "text-[var(--muted)]"
                    }`} />
                    <span className={`text-xs font-medium ${
                      paymentMethod === method.value ? "text-[#0891B2]" : "text-[var(--foreground-secondary)]"
                    }`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes about this payment..."
                className="w-full px-3 py-2.5 text-sm bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/20 resize-none"
              />
            </div>
          </div>

          {/* Summary + Submit */}
          <AnimatePresence>
            {isValid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-[#0891B2]/20 bg-[#0891B2]/5 p-4 mb-4">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
                    Payment Summary
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground)]">
                      {feeTypes.find((f) => f.value === feeType)?.label} for{" "}
                      <span className="font-medium">
                        {selectedStudent?.firstName} {selectedStudent?.lastName}
                      </span>
                    </span>
                    <span className="text-lg font-bold text-[var(--foreground)]">
                      ${Number(amount).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    via {paymentMethods.find((m) => m.value === paymentMethod)?.label}
                    {reference && ` · Ref: ${reference}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/school-admin/finances"
              className="px-4 py-2.5 text-sm font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#10B981] rounded-xl hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-[#10B981]/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Record Payment
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
