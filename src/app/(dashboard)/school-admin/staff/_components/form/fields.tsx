"use client";

import { useId, type ReactNode, type Ref, type SelectHTMLAttributes, type InputHTMLAttributes } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible field primitives in the same visual language as the student
 * enrolment form: muted 13px labels, filled controls on the secondary
 * background with a brand focus ring, bordered section cards. Description and
 * error are wired through aria-describedby, aria-invalid on error, and the
 * error is announced via role="alert". `ref` is a plain prop (React 19).
 */

/** Select options from an enum tuple and its label map. */
export const asOptions = <T extends string>(keys: readonly T[], labels: Record<T, string>) => keys.map((value) => ({ value, label: labels[value] }));

interface FieldShellProps {
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined }) => ReactNode;
}

function FieldShell({ label, description, error, required, className, children }: FieldShellProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const errId = `${id}-err`;
  const describedBy = [description ? descId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[13px] font-medium text-[var(--muted)] mb-1">
        {label}
        {required && (
          <span className="text-[var(--error)] ml-1" aria-hidden="true">*</span>
        )}
      </label>
      {children({ id, describedBy })}
      {description && (
        <p id={descId} className="mt-1 text-[11.5px] text-[var(--muted)]">{description}</p>
      )}
      {error && (
        <p id={errId} role="alert" className="mt-1 text-[12px] text-[var(--error)]">{error}</p>
      )}
    </div>
  );
}

export const controlClass =
  "w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] disabled:opacity-60 disabled:cursor-not-allowed";

type TextFieldProps = Omit<FieldShellProps, "children"> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required" | "className"> & { ref?: Ref<HTMLInputElement> };

export function TextField({ label, description, error, required, className, ref, ...input }: TextFieldProps) {
  return (
    <FieldShell label={label} description={description} error={error} required={required} className={className}>
      {({ id, describedBy }) => (
        <input
          id={id}
          ref={ref}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, error ? "border-[var(--error)]" : "border-[var(--border)]")}
          {...input}
        />
      )}
    </FieldShell>
  );
}

type SelectFieldProps = Omit<FieldShellProps, "children"> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required" | "className"> & {
    ref?: Ref<HTMLSelectElement>;
    options: readonly { value: string; label: string }[];
    placeholder?: string;
  };

export function SelectField({ label, description, error, required, className, ref, options, placeholder, ...select }: SelectFieldProps) {
  return (
    <FieldShell label={label} description={description} error={error} required={required} className={className}>
      {({ id, describedBy }) => (
        <select
          id={id}
          ref={ref}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(controlClass, "cursor-pointer pr-8", error ? "border-[var(--error)]" : "border-[var(--border)]")}
          {...select}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  label: string;
  description?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "className">;

export function CheckboxField({ label, description, error, ref, className, ...input }: CheckboxFieldProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const errId = `${id}-err`;
  const describedBy = [description ? descId : null, error ? errId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1 pt-1", className)}>
      <label htmlFor={id} className="inline-flex items-start gap-2.5 cursor-pointer">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="mt-0.5 w-4 h-4 rounded border-[var(--border)] accent-[var(--brand)]"
          {...input}
        />
        <span className="text-[13px] text-[var(--foreground)]">{label}</span>
      </label>
      {description && <p id={descId} className="text-[11.5px] text-[var(--muted)] pl-6.5">{description}</p>}
      {error && <p id={errId} role="alert" className="text-[12px] text-[var(--error)] pl-6.5">{error}</p>}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  /** Field columns at the sm breakpoint and up. */
  columns?: 2 | 3;
  children: ReactNode;
}

export function FormSection({ title, description, columns = 3, children }: FormSectionProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4">
        <h3 id={id} className="text-[15px] font-semibold text-[var(--foreground)]">{title}</h3>
        {description && <p className="text-[12.5px] text-[var(--muted)] mt-0.5">{description}</p>}
      </div>
      <div className={cn("grid grid-cols-1 gap-4", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>{children}</div>
    </section>
  );
}

/** One entry of a repeatable group (an emergency contact, a responsibility), styled like a guardian card. */
export function RepeatBlock({ title, badge, onRemove, removeLabel, children }: { title: string; badge?: string; onRemove?: () => void; removeLabel: string; children: ReactNode }) {
  return (
    <div className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-medium text-[var(--foreground)]">
          {title}
          {badge && <span className="text-[11px] text-[var(--brand)] ml-1">({badge})</span>}
        </p>
        {onRemove && (
          <button type="button" onClick={onRemove} aria-label={removeLabel} className="p-1 text-[var(--muted)] hover:text-[var(--error)] transition-colors">
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

export function AddLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--brand)] hover:underline">
      <Plus className="w-3.5 h-3.5" aria-hidden="true" /> {children}
    </button>
  );
}
