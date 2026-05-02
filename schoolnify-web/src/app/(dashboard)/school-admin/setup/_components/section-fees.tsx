"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Wallet, Plus, Trash2, Sparkles, ChevronDown, X, Check } from "lucide-react";
import { SectionCard, Field, TextInput, Toggle } from "./form-primitives";
import { isFeesComplete } from "./setup-types";
import type { SetupData, FeeCategory, DiscountType } from "./setup-types";
import {
  FEE_PRESETS, COMMON_FEE_CATEGORIES, DEFAULT_DISCOUNT_TYPES,
  FEE_TYPE_LABELS, FEE_FREQUENCY_LABELS, FEE_FREQUENCY_OPTIONS,
  type FeePreset,
} from "../_constants/fees";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FeesSectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
  addFeeCategory: (name: string, frequency?: FeeCategory["frequency"], feeType?: FeeCategory["feeType"]) => void;
  updateFeeCategory: (index: number, field: keyof FeeCategory, value: string | boolean | string[] | Record<string, string>) => void;
  toggleFeeCategoryLevel: (index: number, level: string) => void;
  updateFeeCategoryAmount: (index: number, level: string, amount: string) => void;
  removeFeeCategory: (index: number) => void;
  applyFeePreset: (presetId: string) => void;
}

// ---------------------------------------------------------------------------
// FeesSection
// ---------------------------------------------------------------------------

export function FeesSection({
  data, update, expanded, toggleSection,
  addFeeCategory, updateFeeCategory, toggleFeeCategoryLevel,
  updateFeeCategoryAmount, removeFeeCategory, applyFeePreset,
}: FeesSectionProps) {
  const [presetOpen, setPresetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const presetBtnRef = useRef<HTMLButtonElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const hasFees = data.feeCategories.length > 0;

  // Group fees by type for display
  const grouped: Record<string, { fee: FeeCategory; index: number }[]> = {};
  data.feeCategories.forEach((fee, i) => {
    const key = fee.feeType || "tuition";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ fee, index: i });
  });

  const addDiscount = () => {
    update("discountTypes", [...data.discountTypes, { name: "", percentage: "", appliesTo: "tuition" }]);
  };
  const updateDiscount = (i: number, field: keyof DiscountType, value: string) => {
    const updated = [...data.discountTypes];
    updated[i] = { ...updated[i], [field]: value };
    update("discountTypes", updated);
  };
  const removeDiscount = (i: number) => {
    update("discountTypes", data.discountTypes.filter((_, idx) => idx !== i));
  };
  const applyDefaultDiscounts = () => {
    update("discountTypes", [...DEFAULT_DISCOUNT_TYPES]);
  };

  return (
    <SectionCard
      id="fees"
      title="Fee Structure"
      description="Define fee categories, payment schedule, and discount policies"
      icon={<Wallet className="w-5 h-5" />}
      isComplete={isFeesComplete(data)}
      isExpanded={expanded === "fees"}
      onToggle={() => toggleSection("fees")}
    >
      {/* Starter banner when no fees */}
      {!hasFees ? (
        <div className="rounded-xl border border-[#0891B2]/20 bg-gradient-to-br from-[#0891B2]/5 to-transparent p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-[#0891B2]/10 text-[#0891B2] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[17px] font-semibold text-[var(--foreground)] mb-1">Start from a preset</h4>
              <p className="text-[14px] text-[var(--muted)]">
                Choose a school type to pre-fill fee categories. You set the amounts yourself.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {FEE_PRESETS.slice(0, 4).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyFeePreset(preset.id)}
                className="text-left p-3 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
              >
                <span className="text-[14px] font-medium text-[var(--foreground)]">{preset.label}</span>
                <p className="text-[12px] text-[var(--muted)]">{preset.description} ({preset.items.length} categories)</p>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {FEE_PRESETS.length > 4 && (
              <button
                type="button"
                onClick={() => setPresetOpen(true)}
                className="text-[13px] font-medium text-[#0891B2] hover:underline"
              >
                Show all presets ({FEE_PRESETS.length})
              </button>
            )}
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => setAddOpen(true)}
              className="text-[13px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              or add categories manually
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header with actions */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex-1 min-w-[180px]">
              <p className="text-[15px] font-medium text-[var(--foreground)]">
                {data.feeCategories.length} fee {data.feeCategories.length === 1 ? "category" : "categories"}
              </p>
            </div>
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add category
            </button>
            <button
              ref={presetBtnRef}
              type="button"
              onClick={() => setPresetOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              Switch preset
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          {/* Fee categories grouped by type */}
          <div className="space-y-4">
            {Object.entries(grouped).map(([typeKey, items]) => (
              <div key={typeKey}>
                <p className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)] mb-2">
                  {FEE_TYPE_LABELS[typeKey] || typeKey} ({items.length})
                </p>
                <div className="space-y-2">
                  {items.map(({ fee, index }) => (
                    <FeeCategoryCard
                      key={index}
                      fee={fee}
                      index={index}
                      currency={data.currency}
                      gradeLevels={data.gradeLevels}
                      onUpdate={updateFeeCategory}
                      onToggleLevel={toggleFeeCategoryLevel}
                      onUpdateAmount={updateFeeCategoryAmount}
                      onRemove={removeFeeCategory}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Schedule */}
          {/* Payment & Late Fee Policy */}
          <div className="mt-6 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-3">
            <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Payment Policy</p>
            <p className="text-[13px] text-[var(--muted)]">
              Due dates are based on each fee's frequency: per-term fees are due at term start, annual fees at the start of the year, one-time fees on enrollment.
              {data.feeCategories.some((f) => f.frequency === "monthly") && " Monthly fees need a due day."}
            </p>
            {(() => {
              const hasMonthly = data.feeCategories.some((f) => f.frequency === "monthly");
              return (
                <div className={cn("grid gap-4", hasMonthly ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
                  {hasMonthly && (
                    <Field label="Monthly due day" description="Day of month for monthly fees">
                      <TextInput value={data.feePaymentDueDay} onChange={(v) => update("feePaymentDueDay", v)} type="number" placeholder="e.g. 5" />
                    </Field>
                  )}
                  <Field label="Late fee penalty (%)" description="Charged on overdue balance">
                    <TextInput value={data.lateFeePercentage} onChange={(v) => update("lateFeePercentage", v)} type="number" placeholder="0" />
                  </Field>
                  <Field label="Grace period (days)" description="Days before penalty applies">
                    <TextInput value={data.lateFeeGraceDays} onChange={(v) => update("lateFeeGraceDays", v)} type="number" placeholder="7" />
                  </Field>
                </div>
              );
            })()}
          </div>

          {/* Discounts */}
          <div className="mt-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)]/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider">Discount Types</p>
              {data.discountTypes.length === 0 && (
                <button type="button" onClick={applyDefaultDiscounts} className="text-[13px] font-medium text-[#0891B2] hover:underline">
                  Use common defaults
                </button>
              )}
            </div>
            {data.discountTypes.length > 0 && (
              <div className="space-y-2">
                {data.discountTypes.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={d.name}
                      onChange={(e) => updateDiscount(i, "name", e.target.value)}
                      placeholder="Discount name"
                      className="flex-1 px-2.5 py-1.5 text-[14px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                    />
                    <input
                      value={d.percentage}
                      onChange={(e) => updateDiscount(i, "percentage", e.target.value)}
                      type="number"
                      placeholder="%"
                      className="w-20 px-2.5 py-1.5 text-[14px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]"
                    />
                    <select
                      value={d.appliesTo}
                      onChange={(e) => updateDiscount(i, "appliesTo", e.target.value)}
                      className="px-2 py-1.5 text-[13px] bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] focus:outline-none"
                    >
                      <option value="tuition">Tuition only</option>
                      <option value="all">All fees</option>
                    </select>
                    <button type="button" onClick={() => removeDiscount(i)} className="p-1 text-[var(--muted)] hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={addDiscount} className="flex items-center gap-1.5 text-[13px] font-medium text-[#0891B2] hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add discount type
            </button>
          </div>
        </>
      )}

      {/* Popovers */}
      {presetOpen && (
        <FeePresetPopover
          btnRef={presetBtnRef}
          onSelect={(id) => { applyFeePreset(id); setPresetOpen(false); }}
          onClose={() => setPresetOpen(false)}
        />
      )}
      {addOpen && (
        <AddFeeCategoryPopover
          btnRef={addBtnRef}
          existingNames={data.feeCategories.map((f) => f.name)}
          onAdd={(name, freq, type) => { addFeeCategory(name, freq, type); }}
          onClose={() => setAddOpen(false)}
        />
      )}
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// FeeCategoryCard -- individual fee category editor
// ---------------------------------------------------------------------------

/** Map ISO currency code to symbol. Falls back to code itself. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  NGN: "\u20A6", USD: "$", GBP: "\u00A3", EUR: "\u20AC", GHS: "GH\u20B5",
  KES: "KSh", ZAR: "R", INR: "\u20B9", CAD: "CA$", AUD: "A$",
  AED: "AED", PHP: "\u20B1", BRL: "R$", JPY: "\u00A5", CNY: "\u00A5",
  MYR: "RM", SGD: "S$", SAR: "SAR", QAR: "QAR", KWD: "KD",
};

function getCurrencySymbol(code: string): string {
  if (!code) return "";
  return CURRENCY_SYMBOLS[code.toUpperCase()] || code;
}

/** Format a raw number string with thousand separators. */
function formatAmount(raw: string): string {
  let num = raw.replace(/[^0-9.]/g, "");
  if (!num) return "";
  // Strip all but the first decimal point
  const firstDot = num.indexOf(".");
  if (firstDot !== -1) {
    num = num.slice(0, firstDot + 1) + num.slice(firstDot + 1).replace(/\./g, "");
  }
  const parts = num.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/** Currency-aware input: shows formatted amount with symbol, edits as raw number. */
function CurrencyInput({
  value, onChange, symbol, placeholder, className,
}: {
  value: string;
  onChange: (raw: string) => void;
  symbol: string;
  placeholder?: string;
  className?: string;
}) {
  const [focused, setFocused] = useState(false);
  const display = focused ? value : formatAmount(value);

  return (
    <div className={cn("relative", className)}>
      {symbol && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] text-[var(--muted)] pointer-events-none">
          {symbol}
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          onChange(raw);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder ?? "0"}
        className={cn(
          "w-full py-1.5 bg-[var(--card)] border border-[var(--border)] rounded-md text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[#0891B2]",
          symbol ? "pl-7 pr-2" : "px-2",
          "text-[13px]"
        )}
      />
    </div>
  );
}

function FeeCategoryCard({
  fee, index, currency, gradeLevels,
  onUpdate, onToggleLevel, onUpdateAmount, onRemove,
}: {
  fee: FeeCategory;
  index: number;
  currency: string;
  gradeLevels: string[];
  onUpdate: (i: number, field: keyof FeeCategory, value: string | boolean | string[] | Record<string, string>) => void;
  onToggleLevel: (i: number, level: string) => void;
  onUpdateAmount: (i: number, level: string, amount: string) => void;
  onRemove: (i: number) => void;
}) {
  const [setAllValue, setSetAllValue] = useState("");
  const levels = fee.appliesTo === "all" ? gradeLevels : fee.gradeLevels;
  const hasLevels = levels.length > 0;
  const sym = getCurrencySymbol(currency);

  const applySetAll = (val: string) => {
    if (!val) return;
    const newAmounts = { ...fee.amounts };
    levels.forEach((l) => { newAmounts[l] = val; });
    onUpdate(index, "amounts", newAmounts);
  };

  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--background-secondary)]">
        <input
          value={fee.name ?? ""}
          onChange={(e) => onUpdate(index, "name", e.target.value)}
          className="flex-1 text-[14px] font-medium bg-transparent text-[var(--foreground)] focus:outline-none"
        />
        <FrequencyPicker value={fee.frequency} onChange={(v) => onUpdate(index, "frequency", v)} />
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[12px] text-[var(--muted)]">Required</span>
          <Toggle checked={fee.mandatory ?? true} onChange={(v) => onUpdate(index, "mandatory", v)} />
        </div>
        <button type="button" onClick={() => onRemove(index)} className="p-1 text-[var(--muted)] hover:text-red-500 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Applies to */}
      <div className="px-3 py-2 flex items-start gap-3">
        <span className="text-[11px] font-medium text-[var(--muted)] uppercase tracking-wider shrink-0 pt-1">Applies to</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onUpdate(index, "appliesTo", "all")}
            className={cn(
              "px-2 py-1 text-[12px] font-medium rounded-md border transition-colors",
              fee.appliesTo === "all"
                ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            All Levels
          </button>
          <button
            type="button"
            onClick={() => onUpdate(index, "appliesTo", "specific")}
            className={cn(
              "px-2 py-1 text-[12px] font-medium rounded-md border transition-colors",
              fee.appliesTo === "specific"
                ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2]"
                : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            Specific
          </button>
          {fee.appliesTo === "specific" && gradeLevels.map((level) => {
            const selected = fee.gradeLevels.includes(level);
            return (
              <button
                key={level}
                type="button"
                onClick={() => onToggleLevel(index, level)}
                className={cn(
                  "px-2 py-1 text-[12px] font-medium rounded-md border transition-colors",
                  selected
                    ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amounts */}
      <div className="px-3 py-2 border-t border-[var(--border)]">
        {!hasLevels ? (
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[var(--muted)]">Amount</span>
            <CurrencyInput
              value={fee.amounts["_flat"] ?? ""}
              onChange={(v) => onUpdateAmount(index, "_flat", v)}
              symbol={sym}
              className="w-44"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] text-[var(--muted)]">Set all:</span>
              <CurrencyInput
                value={setAllValue}
                onChange={(v) => setSetAllValue(v)}
                symbol={sym}
                placeholder="Same for all levels"
                className="w-44"
              />
              <button
                type="button"
                onClick={() => applySetAll(setAllValue)}
                disabled={!setAllValue}
                className="text-[12px] font-medium text-[#0891B2] hover:underline disabled:opacity-40 disabled:no-underline"
              >
                Apply
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {levels.map((level) => (
                <div key={level} className="flex items-center gap-1.5">
                  <span className="text-[12px] text-[var(--muted)] w-16 truncate shrink-0" title={level}>{level}</span>
                  <CurrencyInput
                    value={fee.amounts[level] ?? ""}
                    onChange={(v) => onUpdateAmount(index, level, v)}
                    symbol={sym}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popover position helper
// ---------------------------------------------------------------------------

function usePopPos(anchor: React.RefObject<HTMLElement | null>, isOpen: boolean, width: number) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    if (!isOpen || !anchor.current) return;
    const update = () => {
      if (!anchor.current) return;
      const rect = anchor.current.getBoundingClientRect();
      const vw = typeof window !== "undefined" ? window.innerWidth : 0;
      let left = rect.left;
      if (left + width > vw - 12) left = vw - width - 12;
      if (left < 12) left = 12;
      setPos({ top: rect.bottom + 8, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [isOpen, anchor, width]);
  return pos;
}

// ---------------------------------------------------------------------------
// FeePresetPopover
// ---------------------------------------------------------------------------

function FeePresetPopover({
  btnRef, onSelect, onClose,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const W = 440;
  const ref = useRef<HTMLDivElement>(null);
  const pos = usePopPos(btnRef, true, W);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || btnRef.current?.contains(t)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [onClose, btnRef]);

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div ref={ref} style={{ position: "fixed", top: pos.top, left: pos.left, width: W }} className="max-h-[60vh] rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Fee structure presets</span>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]"><X className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {FEE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className="w-full text-left px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[#0891B2]/40 hover:bg-[#0891B2]/5 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-medium text-[var(--foreground)]">{preset.label}</span>
              <span className="shrink-0 text-[11px] text-[var(--muted)]">{preset.items.length} categories</span>
            </div>
            <p className="text-[12px] text-[var(--muted)]">{preset.description}</p>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// AddFeeCategoryPopover -- search common categories + custom input
// ---------------------------------------------------------------------------

function AddFeeCategoryPopover({
  btnRef, existingNames, onAdd, onClose,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  existingNames: string[];
  onAdd: (name: string, frequency?: FeeCategory["frequency"], feeType?: FeeCategory["feeType"]) => void;
  onClose: () => void;
}) {
  const W = 400;
  const ref = useRef<HTMLDivElement>(null);
  const [custom, setCustom] = useState("");
  const [addedCount, setAddedCount] = useState(0);
  const [lastAdded, setLastAdded] = useState("");
  const pos = usePopPos(btnRef, true, W);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || btnRef.current?.contains(t)) return;
      onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [onClose, btnRef]);

  // Clear the "last added" confirmation after 2 seconds
  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(() => setLastAdded(""), 2000);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const handleAdd = (name: string, frequency?: FeeCategory["frequency"], feeType?: FeeCategory["feeType"]) => {
    onAdd(name, frequency, feeType);
    setAddedCount((c) => c + 1);
    setLastAdded(name);
  };

  if (typeof document === "undefined" || !pos) return null;

  return createPortal(
    <div ref={ref} style={{ position: "fixed", top: pos.top, left: pos.left, width: W }} className="max-h-[60vh] rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[var(--foreground)]">Add fee category</span>
          {addedCount > 0 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981]">
              {addedCount} added
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-[var(--background-secondary)] text-[var(--muted)]"><X className="w-4 h-4" /></button>
      </div>
      {/* Confirmation banner */}
      {lastAdded && (
        <div className="px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] text-[13px] font-medium flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          Added "{lastAdded}"
        </div>
      )}
      {/* Custom input */}
      <div className="px-3 py-2 border-b border-[var(--border)] flex items-center gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && custom.trim() && !existingNames.includes(custom.trim())) {
              handleAdd(custom.trim());
              setCustom("");
            }
          }}
          placeholder="Type custom name + Enter"
          autoFocus
          className="flex-1 text-[14px] bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
        {custom.trim() && !existingNames.includes(custom.trim()) && (
          <button
            type="button"
            onClick={() => { handleAdd(custom.trim()); setCustom(""); }}
            className="p-1 text-[#0891B2] hover:bg-[#0891B2]/10 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* Common categories */}
      <div className="flex-1 overflow-y-auto p-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] mb-1.5 px-1">Common categories</p>
        <div className="flex flex-wrap gap-1">
          {COMMON_FEE_CATEGORIES.map((cat) => {
            const isAdded = existingNames.includes(cat.name);
            return (
              <button
                key={cat.name}
                type="button"
                disabled={isAdded}
                onClick={() => handleAdd(cat.name, cat.frequency, cat.feeType)}
                className={cn(
                  "px-2.5 py-1 text-[13px] font-medium rounded-md border transition-colors",
                  isAdded
                    ? "bg-[#0891B2]/10 border-[#0891B2]/30 text-[#0891B2] cursor-default opacity-60"
                    : "bg-[var(--background-secondary)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[#0891B2]/40"
                )}
              >
                {isAdded && <Check className="w-3 h-3 inline mr-1" />}
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// FrequencyPicker -- inline expandable pill (no native select, no scroll block)
// ---------------------------------------------------------------------------

function FrequencyPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const W = 180;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const pos = usePopPos(btnRef, open, W);
  const label = FEE_FREQUENCY_LABELS[value] || value;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:border-[#0891B2]/40 cursor-pointer transition-colors"
      >
        {label} <ChevronDown className={cn("w-2.5 h-2.5 inline ml-0.5 opacity-60 transition-transform", open && "rotate-180")} />
      </button>
      {open && pos && typeof document !== "undefined" && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", top: pos.top, left: pos.left, width: W }}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl z-50 py-1 overflow-hidden"
        >
          {FEE_FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-[13px] transition-colors",
                opt.value === value
                  ? "bg-[#0891B2]/10 text-[#0891B2] font-medium"
                  : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
