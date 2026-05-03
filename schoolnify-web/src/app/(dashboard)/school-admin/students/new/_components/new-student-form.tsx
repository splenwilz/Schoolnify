"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, Trash2, Loader2 } from "lucide-react";
import { useSchoolSetup } from "@/hooks/use-school-setup";
import { useCreateStudent, useUpdateStudent, buildCreateRequest } from "@/hooks/use-students";
import type { Guardian, Student } from "@/types/student";
import { cn } from "@/lib/utils";

interface NewStudentFormProps {
  /** When provided, the form acts as Edit mode */
  initialStudent?: Student;
}

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  gradeLevel: string;
  section: string;
  admissionNumber: string;
  enrollmentDate: string;
  boardingStatus: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  bloodGroup: string;
  genotype: string;
  allergies: string;
  medicalConditions: string;
  previousSchool: string;
  stateOfOrigin: string;
  lga: string;
  religion: string;
  tribe: string;
}

const INITIAL_FORM: FormData = {
  firstName: "", lastName: "", middleName: "", dateOfBirth: "", gender: "",
  gradeLevel: "", section: "", admissionNumber: "", enrollmentDate: new Date().toISOString().slice(0, 10),
  boardingStatus: "Day", phone: "", email: "", address: "", city: "", state: "",
  bloodGroup: "", genotype: "", allergies: "", medicalConditions: "", previousSchool: "",
  stateOfOrigin: "", lga: "", religion: "", tribe: "",
};

const EMPTY_GUARDIAN: Guardian = { firstName: "", lastName: "", phone: "", relationship: "", isPrimary: false };

const GENDERS = ["Male", "Female"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENOTYPES = ["AA", "AS", "SS", "AC", "SC"];
const BOARDING_OPTIONS = ["Day", "Boarding", "Weekly Boarding"];
const RELATIONSHIPS = ["Father", "Mother", "Guardian", "Step-Father", "Step-Mother", "Grandfather", "Grandmother", "Uncle", "Aunt", "Other"];

// ---------------------------------------------------------------------------
// Reusable field components
// ---------------------------------------------------------------------------

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--muted)] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-[14px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:ring-1 focus:ring-[#0891B2]/30 focus:border-[#0891B2]";
const selectCls = cn(inputCls, "cursor-pointer");

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NewStudentForm
// ---------------------------------------------------------------------------

function studentToFormData(s: Student): FormData {
  return {
    firstName: s.firstName,
    lastName: s.lastName,
    middleName: s.middleName ?? "",
    dateOfBirth: s.dateOfBirth,
    gender: s.gender,
    gradeLevel: s.gradeLevel,
    section: s.section ?? "",
    admissionNumber: s.admissionNumber,
    enrollmentDate: s.enrollmentDate,
    boardingStatus: s.boardingStatus,
    phone: s.phone ?? "",
    email: s.email ?? "",
    address: s.address ?? "",
    city: s.city ?? "",
    state: s.state ?? "",
    bloodGroup: s.bloodGroup ?? "",
    genotype: s.genotype ?? "",
    allergies: s.allergies ?? "",
    medicalConditions: s.medicalConditions ?? "",
    previousSchool: s.previousSchool ?? "",
    stateOfOrigin: s.stateOfOrigin ?? "",
    lga: s.lga ?? "",
    religion: s.religion ?? "",
    tribe: s.tribe ?? "",
  };
}

export function NewStudentForm({ initialStudent }: NewStudentFormProps = {}) {
  const router = useRouter();
  const { data: setupData } = useSchoolSetup();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const isEdit = !!initialStudent;
  const [form, setForm] = useState<FormData>(
    initialStudent ? studentToFormData(initialStudent) : INITIAL_FORM
  );
  const [guardians, setGuardians] = useState<Guardian[]>(
    initialStudent && initialStudent.guardians.length > 0
      ? initialStudent.guardians
      : [{ ...EMPTY_GUARDIAN, isPrimary: true }]
  );
  const [saved, setSaved] = useState(false);
  const [localError, setLocalError] = useState("");

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const activeMutation = isEdit ? updateMutation : createMutation;
  const gradeLevels = setupData?.gradeLevels ?? [];
  const country = setupData?.country ?? "NG";
  const isNigerian = country.toUpperCase() === "NG";

  const updateField = (key: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateGuardian = (index: number, field: keyof Guardian, value: string | boolean) => {
    setGuardians((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addGuardian = () => {
    if (guardians.length < 3) setGuardians((prev) => [...prev, { ...EMPTY_GUARDIAN }]);
  };

  const removeGuardian = (index: number) => {
    if (guardians.length > 1) setGuardians((prev) => prev.filter((_, i) => i !== index));
  };

  const trimOrUndef = (s: string) => {
    const t = s.trim();
    return t || undefined;
  };

  const validate = (): string | null => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "First and last name are required.";
    if (!form.dateOfBirth) return "Date of birth is required.";
    const dob = new Date(form.dateOfBirth);
    if (isNaN(dob.getTime())) return "Date of birth is not a valid date.";
    if (dob > new Date()) return "Date of birth cannot be in the future.";
    if (form.enrollmentDate) {
      const enroll = new Date(form.enrollmentDate);
      if (isNaN(enroll.getTime())) return "Enrollment date is not valid.";
      if (enroll < dob) return "Enrollment date cannot be before date of birth.";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Email address is not valid.";
    }
    if (form.phone.trim() && !/^[\d+\-\s()]{6,}$/.test(form.phone.trim())) {
      return "Phone number contains invalid characters.";
    }
    for (const g of guardians) {
      if (g.firstName.trim() && g.email && g.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g.email.trim())) {
        return "Guardian email is not valid.";
      }
      if (g.phone.trim() && !/^[\d+\-\s()]{6,}$/.test(g.phone.trim())) {
        return "Guardian phone contains invalid characters.";
      }
    }
    return null;
  };

  const handleSave = () => {
    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError("");

    const cleanedGuardians: Guardian[] = guardians
      .filter((g) => g.firstName.trim() && g.lastName.trim() && g.phone.trim() && g.relationship)
      .map((g, idx) => ({
        ...g,
        firstName: g.firstName.trim(),
        lastName: g.lastName.trim(),
        phone: g.phone.trim(),
        email: g.email?.trim() || undefined,
        occupation: g.occupation?.trim() || undefined,
        isPrimary: idx === 0 ? true : g.isPrimary,
      }));

    const payload = buildCreateRequest({
      firstName: form.firstName.trim(),
      middleName: trimOrUndef(form.middleName),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender as Student["gender"],
      gradeLevel: form.gradeLevel,
      section: trimOrUndef(form.section),
      admissionNumber: form.admissionNumber.trim(),
      enrollmentDate: form.enrollmentDate,
      boardingStatus: form.boardingStatus as Student["boardingStatus"],
      phone: trimOrUndef(form.phone),
      email: trimOrUndef(form.email),
      address: trimOrUndef(form.address),
      city: trimOrUndef(form.city),
      state: trimOrUndef(form.state),
      bloodGroup: trimOrUndef(form.bloodGroup),
      genotype: trimOrUndef(form.genotype),
      allergies: trimOrUndef(form.allergies),
      medicalConditions: trimOrUndef(form.medicalConditions),
      previousSchool: trimOrUndef(form.previousSchool),
      stateOfOrigin: trimOrUndef(form.stateOfOrigin),
      lga: trimOrUndef(form.lga),
      religion: trimOrUndef(form.religion),
      tribe: trimOrUndef(form.tribe),
      guardians: cleanedGuardians,
    });

    if (isEdit && initialStudent) {
      // Strip admission_number on update (server doesn't accept it)
      const { admission_number: _omit, ...updateData } = payload;
      void _omit;
      updateMutation.mutate(
        { id: initialStudent.id, data: updateData },
        {
          onSuccess: () => {
            if (!isMountedRef.current) return;
            setSaved(true);
            setTimeout(() => {
              if (!isMountedRef.current) return;
              router.push(`/school-admin/students/${initialStudent.id}`);
            }, 1200);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          if (!isMountedRef.current) return;
          setSaved(true);
          setTimeout(() => {
            if (!isMountedRef.current) return;
            router.push("/school-admin/students");
          }, 1500);
        },
      });
    }
  };

  const isValid = form.firstName && form.lastName && form.dateOfBirth && form.gender && form.gradeLevel;

  if (saved) {
    return (
      <div className="py-16 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          {isEdit ? "Changes Saved" : "Student Added"}
        </h2>
        <p className="text-[14px] text-[var(--muted)]">
          {form.firstName} {form.lastName} {isEdit ? "has been updated" : "has been enrolled"}. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Personal Information */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="First Name" required>
            <input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First name" className={inputCls} />
          </Field>
          <Field label="Middle Name">
            <input value={form.middleName} onChange={(e) => updateField("middleName", e.target.value)} placeholder="Middle name" className={inputCls} />
          </Field>
          <Field label="Last Name" required>
            <input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last name" className={inputCls} />
          </Field>
          <Field label="Date of Birth" required>
            <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Gender" required>
            <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} className={selectCls}>
              <option value="">Select...</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Previous School">
            <input value={form.previousSchool} onChange={(e) => updateField("previousSchool", e.target.value)} placeholder="Previous school" className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* Academic */}
      <Section title="Academic Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Grade Level" required>
            <select value={form.gradeLevel} onChange={(e) => updateField("gradeLevel", e.target.value)} className={selectCls}>
              <option value="">Select grade...</option>
              {gradeLevels.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Section">
            <input value={form.section} onChange={(e) => updateField("section", e.target.value)} placeholder="e.g. A, Science" className={inputCls} />
          </Field>
          <Field label="Admission Number">
            <input
              value={form.admissionNumber}
              onChange={(e) => updateField("admissionNumber", e.target.value)}
              placeholder="Auto-generated if blank"
              readOnly={isEdit}
              className={cn(inputCls, isEdit && "opacity-60 cursor-not-allowed")}
            />
          </Field>
          <Field label="Enrollment Date">
            <input type="date" value={form.enrollmentDate} onChange={(e) => updateField("enrollmentDate", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Boarding Status">
            <select value={form.boardingStatus} onChange={(e) => updateField("boardingStatus", e.target.value)} className={selectCls}>
              {BOARDING_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Guardians */}
      <Section title="Guardian(s)">
        <div className="space-y-4">
          {guardians.map((g, i) => (
            <div key={i} className="p-4 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-medium text-[var(--foreground)]">
                  Guardian {i + 1} {g.isPrimary && <span className="text-[11px] text-[#0891B2] ml-1">(Primary)</span>}
                </p>
                {guardians.length > 1 && (
                  <button type="button" onClick={() => removeGuardian(i)} className="p-1 text-[var(--muted)] hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="First Name">
                  <input value={g.firstName} onChange={(e) => updateGuardian(i, "firstName", e.target.value)} placeholder="First name" className={inputCls} />
                </Field>
                <Field label="Last Name">
                  <input value={g.lastName} onChange={(e) => updateGuardian(i, "lastName", e.target.value)} placeholder="Last name" className={inputCls} />
                </Field>
                <Field label="Relationship">
                  <select value={g.relationship} onChange={(e) => updateGuardian(i, "relationship", e.target.value)} className={selectCls}>
                    <option value="">Select...</option>
                    {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Phone">
                  <input value={g.phone} onChange={(e) => updateGuardian(i, "phone", e.target.value)} placeholder="+234..." className={inputCls} />
                </Field>
                <Field label="Email">
                  <input value={g.email ?? ""} onChange={(e) => updateGuardian(i, "email", e.target.value)} placeholder="Email" className={inputCls} />
                </Field>
                <Field label="Occupation">
                  <input value={g.occupation ?? ""} onChange={(e) => updateGuardian(i, "occupation", e.target.value)} placeholder="Occupation" className={inputCls} />
                </Field>
              </div>
            </div>
          ))}
          {guardians.length < 3 && (
            <button type="button" onClick={addGuardian} className="flex items-center gap-1.5 text-[13px] font-medium text-[#0891B2] hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add another guardian
            </button>
          )}
        </div>
      </Section>

      {/* Medical */}
      <Section title="Medical Information">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Blood Group">
            <select value={form.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)} className={selectCls}>
              <option value="">Select...</option>
              {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </Field>
          {isNigerian && (
            <Field label="Genotype">
              <select value={form.genotype} onChange={(e) => updateField("genotype", e.target.value)} className={selectCls}>
                <option value="">Select...</option>
                {GENOTYPES.map((gt) => <option key={gt} value={gt}>{gt}</option>)}
              </select>
            </Field>
          )}
          <Field label="Allergies">
            <input value={form.allergies} onChange={(e) => updateField("allergies", e.target.value)} placeholder="Any known allergies" className={inputCls} />
          </Field>
          <Field label="Medical Conditions">
            <input value={form.medicalConditions} onChange={(e) => updateField("medicalConditions", e.target.value)} placeholder="Any conditions" className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* Regional (Nigeria) */}
      {isNigerian && (
        <Section title="Regional Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="State of Origin">
              <input value={form.stateOfOrigin} onChange={(e) => updateField("stateOfOrigin", e.target.value)} placeholder="e.g. Lagos" className={inputCls} />
            </Field>
            <Field label="Local Government Area">
              <input value={form.lga} onChange={(e) => updateField("lga", e.target.value)} placeholder="e.g. Ikeja" className={inputCls} />
            </Field>
            <Field label="Religion">
              <input value={form.religion} onChange={(e) => updateField("religion", e.target.value)} placeholder="e.g. Christianity, Islam" className={inputCls} />
            </Field>
            <Field label="Tribe / Ethnicity">
              <input value={form.tribe} onChange={(e) => updateField("tribe", e.target.value)} placeholder="e.g. Yoruba, Igbo, Hausa" className={inputCls} />
            </Field>
          </div>
        </Section>
      )}

      {/* Contact */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234..." className={inputCls} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email address" className={inputCls} />
          </Field>
          <Field label="Address">
            <input value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Home address" className={inputCls} />
          </Field>
          <Field label="City">
            <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City / Town" className={inputCls} />
          </Field>
        </div>
      </Section>

      {/* Error */}
      {(localError || activeMutation.error) && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400">
          {localError || (activeMutation.error as Error).message}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() =>
            router.push(
              isEdit && initialStudent
                ? `/school-admin/students/${initialStudent.id}`
                : "/school-admin/students"
            )
          }
          className="px-4 py-2 text-[14px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid || activeMutation.isPending}
          className="px-6 py-2.5 text-[14px] font-medium rounded-lg bg-[#0891B2] text-white hover:bg-[#0E7490] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
        >
          {activeMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </div>
  );
}
