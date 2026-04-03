"use client";

import { Building2, Globe, FileText, Bell, Palette, Image as ImageIcon } from "lucide-react";
import { SectionCard, Field, Toggle, TextInput, Select, SearchableSelect } from "./form-primitives";
import { isIdentityComplete, isBrandingComplete, isLocationComplete, isReportCardComplete, isCommsComplete } from "./setup-types";
import type { SetupData } from "./setup-types";
import { SCHOOL_TYPES, COUNTRIES, TIMEZONES, CURRENCIES, DATE_FORMATS, LANGUAGES, REPORT_CARD_TEMPLATES } from "../_constants/setup-data";

// ---------------------------------------------------------------------------
// Shared Props
// ---------------------------------------------------------------------------

interface SectionProps {
  data: SetupData;
  update: <K extends keyof SetupData>(key: K, value: SetupData[K]) => void;
  expanded: string;
  toggleSection: (id: string) => void;
}

// ---------------------------------------------------------------------------
// 1. IdentitySection
// ---------------------------------------------------------------------------

export function IdentitySection({ data, update, expanded, toggleSection }: SectionProps) {
  return (
    <SectionCard
      id="identity"
      title="School Identity"
      description="Basic information about your institution"
      icon={<Building2 className="w-5 h-5" />}
      isComplete={isIdentityComplete(data)}
      isExpanded={expanded === "identity"}
      onToggle={() => toggleSection("identity")}
    >
      <Field label="School Type" description="What kind of institution is this?">
        <Select value={data.schoolType} onChange={(v) => update("schoolType", v)} options={SCHOOL_TYPES} />
      </Field>
      <Field label="School Motto" description="Your school's motto or tagline">
        <TextInput value={data.motto} onChange={(v) => update("motto", v)} placeholder="e.g. Excellence in Education" />
      </Field>
      <Field label="Founded Year" description="Year the school was established">
        <TextInput value={data.foundedYear} onChange={(v) => update("foundedYear", v)} placeholder="e.g. 1995" type="number" />
      </Field>
      <Field label="Accreditation Number" description="Official accreditation or registration number">
        <TextInput value={data.accreditationNumber} onChange={(v) => update("accreditationNumber", v)} placeholder="e.g. SCH/2024/001" />
      </Field>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// 2. LocationSection
// ---------------------------------------------------------------------------

export function LocationSection({ data, update, expanded, toggleSection }: SectionProps) {
  const countryOptions = COUNTRIES.map((c) => ({ label: c, value: c }));

  return (
    <SectionCard
      id="location"
      title="Location & Regional"
      description="Geographic and regional preferences"
      icon={<Globe className="w-5 h-5" />}
      isComplete={isLocationComplete(data)}
      isExpanded={expanded === "location"}
      onToggle={() => toggleSection("location")}
    >
      <Field label="Country" description="Country where the school is located">
        <SearchableSelect
          value={data.country}
          onChange={(v) => update("country", v)}
          options={countryOptions}
          placeholder="Search country..."
        />
      </Field>
      <Field label="State / Region" description="State, province, or region">
        <TextInput value={data.stateRegion} onChange={(v) => update("stateRegion", v)} placeholder="e.g. Lagos" />
      </Field>
      <Field label="City" description="City or town">
        <TextInput value={data.city} onChange={(v) => update("city", v)} placeholder="e.g. Ikeja" />
      </Field>
      <Field label="Timezone" description="Your school's timezone">
        <SearchableSelect
          value={data.timezone}
          onChange={(v) => update("timezone", v)}
          options={TIMEZONES}
          placeholder="Search timezone..."
        />
      </Field>
      <Field label="Currency" description="Currency for fee management">
        <Select value={data.currency} onChange={(v) => update("currency", v)} options={CURRENCIES} />
      </Field>
      <Field label="Date Format" description="How dates are displayed">
        <Select value={data.dateFormat} onChange={(v) => update("dateFormat", v)} options={DATE_FORMATS} />
      </Field>
      <Field label="Language" description="Primary language of instruction">
        <Select value={data.language} onChange={(v) => update("language", v)} options={LANGUAGES} />
      </Field>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// 3. ReportCardSection
// ---------------------------------------------------------------------------

export function ReportCardSection({ data, update, expanded, toggleSection }: SectionProps) {
  return (
    <SectionCard
      id="reportcard"
      title="Report Card"
      description="Configure report card generation and layout"
      icon={<FileText className="w-5 h-5" />}
      isComplete={isReportCardComplete(data)}
      isExpanded={expanded === "reportcard"}
      onToggle={() => toggleSection("reportcard")}
    >
      <Field label="Default Template" description="Template used for generating report cards">
        <Select value={data.reportTemplate} onChange={(v) => update("reportTemplate", v)} options={REPORT_CARD_TEMPLATES} />
      </Field>
      <Field label="Show Class Position" description="Display student ranking in class">
        <Toggle checked={data.showPosition} onChange={(v) => update("showPosition", v)} />
      </Field>
      <Field label="Show GPA" description="Display GPA on report card">
        <Toggle checked={data.showGPA} onChange={(v) => update("showGPA", v)} />
      </Field>
      <Field label="Teacher Comments" description="Include teacher comments section">
        <Toggle checked={data.showTeacherComments} onChange={(v) => update("showTeacherComments", v)} />
      </Field>
      <Field label="Principal Signature" description="Include principal signature line">
        <Toggle checked={data.showPrincipalSignature} onChange={(v) => update("showPrincipalSignature", v)} />
      </Field>
      <Field label="Attendance Summary" description="Show term attendance record on report card">
        <Toggle checked={data.showAttendanceSummary} onChange={(v) => update("showAttendanceSummary", v)} />
      </Field>
      <Field label="Behavior / Conduct Rating" description="Include behavior or conduct assessment">
        <Toggle checked={data.showBehaviorRating} onChange={(v) => update("showBehaviorRating", v)} />
      </Field>
      <Field label="Subject Teacher Signatures" description="Include signature line per subject teacher">
        <Toggle checked={data.showSubjectTeacherSignature} onChange={(v) => update("showSubjectTeacherSignature", v)} />
      </Field>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// 4. CommunicationSection
// ---------------------------------------------------------------------------

export function CommunicationSection({ data, update, expanded, toggleSection }: SectionProps) {
  return (
    <SectionCard
      id="comms"
      title="Communication & Notifications"
      description="Notification preferences and communication channels"
      icon={<Bell className="w-5 h-5" />}
      isComplete={isCommsComplete(data)}
      isExpanded={expanded === "comms"}
      onToggle={() => toggleSection("comms")}
    >
      <Field label="Parent Portal" description="Allow parents to view student information">
        <Toggle checked={data.parentPortal} onChange={(v) => update("parentPortal", v)} />
      </Field>
      <Field label="Report Card Comments" description="Enable teacher comments on report cards">
        <Toggle checked={data.reportComments} onChange={(v) => update("reportComments", v)} />
      </Field>
      <Field label="Attendance Alerts" description="Notify parents of student absences">
        <Toggle checked={data.attendanceAlerts} onChange={(v) => update("attendanceAlerts", v)} />
      </Field>
      <Field label="Fee Reminders" description="Send automated fee payment reminders">
        <Toggle checked={data.feeReminders} onChange={(v) => update("feeReminders", v)} />
      </Field>
      <Field label="Exam Result Notifications" description="Notify when exam results are published">
        <Toggle checked={data.examResultNotify} onChange={(v) => update("examResultNotify", v)} />
      </Field>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// 5. BrandingSection
// ---------------------------------------------------------------------------

export function BrandingSection({ data, update, expanded, toggleSection }: SectionProps) {
  return (
    <SectionCard
      id="branding"
      title="Branding & Appearance"
      description="Customize your school's login page and portal look"
      icon={<Palette className="w-5 h-5" />}
      isComplete={isBrandingComplete(data)}
      isExpanded={expanded === "branding"}
      onToggle={() => toggleSection("branding")}
    >
      <Field label="School Logo" description="Square image, at least 200x200px. Displayed on your login page and portal.">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {data.logoUrl ? (
              <div className="w-16 h-16 rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--background-secondary)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.logoUrl} alt="School logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}>
                {data.motto ? data.motto.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "AB"}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center w-full h-20 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--foreground)]/30 bg-[var(--background-secondary)]/50 cursor-pointer transition-colors">
              <ImageIcon className="w-5 h-5 text-[var(--muted)] mb-1" />
              <span className="text-xs text-[var(--muted)]">Click to upload logo</span>
              <span className="text-[10px] text-[var(--muted)]/60">PNG, JPG, SVG up to 2MB</span>
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (!file || file.size > 2 * 1024 * 1024) return; const reader = new FileReader(); reader.onload = () => update("logoUrl", reader.result as string); reader.readAsDataURL(file); }}
              />
            </label>
            {data.logoUrl && (
              <button type="button" onClick={() => update("logoUrl", "")} className="mt-2 text-xs text-[#EF4444] hover:underline">Remove logo</button>
            )}
          </div>
        </div>
      </Field>
      <Field label="Primary Brand Color" description="Main accent color used on your login page and portal">
        <div className="flex items-center gap-3">
          <input type="color" value={data.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent p-0.5" />
          <TextInput value={data.primaryColor} onChange={(v) => update("primaryColor", v)} placeholder="#0891B2" />
        </div>
      </Field>
      <Field label="Secondary Brand Color" description="Used for gradients and accents alongside the primary color">
        <div className="flex items-center gap-3">
          <input type="color" value={data.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent p-0.5" />
          <TextInput value={data.secondaryColor} onChange={(v) => update("secondaryColor", v)} placeholder="#10B981" />
        </div>
      </Field>

      {/* Live Preview */}
      <div className="col-span-full mt-2">
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">Login Page Preview</p>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden h-[280px] max-w-[540px] flex text-[10px]">
          <div className="w-[48%] bg-[var(--background)] flex flex-col justify-between p-5">
            <p className="text-[8px] text-[var(--muted)]">Your School</p>
            <div>
              {data.logoUrl ? (
                <div className="w-8 h-8 rounded-lg mb-3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.logoUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white text-[8px] font-bold" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}>
                  {data.motto ? data.motto.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "AB"}
                </div>
              )}
              <p className="font-bold text-[11px] text-[var(--foreground)] mb-0.5">Welcome Back</p>
              <p className="text-[8px] text-[var(--muted)] mb-3">Sign in to your school portal</p>
              <div className="w-full h-px bg-[var(--border)] mb-3" />
              <p className="text-[8px] font-medium text-[var(--foreground)] mb-1">Email</p>
              <div className="w-full h-6 rounded border border-[var(--border)] bg-[var(--card)] mb-2 flex items-center px-2"><span className="text-[7px] text-[var(--muted)]">you@school.edu</span></div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[8px] font-medium text-[var(--foreground)]">Password</p>
                <p className="text-[7px]" style={{ color: data.primaryColor }}>Forgot?</p>
              </div>
              <div className="w-full h-6 rounded border border-[var(--border)] bg-[var(--card)] mb-3 flex items-center px-2"><span className="text-[7px] text-[var(--muted)]">........</span></div>
              <div className="w-full h-7 rounded flex items-center justify-center text-white text-[8px] font-semibold" style={{ background: `linear-gradient(135deg, ${data.primaryColor}dd, ${data.primaryColor})` }}>Sign in</div>
            </div>
            <p className="text-[7px] text-[var(--muted)]">Powered by <span className="font-semibold text-[var(--foreground)]">Schoolni<span style={{ color: data.primaryColor }}>fy</span></span></p>
          </div>
          <div className="w-[52%] relative overflow-hidden flex flex-col justify-between p-5" style={{ background: `linear-gradient(160deg, ${data.primaryColor}, ${data.primaryColor}cc, ${data.secondaryColor}99)` }}>
            <div className="relative z-10 flex items-center justify-between">
              <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                {data.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.logoUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-white text-[6px] font-bold">{data.motto ? data.motto.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "AB"}</span>
                )}
              </div>
              <p className="text-[6px] text-white/40 italic">&ldquo;{data.motto || "Your motto"}&rdquo;</p>
            </div>
            <div className="relative z-10">
              <p className="text-white font-bold text-[14px] leading-tight mb-1">Your School</p>
              <div className="w-6 h-0.5 bg-white/20 mb-1.5" />
              <p className="text-white/50 text-[7px] max-w-[80%]">Sign in to access your portal</p>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-400/80" /><p className="text-[6px] text-white/40">Secure</p></div>
              <p className="text-[6px] text-white/30">Powered by Schoolnify</p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
