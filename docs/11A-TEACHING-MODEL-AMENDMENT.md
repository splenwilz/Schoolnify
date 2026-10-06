# Schoolnify - Classes Spec Amendment: Teaching Model and Teaching Assignments

> **Amends:** `11-CLASSES-MODULE-SPEC.md` (v1.0.0) and `12-STAFF-MODULE-SPEC.md` (v1.0.0)
> **Version:** 1.1.0
> **Last Updated:** October 2026
> **Status:** Draft for product and backend sign-off
> **Migration:** one migration, applied with the classes build. `class_subject_teacher` is **not** built.

---

## Why

Nigerian schools (and most K-12 systems) run three staffing patterns, often
inside one school:

| Pattern | Where | Who owns the class | Who teaches subjects |
|---|---|---|---|
| **Self-contained** | Primary | The class teacher | The same class teacher, every subject |
| **Form teacher + specialists** | Junior secondary | A form teacher (pastoral) | Subject specialists who rotate across classes; the form teacher is one of them |
| **Specialists only** | Senior secondary, "staff room" schools | Nobody | Subject specialists only |

The v1.0 model has one `class_teacher_id` and a link table of subject teachers,
with a comment that an empty link set "falls back to the homeroom teacher in
the UI". That covers pattern 2 well, pattern 1 only by convention (the fallback
is not applied by derived assignments, coverage, or reports), and pattern 3
badly (every class is flagged as having no teacher).

Two further gaps the link table cannot express: **time** (a cover teacher for
one term, a mid-session replacement, who taught a class last year for report
card signatures) and **a stable anchor for the timetable** (a period must point
at a person-subject-class fact, not at a free pair of ids).

This amendment adds an explicit per-class teaching model and replaces the link
table with a first-class, term-scoped `teaching_assignment` table that the
timetable references.

---

## Decisions

1. **`class.teaching_model`** is an explicit enum per class, defaulted from the
   grade level's section (primary / junior / senior) in school setup and
   editable per class.
2. **`class.class_teacher_id` stays** and means the **pastoral owner** (form
   teacher, homeroom). It is nullable. It is not a teaching assignment.
3. **`class_subject_teacher` is replaced by `teaching_assignment`**, one row
   per person, per class subject, per time window, with a role.
4. **Self-contained classes materialise assignments.** When a class is
   `self_contained`, the system creates one `subject` assignment per
   `class_subject` for the class teacher (and keeps them in sync when subjects
   or the class teacher change). No UI fallback rule remains.
5. **Timetable periods reference an assignment**, never a `(class_subject,
   teacher)` pair. The full timetable module is still a later build; only the
   anchor table is defined here so the foreign-key direction is settled.
6. **Coverage rules read the teaching model** (see Computed-on-read).
7. **Senior electives stay on the v1.0 sub-roster** (`class_subject.is_core` +
   `class_subject_enrollment`); nothing there changes. What is added is the
   **teaching set**: the same subject taught once to students drawn from
   several arms, including cross-stream (an Arts student offering Further
   Mathematics with the Science class). Assignments and timetable periods
   attach to the set, each arm keeps its own class-subject row and sub-roster.

---

## Schema changes

### `class` (amended)

| Column | Type | Notes |
|---|---|---|
| `teaching_model` | enum `self_contained` \| `form_plus_specialists` \| `specialists_only` | **new**; default from `grade_level.section`; see Setup |
| `class_teacher_id` | uuid FK → staff null | unchanged meaning, now explicitly **pastoral owner**; required unless `teaching_model = specialists_only` |

**Check:** `teaching_model <> 'specialists_only' OR class_teacher_id IS NULL OR TRUE` is deliberately not enforced; a senior class may still name a form teacher. The only hard rule is validation at the API: `self_contained` and `form_plus_specialists` require `class_teacher_id` once the class leaves `draft`.

### `grade_level` (amended, setup wizard)

| Column | Type | Notes |
|---|---|---|
| `section` | enum `primary` \| `junior_secondary` \| `senior_secondary` \| `other` | **new** if absent; drives the default teaching model |
| `default_teaching_model` | enum (same as class) | **new**; defaults: primary → `self_contained`, junior → `form_plus_specialists`, senior → `specialists_only`, other → `form_plus_specialists` |

### `teaching_assignment` (new, replaces `class_subject_teacher`)

One row per person, per class subject, per time window. This is the single
source of truth for "who teaches what, when".

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | RLS |
| `class_id` | uuid FK → class | denormalised from `class_subject` for cheap per-class queries |
| `class_subject_id` | uuid FK → class_subject | the subject slot in this class |
| `staff_id` | uuid FK → staff | must have `is_teacher = true` and be on the books for the window |
| `role` | enum `subject` \| `co_teacher` \| `cover` | `subject` = responsible teacher; `co_teacher` = team teaching; `cover` = temporary stand-in |
| `term_id` | uuid FK → term null | null = whole session |
| `starts_on` | date | defaults to term or session start |
| `ends_on` | date null | null = open ended; set when a cover ends or a teacher is replaced |
| `periods_per_week` | smallint null | planned load; the timetable module reconciles actuals |
| `source` | enum `manual` \| `self_contained` | `self_contained` rows are system-managed (decision 4) and not editable by hand |
| `notes` | text null | e.g. "maternity cover for Mrs Bello" |
| + audit/soft-delete columns | | |

**Indexes:** `(tenant_id, staff_id, starts_on)`, `(tenant_id, class_subject_id)`, `(tenant_id, class_id)`.
**Unique (partial):** `(class_subject_id, staff_id, role) WHERE ends_on IS NULL AND deleted_at IS NULL`; one open assignment per person per role per subject slot.
**Check:** `ends_on IS NULL OR ends_on >= starts_on`.

> Homeroom is **not** a row here. The pastoral owner is `class.class_teacher_id`.
> The frontend `StaffAssignment.role = "homeroom"` is derived from that column,
> not from this table.

### `teaching_set` (new)

Groups class-subject rows for one subject across arms within a session so
they are staffed and timetabled once.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `subject_id` | uuid FK → subject | every member must share it |
| `academic_session_id` | uuid FK → academic_session | every member must share it |
| `name` | text | "SS1 Further Mathematics set" |
| + audit/soft-delete columns | | |

### `class_subject` (amended)

| Column | Type | Notes |
|---|---|---|
| `teaching_set_id` | uuid FK → teaching_set null | **new**; member of a cross-arm set; null = taught to this class alone |

**Check:** the set's `subject_id` and session match the row's. A set with one
member is allowed (it is just a future-proof grouping).

### `teaching_assignment` (amended for sets)

| Column | Type | Notes |
|---|---|---|
| `teaching_set_id` | uuid FK → teaching_set null | **new**; when set, the row covers every member class-subject, and `class_subject_id` points at any one member (the one it was created from) |

**Unique (partial), amended:** `(COALESCE(teaching_set_id, class_subject_id), staff_id, role) WHERE ends_on IS NULL AND deleted_at IS NULL`.

### `timetable_period` (new, anchor only)

Defined now so periods point at assignments. Everything else about the
timetable (bells, rooms as entities, clash detection, printing) is the
Timetable module's spec.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `teaching_assignment_id` | uuid FK → teaching_assignment | **the** link; implies class, subject and teacher |
| `term_id` | uuid FK → term | |
| `day_of_week` | smallint | 1 = Monday |
| `starts_at` | time | |
| `ends_at` | time | |
| `room` | text null | free text until a Rooms entity exists |
| + audit columns | | |

**Check:** `ends_at > starts_at`. **Index:** `(tenant_id, term_id, day_of_week, starts_at)`.

---

## Computed-on-read (amended rules)

| Value | Rule |
|---|---|
| Assignments for a person on date D | rows where `staff_id = person`, `starts_on <= D`, and (`ends_on` null or `ends_on >= D`); plus a derived `homeroom` entry for every class where `class_teacher_id = person` |
| Subject teacher shown in the class UI | the `subject` assignment active on D, else `co_teacher`, else `cover`; **no fallback to the class teacher** (self-contained classes have real rows) |
| Class without a teacher (coverage) | `self_contained` or `form_plus_specialists`: `class_teacher_id` null or not on the books. `specialists_only`: never flagged on this rule |
| Subject without a teacher (coverage) | any `class_subject` with no active assignment on D, directly or through its `teaching_set_id`. For `self_contained` this cannot happen while the class teacher is set (rows are materialised) |
| Subjects a senior student offers | every `is_core` class-subject of their class plus their active `class_subject_enrollment` rows; report cards and results read this, never the class's full subject list |
| Unassigned teacher (coverage) | `is_teacher`, on the books, and neither a class teacher anywhere nor holder of any active assignment |
| Teaching load | count of active `subject` and `co_teacher` rows, and sum of `periods_per_week`; `cover` rows shown separately |
| History (report card signature, "who taught X in term T") | assignments whose window intersects T; never the current link |

### Materialisation of self-contained classes

On any of: class created or switched to `self_contained`, `class_teacher_id`
changed, `class_subject` added or removed:

1. For every `source = self_contained` row for the class whose `staff_id` is
   no longer the class teacher or whose subject slot was removed: if
   `starts_on < today`, close it (`ends_on = today - 1`); if `starts_on =
   today` it has no history yet, so soft delete it instead (closing it would
   violate `ends_on >= starts_on`).
2. Insert a `subject` row with `source = self_contained`, `starts_on = today`
   (or the class start), for every `class_subject` lacking an open row for the
   class teacher.

Switching a class away from `self_contained` closes its system rows and leaves
manual ones untouched.

---

## Endpoints (amended)

```
PATCH  /classes/{id}                               # + teaching_model
POST   /classes/{id}/subjects                      # body no longer takes teacher_ids
GET    /classes/{id}/assignments                   # ?on=YYYY-MM-DD (default today) ?include_history=true
POST   /classes/{id}/assignments                   # { class_subject_id, staff_id, role, term_id?, starts_on?, ends_on?, periods_per_week?, notes? }
PATCH  /assignments/{id}                           # change window, role, load, notes (self_contained rows: 403)
POST   /assignments/{id}/end                       # { ends_on }  closes the window; used for replacements and cover
DELETE /assignments/{id}                           # soft delete; only for mistakes, history prefers /end

GET    /staff/{id}/assignments                     # ?on=YYYY-MM-DD ?include_history=true  (replaces include=assignments); a set row expands to one entry per member class

POST   /teaching-sets                              # { subject_id, academic_session_id, name, class_subject_ids[] }
PATCH  /teaching-sets/{id}                         # add/remove members (same subject and session enforced)
DELETE /teaching-sets/{id}                         # soft delete; converts set assignments to per-member rows first (see below)
GET    /staff/coverage                             # now model-aware (see rules)
```

**Deleting a set** runs in one transaction: for each assignment with
`teaching_set_id = id`, the row keeps its `class_subject_id`, drops its
`teaching_set_id`, and one copy per other member class-subject is inserted
with the same `staff_id`, `role`, `term_id`, `starts_on`, `ends_on`,
`periods_per_week`, `source` and `notes`. Timetable periods stay on the
original row (the lesson was taught once; the copies carry no periods). Only
then is the set soft deleted. The unique partial index holds throughout
because the copies have distinct `class_subject_id`s.

**Validation:** `staff_id` must have `is_teacher = true`; the window must lie
inside the class's session; `cover` requires `ends_on`; a `self_contained`
class rejects manual `subject` rows for teachers other than the class teacher
(co-teachers and cover are allowed).

**Removed from v1.0:** `class_subject_teacher` table; `teacher_ids[]` on the
class-subject endpoints.

---

## Frontend contract changes (follow-up work in this repo)

- `Class.classTeacherId` becomes `string | null`; add `Class.teachingModel`.
- `ClassSubject.teacherIds` goes away; the class UI reads assignments.
- `StaffAssignment` gains `id`, `startsOn`, `endsOn`, `periodsPerWeek`, `source`, and its `role` union becomes `homeroom | subject | co_teacher | cover`.
- `lib/staff/coverage.ts` takes `teachingModel` into account per the rules above.
- Demo data: add one self-contained primary class with materialised rows, one specialists-only senior class with no class teacher, one `cover` assignment with an end date, elective sub-roster rows for every senior student, and one cross-stream teaching set (SS1 Further Mathematics for Science A and Arts A), so all patterns are exercised. **Done in this repo.**

---

## Migration (single)

1. Add `grade_level.section` and `grade_level.default_teaching_model`; backfill from grade names (Primary*, JSS*, SS*), default `form_plus_specialists`.
2. Add `class.teaching_model`, backfilled from the grade level default.
3. Create `teaching_set`, add `class_subject.teaching_set_id`, create `teaching_assignment` (with `teaching_set_id`) and `timetable_period`.
4. If any environment already holds `class_subject_teacher` rows: insert one `subject` row per link with `starts_on = class.session start`, `term_id = null`, `source = manual`; then drop the link table.
5. Run the self-contained materialisation for every `self_contained` class.

---

## Open questions (do not freeze without answers)

- **Subject-count rules per stream** (WASSCE: at least eight subjects, four core): validation config in the Results module, not schema. The sub-roster already carries the data.
- **Set membership across sessions:** a set is per session by design; promotion to the next session recreates sets (ties into the open promote-to-next-session item in the classes spec).

- **Co-teacher versus cover semantics in reports:** does a `cover` teacher's name appear on report cards for the covered term, or the responsible teacher's? Recommendation: both, "signed by" is the responsible teacher, "taught by" lists everyone active in the term.
- **Load limits:** should the API warn when a teacher exceeds a per-week period ceiling? Needs the timetable module; leave the field nullable for now.
- **Mixed sections within one grade level** (a "junior" grade run self-contained in one arm only): supported because the model is per class, but the setup default would be wrong for that arm. Acceptable.
