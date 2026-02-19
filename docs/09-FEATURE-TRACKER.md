# Schoolnify Feature Tracker

> **Last Updated:** 2026-02-19
> **Sources:** Blueprint document + Industry research (PowerSchool, Gradelink, Fedena, OpenSIS, SchoolMint, Veracross, FACTS/TADS)
>
> **Legend:**
> - **Source**: B = Blueprint, I = Industry, B+I = Both
> - **Priority**: Essential / Important / Nice-to-Have
> - **Status**: Pending / In Progress / Done
> - **Dashboard**: Which role's dashboard this feature belongs to

---

## Currently Implemented (School Admin Dashboard)

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/school-admin` | Done |
| Students | `/school-admin/students` | Done |
| Student Detail | `/school-admin/students/[id]` | Done |
| Staff | `/school-admin/staff` | Done |
| Staff Detail | `/school-admin/staff/[id]` | Done |
| Classes | `/school-admin/classes` | Done |
| Class Detail | `/school-admin/classes/[id]` | Done |
| Attendance | `/school-admin/attendance` | Done |
| Finances | `/school-admin/finances` | Done |
| Announcements | `/school-admin/messages` | Done |
| Reports | `/school-admin/reports` | Done |
| Settings | `/school-admin/settings` | Done |
| Help & Support | `/school-admin/help` | Done |
| Internal Messaging | Header slide-out panel | Done |
| Marketing Home | `/` | Done |
| Features/Pricing/Docs/Download | Marketing pages | Stub |
| Sign In / Sign Up | Auth pages | Stub |

---

## DASHBOARDS OVERVIEW

The system has 7 distinct dashboards/portals:

| # | Dashboard | Route Prefix | Description |
|---|-----------|-------------|-------------|
| 1 | **School Admin** | `/school-admin/` | Full school management, oversight of all sub-admins |
| 2 | **Super Admin** | `/super-admin/` | Platform-level management across all schools |
| 3 | **Teacher** | `/teacher/` | Classroom management, grading, attendance, communication |
| 4 | **Parent** | `/parent/` | Monitor child's progress, pay fees, communicate |
| 5 | **Student** | `/student/` | View grades, timetable, submit assignments |
| 6 | **Sub-Admin: Bursar** | `/bursar/` | Financial management, fee collection, payroll |
| 7 | **Sub-Admin: Librarian** | `/librarian/` | Book catalog, issue/return, library analytics |
| 8 | **Sub-Admin: Exam Officer** | `/exam-officer/` | Exam scheduling, grading, report cards, transcripts |
| 9 | **Sub-Admin: Registrar** | `/registrar/` | Admissions, enrollment, student records |
| 10 | **Sub-Admin: Facilities** | `/facilities/` | Asset tracking, maintenance, room booking |

---

## 1. AUTHENTICATION & SHARED (All Dashboards)

| # | Feature | Source | Priority | Status | Notes |
|---|---------|--------|----------|--------|-------|
| 1 | User login (email/password) | B+I | Essential | Stub | Sign-in page exists but not functional |
| 2 | User registration (school self-registration) | B+I | Essential | Stub | Sign-up page exists but not functional |
| 3 | Password reset flow | B+I | Essential | Pending | |
| 4 | Multi-factor authentication (MFA/2FA) | B+I | Important | Pending | Settings page has UI stub |
| 5 | Role-based access control (RBAC) | B+I | Essential | Pending | |
| 6 | JWT token management | B | Essential | Pending | |
| 7 | Session management and timeout | B+I | Essential | Pending | |
| 8 | Audit logging (who did what, when) | B+I | Essential | Pending | |
| 9 | Data encryption at rest and in transit | B | Essential | Pending | |
| 10 | FERPA / GDPR / COPPA compliance | B+I | Important | Pending | |
| 11 | Token-based invitation system (admin issues tokens for role-based signup) | B | Important | Pending | Blueprint-specific: users register with tokens |
| 12 | Multi-language / localization | I | Important | Pending | |
| 13 | WCAG accessibility compliance | B+I | Important | Pending | |
| 14 | Dark mode / theme customization | I | Nice-to-Have | Done | Theme toggle exists |

---

## 2. SCHOOL ADMIN DASHBOARD (`/school-admin/`)

### 2.1 Admissions & Enrollment

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 15 | Online application forms (customizable) | B+I | Essential | Pending |
| 16 | Application status tracking (inquiry -> applied -> accepted -> enrolled) | B+I | Essential | Pending |
| 17 | Document upload during application | B+I | Important | Pending |
| 18 | Admission workflow management (stages, approvals) | B+I | Important | Pending |
| 19 | Waitlist management | I | Important | Pending |
| 20 | Re-enrollment / promotion workflow | B+I | Important | Pending |
| 21 | Bulk admission processing | I | Important | Pending |
| 22 | Admissions analytics (conversion rates, funnel) | I | Nice-to-Have | Pending |
| 23 | Enrollment contracts with digital signatures | I | Nice-to-Have | Pending |

### 2.2 Academic Management (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 24 | Academic year/term/semester configuration | B+I | Essential | Pending |
| 25 | Subject/course management | B+I | Essential | Pending |
| 26 | Timetable/schedule creation (auto conflict detection) | B+I | Essential | Pending |
| 27 | Room/resource allocation for classes | B+I | Important | Pending |
| 28 | Curriculum and syllabus management | B | Important | Pending |
| 29 | Class promotion rules (auto/manual) | B+I | Important | Pending |

### 2.3 Communication & Notifications (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 30 | Email notifications (automated + manual) | B+I | Essential | Pending |
| 31 | SMS notifications | B+I | Important | Pending |
| 32 | Push notifications (mobile) | B+I | Important | Pending |
| 33 | Group messaging (by class, section, role) | B+I | Important | Pending |
| 34 | Emergency alerts/notifications | B+I | Important | Pending |
| 35 | Scheduled notifications | B | Important | Pending |
| 36 | Notification preferences (per-user opt-in/out) | B+I | Important | Pending |
| 37 | Communication templates | I | Nice-to-Have | Pending |

### 2.4 Attendance & Discipline Enhancements (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 38 | Period-wise / subject-wise attendance | I | Important | Pending |
| 39 | Absent/tardy auto-notifications to parents | B+I | Important | Pending |
| 40 | Chronic absenteeism tracking and alerts | I | Important | Pending |
| 41 | Student leave request and approval flow | I | Important | Pending |
| 42 | Behavior/discipline incident logging | I | Important | Pending |
| 43 | Disciplinary action management (warnings, suspensions) | I | Important | Pending |
| 44 | Parent notification of disciplinary incidents | I | Important | Pending |
| 45 | Positive behavior rewards/points system | I | Nice-to-Have | Pending |

### 2.5 Staff/HR Management Enhancements (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 46 | Staff attendance tracking (daily + leave) | B+I | Essential | Pending |
| 47 | Leave management (apply, approve, balance, types) | B+I | Important | Pending |
| 48 | Staff performance tracking/appraisals | B | Important | Pending |
| 49 | Staff workload and teaching load analysis | I | Important | Pending |
| 50 | Staff document storage | I | Important | Pending |
| 51 | Professional development/training tracking | B | Nice-to-Have | Pending |
| 52 | Substitute teacher management | I | Nice-to-Have | Pending |
| 53 | Staff onboarding workflow | I | Nice-to-Have | Pending |

### 2.6 Sub-Admin Management (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 54 | Sub-admin token invitation system | B | Important | Pending |
| 55 | Admin oversight of sub-admin activities (view-only monitoring) | B | Important | Pending |
| 56 | Sub-admin role configuration and permissions | B | Important | Pending |

### 2.7 Calendar & Events (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 57 | School calendar (academic year, terms, holidays) | B+I | Essential | Pending |
| 58 | Event creation and management | B+I | Important | Pending |
| 59 | Event categories (academic, sports, cultural) | I | Important | Pending |
| 60 | Event reminders and notifications | I | Important | Pending |
| 61 | Parent-teacher conference scheduling | I | Important | Pending |
| 62 | Calendar sync (Google Calendar, iCal) | I | Nice-to-Have | Pending |

### 2.8 Document Management (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 63 | Student/staff document storage (per record) | B+I | Important | Pending |
| 64 | Certificate and letter templates (bonafide, TC) | I | Important | Pending |
| 65 | Auto-generation of certificates and letters | I | Important | Pending |
| 66 | Bulk document generation (report cards, IDs) | I | Important | Pending |
| 67 | Transfer certificate (TC) generation | I | Important | Pending |
| 68 | ID card generation and printing | I | Nice-to-Have | Pending |
| 69 | Digital signature support | I | Nice-to-Have | Pending |

### 2.9 Transport Management (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 70 | Route management (routes and stops) | I | Important | Pending |
| 71 | Vehicle management (details, capacity) | I | Important | Pending |
| 72 | Student-to-route assignment | I | Important | Pending |
| 73 | Transport fee management | I | Important | Pending |
| 74 | GPS real-time tracking | I | Nice-to-Have | Pending |
| 75 | Parent notifications (bus arrival, delays) | I | Nice-to-Have | Pending |

### 2.10 Health / Medical Records (Admin-Side)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 76 | Student health profiles (blood group, allergies) | I | Important | Pending |
| 77 | Emergency medical information | I | Essential | Pending |
| 78 | Immunization records | I | Important | Pending |
| 79 | Allergy alerts (visible to teachers, cafeteria) | I | Important | Pending |
| 80 | Special needs / IEP tracking | I | Important | Pending |
| 81 | Clinic visit logs | I | Nice-to-Have | Pending |

### 2.11 Hostel / Boarding (Admin-Side, If Applicable)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 82 | Room allocation and management | I | Important | Pending |
| 83 | Hostel fee management | I | Important | Pending |
| 84 | Hostel attendance | I | Nice-to-Have | Pending |

---

## 3. SUPER ADMIN DASHBOARD (`/super-admin/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 85 | Multi-tenant school management (create, suspend, delete schools) | B | Essential | Pending |
| 86 | Subscription/plan management (Free, Premium tiers) | B | Essential | Pending |
| 87 | School onboarding workflow | B | Essential | Pending |
| 88 | Feature access control per school/plan | B | Important | Pending |
| 89 | Global announcements across all schools | B | Important | Pending |
| 90 | Support ticket system | B | Important | Pending |
| 91 | Platform-wide analytics (total schools, users, revenue) | B | Important | Pending |
| 92 | Global audit logs | B | Important | Pending |
| 93 | System settings (global config) | B | Important | Pending |
| 94 | School data isolation and compliance monitoring | B | Essential | Pending |

---

## 4. TEACHER DASHBOARD (`/teacher/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 95 | Teacher dashboard (my classes, schedule, tasks overview) | B+I | Essential | Pending |
| 96 | View and manage assigned classes | B+I | Essential | Pending |
| 97 | Mark class attendance | B+I | Essential | Pending |
| 98 | Gradebook (enter grades per student per assignment/exam) | B+I | Essential | Pending |
| 99 | Create and manage assignments/homework | B+I | Important | Pending |
| 100 | View student submissions and provide feedback | B+I | Important | Pending |
| 101 | Student progress monitoring (grades, attendance, behavior) | B+I | Important | Pending |
| 102 | Generate progress reports for students | B+I | Important | Pending |
| 103 | Communicate with parents (messaging) | B+I | Essential | Pending |
| 104 | Communicate with admin/other staff (messaging) | B+I | Essential | Done (internal messaging panel) |
| 105 | View personal timetable/schedule | B+I | Essential | Pending |
| 106 | Apply for leave | B+I | Important | Pending |
| 107 | View school calendar and events | B+I | Important | Pending |
| 108 | Access professional development resources | B | Nice-to-Have | Pending |
| 109 | Lesson planning tools | B | Nice-to-Have | Pending |
| 110 | View class analytics (performance trends) | B | Important | Pending |

---

## 5. PARENT DASHBOARD (`/parent/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 111 | Parent dashboard (children overview, key metrics) | B+I | Essential | Pending |
| 112 | View child's attendance records | B+I | Essential | Pending |
| 113 | View child's grades and report cards | B+I | Essential | Pending |
| 114 | View and pay fees online | B+I | Essential | Pending |
| 115 | Message teachers and administrators | B+I | Essential | Pending |
| 116 | View homework and assignments | B+I | Important | Pending |
| 117 | View school announcements and events | B+I | Essential | Pending |
| 118 | View exam schedules and results | B+I | Important | Pending |
| 119 | View child's behavior/discipline records | I | Important | Pending |
| 120 | Apply for leave on behalf of child | I | Important | Pending |
| 121 | Multiple children view (single login) | B+I | Important | Pending |
| 122 | View school calendar | B+I | Important | Pending |
| 123 | Access downloadable documents (report cards, receipts) | I | Important | Pending |
| 124 | Feedback/survey participation | B | Nice-to-Have | Pending |
| 125 | Volunteer sign-up and community engagement | B | Nice-to-Have | Pending |
| 126 | Track transport/bus information | I | Nice-to-Have | Pending |
| 127 | Parent consent forms (digital) | I | Nice-to-Have | Pending |

---

## 6. STUDENT DASHBOARD (`/student/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 128 | Student dashboard (grades, schedule, assignments overview) | B+I | Essential | Pending |
| 129 | View grades and academic progress | B+I | Essential | Pending |
| 130 | View personal timetable | B+I | Important | Pending |
| 131 | View and submit assignments online | B+I | Important | Pending |
| 132 | View attendance records | B+I | Important | Pending |
| 133 | View exam schedules and results | B+I | Important | Pending |
| 134 | Access learning materials/resources | B | Important | Pending |
| 135 | Communication with teachers | B+I | Important | Pending |
| 136 | View school announcements | B+I | Important | Pending |
| 137 | View school calendar | B+I | Important | Pending |
| 138 | Apply for leave | I | Nice-to-Have | Pending |
| 139 | View library records (borrowed books) | I | Nice-to-Have | Pending |
| 140 | View fee payment status | I | Nice-to-Have | Pending |
| 141 | Extracurricular activities management | B | Nice-to-Have | Pending |
| 142 | Student digital portfolio | I | Nice-to-Have | Pending |

---

## 7. SUB-ADMIN: BURSAR DASHBOARD (`/bursar/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 143 | Bursar dashboard (financial overview, KPIs) | B | Essential | Pending |
| 144 | Fee structure configuration (by class, category, term) | B+I | Essential | Pending |
| 145 | Fee collection and tracking (paid, pending, overdue) | B+I | Essential | Pending |
| 146 | Online payment gateway integration (Flutterwave, Paystack) | B+I | Essential | Pending |
| 147 | Automated invoicing and billing | B+I | Essential | Pending |
| 148 | Payment receipts generation (auto) | B+I | Essential | Pending |
| 149 | Payment reminders and overdue notifications | B+I | Important | Pending |
| 150 | Flexible payment plans / installments | I | Important | Pending |
| 151 | Discounts, scholarships, fee waivers | I | Important | Pending |
| 152 | Refund processing | I | Important | Pending |
| 153 | Expense tracking and budget management | B | Important | Pending |
| 154 | Financial reporting (collection summary, revenue, outstanding) | B+I | Essential | Pending |
| 155 | Payroll management (staff salaries, deductions, payslips) | B+I | Important | Pending |
| 156 | Audit trails for all financial transactions | B+I | Important | Pending |
| 157 | Accounting integration (QuickBooks, Xero) | I | Nice-to-Have | Pending |
| 158 | Fine management (library, discipline) | I | Nice-to-Have | Pending |

---

## 8. SUB-ADMIN: LIBRARIAN DASHBOARD (`/librarian/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 159 | Librarian dashboard (stats, recent activity) | B | Essential | Pending |
| 160 | Book catalog management (add, edit, categorize) | B+I | Important | Pending |
| 161 | Book search (by title, author, ISBN, category) | B+I | Important | Pending |
| 162 | Book issue / return / renewal tracking | B+I | Important | Pending |
| 163 | Member management (student, staff borrowers) | B+I | Important | Pending |
| 164 | Overdue tracking and fine calculation | B+I | Important | Pending |
| 165 | Library reports and analytics (popular books, trends) | B | Nice-to-Have | Pending |
| 166 | Digital resource / e-book management | B | Nice-to-Have | Pending |
| 167 | Barcode/QR code scanning for books | I | Nice-to-Have | Pending |
| 168 | Book reservation system | I | Nice-to-Have | Pending |
| 169 | Student reading history | I | Nice-to-Have | Pending |

---

## 9. SUB-ADMIN: EXAM OFFICER DASHBOARD (`/exam-officer/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 170 | Exam officer dashboard (upcoming exams, stats) | B | Essential | Pending |
| 171 | Exam/assessment scheduling and management | B+I | Essential | Pending |
| 172 | Gradebook management (assignment/quiz/test/exam scores) | B+I | Essential | Pending |
| 173 | Flexible grading systems (points, %, letters, GPA, custom scales) | B+I | Essential | Pending |
| 174 | Report card generation (customizable templates) | B+I | Essential | Pending |
| 175 | Transcript generation | B+I | Important | Pending |
| 176 | GPA/CGPA calculation | B+I | Important | Pending |
| 177 | Weighted grade categories | I | Important | Pending |
| 178 | Exam seating plan generation | B | Nice-to-Have | Pending |
| 179 | Honor roll / awards / certificates generation | I | Nice-to-Have | Pending |
| 180 | Exam results analytics and reports | B | Important | Pending |
| 181 | Homework/assignment management (create, assign, collect, grade) | B+I | Important | Pending |

---

## 10. SUB-ADMIN: REGISTRAR DASHBOARD (`/registrar/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 182 | Registrar dashboard (admissions pipeline, enrollment stats) | B | Essential | Pending |
| 183 | Online application forms management | B+I | Essential | Pending |
| 184 | Application review and status tracking | B+I | Essential | Pending |
| 185 | Student records management (CRUD) | B+I | Essential | Pending |
| 186 | Enrollment processing and class assignment | B+I | Essential | Pending |
| 187 | Document collection and verification | B+I | Important | Pending |
| 188 | Transfer certificate (TC) generation | I | Important | Pending |
| 189 | Student ID generation | I | Important | Pending |
| 190 | Class promotion processing | B+I | Important | Pending |
| 191 | Waitlist management | I | Important | Pending |
| 192 | Bulk enrollment processing | I | Important | Pending |
| 193 | Student archive and data retention | I | Nice-to-Have | Pending |

---

## 11. SUB-ADMIN: FACILITIES MANAGER DASHBOARD (`/facilities/`)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 194 | Facilities dashboard (assets, maintenance, bookings) | B | Nice-to-Have | Pending |
| 195 | School asset tracking (computers, furniture, lab equipment) | B | Nice-to-Have | Pending |
| 196 | Inventory stock management | B | Nice-to-Have | Pending |
| 197 | Room/facility booking system | B | Nice-to-Have | Pending |
| 198 | Maintenance and repair tracking | B | Nice-to-Have | Pending |
| 199 | Purchase order / procurement management | B | Nice-to-Have | Pending |
| 200 | Vendor management | I | Nice-to-Have | Pending |

---

## 12. INTEGRATION & TECHNICAL (Backend/Infra)

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 201 | RESTful API backend (Node.js + Express) | B+I | Essential | Pending |
| 202 | MongoDB database with multi-tenant schema | B | Essential | Pending |
| 203 | Payment gateway integration (Flutterwave/Paystack) | B+I | Essential | Pending |
| 204 | SMS gateway integration (Twilio, etc.) | I | Important | Pending |
| 205 | Email service integration (SendGrid, SES) | I | Important | Pending |
| 206 | SSO support (Google, Microsoft) | I | Important | Pending |
| 207 | Data import/export (CSV, Excel, PDF) | B+I | Essential | Pending |
| 208 | WebSocket/SSE real-time updates | B | Important | Pending |
| 209 | Offline mode with sync (SQLite -> MongoDB) | B | Nice-to-Have | Pending |
| 210 | Mobile app (React Native, offline-first) | B | Important | Pending |

---

## 13. MARKETING & PUBLIC PAGES

| # | Feature | Source | Priority | Status |
|---|---------|--------|----------|--------|
| 211 | Features page | - | Important | Stub |
| 212 | Pricing page (plan comparison) | - | Important | Stub |
| 213 | Documentation / API docs page | - | Important | Stub |
| 214 | Download page (mobile apps) | - | Nice-to-Have | Stub |

---

## SUMMARY

| Category | Count | Essential | Important | Nice-to-Have |
|----------|-------|-----------|-----------|--------------|
| Auth & Shared | 14 | 9 | 4 | 1 |
| School Admin | 70 | 10 | 48 | 12 |
| Super Admin | 10 | 4 | 6 | 0 |
| Teacher | 16 | 5 | 8 | 3 |
| Parent | 17 | 5 | 8 | 4 |
| Student | 15 | 2 | 8 | 5 |
| Bursar | 16 | 6 | 7 | 3 |
| Librarian | 11 | 1 | 5 | 5 |
| Exam Officer | 12 | 4 | 5 | 3 |
| Registrar | 12 | 5 | 5 | 2 |
| Facilities | 7 | 0 | 0 | 7 |
| Integration | 10 | 4 | 4 | 2 |
| Marketing | 4 | 0 | 3 | 1 |
| **TOTAL** | **214** | **55** | **111** | **48** |

---

## RECOMMENDED BUILD ORDER

### Phase 1: Foundation (Build First)
1. Authentication system (#1-11) — enables all other dashboards
2. Academic year/term configuration (#24) — everything depends on this
3. Marketing pages (#211-213) — public-facing presence

### Phase 2: School Admin Enhancements
4. Calendar & events (#57-62)
5. Admissions & enrollment (#15-23)
6. Communication & notifications (#30-37)
7. Attendance & discipline enhancements (#38-45)
8. Staff/HR enhancements (#46-53)
9. Sub-admin management (#54-56)

### Phase 3: Teacher & Academic Portals
10. Teacher dashboard (#95-110)
11. Exam Officer dashboard (#170-181) — gradebook, report cards, exams

### Phase 4: Parent & Student Portals
12. Parent dashboard (#111-127)
13. Student dashboard (#128-142)

### Phase 5: Financial & Administrative Sub-Admins
14. Bursar dashboard (#143-158)
15. Registrar dashboard (#182-193)
16. Librarian dashboard (#159-169)

### Phase 6: Advanced & Nice-to-Have
17. Transport management (#70-75)
18. Health/medical records (#76-81)
19. Document generation (#63-69)
20. Super Admin dashboard (#85-94)
21. Facilities dashboard (#194-200)
22. Hostel management (#82-84)
23. Backend integrations (#201-210)
