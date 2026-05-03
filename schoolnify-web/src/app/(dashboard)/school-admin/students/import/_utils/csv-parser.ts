import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
  errors: string[];
}

/**
 * Parse a file (CSV or XLSX) and return uniform result.
 */
export async function parseFile(file: File): Promise<ParsedCSV> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "xlsx" || ext === "xls") {
    return parseExcelFile(file);
  }
  return parseCSVFile(file);
}

/**
 * Parse a CSV file using PapaParse.
 */
export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const rows = cleanRows(results.data as Record<string, string>[]);
        const errors = results.errors
          .filter((e) => e.type !== "FieldMismatch")
          .map((e) => `Row ${e.row ?? "?"}: ${e.message}`);
        resolve({ headers, rows, rowCount: rows.length, errors });
      },
      error: (err) => {
        resolve({ headers: [], rows: [], rowCount: 0, errors: [err.message] });
      },
    });
  });
}

/**
 * Parse an Excel file (.xlsx / .xls) using the xlsx library.
 * Reads the first sheet and converts to the same format as CSV.
 */
function parseExcelFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          resolve({ headers: [], rows: [], rowCount: 0, errors: ["No sheets found in the Excel file"] });
          return;
        }
        const sheet = workbook.Sheets[sheetName];
        // raw: false converts Excel-formatted dates (stored as serial numbers
        // like 45000) into formatted strings, matching CSV semantics.
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });

        if (jsonData.length === 0) {
          resolve({ headers: [], rows: [], rowCount: 0, errors: ["The sheet appears to be empty"] });
          return;
        }

        const headers = Object.keys(jsonData[0]).map((h) => String(h).trim());
        const rows = jsonData.map((row) => {
          const cleaned: Record<string, string> = {};
          for (const [key, val] of Object.entries(row)) {
            cleaned[key.trim()] = val != null ? String(val).trim() : "";
          }
          return cleaned;
        });

        resolve({ headers, rows, rowCount: rows.length, errors: [] });
      } catch (err) {
        resolve({ headers: [], rows: [], rowCount: 0, errors: [`Failed to parse Excel file: ${err instanceof Error ? err.message : "Unknown error"}`] });
      }
    };
    reader.onerror = () => {
      resolve({ headers: [], rows: [], rowCount: 0, errors: ["Failed to read file"] });
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse pasted text as CSV.
 */
export function parseCSVText(text: string): ParsedCSV {
  const results = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });
  const headers = results.meta.fields ?? [];
  const rows = cleanRows(results.data as Record<string, string>[]);
  const errors = results.errors.map((e) => `Row ${e.row ?? "?"}: ${e.message}`);
  return { headers, rows, rowCount: rows.length, errors };
}

function cleanRows(data: Record<string, string>[]): Record<string, string>[] {
  return data.map((row) => {
    const cleaned: Record<string, string> = {};
    for (const [key, val] of Object.entries(row)) {
      cleaned[key.trim()] = typeof val === "string" ? val.trim() : String(val ?? "");
    }
    return cleaned;
  });
}
