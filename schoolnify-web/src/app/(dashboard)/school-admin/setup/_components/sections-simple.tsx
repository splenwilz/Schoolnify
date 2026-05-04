"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Globe, Bell, Palette, Image as ImageIcon } from "lucide-react";
import { SectionCard, Field, Toggle, TextInput, Select } from "./form-primitives";
import { isIdentityComplete, isBrandingComplete, isLocationComplete, isCommsComplete } from "./setup-types";
import type { SetupData } from "./setup-types";
import { SCHOOL_TYPES, OWNERSHIP_TYPES, DATE_FORMATS, LANGUAGES } from "../_constants/setup-data";
import { CountrySelect, StateSelect, CityInput, getCountryDetails } from "./location-picker";
import type { Country, StateInfo } from "./location-picker";

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
      <Field label="Ownership Type" description="How your school is classified: government, private, religious, or community-run">
        <Select value={data.ownershipType} onChange={(v) => update("ownershipType", v)} options={OWNERSHIP_TYPES} />
      </Field>
      <Field label="School Motto" description="Your school's motto or tagline (optional)">
        <TextInput value={data.motto} onChange={(v) => update("motto", v)} placeholder="e.g. Excellence in Education" />
      </Field>
      <Field label="Founded Year" description="Year the school was established (optional)">
        <TextInput value={data.foundedYear} onChange={(v) => update("foundedYear", v)} placeholder="e.g. 1995" type="number" />
      </Field>
      <Field label="Accreditation or Registration ID" description="Official registration or accreditation number, if applicable">
        <TextInput value={data.accreditationNumber} onChange={(v) => update("accreditationNumber", v)} placeholder="e.g. SCH/2024/001" />
      </Field>
      <Field label="Admission Number Prefix" description="Used to auto-generate admission numbers (e.g. INF produces INF/2026/001). Leave blank to use the school's slug.">
        <TextInput value={data.admissionNumberPrefix} onChange={(v) => update("admissionNumberPrefix", v.toUpperCase())} placeholder="e.g. INF" />
      </Field>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// 2. LocationSection
// ---------------------------------------------------------------------------

export function LocationSection({ data, update, expanded, toggleSection }: SectionProps) {
  const [countryTimezones, setCountryTimezones] = useState<{ label: string; value: string }[]>([]);
  const [countryMeta, setCountryMeta] = useState<Country | null>(null);

  // Auto-detect country from IP on first load (only when country is empty)
  useEffect(() => {
    if (data.country) return;
    const controller = new AbortController();
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => r.json())
      .then((geo: { country_code?: string }) => {
        if (geo.country_code && !data.country) {
          update("country", geo.country_code);
        }
      })
      .catch(() => { /* silent fail -- admin picks manually */ });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When country changes: capture meta for currency display + auto-fill
  const handleCountryMeta = useCallback(
    (country: Country | null) => {
      setCountryMeta(country);
      if (!country) {
        setCountryTimezones([]);
        return;
      }
      // Auto-fill currency whenever country changes (overwrites previous)
      if (country.currency) {
        update("currency", country.currency);
      }
    },
    [update]
  );

  // Load timezones when country changes
  useEffect(() => {
    if (!data.country) {
      setCountryTimezones([]);
      return;
    }
    getCountryDetails(data.country).then((c) => {
      if (!c?.timezones) return;
      interface ApiTz { zoneName: string; gmtOffsetName?: string }
      const opts = (c.timezones as ApiTz[]).map((tz) => ({
        label: `${tz.zoneName}${tz.gmtOffsetName ? ` (${tz.gmtOffsetName})` : ""}`,
        value: tz.zoneName,
      }));
      setCountryTimezones(opts);
      // Auto-fill timezone if country has only one (most countries)
      if (opts.length === 1) {
        update("timezone", opts[0].value);
      }
      // For countries with multiple timezones (US, Canada, Russia, etc.),
      // don't auto-pick — wait for state selection or user choice
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.country]);

  // When state changes: state's timezone takes precedence over country-level default
  const handleStateMeta = useCallback(
    (state: StateInfo | null) => {
      if (state?.timezone) {
        update("timezone", state.timezone);
      }
    },
    [update]
  );

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
        <CountrySelect
          value={data.country}
          onChange={(v) => {
            update("country", v);
            // Reset dependent fields when country changes
            update("stateRegion", "");
            update("city", "");
            update("timezone", "");
          }}
          onCountryMeta={handleCountryMeta}
        />
      </Field>
      <Field label="State / Region" description="State, province, or region">
        <StateSelect
          countryCode={data.country}
          value={data.stateRegion}
          onChange={(v) => {
            update("stateRegion", v);
            update("city", "");
          }}
          onStateMeta={handleStateMeta}
        />
      </Field>
      <Field label="City" description="City or town">
        <CityInput
          countryCode={data.country}
          stateCode={data.stateRegion}
          value={data.city}
          onChange={(v) => update("city", v)}
        />
      </Field>
      <Field
        label="Timezone"
        description={
          countryTimezones.length > 1
            ? "We set it from your state. Change if needed."
            : "Based on your country"
        }
      >
        {countryTimezones.length > 0 ? (
          <Select value={data.timezone} onChange={(v) => update("timezone", v)} options={countryTimezones} />
        ) : (
          <input
            disabled
            placeholder="Select a country first"
            className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--muted)] cursor-not-allowed"
          />
        )}
      </Field>
      <Field label="Currency" description="Based on your country">
        {data.currency ? (
          <div className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] flex items-center justify-between">
            <span>
              {countryMeta?.currency_symbol && <span className="mr-2 font-semibold">{countryMeta.currency_symbol}</span>}
              {data.currency}
              {countryMeta?.currency_name && <span className="text-[var(--muted)] ml-2">({countryMeta.currency_name})</span>}
            </span>
          </div>
        ) : (
          <input
            disabled
            placeholder="Select a country first"
            className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--muted)] cursor-not-allowed"
          />
        )}
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
// 3. CommunicationSection
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
              <span className="text-sm text-[var(--muted)]">Click to upload logo</span>
              <span className="text-[14px] text-[var(--muted)]/60">PNG, JPG, SVG up to 2MB</span>
              <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden"
                onChange={(e) => { const file = e.target.files?.[0]; if (!file || file.size > 2 * 1024 * 1024) return; const reader = new FileReader(); reader.onload = () => update("logoUrl", reader.result as string); reader.readAsDataURL(file); }}
              />
            </label>
            {data.logoUrl && (
              <button type="button" onClick={() => update("logoUrl", "")} className="mt-2 text-sm text-[#EF4444] hover:underline">Remove logo</button>
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
        <p className="text-sm font-medium text-[var(--muted)] uppercase tracking-wider mb-3">Login Page Preview</p>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden h-[280px] max-w-[540px] flex text-[14px]">
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
              <p className="font-bold text-[15px] text-[var(--foreground)] mb-0.5">Welcome Back</p>
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
