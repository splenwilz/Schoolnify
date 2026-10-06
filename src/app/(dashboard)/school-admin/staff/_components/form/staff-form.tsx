"use client";

import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { StaffDetail } from "@/types/staff";
import { staffFormDefaults, staffFormSchemaFor, toStaffInput, type StaffCreateInput, type StaffFormInput, type StaffFormValues } from "@/lib/staff/schema";
import { staffDetailToFormInput } from "@/lib/staff/form-input";
import { AccessSection, ContactSection, ContractSection, IdentitySection, JobSection, ResponsibilitiesSection } from "./form-sections";

export interface StaffFormProps {
  mode: "create" | "edit";
  initial?: StaffDetail;
  /** Request-time date from the server page; drives the age and contract rules and the edit pre-fill. */
  today: string;
  /** ISO 3166-1 alpha-2 of the school, for national phone numbers. */
  country: string;
  managers: readonly { id: string; name: string }[];
  departments: readonly string[];
  /** Receives the create shape and the raw normalised form values. Throw to show a submit error. */
  onSubmit: (input: StaffCreateInput, values: StaffFormValues) => Promise<void>;
  onCancel: () => void;
}

export function StaffForm({ mode, initial, today, country, managers, departments, onSubmit, onCancel }: StaffFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const errorTitleId = useId();
  const schema = useMemo(() => staffFormSchemaFor({ country, today }), [country, today]);

  const form = useForm<StaffFormInput, unknown, StaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? staffDetailToFormInput(initial, today) : staffFormDefaults(),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(toStaffInput(values), values);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  const managerOptions = managers.filter((m) => m.id !== initial?.id);

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <IdentitySection form={form} />
      <ContactSection form={form} />
      <ContractSection form={form} mode={mode} />
      <JobSection form={form} managers={managerOptions} departments={departments} />
      <ResponsibilitiesSection form={form} today={today} />
      <AccessSection form={form} mode={mode} />

      {submitError && (
        <div role="alert" aria-labelledby={errorTitleId} className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          <strong id={errorTitleId} className="font-semibold">Could not save</strong>
          <span> {submitError}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-60">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 text-[14px] font-medium rounded-lg bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? "Saving..." : mode === "create" ? "Add Staff Member" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
