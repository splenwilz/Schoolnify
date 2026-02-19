# School Admin Dashboard — Missing Features & Build Plan

> **Last Updated:** 2026-02-19
> **Context:** The School Admin dashboard has 13 pages built. This file tracks what's still missing and the build order.
> **Frontend Path:** `/Users/splenwilz/projects/schoolnify/schoolnify-web/src/`
> **Build Command:** `cd /Users/splenwilz/projects/schoolnify/schoolnify-web && npx next build`

---

## Already Built

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/school-admin` | Done |
| Students + Detail | `/school-admin/students`, `/school-admin/students/[id]` | Done |
| Staff + Detail | `/school-admin/staff`, `/school-admin/staff/[id]` | Done |
| Classes + Detail | `/school-admin/classes`, `/school-admin/classes/[id]` | Done |
| Attendance | `/school-admin/attendance` | Done |
| Finances | `/school-admin/finances` | Done |
| Announcements | `/school-admin/messages` | Done |
| Reports | `/school-admin/reports` | Done |
| Settings | `/school-admin/settings` | Done |
| Help & Support | `/school-admin/help` | Done |
| Internal Messaging | Header slide-out panel | Done |

---

## Build Queue (Priority Order)

### Phase 1: The 3 Biggest Gaps (Build Now)

#### 1. Calendar & Events Page — `IN PROGRESS`
- **Route:** `/school-admin/calendar`
- **Sidebar:** Add "Calendar" nav item between "Reports" and "Settings"
- **Features:**
  - Monthly/weekly/daily calendar view
  - Academic year terms and holidays display
  - Event creation modal (title, date, time, category, description)
  - Event categories: Academic, Sports, Cultural, Meeting, Holiday
  - Color-coded events by category
  - Upcoming events sidebar
  - Quick stats: total events this month, upcoming this week, holidays remaining
- **Design:** Match existing card style (`rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]`), brand color `#0891B2`

#### 2. Admissions Page — `IN PROGRESS`
- **Route:** `/school-admin/admissions`
- **Sidebar:** Add "Admissions" nav item after "Students"
- **Features:**
  - Pipeline/kanban view: Inquiry → Applied → Under Review → Accepted → Enrolled
  - Application list with filters (status, grade, date)
  - Application detail view (student info, documents, notes, status history)
  - Stats: total applications, acceptance rate, pending review, enrolled this term
  - Bulk actions (accept, reject, waitlist)
  - Search across applicant name, email, grade
- **Design:** CRM-style pipeline similar to existing pages

#### 3. Academic Configuration Page — `IN PROGRESS`
- **Route:** `/school-admin/academics`
- **Sidebar:** Add "Academics" nav item after "Classes"
- **Features:**
  - **Terms & Sessions tab:** Academic year setup, term dates, current term indicator
  - **Subjects tab:** Subject list (name, code, department, teachers assigned), add/edit
  - **Timetable tab:** Weekly timetable grid by class, drag-and-drop or manual entry
  - **Promotions tab:** Promotion rules (criteria, auto/manual), promote students between grades
  - Stats: total subjects, active terms, classes with timetables
- **Design:** Tabbed layout matching Settings page pattern

---

### Phase 2: Important Enhancements

#### 4. Discipline & Behavior — `PENDING`
- **Route:** `/school-admin/discipline`
- **Features:** Incident logging, action management, student behavior history, parent alerts

#### 5. Staff HR Enhancements — `PENDING`
- Integrate into existing Staff page:
  - Staff attendance tab
  - Leave management (apply/approve flow)
  - Performance tracking tab
  - Document storage per staff member

#### 6. Sub-Admin Management — `PENDING`
- **Route:** `/school-admin/sub-admins`
- **Features:** Token invitation, role assignment, activity monitoring (view-only)

#### 7. Document Management — `PENDING`
- **Route:** `/school-admin/documents`
- **Features:** Document storage per student/staff, certificate templates, TC generation, ID cards

---

### Phase 3: Additional Pages

#### 8. Transport Management — `PENDING`
- **Route:** `/school-admin/transport`
- **Features:** Routes, vehicles, student assignments, fee management

#### 9. Health Records — `PENDING`
- **Route:** `/school-admin/health`
- **Features:** Student health profiles, allergies, emergency info, immunization records

#### 10. Hostel Management — `PENDING`
- **Route:** `/school-admin/hostel`
- **Features:** Room allocation, hostel fees, hostel attendance

#### 11. Notification System — `PENDING`
- Backend integration for email/SMS/push delivery
- Notification center in header
- Scheduled notifications

---

## Design Patterns (Reference)

- **Brand color:** `#0891B2` (teal), hover: `#0E7490`
- **Card style:** `rounded-2xl bg-[var(--card)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]`
- **CSS variables:** `var(--foreground)`, `var(--card)`, `var(--border)`, `var(--muted)`, `var(--background-secondary)`
- **Stats cards:** 4-column grid with icon, value, label, trend
- **Tables:** Checkbox, search, filter tabs, pagination, bulk actions
- **Detail pages:** Stat rings + tabbed content
- **Animations:** Framer Motion, spring: `type: "spring", damping: 30, stiffness: 300`
- **Full-height layout:** `-m-4 lg:-m-8` negative margin technique
- **Utility:** `cn()` from `@/lib/utils` (clsx + tailwind-merge)
