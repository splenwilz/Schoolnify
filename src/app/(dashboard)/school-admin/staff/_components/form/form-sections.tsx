"use client";

import { useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { CONTRACT_TYPE_LABEL, EMPLOYER_LABEL, PERMISSION_ROLE_LABEL } from "@/types/staff";
import { CONTRACT_TYPES, EMPLOYERS, GENDER_OPTIONS, PERMISSION_ROLES, type StaffFormInput, type StaffFormValues } from "@/lib/staff/schema";
import { useId } from "react";
import { AddLink, CheckboxField, FormSection, RepeatBlock, SelectField, TextField, asOptions } from "./fields";

type Form = UseFormReturn<StaffFormInput, unknown, StaffFormValues>;

const MAX_EMERGENCY_CONTACTS = 3;

export function IdentitySection({ form }: { form: Form }) {
  const { register, formState: { errors } } = form;
  return (
    <FormSection title="Personal Information">
      <TextField label="First name" required placeholder="First name" autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
      <TextField label="Middle name" placeholder="Middle name" autoComplete="additional-name" error={errors.middleName?.message} {...register("middleName")} />
      <TextField label="Last name" required placeholder="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
      <TextField label="Title" placeholder="Mr, Mrs, Dr, Rev. Fr., Alhaji" error={errors.title?.message} {...register("title")} />
      <TextField label="Preferred name" placeholder="Shown instead of the full name" error={errors.preferredName?.message} {...register("preferredName")} />
      <SelectField label="Gender" placeholder="Select..." options={GENDER_OPTIONS.map((g) => ({ value: g, label: g[0].toUpperCase() + g.slice(1) }))} error={errors.gender?.message} {...register("gender")} />
      <TextField label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
    </FormSection>
  );
}

export function ContactSection({ form }: { form: Form }) {
  const { register, control, formState: { errors } } = form;
  const contacts = useFieldArray({ control, name: "emergencyContacts" });
  const primaryFlags = useWatch({ control, name: "emergencyContacts" }) ?? [];
  const listId = useId();
  const arrayError = errors.emergencyContacts?.root?.message ?? errors.emergencyContacts?.message;
  return (
    <>
      <FormSection title="Contact Information" description="At least one of a work email or a phone number. Many staff only have a phone." columns={2}>
        <TextField label="Work email" type="email" placeholder="Email address" autoComplete="email" inputMode="email" description="Used to sign in when present." error={errors.email?.message} {...register("email")} />
        <TextField label="Phone" type="tel" placeholder="0803 123 4567 or +234..." autoComplete="tel" inputMode="tel" error={errors.phone?.message} {...register("phone")} />
      </FormSection>

      <section aria-labelledby={listId} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <h3 id={listId} className="text-[15px] font-semibold text-[var(--foreground)] mb-4">Emergency Contact(s)</h3>
        <div className="space-y-4">
          {arrayError && <p role="alert" className="text-[12px] text-[var(--error)]">{String(arrayError)}</p>}
          {contacts.fields.length === 0 && <p className="text-[13px] text-[var(--muted)]">No emergency contact yet. Add one so the school can reach someone in an emergency.</p>}
          {contacts.fields.map((field, i) => (
            <RepeatBlock key={field.id} title={`Contact ${i + 1}`} badge={primaryFlags[i]?.isPrimary ? "Primary" : undefined} onRemove={() => contacts.remove(i)} removeLabel={`Remove emergency contact ${i + 1}`}>
              <TextField label="Contact name" required placeholder="Full name" error={errors.emergencyContacts?.[i]?.name?.message} {...register(`emergencyContacts.${i}.name` as const)} />
              <TextField label="Relationship" required placeholder="Spouse, sibling, parent" error={errors.emergencyContacts?.[i]?.relationship?.message} {...register(`emergencyContacts.${i}.relationship` as const)} />
              <TextField label="Contact phone" required type="tel" inputMode="tel" placeholder="+234..." error={errors.emergencyContacts?.[i]?.phone?.message} {...register(`emergencyContacts.${i}.phone` as const)} />
              <CheckboxField label="Primary contact" {...register(`emergencyContacts.${i}.isPrimary` as const)} />
            </RepeatBlock>
          ))}
          {contacts.fields.length < MAX_EMERGENCY_CONTACTS && (
            <AddLink onClick={() => contacts.append({ name: "", relationship: "", phone: "", isPrimary: contacts.fields.length === 0 })}>
              {contacts.fields.length === 0 ? "Add emergency contact" : "Add another emergency contact"}
            </AddLink>
          )}
        </div>
      </section>
    </>
  );
}

export function ContractSection({ form, mode }: { form: Form; mode: "create" | "edit" }) {
  const { register, formState: { errors } } = form;
  return (
    <FormSection title="Contract" description="Who employs or pays this person, and on what terms. Pay itself lives in Payroll.">
      <SelectField label="Employer" options={asOptions(EMPLOYERS, EMPLOYER_LABEL)} description="Who pays: the school, a government board, the PTA, a mission, NYSC, an agency." error={errors.employer?.message} {...register("employer")} />
      <SelectField label="Contract type" options={asOptions(CONTRACT_TYPES, CONTRACT_TYPE_LABEL)} error={errors.contractType?.message} {...register("contractType")} />
      {mode === "create" ? (
        <TextField label="Hire date" required type="date" error={errors.hireDate?.message} {...register("hireDate")} />
      ) : (
        <TextField label="Contract start" required type="date" description="Start of this contract. The original hire date stays on the profile." error={errors.hireDate?.message} {...register("hireDate")} />
      )}
      <TextField label="Contract end" type="date" description="Required for fixed term, corps members, trainees and supply staff." error={errors.contractEndDate?.message} {...register("contractEndDate")} />
      <TextField label="Probation end" type="date" error={errors.probationEndDate?.message} {...register("probationEndDate")} />
      <TextField label="FTE (%)" type="number" min={1} max={100} step={1} inputMode="numeric" description="Share of a full-time role, 1 to 100." error={errors.ftePercent?.message} {...register("ftePercent")} />
      <CheckboxField label="Term-time only" description="Works school terms only; affects days lost and pro-rata calculations." error={errors.isTermTimeOnly?.message} {...register("isTermTimeOnly")} />
    </FormSection>
  );
}

export function JobSection({ form, managers, departments }: { form: Form; managers: readonly { id: string; name: string }[]; departments: readonly string[] }) {
  const { register, formState: { errors } } = form;
  const departmentListId = useId();
  return (
    <FormSection title="Job" description="The primary post. Additional roles go under Responsibilities. Employment status is not set here: it follows the hire date and recorded events such as suspensions and exits.">
      <TextField label="Designation" required placeholder="e.g. Teacher, Bursar, Driver" error={errors.designation?.message} {...register("designation")} />
      <TextField label="Department" required list={departmentListId} autoComplete="off" placeholder="Pick or type a department" error={errors.department?.message} {...register("department")} />
      <datalist id={departmentListId}>
        {departments.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>
      <SelectField label="Category" options={[{ value: "academic", label: "Academic" }, { value: "support", label: "Support" }]} error={errors.staffCategory?.message} {...register("staffCategory")} />
      <SelectField label="Reports to" placeholder="No manager" options={managers.map((m) => ({ value: m.id, label: m.name }))} error={errors.reportsToId?.message} {...register("reportsToId")} />
      <TextField label="Grade level" placeholder="e.g. GL 08 or T2" description="Public-service grade or the school's own band. Amounts live in Payroll." error={errors.gradeLevel?.message} {...register("gradeLevel")} />
      <TextField label="Employee number" placeholder="Auto-generated if blank" error={errors.employeeNumber?.message} {...register("employeeNumber")} />
      <CheckboxField label="Eligible to teach" description="Can be assigned to classes as a class or subject teacher." error={errors.isTeacher?.message} {...register("isTeacher")} />
    </FormSection>
  );
}

export function ResponsibilitiesSection({ form }: { form: Form }) {
  const { register, control, formState: { errors } } = form;
  const roles = useFieldArray({ control, name: "responsibilities" });
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4">
        <h3 id={headingId} className="text-[15px] font-semibold text-[var(--foreground)]">Responsibilities</h3>
        <p className="text-[12.5px] text-[var(--muted)] mt-0.5">Head of department, form teacher, housemaster, exam officer, games master. Each is dated and can carry an allowance code.</p>
      </div>
      <div className="space-y-4">
        {roles.fields.length === 0 && <p className="text-[13px] text-[var(--muted)]">No additional responsibilities.</p>}
        {roles.fields.map((field, i) => (
          <RepeatBlock key={field.id} title={`Responsibility ${i + 1}`} onRemove={() => roles.remove(i)} removeLabel={`Remove responsibility ${i + 1}`}>
            <TextField label="Responsibility title" required placeholder="Head of Department" error={errors.responsibilities?.[i]?.designation?.message} {...register(`responsibilities.${i}.designation` as const)} />
            <TextField label="Allowance code" placeholder="HOD" error={errors.responsibilities?.[i]?.allowanceCode?.message} {...register(`responsibilities.${i}.allowanceCode` as const)} />
            <TextField label="Responsibility start" required type="date" error={errors.responsibilities?.[i]?.startDate?.message} {...register(`responsibilities.${i}.startDate` as const)} />
            <TextField label="Responsibility end" type="date" error={errors.responsibilities?.[i]?.endDate?.message} {...register(`responsibilities.${i}.endDate` as const)} />
          </RepeatBlock>
        ))}
        <AddLink onClick={() => roles.append({ designation: "", department: "", allowanceCode: "", startDate: "", endDate: "" })}>
          {roles.fields.length === 0 ? "Add responsibility" : "Add another responsibility"}
        </AddLink>
      </div>
    </section>
  );
}

export function AccessSection({ form, mode }: { form: Form; mode: "create" | "edit" }) {
  const { register, formState: { errors } } = form;
  return (
    <FormSection title="Access" description="What this person can do in Schoolnify. An invite goes to the work email, or by SMS to the phone when there is no email." columns={2}>
      <SelectField label="Permission role" options={asOptions(PERMISSION_ROLES, PERMISSION_ROLE_LABEL)} description="Coarse role until configurable roles exist." error={errors.permissionRole?.message} {...register("permissionRole")} />
      {mode === "create" && (
        <CheckboxField label="Send invite now" description="You can also do this later from the profile. Staff with neither email nor phone cannot be invited." error={errors.sendInvite?.message} {...register("sendInvite")} />
      )}
    </FormSection>
  );
}
