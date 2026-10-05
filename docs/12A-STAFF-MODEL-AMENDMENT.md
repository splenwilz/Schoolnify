# Schoolnify - Staff Spec Amendment: Person, Contracts, Checks and Seams

> **Amends:** `12-STAFF-MODULE-SPEC.md` (v1.0.0)
> **Version:** 1.1.0
> **Last Updated:** October 2026
> **Status:** Draft for product and backend sign-off
> **Basis:** `13-STAFF-MODEL-GAP-ANALYSIS.md` (Tier 1 in full, Tier 2 as reserved seams)
> **Migration:** one migration, applied with the staff build. The v1.0 `staff` table is **not** built as specified; this amendment replaces its employment columns.

---

## Why

The v1.0 staff record is one row that is at once the person, the login, the
job and the employment. Five research passes (Nigerian regulation and school
practice, six open-source and interoperability schemas, UK and US commercial
systems and statutory returns, HR modelling standards, and day-to-day school
operations) agree on the same split, and Nigerian reality forces it on day
one: most support staff have no email, a person routinely holds several posts
with allowances, and the payer is often not the school.

---

## Decisions

1. **Person, employment and account are three things.** A person can exist
   with no login. A login can be by email or phone. A person can be staff and
   a parent at once.
2. **Employment is a contract with roles**, not columns on the person. The
   common case (one contract, one role) stays simple in the UI.
3. **The employer or payer is recorded on the contract**, and employment types
   cover corps members, trainees, casual, volunteer and supply staff.
4. **History is kept as events**, and exit carries a reason and a rehire path.
5. **Credentials split into four**: education awards, professional
   registrations, vetting checks, training. Only the last three expire or
   renew.
6. **Sensitive data and statutory identifiers live apart** from the main
   record, with a lawful basis and a retention policy.
7. **Contacts, names and consent** are first class.
8. **Operational seams are reserved** (absence, attendance, cover, working
   pattern, duties, postings, pay structure, appraisal, exit) as tables and
   columns with no screens yet.

Unchanged from v1.0 and 11A: teaching assignments and sets, the pastoral class
teacher, the teaching model, credential expiry rules, coverage rules, salary
and leave and performance outside this module.

---

## Schema

### `person` (new)

One row per human, shared by staff, guardians and (later) students.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `title` | text null | Mr, Mrs, Dr, Rev. Fr., Alhaji, Chief |
| `first_name` | varchar(100) | required |
| `middle_name` | varchar(100) null | |
| `last_name` | varchar(100) | required |
| `suffix` | text null | |
| `preferred_name` | varchar(100) null | replaces v1.0 `display_name` |
| `former_names` | text[] | |
| `gender` | enum null | |
| `date_of_birth` | date null | |
| `photo_url` | text null | |
| `personal_email` | citext null | |
| `preferred_channel` | enum `sms` \| `whatsapp` \| `email` \| `push` | default `sms` |
| `preferred_language` | text null | |
| `merged_into_person_id` | uuid FK → person null | duplicate resolution seam |

**`person_phone`** (person, type `mobile` \| `home` \| `work`, number E.164, is_primary, verified_at).
**`person_address`** (person, lines, city, state, country, valid_from, valid_to, is_current).
**`emergency_contact`** (person, name, relationship, phone, alt_phone, email null, priority, is_primary; **exactly one primary per person**).

### `person_identifier` (new)

| Column | Type | Notes |
|---|---|---|
| `person_id` | uuid FK | |
| `type` | enum | `nin`, `bvn`, `tin`, `rsa_pin`, `nhis`, `state_payroll_number`, `ippis`, `nysc_call_up`, `ni_number`, `teacher_reference_number`, `passport`, `other` |
| `value` | text | encrypted at rest |
| `issuer` | text null | PFA name, state, issuing country |
| `valid_to` | date null | |

**Unique:** (`tenant_id`, `type`, `value`).

### `person_sensitive` (new, column-level access)

| Column | Notes |
|---|---|
| `religion`, `ethnicity`, `state_of_origin`, `lga_of_origin`, `nationality`, `marital_status` | NG official forms; UK census ethnic code |
| `disability`, `health_notes`, `blood_group` | |
| `lawful_basis` | enum `employment_obligation` \| `consent` \| `legal_claim` |
| `retention_until` | date null; computed from the exit date and the tenant retention policy (NDPA default: six months after purpose lapses unless law requires longer) |

Bank details stay in payroll. Criminal checks record outcome and date only (see `vetting_check`), never document copies.

### `user_account` (new, replaces email-as-login)

| Column | Notes |
|---|---|
| `person_id` | FK → person, **nullable until invited** |
| `identifier_type` | enum `email` \| `phone` |
| `identifier` | citext; unique per tenant |
| `can_login` | bool; false on exit date automatically |
| `invited_at`, `activated_at`, `deactivated_at` | |

A staff member with no account is valid and common.

### `staff` (amended: becomes the employment header)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `tenant_id` | uuid FK | |
| `person_id` | uuid FK → person | |
| `employee_number` | varchar(32) | unique per tenant; auto-allocated |
| `work_email` | citext null | **nullable**; unique when present |
| `staff_category` | enum `academic` \| `support` | |
| `is_teacher` | bool | |
| `permission_role` | enum | seam, unchanged |
| `employment_status` | enum `onboarding` \| `active` \| `suspended` \| `inactive` | **projection** of the latest `employment_event`; never edited directly |
| `hire_date` | date | first contract start; projection |
| `exit_date` | date null | projection |
| `exit_reason` | enum null | projection |
| `qualified_subject_ids` | uuid[] | |
| `custom_fields` | jsonb | |
| `cover_role` | enum `provides` \| `cover_supervisor` \| `excluded` | seam |
| `cover_priority` | smallint null | seam |
| `appraiser_id` | uuid FK → staff null | seam |
| `appraisal_cycle_key` | text null | seam |
| `career_stage` | text null | seam: `ect`, `main`, `upper`, `leadership`, or a GL code |
| `senior_leadership` | bool | UK census flag |

Removed from v1.0 `staff`: `designation`, `department`, `employment_type`,
`fte_percent`, `reports_to_id`, `grade_band`, `phone`, `avatar`, `gender`,
`display_name`, `middle_name` (all moved to `person`, `staff_contract` or
`contract_role`).

### `staff_contract` (new)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `staff_id` | uuid FK | |
| `employer` | enum | `school`, `government_board`, `pta`, `mission`, `nysc`, `agency`, `volunteer`, `self` |
| `agency_id` | uuid null | when `employer = agency` |
| `contract_type` | enum | `permanent`, `fixed_term`, `temporary`, `casual`, `corps_member`, `trainee`, `volunteer`, `supply` |
| `start_date` | date | |
| `end_date` | date null | required for `fixed_term`, `corps_member`, `trainee`, `supply` |
| `probation_end_date` | date null | |
| `confirmation_date` | date null | NG confirmation of appointment |
| `hours_per_week` | numeric null | |
| `weeks_per_year` | smallint null | |
| `fte` | numeric(4,3) | sum of roles; 1.000 = full time |
| `is_term_time_only` | bool | |
| `notice_period_days` | smallint null | |
| `document_url` | text null | |

**Check:** `end_date IS NULL OR end_date >= start_date`.

### `contract_role` (new)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `contract_id` | uuid FK | |
| `designation` | varchar(80) | job title; config lookup later |
| `role_kind` | enum `post` \| `responsibility` | post = the job; responsibility = HOD, form teacher, housemaster, exam officer, games master, safeguarding lead |
| `department` | varchar(80) null | |
| `reports_to_id` | uuid FK → staff null | |
| `fte_share` | numeric(4,3) null | |
| `allowance_code` | text null | TLR1, TLR2, TLR3, responsibility allowance code |
| `allowance_amount` | numeric null | amount only; payment is payroll |
| `is_primary` | bool | exactly one primary post per staff at any date |
| `start_date` | date | |
| `end_date` | date null | TLR3 and fixed-term responsibilities require it |

The v1.0 `designation`, `department`, `reports_to_id` and `fte_percent` are
projections of the primary post.

### `pay_structure` (new, on `contract_role`, nullable, public-service seam)

| Column | Notes |
|---|---|
| `salary_structure` | `CONPSS`, `TSS`, state variant, or custom |
| `grade_level`, `step`, `cadre` | GL 01 to 17, step, Education Officer cadre |
| `first_appointment_date`, `last_promotion_date` | |
| `retirement_rule` | enum `60_or_35` \| `65_or_40` ; derived default from cadre and state |

### `employment_event` (new)

| Column | Notes |
|---|---|
| `staff_id` | |
| `type` | `hire`, `probation_end`, `confirmation`, `promotion`, `transfer`, `suspension`, `reinstatement`, `contract_renewal`, `status_change`, `exit`, `rehire` |
| `effective_date` | |
| `outcome` / `reason` | probation outcome; suspension reason; exit reason `resignation` \| `dismissal` \| `end_of_contract` \| `retirement` \| `death` \| `transfer_out` |
| `eligible_for_rehire` | bool null, on exit |
| `end_date` | for suspensions |
| `notes`, `recorded_by`, `recorded_at` | |

The `staff.employment_status` projection is recomputed from events; a rehire
opens a new `staff_contract` under the same `person`.

### Credentials split (replaces `staff_credential`)

**`education_award`** (staff, award `nce` \| `bed` \| `bsc` \| `hnd` \| `pgde` \| `msc` \| `phd` \| `other`, subject, institution, year, class, verified_by, verified_at).

**`professional_registration`** (staff, body `trcn` \| `qts` \| `qtls` \| `eyts` \| `hlta` \| `other`, number, category `A` \| `B` \| `C` \| `D` null, valid_from, valid_to null, cpd_credits smallint null, verified_by, verified_at). Status derives from `valid_to` with the v1.0 window rules.

**`vetting_check`** (staff, type `identity` \| `police_character` \| `dbs_enhanced` \| `barred_list` \| `prohibition` \| `section_128` \| `overseas` \| `right_to_work` \| `medical_fitness` \| `safeguarding_policy_signed` \| `code_of_conduct_signed` \| `other`, completed_on, checked_by, outcome `clear` \| `concern` \| `pending`, expiry null, reference, agency_assurance_received_on null). The Single Central Record is a view over this table and must include supply staff and drop leavers.

**`training_record`** (staff, type `safeguarding` \| `first_aid` \| `fire` \| `mcpd` \| `induction` \| `other`, provider, date, expiry null, hours, credits, certificate_ref, verified_by). `training_type` catalogue carries `renewal_months` and `mandatory_for` roles.

### Operational seams (new, reserved, no screens)

| Table | Key columns | Consumer |
|---|---|---|
| `staff_absence` | staff, category (`SIC`, `PRG`, `MAT`, `PUB`, `SEC`, `TRN`, `UNA`, `UNP`, `OTH`), local_reason, start, end null, half_day_value, status, approver, certificate_ref, cover_only | Leave, cover, census; "away today" reads this |
| `staff_attendance_event` | staff, timestamp, kind `in` \| `out`, source `register` \| `app` \| `biometric`, device | Attendance, payroll |
| `cover_assignment` | absence, date, period_label, teaching_assignment, cover_staff, status, paid, rate, agency | Timetable, payroll |
| `working_pattern` | staff, weekday, am, pm | Timetable |
| `scheduling_prefs` | staff, max_periods_day, max_periods_week, max_consecutive, preferred_room, campus | Timetable |
| `duty` / `duty_assignment` | name, type, weekdays, times; staff, weekday or date | Timetable rota |
| `boarding_post` | staff, house, role, live_in, start, end | Boarding |
| `school_posting` | person, school, letter_reference, start, end | Public-school transfers, chains |
| `induction_status` | staff, route, start, terms_completed, tutor, mentor, body | Appraisal, timetable cap |
| `consent_flag` | person, purpose (`id_card`, `website`, `directory`), granted_at, withdrawn_at, basis | Comms |
| `exit_checklist_item` | staff, item, done_at, by | Offboarding |

`teaching_assignment` gains `is_lead` (one per class subject per day) and `allocation_percent`.

---

## Endpoints (amended)

```
POST   /staff                          # creates person + staff + first contract + primary role in one call; email optional; send_invite requires an identifier
GET    /staff/{id}                     # ?include=contracts,roles,registrations,checks,awards,training,contacts,events
PATCH  /staff/{id}                     # person and header fields only
POST   /staff/{id}/contracts           # new contract (also used for rehire)
POST   /contracts/{id}/roles           # add post or responsibility
POST   /contracts/{id}/roles/{rid}/end # { end_date }
POST   /staff/{id}/events              # suspension, confirmation, promotion, exit, reinstatement
GET    /staff/{id}/events
POST   /staff/{id}/invite              # creates or reactivates user_account by email or phone
*      /staff/{id}/{awards|registrations|checks|training}
GET    /staff/scr                      # Single Central Record view (UK); includes supply, excludes leavers
GET    /staff/compliance               # now covers registrations, checks and training expiries
```

**Validation:** at least one of work email or mobile phone; a person with a
`user_account` must have the matching identifier; one primary post per staff
per date; FTE shares sum to the contract FTE; `end_date` required for the
dated contract types; `is_teacher` requires `staff_category = academic`.

---

## Frontend contract changes (done in this repo, October 2026)

- `Staff` splits into `Person` and `Staff` with `contracts: StaffContract[]`; the current flat fields become projections exposed by the API for list rendering.
- `email` nullable; `phone` moves to `person.phones` with one primary.
- `StaffCredential` becomes four types; the credentials tab shows four lists and the expiry rules apply to registrations, checks and training.
- Form: email optional, employer and contract type, title and preferred name, emergency contact. Import: the same as optional columns.
- Employment status is not editable anywhere (no form select, no import column); it is projected from events. Status changes will be "record event" actions on the profile.
- One set of cross-field rules (`lib/staff/rules.ts`) is shared by the form schema and the CSV import, which also normalises national phone numbers for the school's country.
- Projections: FTE is summed across contracts active on the date; `contractLapsed` flags a last contract that ended with no exit event, shown as "Contract ended" and off the books.
- Edit saves carry the id of the contract being changed (`StaffUpdateInput`) and pre-fill from that contract, not from the first hire.
- Job tab: contracts and roles with allowances; employment events as a timeline.
- `lib/staff/*` keep their rules; `credentials.ts` works over registrations, checks and training.

---

## Migration (single)

1. Create `person`, `person_phone`, `person_address`, `emergency_contact`, `person_identifier`, `person_sensitive`, `user_account`.
2. Create `staff_contract`, `contract_role`, `pay_structure`, `employment_event`.
3. Create `education_award`, `professional_registration`, `vetting_check`, `training_record`.
4. Create the seam tables.
5. Build `staff` as the header described here, with the projections maintained by trigger or on write.

---

## Open questions

- **Person across tenants:** a public-school teacher posted between two schools on the platform. Recommendation: `person` is per tenant now, with `school_posting` and the government identifiers as the join key for a later cross-tenant merge.
- **Which vetting checks are mandatory per country and designation**, so a `missing` status can exist. Needs a per-tenant check policy; reserve `check_policy(designation, check_type, required)`.
- **Tenant timezone and country.** "Today" is computed as the UTC calendar date on the server, so a school in Lagos sees yesterday's date for the first hour after midnight. The school's country (ISO 3166-1 alpha-2, now on the demo `schoolInfo`) drives phone normalisation; both belong in tenant settings.
- **Retention periods per record class** beyond the NDPA default (UK IRMS: personnel file termination plus six years; child-related training forty years).
