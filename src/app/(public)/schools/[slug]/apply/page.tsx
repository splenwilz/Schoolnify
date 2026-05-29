"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getSchoolBySlug } from "@/lib/school-lookup";
import { StepStudentInfo } from "./_components/step-student-info";
import { StepParentInfo } from "./_components/step-parent-info";
import { StepDocuments } from "./_components/step-documents";
import { StepReview } from "./_components/step-review";
import { ApplicationSuccess } from "./_components/application-success";

interface ApplicationFormData {
  studentName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  previousSchool: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  address: string;
  documents: string[];
  notes: string;
}

const STEPS = [
  { label: "Student Info", number: 1 },
  { label: "Parent/Guardian", number: 2 },
  { label: "Documents", number: 3 },
  { label: "Review & Submit", number: 4 },
];

const INITIAL_FORM_DATA: ApplicationFormData = {
  studentName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  grade: "",
  previousSchool: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  relationship: "",
  address: "",
  documents: [],
  notes: "",
};

function generateTrackingCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `GA-2026-${randomDigits}`;
}

export default function ApplyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const school = getSchoolBySlug(slug);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleFieldChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const validateStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.studentName.trim()) {
        setValidationError("Full Name is required.");
        return false;
      }
      if (!formData.grade) {
        setValidationError("Grade Applying For is required.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.parentName.trim()) {
        setValidationError("Parent/Guardian Name is required.");
        return false;
      }
      if (!formData.parentEmail.trim()) {
        setValidationError("Parent Email is required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    setValidationError("");
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setValidationError("");
  };

  const handleSubmit = () => {
    const code = generateTrackingCode();
    setTrackingCode(code);

    const applicationEntry = {
      id: `app_${Date.now()}`,
      trackingCode: code,
      schoolSlug: slug,
      studentName: formData.studentName,
      email: formData.email,
      phone: formData.phone,
      grade: formData.grade,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "applied",
      parentName: formData.parentName,
      parentEmail: formData.parentEmail,
      parentPhone: formData.parentPhone,
      relationship: formData.relationship,
      address: formData.address,
      previousSchool: formData.previousSchool,
      documents: formData.documents,
      notes: formData.notes,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      statusHistory: [
        {
          status: "applied",
          date: new Date().toISOString().split("T")[0],
          note: "Application submitted online",
        },
      ],
    };

    try {
      const existing = localStorage.getItem("schoolnify_applications");
      const applications = existing ? JSON.parse(existing) : [];
      applications.push(applicationEntry);
      localStorage.setItem("schoolnify_applications", JSON.stringify(applications));
    } catch {
      // Silently continue if localStorage is unavailable
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setSubmitted(false);
    setTrackingCode("");
    setValidationError("");
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10">
            <ApplicationSuccess
              trackingCode={trackingCode}
              studentName={formData.studentName}
              onReset={handleReset}
              trackUrl={`/schools/${slug}/apply/track`}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Apply for Admission
          </h1>
          <p className="text-[var(--muted)] mt-1">
            {school
              ? `Complete the form below to apply to ${school.name}.`
              : "Complete the form below to submit your application."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isActive = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                        isCompleted
                          ? "bg-[#0891B2] border-[#0891B2] text-white"
                          : isActive
                          ? "border-[#0891B2] text-[#0891B2] bg-[#0891B2]/10"
                          : "border-[var(--border)] text-[var(--muted)] bg-[var(--background-secondary)]"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block ${
                        isActive
                          ? "text-[#0891B2]"
                          : isCompleted
                          ? "text-[#0891B2]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mx-2 sm:mx-3 mt-[-1.25rem] sm:mt-[-1.25rem]">
                      <div
                        className={`h-0.5 rounded-full transition-all ${
                          currentStep > step.number
                            ? "bg-[#0891B2]"
                            : "bg-[var(--border)]"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          {/* Validation Error */}
          {validationError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {validationError}
            </div>
          )}

          {/* Step Content */}
          {currentStep === 1 && (
            <StepStudentInfo data={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 2 && (
            <StepParentInfo data={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 3 && (
            <StepDocuments data={formData} onChange={handleFieldChange} />
          )}
          {currentStep === 4 && <StepReview data={formData} />}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-5 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm font-medium hover:bg-[var(--background-secondary)] transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-[#0891B2] text-white text-sm font-medium hover:bg-[#0E7490] transition-colors"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
