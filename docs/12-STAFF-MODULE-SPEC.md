# Schoolnify - Staff Module Spec (Backend Handoff)

> **Version:** 1.0.0
> **Last Updated:** October 2026
> **Status:** Frozen for backend build
> **Amended by:** `11A-TEACHING-MODEL-AMENDMENT.md` (v1.1): assignments come from `teaching_assignment`; coverage rules are teaching-model aware
> **Amended by:** `12A-STAFF-MODEL-AMENDMENT.md` (v1.1): person / employment / account split, contracts and roles, employer, credentials split into four, sensitive data, operational seams. See `13-STAFF-MODEL-GAP-ANALYSIS.md` for the evidence.
> **Source of truth:** `src/types/staff.ts`, `src/lib/staff/*.ts` (pure rules, unit-tested), `src/lib/demo-data.ts` (staff, staffCredentials, staffAssignments)

---

## Purpose

Finalised data contract for the **Staff module** (teaching and non-teaching
employees), derived from the demo-data-driven frontend after UI iteration and
primary-source research (BambooHR, Fedena, PowerSchool, Arbor and Bromcom
Single Central Record). Country-agnostic: Nigerian, UK and US schools are the
first customers, so government IDs and bank details are config-driven custom
fields, never columns.

Conventions follow `02-DATABASE-DESIGN.md`: `tenant_id` on every table + RLS,
soft deletes (`deleted_at`), audit columns (`created_at`, `updated_at`,
`created_by`, `updated_by`), UUID PKs, snake_case. API responses are
snake_case; the frontend maps to camelCase in its API layer.

Out of scope for this module, by decision: salary and payroll (only a
`grade_band` reference stays), leave and attendance (the staff UI reads
approved leave to show "away today"), performance reviews, RBAC (a coarse
`permission_role` seam is reserved), document storage beyond credential
attachments.

---

## Owned tables (build these)

### `staff`

One row per employee per tenant. A person who leaves and returns gets a new
row; history is the previous row with an `exit_date`.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | RLS |
| `employee_number` | varchar(32) | unique per tenant; **auto-allocated from a tenant sequence with a tenant prefix when blank on create**; editable only at creation |
| `first_name` | varchar(100) | required |
| `middle_name` | varchar(100) null | |
| `last_name` | varchar(100) | required |
| `display_name` | text null | override for name ordering / mononyms |
| `email` | citext (max 254) | required, **unique per tenant**, work email, doubles as login identity |
| `phone` | text | E.164 or empty string; format on display |
| `avatar_url` | text null | |
| `gender` | enum `male\|female\|other` null | |
| `designation` | varchar(80) | required; job title; config-driven lookup in a later iteration |
| `staff_category` | enum `academic\|support` | required |
| `is_teacher` | bool | eligibility to be assigned to a class; **must be false when category is support** |
| `permission_role` | enum `school_admin\|teacher\|bursar\|registrar\|support` | seam; becomes FK to a roles table when RBAC lands |
| `department` | varchar(80) | required; free text with suggestions in the UI until the config lookup exists |
| `employment_type` | enum `full_time\|part_time\|contract\|term_time` | default `full_time` |
| `fte_percent` | smallint | 1..100; **must be 100 when `employment_type = full_time`** |
| `hire_date` | date | required |
| `exit_date` | date null | **must be >= hire_date** |
| `reports_to_id` | uuid FK -> staff null | same tenant; not self |
| `employment_status` | enum `onboarding\|active\|suspended\|inactive` | default `onboarding`; see lifecycle |
| `grade_band` | varchar(20) null | pay band reference only |
| `custom_fields` | jsonb | `{ [config_key]: string }` for government IDs, bank details, etc. |
| `qualified_subject_ids` | uuid[] | subjects the person may teach; FK -> subject |

**Indexes:** `(tenant_id, email)` unique, `(tenant_id, employee_number)` unique,
`(tenant_id, employment_status)`, `(tenant_id, department)`, `(tenant_id, reports_to_id)`.

### `staff_credential`

Repeatable compliance records keyed on an expiry date (licence, work permit or
visa, background check, medical, contract). The expiry is the load-bearing
field; status is **never stored** (see computed-on-read).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `staff_id` | uuid FK -> staff | cascade on soft delete |
| `type` | enum `teaching_license\|work_permit\|background_check\|medical\|contract\|other` | |
| `name` | text | config-driven label, e.g. "TRCN", "QTS", "DBS", "H-1B Visa" |
| `issuing_authority` | text | |
| `number` | text | reference / certificate number |
| `issue_date` | date | |
| `expiry_date` | date null | null = does not expire |
| `document_url` | text null | attachment (Documents storage) |
| `verified_by_id` | uuid FK -> staff null | admin who checked the evidence (Arbor "Authenticated By") |
| `verified_at` | date null | |
| `notes` | text null | |

**Indexes:** `(tenant_id, staff_id)`, `(tenant_id, expiry_date)` for the compliance digest.

### `tenant_settings` additions (not a new table)

| Key | Default | Used by |
|---|---|---|
| `staff.credential_expiry_window_days` | 60 | "expiring" status |
| `staff.credential_urgent_days` | 30 | red tier in UI and digest |
| `staff.employee_number_prefix` | `EMP-` | auto allocation |

---

## Computed-on-read (do NOT store as columns)

Frontend reference implementations, all pure and unit-tested in `src/lib/staff/`:

| Value | Rule | Reference |
|---|---|---|
| Credential `status` | `valid` if no expiry or more than `window` days away; `expiring` if 0..window days (inclusive, including today); `expired` if the day after expiry or later; `unknown` if the stored expiry cannot be read (counts as an issue, never as valid) | `credentials.ts` `credentialStatus` |
| Credential health per person | worst status across their credentials; `none` when no records | `credentialHealth` |
| Compliance summary | counts of valid / expiring / expired and distinct staff with issues | `complianceSummary` |
| On the books on date D | `hire_date <= D` and (`exit_date` null or `exit_date > D`) and not (`inactive` with null `exit_date`); a malformed `hire_date` is never on the books | `metrics.ts` `isOnBooksOn` |
| On duty today | on the books, minus approved leave, minus `suspended` | `staff-today.tsx` |
| Headcount, FTE, average tenure | over staff on the books on D | `headcountOn`, `totalFte`, `averageTenureYears` |
| New hires in a window | `hire_date` inside `[from, to]` inclusive | `newHiresBetween` |
| Onboarding on D | `hire_date > D` (upcoming), plus `onboarding` status with `hire_date <= D` (started, not activated) | `overview.ts` `onboardingOn` |
| Away today | any **approved** leave request with `start_date <= D <= end_date` | `leave.ts` `isAwayOn` |
| Teaching assignments | derived from `class.class_teacher_id` (homeroom) and `class_subject_teacher` (subject or co-teacher) | `staffAssignments()` in demo data; see Classes spec |
| Coverage | teachers on the books with no class link; non-archived classes whose homeroom teacher is missing or unknown | `coverage.ts` |

> The old demo carried `role`, `joinDate`, `status: on_leave`, `salary`,
> `classesAssigned`, `subjects`. **All removed. Do not build them.** Leave is a
> leave-module state; salary is payroll; class counts derive from assignments.

---

## Lifecycle

```
onboarding --(hire_date reached, nightly job; or manual "Activate")--> active
active --(manual)--> suspended --(manual)--> active
active|suspended --(set exit_date; effective on that date)--> inactive
inactive --(clear exit_date)--> active        (reversible, Bromcom pattern)
```

- Auto-flip onboarding -> active runs daily per tenant; the UI also offers a
  manual override. Inactive is date-effective, so a future `exit_date` keeps the
  person active and on the books until that day.
- Login access is **not** coupled to creation: `POST /staff` accepts
  `send_invite: bool` and a later `POST /staff/{id}/invite` exists.

---

## Consumed from other modules (read-shapes the Staff UI expects)

- **Classes**: `class.class_teacher_id`, `class_subject_teacher(class_subject_id, teacher_id)`, `class.status` (archived excluded from coverage). Multi-teacher per subject is locked in the Classes spec; the UI labels a link `co_teacher` when more than one teacher is on the subject.
- **Leave** (future module): `leave_request(staff_id, start_date, end_date, status)`; only `approved` is read.
- **Subjects / Departments / Designations** (school setup config): lookups for `qualified_subject_ids`, `department`, `designation`.
- **Documents**: storage for `staff_credential.document_url`.

---

## Endpoints (REST shape; align with `03-API-SPECIFICATION.md`)

All under `/api/v1/staff`, tenant resolved from session, cross-tenant -> 404.

```
GET    /staff                         # list + filters: status, category, department, employment_type, reports_to_id, q (name/email/employee_number/designation), credential_health (ok|expiring|expired|none), hired_from, hired_to; sort: name|designation|department|hire_date|status; page, page_size
POST   /staff                         # create; body = Staff fields minus id; employee_number optional; send_invite?: bool
GET    /staff/{id}                    # detail; ?include=assignments,credentials,manager,away_today
PATCH  /staff/{id}                    # partial update; employee_number immutable
DELETE /staff/{id}                    # soft delete
POST   /staff/{id}/status             # { status, effective_date? }  (activate, suspend, exit)
POST   /staff/{id}/invite             # send or resend sign-in invite

GET    /staff/{id}/credentials        # list with computed status + days_until_expiry
POST   /staff/{id}/credentials
PATCH  /staff/{id}/credentials/{cid}
DELETE /staff/{id}/credentials/{cid}
POST   /staff/{id}/credentials/{cid}/verify   # sets verified_by (caller) + verified_at

GET    /staff/metrics                 # ?date=YYYY-MM-DD&range=7d|30d|90d|term&granularity=daily|weekly|monthly -> the overview widgets with spark + compare series (same rules as lib/staff/overview.ts)
GET    /staff/compliance              # summary + credentials needing attention, sorted expired first then soonest
GET    /staff/coverage                # unassigned teachers, classes without a teacher

POST   /staff/import                  # multipart CSV + mode=upsert|create + date_format; validates every row, commits valid rows, returns per-row results and an error CSV; matches existing on email then employee_number
GET    /staff/import/template         # CSV template (columns = src/lib/staff/import-fields.ts keys)
```

**Validation the API must enforce** (mirrors `src/lib/staff/schema.ts`):
names required and trimmed; email valid, lower-cased, unique per tenant;
phone E.164 or empty; `exit_date >= hire_date`; `fte_percent` 1..100 and 100
for full time; `is_teacher` only with `academic`; `reports_to_id` in tenant and
not self. Errors return `{ detail: [{ loc: ["body", field], msg }] }` so the
form can map them to fields.

---

## Resolved product decisions

1. **Credential status is computed**, never stored. Window 60 days, urgent 30, both tenant settings.
2. **Credential fields** are the union of Arbor and PowerSchool: type, name, issuer, number, issue date, expiry (nullable "never"), attachment, verified-by and verified-at, notes.
3. **Alert surfaces**: Staff "Today" tile (expired and expiring counts), directory column dot, profile Credentials tab. Weekly admin email digest is phase 2.
4. **Onboarding to active flips automatically on hire date**, with manual override; inactive is date-effective and reversible.
5. **Employee number auto-generated** with tenant prefix, editable only at creation.
6. **Invite is a separate action**, not coupled to creation.
7. **Import**: CSV only (no `.xlsx`; the npm `xlsx` package has unpatched advisories), upsert matched on email then employee number, per-row validation before commit, commit valid rows and return an error CSV for the rest. Browser-side limits: 5 MB and 2,000 rows per file; rows with more cells than columns are reported, not silently truncated; an unknown `reports_to_email` is a per-row warning and the field is left blank.
8. **Add form**: one page, three sections (Identity, Job, Access); five required fields plus category and department.
9. **Salary, leave, performance** stay out of this module; only seams remain.

---

## Still open (do not freeze without product sign-off)

- **Required credential types per designation** (e.g. every teacher must hold a licence and a background check). Needed for a `missing` status; not modelled yet.
- **Designation and department as config tables** rather than free text; the UI already treats them as lookups.
- **School timezone for "today"**: the frontend currently uses the UTC calendar date at request time. Metrics endpoints should accept an explicit `date` and the tenant timezone should decide the default.
- **Multiple positions per person** (one teacher, two departments). Not supported; one designation and one department per row.
