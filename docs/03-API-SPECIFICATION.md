# Schoolnify - API Specification

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Base URL:** `https://api.schoolnify.com/api/v1`  
> **Framework:** FastAPI (Python)

---

## Table of Contents

1. [Overview](#overview)
2. [API Standards](#api-standards)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Super Admin Endpoints](#super-admin-endpoints)
5. [School/Tenant Endpoints](#schooltenant-endpoints)
6. [User Management Endpoints](#user-management-endpoints)
7. [Academic Endpoints](#academic-endpoints)
8. [Communication Endpoints](#communication-endpoints)
9. [Financial Endpoints](#financial-endpoints)
10. [Error Handling](#error-handling)

---

## Overview

The Schoolnify API follows RESTful principles with consistent patterns across all endpoints. FastAPI's automatic OpenAPI documentation is available at `/docs` (Swagger UI) and `/redoc` (ReDoc).

### API Versioning

- Current version: `v1`
- Version included in URL path: `/api/v1/...`
- Breaking changes will increment the version number

### Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://api.schoolnify.com/api/v1` |
| Staging | `https://staging-api.schoolnify.com/api/v1` |
| Development | `http://localhost:8000/api/v1` |

---

## API Standards

### Request Headers

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <access_token>
X-Tenant-ID: <tenant_uuid>           # Required for tenant-scoped requests
X-Request-ID: <unique_request_id>    # Optional, for tracing
```

### Response Format

All responses follow a consistent structure:

#### Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": { ... },                   // Response payload
    "meta": {                          // Optional metadata
        "page": 1,
        "per_page": 20,
        "total": 100,
        "total_pages": 5
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email format",
            "code": "INVALID_FORMAT"
        }
    ],
    "error_code": "VALIDATION_ERROR"
}
```

### Pagination

List endpoints support cursor-based or offset-based pagination:

```
GET /api/v1/users?page=1&per_page=20
GET /api/v1/users?cursor=eyJpZCI6MTIzfQ==&limit=20
```

### Filtering & Sorting

```
GET /api/v1/users?status=active&role=teacher&sort=-created_at
```

- Prefix with `-` for descending order
- Multiple filters use AND logic
- Filter operators: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `like`

### Date Formats

- All dates in ISO 8601 format: `2026-01-05T10:30:00Z`
- Timezone: UTC by default, can be converted on client

---

## Authentication Endpoints

### POST /auth/register

Register a new school (tenant) with an admin account.

**Access:** Public

**Request:**
```json
{
    "school": {
        "name": "Kings College Lagos",
        "email": "admin@kingscollege.edu.ng",
        "phone": "+2348012345678",
        "address_line_1": "2 Catholic Mission Street",
        "city": "Lagos",
        "state": "Lagos"
    },
    "admin": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@kingscollege.edu.ng",
        "password": "SecurePassword123!"
    }
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "School registered successfully. Please verify your email.",
    "data": {
        "tenant": {
            "id": "uuid-tenant-id",
            "name": "Kings College Lagos",
            "slug": "kings-college-lagos",
            "subscription_status": "trial"
        },
        "user": {
            "id": "uuid-user-id",
            "email": "johndoe@kingscollege.edu.ng",
            "is_email_verified": false
        }
    }
}
```

---

### POST /auth/login

Authenticate user and receive access tokens.

**Access:** Public

**Request:**
```json
{
    "email": "johndoe@kingscollege.edu.ng",
    "password": "SecurePassword123!",
    "tenant_slug": "kings-college-lagos"   // Optional if email is unique across tenants
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": "uuid-user-id",
            "email": "johndoe@kingscollege.edu.ng",
            "first_name": "John",
            "last_name": "Doe",
            "roles": ["school_admin"],
            "tenant": {
                "id": "uuid-tenant-id",
                "name": "Kings College Lagos",
                "slug": "kings-college-lagos"
            }
        }
    }
}
```

---

### POST /auth/refresh

Refresh access token using refresh token.

**Access:** Authenticated (Refresh Token)

**Request:**
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
        "expires_in": 3600
    }
}
```

---

### POST /auth/logout

Invalidate current tokens.

**Access:** Authenticated

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

### POST /auth/forgot-password

Initiate password reset flow.

**Access:** Public

**Request:**
```json
{
    "email": "johndoe@kingscollege.edu.ng"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "If the email exists, a password reset link has been sent."
}
```

---

### POST /auth/reset-password

Reset password using token from email.

**Access:** Public

**Request:**
```json
{
    "token": "reset-token-from-email",
    "password": "NewSecurePassword123!",
    "password_confirmation": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Password reset successfully"
}
```

---

### POST /auth/verify-email

Verify email address.

**Access:** Public

**Request:**
```json
{
    "token": "verification-token-from-email"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Email verified successfully"
}
```

---

### POST /auth/mfa/setup

Setup Multi-Factor Authentication.

**Access:** Authenticated

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "secret": "JBSWY3DPEHPK3PXP",
        "qr_code_url": "data:image/png;base64,...",
        "backup_codes": ["12345678", "23456789", ...]
    }
}
```

---

### POST /auth/mfa/verify

Verify MFA code during login.

**Access:** Public (with MFA challenge token)

**Request:**
```json
{
    "challenge_token": "mfa-challenge-token",
    "code": "123456"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
    }
}
```

---

## Super Admin Endpoints

All super admin endpoints require the `super_admin` role.

### GET /superadmin/tenants

List all schools/tenants on the platform.

**Access:** Super Admin

**Query Parameters:**
- `page`, `per_page`: Pagination
- `status`: Filter by subscription status
- `search`: Search by name or email
- `sort`: Sort field (e.g., `-created_at`)

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-tenant-id",
            "name": "Kings College Lagos",
            "slug": "kings-college-lagos",
            "email": "admin@kingscollege.edu.ng",
            "subscription_status": "active",
            "subscription_plan": {
                "id": "uuid-plan-id",
                "name": "Premium"
            },
            "subscription_expires_at": "2026-12-31T23:59:59Z",
            "is_active": true,
            "stats": {
                "total_students": 1500,
                "total_staff": 120,
                "total_users": 2000
            },
            "created_at": "2025-01-15T10:00:00Z"
        }
    ],
    "meta": {
        "page": 1,
        "per_page": 20,
        "total": 500,
        "total_pages": 25
    }
}
```

---

### POST /superadmin/tenants

Create a new school/tenant.

**Access:** Super Admin

**Request:**
```json
{
    "name": "Queen's College",
    "email": "info@queenscollege.edu.ng",
    "phone": "+2348098765432",
    "address_line_1": "1-7 Apapa Oshodi Expressway",
    "city": "Yaba",
    "state": "Lagos",
    "subscription_plan_id": "uuid-plan-id",
    "admin": {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane.smith@queenscollege.edu.ng",
        "send_invite": true
    }
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "School created successfully",
    "data": {
        "tenant": { ... },
        "admin": { ... }
    }
}
```

---

### GET /superadmin/tenants/{tenant_id}

Get detailed tenant information.

**Access:** Super Admin

---

### PUT /superadmin/tenants/{tenant_id}

Update tenant information.

**Access:** Super Admin

---

### DELETE /superadmin/tenants/{tenant_id}

Deactivate a tenant (soft delete).

**Access:** Super Admin

---

### GET /superadmin/analytics

Platform-wide analytics.

**Access:** Super Admin

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "overview": {
            "total_tenants": 500,
            "active_tenants": 480,
            "total_users": 100000,
            "active_users_today": 45000
        },
        "subscriptions": {
            "trial": 50,
            "active": 400,
            "expired": 30,
            "cancelled": 20
        },
        "revenue": {
            "mrr": 5000000.00,
            "arr": 60000000.00,
            "growth_rate": 15.5
        },
        "usage": {
            "storage_used_gb": 500,
            "api_calls_today": 1500000
        }
    }
}
```

---

### POST /superadmin/announcements

Create platform-wide announcement.

**Access:** Super Admin

**Request:**
```json
{
    "title": "Scheduled Maintenance",
    "content": "The platform will be unavailable on January 10, 2026 from 2:00 AM to 4:00 AM WAT for scheduled maintenance.",
    "priority": "high",
    "target_audience": "all",
    "publish_at": "2026-01-08T10:00:00Z",
    "expires_at": "2026-01-10T04:00:00Z"
}
```

---

## School/Tenant Endpoints

These endpoints are scoped to the current tenant (from JWT or X-Tenant-ID header).

### GET /school

Get current school profile.

**Access:** School Admin, Staff

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "uuid-tenant-id",
        "name": "Kings College Lagos",
        "slug": "kings-college-lagos",
        "code": "KCL",
        "email": "admin@kingscollege.edu.ng",
        "phone": "+2348012345678",
        "website": "https://kingscollege.edu.ng",
        "address": {
            "line_1": "2 Catholic Mission Street",
            "city": "Lagos",
            "state": "Lagos",
            "country": "Nigeria"
        },
        "logo_url": "https://cdn.schoolnify.com/logos/kings-college.png",
        "primary_color": "#1E40AF",
        "secondary_color": "#FBBF24",
        "settings": {
            "timezone": "Africa/Lagos",
            "academic_year_start": 9,
            "grading_system": "WAEC"
        },
        "subscription": {
            "plan": "Premium",
            "status": "active",
            "expires_at": "2026-12-31T23:59:59Z"
        }
    }
}
```

---

### PUT /school

Update school profile.

**Access:** School Admin

**Request:**
```json
{
    "name": "Kings College Lagos",
    "phone": "+2348012345679",
    "settings": {
        "timezone": "Africa/Lagos",
        "grading_system": "WAEC"
    }
}
```

---

### GET /school/stats

Get school statistics and dashboard data.

**Access:** School Admin

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "students": {
            "total": 1500,
            "active": 1480,
            "by_class": {
                "JSS1": 250,
                "JSS2": 240,
                ...
            }
        },
        "staff": {
            "total": 120,
            "teachers": 85,
            "non_teaching": 35
        },
        "attendance": {
            "today": {
                "present": 1420,
                "absent": 60,
                "rate": 95.9
            },
            "this_week": {
                "average_rate": 94.5
            }
        },
        "academics": {
            "current_term": "First Term",
            "current_session": "2025/2026",
            "assignments_pending": 45,
            "exams_upcoming": 3
        },
        "finance": {
            "fees_collected_this_term": 25000000.00,
            "fees_outstanding": 5000000.00,
            "collection_rate": 83.3
        }
    }
}
```

---

## User Management Endpoints

### GET /users

List users in the current tenant.

**Access:** School Admin, Staff (with user.view permission)

**Query Parameters:**
- `role`: Filter by role
- `status`: active, inactive
- `search`: Search by name or email
- `class_id`: Filter by class (for students)

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-user-id",
            "email": "teacher@school.com",
            "first_name": "John",
            "last_name": "Smith",
            "phone": "+2348012345678",
            "avatar_url": null,
            "roles": ["teacher"],
            "is_active": true,
            "last_login_at": "2026-01-04T15:30:00Z",
            "created_at": "2025-06-15T10:00:00Z"
        }
    ],
    "meta": { ... }
}
```

---

### POST /users

Create a new user (invite).

**Access:** School Admin

**Request:**
```json
{
    "email": "newteacher@school.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "phone": "+2348098765432",
    "roles": ["teacher"],
    "send_invite": true,
    "profile": {
        "department": "Sciences",
        "designation": "Chemistry Teacher"
    }
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "User created and invitation sent",
    "data": {
        "id": "uuid-user-id",
        "email": "newteacher@school.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "roles": ["teacher"],
        "is_active": true,
        "invitation_sent_at": "2026-01-05T10:00:00Z"
    }
}
```

---

### GET /users/{user_id}

Get user details.

**Access:** School Admin, Self

---

### PUT /users/{user_id}

Update user details.

**Access:** School Admin, Self (limited fields)

---

### DELETE /users/{user_id}

Deactivate user.

**Access:** School Admin

---

### POST /users/bulk-invite

Bulk invite users via CSV upload.

**Access:** School Admin

**Request (multipart/form-data):**
- `file`: CSV file with columns (email, first_name, last_name, role, class)

**Response (202 Accepted):**
```json
{
    "success": true,
    "message": "Bulk invite job queued",
    "data": {
        "job_id": "uuid-job-id",
        "total_rows": 150,
        "status": "processing"
    }
}
```

---

### GET /users/me

Get current authenticated user profile.

**Access:** Authenticated

---

### PUT /users/me

Update current user profile.

**Access:** Authenticated

---

### PUT /users/me/password

Change current user password.

**Access:** Authenticated

**Request:**
```json
{
    "current_password": "OldPassword123!",
    "new_password": "NewPassword123!",
    "new_password_confirmation": "NewPassword123!"
}
```

---

## Academic Endpoints

### Sessions & Terms

#### GET /academic/sessions

List academic sessions.

**Access:** Authenticated

#### POST /academic/sessions

Create academic session.

**Access:** School Admin

**Request:**
```json
{
    "name": "2025/2026",
    "start_date": "2025-09-01",
    "end_date": "2026-07-31",
    "is_current": true
}
```

#### GET /academic/sessions/{session_id}/terms

List terms in a session.

#### POST /academic/sessions/{session_id}/terms

Create a term.

**Request:**
```json
{
    "name": "First Term",
    "sequence_number": 1,
    "start_date": "2025-09-01",
    "end_date": "2025-12-15",
    "is_current": true
}
```

---

### Classes & Sections

#### GET /classes

List all classes.

**Access:** Authenticated

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-class-id",
            "name": "JSS 1",
            "code": "JSS1",
            "level": 7,
            "category": "junior_secondary",
            "class_teacher": {
                "id": "uuid-user-id",
                "name": "Mr. John Smith"
            },
            "sections": [
                {
                    "id": "uuid-section-id",
                    "name": "A",
                    "full_name": "JSS 1A",
                    "student_count": 40,
                    "form_teacher": {
                        "id": "uuid-user-id",
                        "name": "Mrs. Jane Doe"
                    }
                }
            ],
            "is_active": true
        }
    ]
}
```

#### POST /classes

Create a class.

**Access:** School Admin

#### GET /classes/{class_id}/sections

List sections in a class.

#### POST /classes/{class_id}/sections

Create a class section.

#### GET /classes/{class_id}/students

List students in a class.

---

### Subjects

#### GET /subjects

List all subjects.

**Access:** Authenticated

#### POST /subjects

Create a subject.

**Access:** School Admin

**Request:**
```json
{
    "name": "Mathematics",
    "code": "MTH",
    "category": "core",
    "department": "sciences",
    "credit_units": 3
}
```

#### POST /class-subjects

Assign subject to class with teacher.

**Access:** School Admin

**Request:**
```json
{
    "class_section_id": "uuid-section-id",
    "subject_id": "uuid-subject-id",
    "teacher_id": "uuid-teacher-id",
    "schedule": [
        {
            "day": "monday",
            "start_time": "09:00",
            "end_time": "10:00",
            "room": "Room 101"
        }
    ]
}
```

---

### Students & Enrollment

#### GET /students

List all students.

**Access:** School Admin, Teachers

**Query Parameters:**
- `class_id`: Filter by class
- `section_id`: Filter by section
- `status`: enrollment status

#### POST /students

Register a new student.

**Access:** School Admin, Registrar

**Request:**
```json
{
    "user": {
        "first_name": "Chinedu",
        "last_name": "Okonkwo",
        "email": "parent@email.com"
    },
    "profile": {
        "student_id": "KCL/2025/001",
        "admission_number": "ADM001",
        "admission_date": "2025-09-01",
        "date_of_birth": "2010-05-15",
        "gender": "male",
        "blood_group": "O+",
        "state_of_origin": "Anambra"
    },
    "enrollment": {
        "class_section_id": "uuid-section-id",
        "academic_session_id": "uuid-session-id"
    },
    "guardian": {
        "first_name": "Emeka",
        "last_name": "Okonkwo",
        "email": "emeka.okonkwo@email.com",
        "phone": "+2348012345678",
        "relationship": "father"
    }
}
```

#### GET /students/{student_id}

Get student details with academic history.

#### GET /students/{student_id}/grades

Get student grades across terms.

#### GET /students/{student_id}/attendance

Get student attendance records.

---

### Assignments

#### GET /assignments

List assignments.

**Access:** Teachers, Students, Parents

**Query Parameters:**
- `class_subject_id`: Filter by class subject
- `term_id`: Filter by term
- `status`: draft, published, closed
- `type`: homework, classwork, project, test

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-assignment-id",
            "title": "Quadratic Equations Practice",
            "description": "Solve the following quadratic equations...",
            "type": "homework",
            "class_subject": {
                "id": "uuid-class-subject-id",
                "class_section": "JSS 3A",
                "subject": "Mathematics"
            },
            "teacher": {
                "id": "uuid-user-id",
                "name": "Mr. John Smith"
            },
            "max_score": 20,
            "due_date": "2026-01-10T23:59:59Z",
            "status": "published",
            "stats": {
                "total_students": 40,
                "submitted": 25,
                "graded": 20
            },
            "created_at": "2026-01-03T10:00:00Z"
        }
    ]
}
```

#### POST /assignments

Create an assignment.

**Access:** Teachers

**Request:**
```json
{
    "title": "Essay: Climate Change",
    "description": "Write a 500-word essay on the effects of climate change.",
    "instructions": "1. Include at least 3 references\n2. Use proper formatting",
    "type": "homework",
    "class_subject_id": "uuid-class-subject-id",
    "term_id": "uuid-term-id",
    "max_score": 50,
    "weight": 1.0,
    "due_date": "2026-01-15T23:59:59Z",
    "allow_late_submission": true,
    "late_submission_penalty": 10,
    "status": "published"
}
```

#### GET /assignments/{assignment_id}

Get assignment details.

#### PUT /assignments/{assignment_id}

Update assignment.

#### DELETE /assignments/{assignment_id}

Delete assignment (soft delete).

#### GET /assignments/{assignment_id}/submissions

List all submissions for an assignment.

**Access:** Teacher (assignment owner)

---

### Submissions

#### POST /assignments/{assignment_id}/submissions

Submit an assignment.

**Access:** Students

**Request (multipart/form-data):**
- `content`: Text content (optional)
- `files`: Uploaded files (optional)

#### GET /submissions/{submission_id}

Get submission details.

#### PUT /submissions/{submission_id}/grade

Grade a submission.

**Access:** Teacher

**Request:**
```json
{
    "score": 45,
    "feedback": "Excellent work! Good use of references and clear arguments."
}
```

---

### Attendance

#### GET /attendance

Get attendance records.

**Access:** Teachers, School Admin

**Query Parameters:**
- `class_section_id`: Required
- `date`: Single date (YYYY-MM-DD)
- `date_from`, `date_to`: Date range
- `term_id`: Filter by term

#### POST /attendance

Record attendance.

**Access:** Teachers

**Request:**
```json
{
    "class_section_id": "uuid-section-id",
    "date": "2026-01-05",
    "session_type": "full_day",
    "records": [
        {
            "student_id": "uuid-student-id",
            "status": "present"
        },
        {
            "student_id": "uuid-student-id",
            "status": "absent",
            "remarks": "Sick - parent called"
        },
        {
            "student_id": "uuid-student-id",
            "status": "late",
            "check_in_time": "08:15"
        }
    ]
}
```

#### PUT /attendance/{attendance_id}

Update an attendance record.

---

### Grades

#### GET /grades

Get grades.

**Access:** Teachers, Students, Parents

**Query Parameters:**
- `student_id`: Filter by student
- `class_subject_id`: Filter by subject
- `term_id`: Filter by term

#### POST /grades

Record term grades.

**Access:** Teachers

**Request:**
```json
{
    "student_id": "uuid-student-id",
    "class_subject_id": "uuid-class-subject-id",
    "term_id": "uuid-term-id",
    "ca_score": 30,
    "exam_score": 55,
    "teacher_comment": "Shows great improvement. Keep it up!"
}
```

#### GET /grades/report-card/{student_id}

Generate student report card for a term.

**Access:** Teachers, School Admin, Parent (own child), Student (self)

**Query Parameters:**
- `term_id`: Required

---

## Communication Endpoints

### Announcements

#### GET /announcements

List announcements.

**Access:** Authenticated

#### POST /announcements

Create announcement.

**Access:** School Admin, Teachers (limited scope)

**Request:**
```json
{
    "title": "Parent-Teacher Meeting",
    "content": "We invite all parents to our annual parent-teacher meeting...",
    "target_audience": "parents",
    "target_class_ids": [],
    "priority": "high",
    "publish_at": "2026-01-06T08:00:00Z",
    "expires_at": "2026-01-20T23:59:59Z"
}
```

---

### Messages

#### GET /messages

Get user's messages.

**Access:** Authenticated

**Query Parameters:**
- `folder`: inbox, sent, drafts
- `thread_id`: Get messages in a thread
- `is_read`: Filter by read status

#### POST /messages

Send a message.

**Access:** Authenticated

**Request:**
```json
{
    "recipient_id": "uuid-user-id",
    "subject": "Question about homework",
    "body": "Good day, I wanted to ask about...",
    "attachments": []
}
```

#### PUT /messages/{message_id}/read

Mark message as read.

---

### Notifications

#### GET /notifications

Get user's notifications.

**Access:** Authenticated

**Query Parameters:**
- `is_read`: Filter by read status
- `type`: Filter by notification type

#### PUT /notifications/{notification_id}/read

Mark notification as read.

#### PUT /notifications/read-all

Mark all notifications as read.

---

## Financial Endpoints

### Fee Structure

#### GET /fees/structure

List fee structures.

**Access:** School Admin, Bursar, Parents

#### POST /fees/structure

Create fee structure.

**Access:** School Admin, Bursar

**Request:**
```json
{
    "name": "Tuition Fee",
    "description": "First term tuition fee",
    "amount": 150000.00,
    "academic_session_id": "uuid-session-id",
    "term_id": "uuid-term-id",
    "class_ids": ["uuid-class-id"],
    "type": "mandatory",
    "due_date": "2025-10-15"
}
```

---

### Payments

#### GET /payments

List payments.

**Access:** School Admin, Bursar

**Query Parameters:**
- `status`: pending, completed, failed
- `date_from`, `date_to`: Date range
- `student_id`: Filter by student

#### POST /payments/initialize

Initialize a payment.

**Access:** Parents, School Admin

**Request:**
```json
{
    "student_id": "uuid-student-id",
    "fee_structure_id": "uuid-fee-id",
    "amount": 150000.00,
    "gateway": "paystack"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "payment_id": "uuid-payment-id",
        "authorization_url": "https://checkout.paystack.com/...",
        "reference": "SCH_PAY_123456",
        "amount": 150000.00
    }
}
```

#### POST /payments/webhook/{gateway}

Payment gateway webhook handler.

**Access:** Webhook (verified by signature)

#### GET /payments/{payment_id}/receipt

Get payment receipt.

**Access:** School Admin, Bursar, Parent (own payment)

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async processing) |
| 204 | No Content (successful delete) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 422 | Unprocessable Entity (business logic error) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Codes

```json
{
    "VALIDATION_ERROR": "Request validation failed",
    "AUTHENTICATION_REQUIRED": "Authentication is required",
    "INVALID_CREDENTIALS": "Invalid email or password",
    "TOKEN_EXPIRED": "Access token has expired",
    "PERMISSION_DENIED": "You do not have permission to perform this action",
    "RESOURCE_NOT_FOUND": "The requested resource was not found",
    "DUPLICATE_ENTRY": "A record with this identifier already exists",
    "TENANT_NOT_FOUND": "School/tenant not found",
    "TENANT_INACTIVE": "This school's account is not active",
    "SUBSCRIPTION_EXPIRED": "School subscription has expired",
    "RATE_LIMIT_EXCEEDED": "Too many requests. Please try again later."
}
```

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 10 requests/minute per IP |
| General API | 100 requests/minute per user |
| File Upload | 20 requests/hour per user |
| Bulk Operations | 5 requests/hour per tenant |

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704456000
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [02-DATABASE-DESIGN.md](./02-DATABASE-DESIGN.md) - Database schema
- [04-AUTHENTICATION.md](./04-AUTHENTICATION.md) - Auth details

---

*Document maintained by: Schoolnify Development Team*

