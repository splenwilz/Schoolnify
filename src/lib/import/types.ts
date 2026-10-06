/** Generic CSV import contract shared by modules (staff first; students can migrate). */

export type ImportFieldType = "text" | "email" | "phone" | "date" | "enum" | "number";

export interface ImportField {
  /** Snake_case key; also the template column header. */
  key: string;
  label: string;
  required: boolean;
  type: ImportFieldType;
  /** Other column names people use for this field (matched case-insensitively). */
  aliases: readonly string[];
  /** Allowed values for enum fields (snake_case). */
  enumValues?: readonly string[];
  /** Applied when the cell is blank. */
  defaultValue?: string;
  /** Duplicates inside the file are errors; matches against existing records make the row an update. */
  unique?: boolean;
  min?: number;
  max?: number;
  /** Number fields: reject decimals. */
  integer?: boolean;
  description?: string;
  /** Name of a `ValidationContext.existing` set the value should appear in; a miss is a warning, not an error. */
  mustExistIn?: string;
}

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

/** CSV column name -> field key ("" = ignore column). */
export type ColumnMapping = Record<string, string>;

export interface RowError {
  field: string;
  message: string;
}

export interface RowResult {
  index: number;
  valid: boolean;
  errors: RowError[];
  /** Non-blocking notes, e.g. a manager email that matches nobody. */
  warnings: RowError[];
  /** Field key -> normalised value for every field (blank when absent). */
  normalized: Record<string, string>;
  /** "existing" when a unique field matches a record already in the system. */
  match: "new" | "existing";
  /** The unique field that produced the match. */
  matchedOn?: string;
}

export interface BatchSummary {
  total: number;
  valid: number;
  invalid: number;
  create: number;
  update: number;
}

export interface BatchResult {
  rows: RowResult[];
  validCount: number;
  invalidCount: number;
  summary: BatchSummary;
  unmappedRequired: string[];
}

export interface ValidationContext {
  dateFormat: DateFormat;
  /** Field key -> set of values already in the system (lower-cased for email). */
  existing?: Record<string, ReadonlySet<string>>;
  /** Field key -> value -> record id, for unique fields. Lets a row whose keys point at two different people be rejected. */
  existingIds?: Record<string, ReadonlyMap<string, string>>;
  /** Row index -> message from the parser (for example too many cells); the row fails with it. */
  rowErrors?: ReadonlyMap<number, string>;
  /** Groups of field keys of which at least one must be non-blank per row; the error lands on the first key. */
  requireOneOf?: readonly (readonly string[])[];
  /** ISO 3166-1 alpha-2 of the school; lets national phone numbers be normalised. Without it only E.164 is accepted. */
  country?: string;
  /** Cross-field rules run once every cell has validated; their errors fail the row. `meta.matchedId` is the existing record the row updates, if any. */
  rowRules?: (normalized: Record<string, string>, meta: { matchedId?: string }) => RowError[];
  /** Create-only mode: a row that matches an existing record is an error, and references are judged after that. */
  createOnly?: boolean;
}
