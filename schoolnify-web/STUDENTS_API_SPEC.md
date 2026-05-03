# Students Module: Backend API Contract

**Date:** 2026-05-03
**Branch:** `feat/students-module`
**Status:** Backend contract finalized. Frontend aligned with contract on this branch.

This document is the **canonical contract** for the students module endpoints. Drafted by the frontend team and reconciled with what the backend actually built. Sections marked **Deferred** below are planned but not yet implemented; the frontend handles them with mock data.

All endpoints are under `/api/v1/students`. Every endpoint requires authentication; the user's school is resolved from their session (cookie or Bearer JWT) -- no `org_id` query parameter needed.

A student is **always scoped to one school**. Cross-tenant requests return `404` (not `403`) so the existence of records in other schools isn't leaked.

---

## Implemented Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/students` | GET | List students with filters + pagination + summary |
| `/students` | POST | Create a single student (manual enrollment) |
| `/students/{id}` | GET | Full student detail (optionally with includes) |
| `/students/{id}` | PATCH | Update fields (excluding status / class) |
| `/students/{id}` | DELETE | Soft-delete (marks `withdrawn`, writes audit row) |
| `/students/{id}/status` | PATCH | Change enrollment status with reason and audit history |
| `/students/{id}/class` | PATCH | Change grade level / section with audit history |
| `/students/promote` | POST | Bulk promotion / retention / graduation (transactional) |
| `/students/bulk-import` | POST | Bulk create from CSV (up to 5,000 rows) |
| `/students/export` | GET | Export filtered list as CSV |

## Deferred Endpoints

These are stubbed in this spec for reference but the underlying modules don't exist yet on the backend. The frontend keeps using demo data for views these endpoints would power.

| Endpoint | Reason | Tracking |
|---|---|---|
| `GET /students/{id}/fees` | No fees ledger yet | Needs Fees module spec |
| `POST /students/{id}/fees/payments` | Same | Same |
| `GET /students/{id}/attendance` | No attendance module | Needs Attendance module spec |
| `GET /students/{id}/grades` | No gradebook | Needs Grades module spec |
| `GET /students/{id}/report-card` | Depends on grades + attendance + report templates | After the above three |

When these modules ship, the `recent_payments` and `recent_attendance` `?include=` keys on `GET /students/{id}` will start returning real data instead of empty arrays. No breaking change.

---

## Student object

The full canonical Student response shape returned by GET endpoints. The frontend type at `src/types/student.ts` mirrors this exactly (camelCase on the client, snake_case on the wire).

```json
{
  "id": "std_a1b2c3",
  "admission_number": "INF/2026/001",
  "first_name": "Chidera",
  "middle_name": "Grace",
  "last_name": "Okonkwo",
  "date_of_birth": "2017-03-15",
  "gender": "female",
  "grade_level": "Primary 1",
  "section": "A",
  "stream": null,

  "enrollment_date": "2024-09-09",
  "status": "active",
  "boarding_status": "day",

  "phone": null,
  "email": null,
  "address": "23 Adeola Odeku Street",
  "city": "Lagos",
  "state": "Lagos",
  "postal_code": "101241",

  "guardians": [
    {
      "id": "grd_xyz789",
      "first_name": "Emeka",
      "last_name": "Okonkwo",
      "phone": "+2348012345678",
      "email": "emeka.o@example.com",
      "relationship": "Father",
      "occupation": "Engineer",
      "is_primary": true
    }
  ],

  "blood_group": "O+",
  "genotype": "AA",
  "allergies": "Peanuts",
  "medical_conditions": null,
  "previous_school": "Sunrise Pre-school",
  "state_of_origin": "Anambra",
  "lga": "Onitsha North",
  "religion": "Christianity",
  "tribe": "Igbo",
  "avatar_url": null,

  "gpa": null,
  "attendance_rate": null,
  "fee_status": "unknown",

  "created_at": "2024-09-09T08:30:00Z",
  "updated_at": "2025-04-15T14:22:00Z"
}
```

### Field rules

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Server-generated |
| `admission_number` | string | Unique per school. Format `{prefix}/{year}/{seq:03}`. |
| `gender` | enum | `male` or `female` |
| `status` | enum | `active`, `inactive`, `suspended`, `graduated`, `withdrawn`, `transferred` |
| `boarding_status` | enum? | `day`, `boarding`, `weekly_boarding` |
| `gpa` | float? | **Always null until grades module ships.** Frontend renders dash. |
| `attendance_rate` | float? | **Always null until attendance module ships.** Frontend renders dash. |
| `fee_status` | string | **Always `"unknown"` until fees module ships.** Frontend hides badge. |
| `guardians` | array | Up to 3, exactly one with `is_primary: true` |
| `created_at`, `updated_at` | ISO 8601 | |

Optional `string?` fields are omitted from the JSON when null.

When `?include=recent_payments` is passed on detail requests, the response includes `"recent_payments": []`. Same for `recent_attendance`.

---

## Endpoint details

### `GET /students`

List students with filters, pagination, and a whole-school summary.

**Query parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `search` | string? | — | Matches first/last name, admission_number, or guardian name/phone/email (case-insensitive) |
| `grade_level` | string? | — | Exact match |
| `section` | string? | — | Exact match |
| `status` | string? | `active` | `active`, `inactive`, `suspended`, `graduated`, `withdrawn`, `transferred`. Pass `all` to disable the filter. |
| `gender` | string? | — | `male` or `female` |
| `boarding_status` | string? | — | `day`, `boarding`, `weekly_boarding` |
| `page` | int? | `1` | 1-indexed |
| `page_size` | int? | `25` | Max `100` |
| `sort` | string? | `last_name` | `last_name`, `first_name`, `admission_number`, `enrollment_date`, `created_at` |
| `order` | string? | `asc` | `asc` or `desc` |

**Response 200:**
```json
{
  "data": [Student, ...],
  "pagination": { "page": 1, "page_size": 25, "total": 30, "total_pages": 2 },
  "summary": {
    "total_students": 30,
    "active": 29,
    "average_gpa": null,
    "average_attendance": null
  }
}
```

The `summary` is computed across the entire school and **ignores list filters**. `average_gpa` and `average_attendance` are null until the graded attendance modules ship.

| Error | Status | When |
|---|---|---|
| Not authenticated | `401` | Missing or invalid token |
| No organization | `400` | User is not part of an org |

---

### `POST /students`

Create a single student.

**Required fields:** `first_name`, `last_name`, `date_of_birth`, `gender`, `grade_level`. Everything else is optional.

**Auto-generation:**
- `admission_number`: if omitted, generated from `school_configs.admission_number_prefix` (set via the setup wizard's identity section). Falls back to the school slug uppercased when no prefix is set. Format: `{prefix}/{year}/{seq:03}`. Sequence resets per year.
- `enrollment_date`: defaults to today.

**Guardians:** up to 3. Exactly one may have `is_primary: true`. If none is marked primary, the first becomes primary by convention.

**Response 201:** Full Student object.

| Error | Status | When |
|---|---|---|
| Not authenticated | `401` | |
| Bad request | `400` | Invalid `gender`/`boarding_status`/`grade_level` (must be configured for the school), more than one primary guardian, more than 3 guardians |
| Duplicate admission number | `409` | Admin-supplied `admission_number` already exists in this school |

---

### `GET /students/{id}`

**Query parameters:**

| Param | Type | Notes |
|---|---|---|
| `include` | string? | Comma-separated. Recognized: `recent_payments`, `recent_attendance`. Always empty arrays until those modules ship. |

| Error | Status | When |
|---|---|---|
| Not found | `404` | No student with that id in this school (also returned for cross-tenant access) |

---

### `PATCH /students/{id}`

Send only changed fields. Each field uses `COALESCE`: passing `null` keeps existing, empty string `""` overwrites with empty.

**Cannot be changed via this endpoint:**
- `id`, `admission_number`, `enrollment_date`, `created_at`, `updated_at` -- immutable
- `status` -- use `PATCH /students/{id}/status`
- `grade_level`, `section` -- use `PATCH /students/{id}/class`

**Guardians:** if included, the entire guardian set is replaced. Omit the field to leave guardians unchanged.

| Error | Status | When |
|---|---|---|
| Bad request | `400` | Invalid field value |
| Not found | `404` | |

---

### `DELETE /students/{id}`

Soft-delete: marks the student `withdrawn`, sets `withdrawn_at`, writes a status_history audit row with reason `"deleted via API"`. Never hard-deletes.

After deletion the student is excluded from default list view (which filters to `status=active`). Reappears when querying `?status=withdrawn` or `?status=all`.

**Response 204** (no body).

| Error | Status | When |
|---|---|---|
| Not found | `404` | |
| Bad request | `400` | Student already has `status=withdrawn` |

---

### `PATCH /students/{id}/status`

```json
{
  "status": "transferred",
  "reason": "Family relocated to UK",
  "effective_date": "2025-05-15"
}
```

| Field | Type | Required |
|---|---|---|
| `status` | enum | yes |
| `reason` | string? | no |
| `effective_date` | date? | defaults to today |

Transitioning to `graduated` sets `graduation_date`. Transitioning to `withdrawn` sets `withdrawn_at`.

**Response 200:**
```json
{
  "student": Student,
  "status_change": {
    "id": "stchg_...",
    "from_status": "active",
    "to_status": "transferred",
    "reason": "Family relocated to UK",
    "effective_date": "2025-05-15",
    "changed_by": "550e8400-...",
    "changed_at": "2026-05-03T10:30:00Z"
  }
}
```

| Error | Status | When |
|---|---|---|
| Bad request | `400` | Invalid `status`, or status unchanged |

---

### `PATCH /students/{id}/class`

```json
{
  "grade_level": "JSS 2",
  "section": "B",
  "stream": null,
  "effective_date": "2025-09-09",
  "reason": null
}
```

`grade_level` is required and must match a value configured in the school's `grade_levels`. `section` and `stream` are optional and use `COALESCE` (null preserves existing).

Writes a `student_class_history` row with `change_kind: "manual"`.

| Error | Status | When |
|---|---|---|
| Bad request | `400` | `grade_level` not configured for this school |

---

### `POST /students/promote`

Bulk promotion at end of academic session. Wrapped in a single transaction -- if any decision fails, **all** changes roll back. Each decision writes one `student_class_history` row sharing a server-generated `promotion_batch_id`.

**Request:**
```json
{
  "decisions": [
    { "student_id": "std_001", "action": "promote", "to_grade": "Primary 2", "to_section": "A" },
    { "student_id": "std_002", "action": "promote", "to_grade": "Primary 2", "to_section": "B" },
    { "student_id": "std_003", "action": "retain", "reason": "Failed core subjects" },
    { "student_id": "std_004", "action": "graduate" }
  ],
  "academic_year": "2025/2026",
  "effective_date": "2026-09-01"
}
```

| Action | Effect |
|---|---|
| `promote` | Updates `grade_level` (requires `to_grade`) and optionally `section`. Writes audit row. |
| `retain` | Leaves `grade_level` unchanged. Writes audit row with the unchanged grade. |
| `graduate` | Sets `status='graduated'` and `graduation_date`. Writes both status_history and class_history rows. |

**Response 200:**
```json
{
  "promoted": 28,
  "retained": 1,
  "graduated": 1,
  "batch_id": "550e8400-...",
  "errors": []
}
```

| Error | Status | When |
|---|---|---|
| Bad request | `400` | Empty `decisions`, invalid `action`, `promote` missing `to_grade`, or `to_grade` not configured |
| Not found | `404` | One or more `student_id`s do not belong to this school. Entire batch rolls back. |

---

### `POST /students/bulk-import`

`multipart/form-data`:

| Part | Type | Required | Notes |
|---|---|---|---|
| `file` | CSV bytes | yes | Up to **5,000 rows**. Headers required. |
| `mapping` | JSON string | yes | Maps CSV headers to field keys |
| `skip_invalid` | string | no | `"true"` to import valid rows when some fail. Default false. |

**Field keys recognized in `mapping`:**

`first_name`, `middle_name`, `last_name`, `date_of_birth`, `gender`, `grade_level`, `section`, `stream`, `admission_number`, `enrollment_date`, `boarding_status`, `phone`, `email`, `address`, `city`, `state`, `postal_code`, `blood_group`, `genotype`, `allergies`, `medical_conditions`, `previous_school`, `state_of_origin`, `lga`, `religion`, `tribe`, `avatar_url`.

For guardians, prefix with `guardianN_` where N is 1-3:
`guardian1_first_name`, `guardian1_last_name`, `guardian1_phone`, `guardian1_email`, `guardian1_relationship`, `guardian1_occupation`, etc.

`guardian1` is treated as primary by convention.

**Required per row:** `first_name`, `last_name`, `date_of_birth` (`YYYY-MM-DD`), `gender` (`male`/`female`), `grade_level`.

**Response 200:**
```json
{
  "imported": 27,
  "skipped": 3,
  "errors": [
    { "row": 5, "field": "date_of_birth", "message": "must be YYYY-MM-DD" },
    { "row": 12, "field": "grade_level", "message": "grade_level 'Senior High' not configured for this school" },
    { "row": 18, "field": "gender", "message": "must be male or female" }
  ],
  "imported_students": [
    { "id": "std_xxx", "admission_number": "INF/2026/028", "first_name": "Ada", "last_name": "Lovelace" }
  ]
}
```

**Response 422** (errors and `skip_invalid != true`): same shape, `imported: 0`, `imported_students: []`. **No rows inserted.**

| Error | Status | When |
|---|---|---|
| Bad request | `400` | Missing `file` or `mapping`, malformed multipart, invalid mapping JSON |
| Validation failed | `422` | At least one row has errors and `skip_invalid != true` |

---

### `GET /students/export`

Export filtered list as CSV. Same query parameters as `GET /students`. No pagination.

**Response 200:**
```
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="students_2026-05-03.csv"
```

CSV columns:
```
Admission No, First Name, Last Name, Middle Name, Grade, Section, Gender, DOB, Status, Boarding, Fee Status, Guardian Name, Guardian Phone, Guardian Email
```

`Fee Status` is `"unknown"` for every row until the fees module ships. Guardian columns reflect the primary guardian (empty if none).

---

## Admission number configuration

Stored on `school_configs`:

| Column | Type | Set by | Notes |
|---|---|---|---|
| `admission_number_prefix` | string? | Admin via `PATCH /schools/setup` (`identity` section) | Falls back to the school slug uppercased when null |
| `admission_number_seq_year` | smallint | Server | Year of the current sequence |
| `admission_number_next_seq` | int | Server | Next number to assign |

The setup wizard's identity section now exposes `admission_number_prefix`. The other two are internal counters managed by `POST /students` and `POST /students/bulk-import`. Sequences reset on year boundary automatically.

```json
PATCH /api/v1/schools/setup
{
  "identity": {
    "school_type": "secondary",
    "motto": "Excellence",
    "admission_number_prefix": "INF"
  }
}
```

---

## Error response shape

All endpoints use a consistent error format:

```json
{
  "error": "Short error code",
  "message": "Human-readable explanation",
  "fields": { "field_name": "Field-specific error" },
  "request_id": "req_xxx"
}
```

| Code | When |
|---|---|
| `400` | Malformed request |
| `401` | Not authenticated |
| `404` | Student not found / cross-tenant access |
| `409` | Conflict (e.g. duplicate admission number) |
| `422` | Validation failed |
| `500` | Server error |

---

## Frontend integration plan

Replace mock data imports with React Query hooks once endpoints are live:

```typescript
// src/hooks/use-students.ts
useStudents(filters)              // GET /students
useStudent(id, { include })        // GET /students/{id}
useCreateStudent()                 // POST /students
useUpdateStudent()                 // PATCH /students/{id}
useDeleteStudent()                 // DELETE /students/{id}
useChangeStatus()                  // PATCH /students/{id}/status
useChangeClass()                   // PATCH /students/{id}/class
usePromoteStudents()               // POST /students/promote
useImportStudents()                // POST /students/bulk-import
useExportStudents()                // GET /students/export (download CSV)
```

The frontend already uses TanStack React Query (`src/providers/query-provider.tsx`).

---

## Frontend handling of null fields

Until grades / attendance / fees modules ship, the backend returns:
- `gpa: null`
- `attendance_rate: null`
- `fee_status: "unknown"`
- `summary.average_gpa: null`
- `summary.average_attendance: null`

The frontend renders these as:
- Stat card shows `—` instead of a number, with subtitle `"no data yet"`
- Detail page hides the GPA/attendance badges when null
- Stat rings show `—` and use 0 for the visual percentage
- Promote page shows `—` instead of a value (sorting by GPA still works -- nulls go last)

When the modules ship, no frontend change required -- the values just start showing real numbers.
