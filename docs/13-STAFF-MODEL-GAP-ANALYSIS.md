# Schoolnify - Staff Model Gap Analysis

> **Version:** 1.0.0
> **Date:** October 2026
> **Inputs:** five primary-source research passes (Nigerian regulation and practice; Gibbon, openSIS, RosarioSIS, Fedena, Ed-Fi, OneRoster, SIF, PowerSchool schemas; Arbor, Bromcom, SIMS, the DfE School Workforce Census and KCSIE Single Central Record; Veracross, Blackbaud, Infinite Campus, Skyward; TimeTabler, aSc, Untis; Workday, SuccessFactors, HR Open Standards; NDPA 2023, GDPR, ICO, IRMS retention)
> **Compares against:** `src/types/staff.ts`, `12-STAFF-MODULE-SPEC.md` v1.0, `11A-TEACHING-MODEL-AMENDMENT.md` v1.1
> **Status:** Proposal. Nothing here is built yet.

---

## What the current model gets right

These were confirmed by several independent sources and need no change:

- **Teaching assignment as a dated, role-bearing row** (subject, co-teacher, cover) attached to a class subject, with teaching sets across arms. Ed-Fi `StaffSectionAssociation`, PowerSchool `SectionTeacher` and Bromcom "Main Teacher per date range" all model exactly this.
- **Pastoral class teacher kept separate from teaching.** Veracross, Blackbaud and Infinite Campus all treat advisory or homeroom as its own leader record, never inferred from sections.
- **Teaching model per class** as the escape hatch for self-contained, form-plus-specialists and specialists-only staffing.
- **Credentials keyed on an expiry date with verified-by**, which is the Arbor and Bromcom SCR shape.
- **Custom fields bag for country-specific identifiers**, matching RosarioSIS, openSIS and Gibbon.
- **Reports-to**, which the appraisal seam needs.
- **Salary, leave balances, payroll and performance kept out** of the staff record. Every HR-and-MIS integration studied splits along the same line.

---

## Tier 1: structural gaps (fix before the backend builds spec 12)

Deferring any of these means a schema migration later that touches every staff row.

| # | Gap | Evidence | Change |
|---|---|---|---|
| 1 | **Work email is required and unique and doubles as login.** Most Nigerian support staff, and many teachers, have a phone but no email (UBEC: 60% of public primary teachers lack basic digital skills). Every system studied lets a staff record exist with no login. | NG practice; Gibbon `canLogin`, openSIS `login_authentication`, OneRoster `userProfiles`, PowerSchool empty `LoginID`; SuccessFactors Person / Employment / User split | `email` nullable, unique only when present. Separate `user_account` (nullable link to the person; identifier email or phone; `can_login`). Phone-first OTP login for staff without email. |
| 2 | **One designation, department, FTE and reports-to per person.** Cannot express HOD plus teacher plus housemaster, a department move mid-year, UK contract roles, or responsibility allowances. | SWC: one contract, one post, many roles; Arbor positions; Gibbon contracts; Ed-Fi assignment vs employment; Workday multiple jobs; NG responsibility allowances | `staff_contract` (employer, type, start, end, probation end, hours per week, weeks per year, FTE) with `contract_role` children (designation, department, FTE share, allowance code and amount, start, end, is_primary). The current columns become a projection of the primary role. |
| 3 | **Employer or payer is not recorded.** PTA-paid, government-board-paid, mission-paid, NYSC and volunteer staff sit side by side in one Nigerian school; agency supply in the UK. | NG: 3,252 PTA teachers regularised 2026; corps members 60% of teaching labour in some states; SWC service agreements; SIF `FundingSource` | `staff_contract.employer` enum: `school`, `government_board`, `pta`, `mission`, `nysc`, `agency`, `volunteer`, `self`. `agency_id` when agency. |
| 4 | **Employment types miss real categories.** | NG casual and daily-paid, NYSC, teaching-practice students, clergy; UK supply and agency; Ed-Fi `Substitute/temporary`, `Volunteer/no contract` | Add `casual`, `volunteer`, `corps_member`, `trainee`, `supply`. Corps members get `tenure_end` (12 months) and NYSC identifiers. |
| 5 | **Status is a flag; exit has no reason, history is overwritten.** | Workday terminate event (reason, last day, eligible for rehire); SuccessFactors effective-dated job info; Ed-Fi `separationReasonDescriptor`; NG PSR certificate of service | `employment_event` (type: hire, probation_end with outcome, confirmation, promotion, transfer, suspension with reason and end, contract_renewal, exit with reason `resignation`, `dismissal`, `end_of_contract`, `retirement`, `death`, `transfer_out`; eligible_for_rehire; effective_date; recorded_by). Rehire creates a new contract under the same person. |
| 6 | **One credential table conflates four things.** Degrees do not expire, registrations renew, vetting checks have an outcome and a checker, training accumulates credits. | TRCN categories A to D with three-year licence and MCPD credits; KCSIE paragraph 350 check list; SWC qualification module; Gibbon first aid expiry | Split into `education_award` (award, institution, year, class), `professional_registration` (body, number, category, valid from and to, status), `vetting_check` (type, completed on, checked by, outcome, expiry, evidence reference, agency assurance), `training_record` (course, provider, date, expiry, credits). Keep the existing table shape for the two that expire. |
| 7 | **Sensitive data has no home and no retention rule.** DOB, state and LGA of origin, religion, ethnicity, disability, health, NIN, BVN, TIN, RSA PIN, NI number, bank details are all collected at hire in Nigeria and the UK. | NDPA 2023 s.30 and GAID 2025 Art. 49 (six-month default after purpose lapses); GDPR Art. 9 and 10; ICO employment records; KCSIE DBS copies six months | `person_identifier` (type, value, issuer) and `person_sensitive` (religion, ethnicity, disability, health notes) with column-level access, lawful basis, and a per-tenant retention policy driving `retention_until` after exit. Record check outcomes and dates, never document copies, for criminal checks. |
| 8 | **No emergency contact, address or personal contact channels.** | Every schema studied; PSR 070308 address record for absentee follow-up; Workday one-primary rule | `emergency_contact` (name, relationship, phones, priority, one primary enforced), structured `address` with dates, `personal_email`, typed phones, `preferred_channel` (SMS, WhatsApp, email), `consent_flag` per purpose (ID card, website, directory). |
| 9 | **Names are too thin.** Titles and honorifics (Rev. Fr., Alhaji, Dr.), preferred name, former names, suffix are on every Nigerian roll and in the SWC. | SWC former names; Ed-Fi `preferredFirstName`, `maidenName`; NG mission schools | `title`, `preferred_name`, `former_names`, `suffix`, `photo_url`. |

---

## Tier 2: seams to reserve now (small tables or columns, no screens yet)

Cheap to add with the Tier 1 migration, painful to retrofit once the leave, timetable, payroll and appraisal modules exist.

| # | Seam | Consumed later by | Shape |
|---|---|---|---|
| 10 | **Staff absence** with a census-mappable category plus local reason, half-day precision, open end date, approval, certificate | Leave, cover, payroll, UK census | `staff_absence` (category enum SIC, PRG, MAT, PUB, SEC, TRN, UNA, UNP, OTH plus local reason; start, end nullable; half_day_value; status; approver; certificate_ref). "Away today" reads this instead of leave requests. |
| 11 | **Daily attendance events** (sign-in, sign-out, source) | Lagos Time Book inspection, Delta biometric clock-in, payroll for hourly staff | `staff_attendance_event` (timestamp, kind, source: register, app, biometric; device). Derived daily status: present, late, absent, on leave. |
| 12 | **Cover per lesson** keyed to a teaching assignment and a date and period | Timetable, payroll, STPCD cover counts | `cover_assignment` (absence, date, period label, teaching_assignment, cover staff, status, paid, rate, agency). Staff flags `cover_role` (supervisor, provides, excluded), `cover_priority`. |
| 13 | **Working pattern and availability** | Timetable export to TimeTabler, Untis, aSc; part-time days-lost | `working_pattern` (weekday, AM, PM), `scheduling_prefs` (max periods per day and week, max consecutive, preferred room, campus). |
| 14 | **Duties and boarding** | Timetable rota, boarding module | `duty` (name, type, weekdays, times) and `duty_assignment`; `boarding_post` (house, role, live_in). |
| 15 | **Posting and transfer history across schools** | Public-school teachers belong to SUBEB or TESCOM, not the school; chains and MATs | `school_posting` (person, school, letter reference, start, end). Multi-tenant identity: the person must survive a move between tenants. |
| 16 | **Public-service pay structure fields** | Promotion cycles, retirement planning, payroll reconciliation | On the contract role: `salary_structure` (CONPSS, TSS, state variant), `grade_level`, `step`, `cadre`; `state_payroll_number` as a person identifier; dates of first appointment, confirmation, last promotion; retirement rule by cadre and state (60/35 versus 65/40 for teachers). |
| 17 | **Appraisal and induction seam** | Appraisal module, UK ECT timetable cap, NYSC tenure | `appraiser_id`, `appraisal_cycle_key`, `career_stage`; `induction_status` (route, start, terms completed, tutor, mentor). |
| 18 | **Teaching assignment extras** | State reporting, cover matching | `is_lead` (one teacher of record per day), `allocation_percent`; `subject_competence` already covered by `qualified_subject_ids`. |
| 19 | **Exit checklist and deactivation** | Access control, payroll, references | `exit_checklist_item`; automatic login deactivation on leaving date; `retention_until`. |

---

## Tier 3: later modules (no schema reservation needed)

Leave entitlements and balances, payroll and allowances payment, performance objectives and observations, timetable generation, cover slips and statistics, census XML generation, SCR report, recruitment, HR system integrations, biometric device integration.

---

## Recommended cut for this iteration

**Spec 12 goes to v1.1** with Tier 1 in full and Tier 2 as reserved tables and columns. The frontend changes that follow, because they touch screens already built:

- Email optional on the form and import; phone-first identity; "no login" staff.
- Job tab shows contracts and roles instead of one designation; employer or payer and the extended employment types on the form and import.
- Credentials tab becomes four lists: registrations, checks, qualifications, training. The existing expiry logic applies to the first two.
- Overview gains emergency contacts and the richer name fields.
- Import template gains employer, title, date of birth, emergency contact and the public-service fields as optional columns.

Everything in Tier 2 lands as types and demo data only, so the specs and tests exist before the modules that consume them.

---

## Sources

Government and regulators: NYSC decree and allowance; Vanguard and The Sun on PTA teacher regularisation (August 2026); NCCE minimum standards; Lagos State Ministry of Education guidelines (2016) and the Lagos safeguarding executive order; NSIWC circulars and CONPSS; Public Service Rules; Harmonised Retirement Age for Teachers Act 2022; TRCN registration and MCPD; PenCom RSA guidelines; NSITF; NHIA Act 2022; NDPA 2023 and NDPC GAID 2025; Labour Act; DfE School Workforce Census 2026 specification; KCSIE 2026; STPCD 2025; ICO employment records guidance; IRMS retention schedule; GDPR Articles 9 and 10.

Systems: Gibbon `gibbon.sql`; openSIS-Classic installer SQL; RosarioSIS `rosariosis.sql`; Fedena `schema.rb`; Ed-Fi ODS 7.3 OpenAPI and staff domain reference; OneRoster 1.2 CSV binding; SIF 2.7M HR and 3.3 staffPersons; PowerSchool SIS admin docs; Arbor, Bromcom and SIMS help centres; Veracross, Blackbaud, Infinite Campus and Skyward docs; TimeTabler, aSc EduPage and Untis help; Workday and SuccessFactors documentation; Access Education, MHR iTrent, Every and BambooHR education pages.
