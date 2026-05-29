# Schoolnify - Classes Module Spec (Backend Handoff)

> **Version:** 1.0.0
> **Last Updated:** May 2026
> **Status:** Frozen for backend build
> **Source of truth:** `src/types/class.ts` + `src/lib/demo-data.ts` (classes section)

---

## Purpose

This is the finalized data contract for the **Classes module**, derived from the
demo-data-driven frontend after UI/UX iteration. It follows the Fedena-style K-12
**cohort model**: a `class` is the "arm" a Nigerian/K-12 admin pictures (e.g.
"JSS 1A", "Primary 4 Gold", "SS2 Science A"), subjects are linked via
`class_subject`, and the roster lives in `class_enrollment`. This is deliberately
**not** PowerSchool's section-as-instance model.

Conventions follow `02-DATABASE-DESIGN.md`: `tenant_id` on every table + RLS,
soft deletes (`deleted_at`), audit columns (`created_at`, `updated_at`,
`created_by`, `updated_by`), UUID PKs, snake_case.

---

## Owned tables (build these)

### `class`

The class arm. One row per arm per session.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK → tenant | RLS |
| `name` | text | "JSS 1A", "Primary 4 Gold", "SS2 Science A" |
| `grade_level_id` | uuid FK → grade_level | from setup wizard |
| `arm` | text | "A", "Gold", "Blue" — split from name for grouping/sort |
| `stream` | enum null | `Science` \| `Arts` \| `Commercial` \| `Technical`; SSS only, else null |
| `academic_session_id` | uuid FK → academic_session | |
| `current_term_id` | uuid FK → term | denormalized for fast scoping |
| `class_teacher_id` | uuid FK → staff null | homeroom; null while draft |
| `room` | text | free text (or FK if a Rooms entity ever exists) |
| `capacity` | int | soft limit; UI warns when roster > capacity |
| `status` | enum | `active` \| `draft` \| `archived` |
| + audit/soft-delete columns | | |

**Unique:** (`tenant_id`, `academic_session_id`, `grade_level_id`, `arm`).

### `class_subject`

Which subjects are taught in a class. **Supports co-teaching and electives.**

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `class_id` | uuid FK → class | |
| `subject_id` | uuid FK → subject | from setup wizard |
| `is_core` | bool | `true` = whole class takes it; `false` = elective, roster in `class_subject_enrollment` |
| + audit columns | | |

**Unique:** (`class_id`, `subject_id`).

### `class_subject_teacher`

Many-to-many teachers per subject (team-teaching / split sections). Empty set =
falls back to the class's homeroom teacher in the UI.

| Column | Type | Notes |
|---|---|---|
| `class_subject_id` | uuid FK → class_subject | |
| `teacher_id` | uuid FK → staff | |

**PK:** (`class_subject_id`, `teacher_id`).

> Frontend models this as `ClassSubject.teacherIds: string[]`. Decision locked:
> **multiple teachers per subject**.

### `class_enrollment`

The class roster. One active row per (class, student).

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `class_id` | uuid FK → class | |
| `student_id` | uuid FK → student | |
| `enrolled_at` | date | |
| `exited_at` | date null | mid-term transfers |
| `status` | enum | `active` \| `withdrawn` \| `transferred` |
| + audit columns | | |

**Constraint:** at most one `active` row per (`class_id`, `student_id`).

### `class_subject_enrollment`

Per-subject sub-roster for **non-core (elective) subjects**, primarily SSS.
Core subjects need no rows (whole class takes them). A student must already have
an active `class_enrollment` in the same class.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `class_id` | uuid FK → class | |
| `subject_id` | uuid FK → subject | must reference a `class_subject` with `is_core=false` |
| `student_id` | uuid FK → student | |
| `status` | enum | `active` \| `withdrawn` \| `transferred` |
| + audit columns | | |

> Decision locked: **model SSS electives now** via this sub-roster.

---

## Computed-on-read (do NOT store as columns)

The frontend reads these as if on the class, but they are aggregates. Expose them
on the **class detail / list response**, computed server-side; never persist:

| Field | Derivation |
|---|---|
| `student_count` | count of active `class_enrollment` |
| `average_grade` | mean of student grades for the class/term — **null** until Academics module ships |
| `average_attendance` | mean of student attendance for the class/term — **null** until Attendance module ships |
| `teacher` (name) | join `class_teacher_id` → staff full name |
| `outstanding_fees_count` | count of enrolled students with fee status pending/overdue (Finance module) |

> The demo carries legacy aliases (`students`, `avgGrade`, `attendanceRate`,
> `schedule` text). **These are demo shims — do not build them.** `schedule`
> is replaced by the Timetable module (below).

---

## Consumed from other modules (read-shapes the Classes UI expects)

The Classes UI surfaces data owned by other modules. These are **not** part of
the Classes build — they are the contracts Classes will read once those modules
exist. Listed so they aren't accidentally baked into the classes tables.

| Surface (Classes UI) | Owner module | Shape expected |
|---|---|---|
| Gradebook tab | Academics | grade entry per (`student_id`, `class_id`, `subject_id`, `term_id`): `ca1`, `ca2`, `exam`, computed `total`, `letter`. CA weights + grade scale are tenant config, not hardcoded |
| Assignments tab | Academics | assignment per class: `title`, `due_date`, `status` (`upcoming`/`active`/`graded`), `submissions`, `total` |
| Schedule tab | Timetable | period per (`class_id`, `subject_id`): `day_of_week`, `start_time`, `end_time`, `room` |
| Header / Overview fee pills | Finance | per-student fee status for the session/term: `paid`/`pending`/`overdue` |
| Class position / rank | Academics | per-student rank within class for the term |

---

## Endpoints (REST shape; align with `03-API-SPECIFICATION.md`)

```
GET    /classes                       # list + filters: session, grade_level, band, arm, status, q (name/teacher)
POST   /classes                       # create: name, grade_level_id, arm, stream?, session, class_teacher_id?, room, capacity, status
GET    /classes/{id}                  # detail incl. computed student_count, average_grade, average_attendance
PATCH  /classes/{id}                  # edit metadata; archive via status
DELETE /classes/{id}                  # soft delete; guard: roster must be empty

GET    /classes/{id}/subjects         # class_subject + teachers + is_core
POST   /classes/{id}/subjects         # link subject {subject_id, teacher_ids[], is_core}
PATCH  /classes/{id}/subjects/{sid}   # update teachers / is_core
DELETE /classes/{id}/subjects/{sid}

GET    /classes/{id}/roster           # active class_enrollment → students
POST   /classes/{id}/roster           # enroll {student_id[]}
DELETE /classes/{id}/roster/{student} # withdraw/transfer (sets status + exited_at)

GET    /classes/{id}/subjects/{sid}/roster    # elective sub-roster (is_core=false)
POST   /classes/{id}/subjects/{sid}/roster    # add students to elective
DELETE /classes/{id}/subjects/{sid}/roster/{student}
```

All list/detail responses scoped to the selected `academic_session` + `term`.

---

## Resolved product decisions

- **SSS electives:** modeled now — `class_subject.is_core` + `class_subject_enrollment` sub-roster.
- **Multi-teacher per subject:** supported — `class_subject_teacher` join.
- **Stream:** a column on `class` (matches "SS2 Science A" naming), not a separate grouping.

## Still open (do not freeze without product sign-off)

- **Class invite codes** (Google-Classroom-style self-join): likely skip — Nigerian admins enroll centrally.
- **Promote-to-next-session / clone class:** Tier 2 — needs a bulk-roster-copy endpoint design.
- **Grade scale & CA weight config:** owned by Academics, but Classes gradebook depends on it — confirm config lives at tenant level before Academics build.
