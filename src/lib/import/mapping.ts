import type { ColumnMapping, ImportField } from "./types";

export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Suggest a column -> field mapping. Exact (normalised) matches on key, label
 * or alias win; a field is used at most once; everything else stays unmapped
 * for the user to decide.
 */
export function autoMap(headers: readonly string[], fields: readonly ImportField[]): ColumnMapping {
  const index = new Map<string, string>();
  for (const f of fields) {
    for (const name of [f.key, f.label, ...f.aliases]) {
      const n = normalizeHeader(name);
      if (!index.has(n)) index.set(n, f.key);
    }
  }
  const used = new Set<string>();
  const mapping: ColumnMapping = {};
  for (const h of headers) {
    const key = index.get(normalizeHeader(h));
    if (key && !used.has(key)) {
      mapping[h] = key;
      used.add(key);
    } else {
      mapping[h] = "";
    }
  }
  return mapping;
}
