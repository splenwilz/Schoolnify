"use client";

import { useEffect, useState } from "react";
import { SearchableSelect, TextInput } from "./form-primitives";

interface Country {
  iso2: string;
  name: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  emoji: string;
}

interface StateInfo {
  iso2: string;
  name: string;
  timezone?: string | null;
}

interface CityInfo {
  name: string;
  timezone?: string | null;
}

// ---------------------------------------------------------------------------
// Country picker (cached, loads once)
// ---------------------------------------------------------------------------

let countryCache: Country[] | null = null;

async function loadCountries(): Promise<Country[]> {
  if (countryCache) return countryCache;
  const res = await fetch("/api/geo/countries");
  if (!res.ok) return [];
  countryCache = await res.json();
  return countryCache!;
}

export function CountrySelect({
  value,
  onChange,
  onCountryMeta,
}: {
  value: string;
  onChange: (iso2: string) => void;
  onCountryMeta?: (country: Country | null) => void;
}) {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  useEffect(() => {
    const match = countries.find((c) => c.iso2 === value);
    onCountryMeta?.(match ?? null);
  }, [value, countries, onCountryMeta]);

  const options = countries.map((c) => ({
    label: `${c.emoji} ${c.name}`,
    value: c.iso2,
  }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={countries.length === 0 ? "Loading countries..." : "Search country..."}
    />
  );
}

// ---------------------------------------------------------------------------
// State picker (depends on country)
// ---------------------------------------------------------------------------

export function StateSelect({
  countryCode,
  value,
  onChange,
  onStateMeta,
}: {
  countryCode: string;
  value: string;
  onChange: (iso2: string) => void;
  onStateMeta?: (state: StateInfo | null) => void;
}) {
  const [states, setStates] = useState<StateInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setStates([]);
      return;
    }
    setLoading(true);
    fetch(`/api/geo/states?country=${encodeURIComponent(countryCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: StateInfo[]) => setStates(list))
      .catch(() => setStates([]))
      .finally(() => setLoading(false));
  }, [countryCode]);

  useEffect(() => {
    const match = states.find((s) => s.iso2 === value);
    onStateMeta?.(match ?? null);
  }, [value, states, onStateMeta]);

  if (!countryCode) {
    return (
      <input
        disabled
        placeholder="Select a country first"
        className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--muted)] cursor-not-allowed"
      />
    );
  }

  if (states.length === 0 && !loading) {
    // No states data for this country, free text
    return (
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Enter state or region"
      />
    );
  }

  const options = states.map((s) => ({ label: s.name, value: s.iso2 }));

  return (
    <SearchableSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={loading ? "Loading states..." : "Search state..."}
    />
  );
}

// ---------------------------------------------------------------------------
// City picker (hybrid: dropdown + free-text fallback)
// ---------------------------------------------------------------------------

export function CityInput({
  countryCode,
  stateCode,
  value,
  onChange,
}: {
  countryCode: string;
  stateCode: string;
  value: string;
  onChange: (name: string) => void;
}) {
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"select" | "custom">("select");

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCities([]);
      return;
    }
    setLoading(true);
    fetch(`/api/geo/cities?country=${encodeURIComponent(countryCode)}&state=${encodeURIComponent(stateCode)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: CityInfo[]) => {
        setCities(list);
        if (list.length === 0) setMode("custom");
        else setMode("select");
      })
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, [countryCode, stateCode]);

  if (!stateCode) {
    return (
      <input
        disabled
        placeholder="Select a state first"
        className="w-full px-3.5 py-2.5 text-[15px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg text-[var(--muted)] cursor-not-allowed"
      />
    );
  }

  if (mode === "custom" || cities.length === 0) {
    return (
      <div className="space-y-1">
        <TextInput value={value} onChange={onChange} placeholder="Enter city name" />
        {cities.length > 0 && (
          <button
            type="button"
            onClick={() => setMode("select")}
            className="text-[13px] text-[#0891B2] hover:underline"
          >
            Choose from list instead
          </button>
        )}
      </div>
    );
  }

  const options = cities.map((c) => ({ label: c.name, value: c.name }));

  return (
    <div className="space-y-1">
      <SearchableSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={loading ? "Loading cities..." : "Search city..."}
      />
      <button
        type="button"
        onClick={() => setMode("custom")}
        className="text-[13px] text-[var(--muted)] hover:text-[#0891B2] hover:underline"
      >
        City not listed? Type it manually
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: get currency + timezones from country code
// ---------------------------------------------------------------------------

export async function getCountryDetails(iso2: string) {
  if (!iso2) return null;
  try {
    const res = await fetch(`/api/geo/country?code=${encodeURIComponent(iso2)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type { Country, StateInfo, CityInfo };
