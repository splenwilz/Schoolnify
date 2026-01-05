# Schoolnify - Database Design & Schema

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Database:** PostgreSQL 15+

---

## Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Entity Relationship Diagram](#entity-relationship-diagram)
4. [Core Tables](#core-tables)
5. [Academic Tables](#academic-tables)
6. [Communication Tables](#communication-tables)
7. [Financial Tables](#financial-tables)
8. [Audit & System Tables](#audit--system-tables)
9. [Indexes & Performance](#indexes--performance)
10. [Row-Level Security](#row-level-security)

---

## Overview

The database is designed with **multi-tenancy** at its core. Every tenant-specific table includes a `tenant_id` column with Row-Level Security (RLS) policies enforcing data isolation at the database level.

### Key Characteristics

- **Multi-tenant:** Shared tables with `tenant_id` isolation
- **Soft Deletes:** `deleted_at` timestamp for data recovery
- **Audit Trail:** `created_at`, `updated_at`, `created_by`, `updated_by`
- **UUID Primary Keys:** For security and distributed systems compatibility
- **JSONB:** Flexible metadata storage where needed

---

## Design Principles

1. **Tenant Isolation:** All tenant data includes `tenant_id`; enforced via RLS
2. **Normalization:** 3NF with strategic denormalization for performance
3. **Soft Deletes:** Never hard delete; use `deleted_at` timestamp
4. **Audit Columns:** Every table tracks creation/modification metadata
5. **Consistent Naming:** snake_case, singular table names, `_id` suffix for FKs
6. **Enum Tables:** Use lookup tables for type safety over string enums

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE ENTITIES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐         │
│  │    tenant    │◀────────│     user     │────────▶│     role     │         │
│  │   (school)   │ 1     N │              │ N     N │              │         │
│  └──────────────┘         └──────────────┘         └──────────────┘         │
│         │                        │                        │                  │
│         │                        │                        ▼                  │
│         │                        │                 ┌──────────────┐         │
│         │                        │                 │  permission  │         │
│         │                        │                 └──────────────┘         │
│         │                        │                                          │
│         ▼                        ▼                                          │
│  ┌──────────────┐         ┌──────────────┐                                 │
│  │subscription  │         │   student    │                                 │
│  │    plan      │         │   profile    │                                 │
│  └──────────────┘         └──────────────┘                                 │
│                                  │                                          │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────┐
│                         ACADEMIC ENTITIES                                    │
├──────────────────────────────────┼──────────────────────────────────────────┤
│                                  │                                          │
│  ┌──────────────┐         ┌──────┴───────┐         ┌──────────────┐         │
│  │ academic_    │◀────────│    class     │────────▶│   subject    │         │
│  │ session      │ 1     N │              │ N     N │              │         │
│  └──────────────┘         └──────────────┘         └──────────────┘         │
│         │                        │                                          │
│         │                        ├─────────────────────────────┐            │
│         │                        │                             │            │
│         │                        ▼                             ▼            │
│         │                 ┌──────────────┐         ┌──────────────┐         │
│         │                 │  enrollment  │         │  assignment  │         │
│         │                 │              │         │              │         │
│         │                 └──────────────┘         └──────────────┘         │
│         │                        │                        │                  │
│         ▼                        ▼                        ▼                  │
│  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐         │
│  │    term      │         │  attendance  │         │  submission  │         │
│  │              │         │              │         │              │         │
│  └──────────────┘         └──────────────┘         └──────────────┘         │
│         │                                                 │                  │
│         └────────────────────────┬────────────────────────┘                 │
│                                  ▼                                          │
│                          ┌──────────────┐                                   │
│                          │    grade     │                                   │
│                          │              │                                   │
│                          └──────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### 1. tenant (School)

The central entity representing each school using the platform.

```sql
-- Represents a school/organization using the platform
-- Docs: Multi-tenancy isolation unit
CREATE TABLE tenant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,           -- URL-friendly identifier (e.g., 'kings-college-lagos')
    code VARCHAR(20) UNIQUE,                      -- School code for easy reference
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    
    -- Branding
    logo_url VARCHAR(500),
    primary_color VARCHAR(7),                     -- Hex color code
    secondary_color VARCHAR(7),
    
    -- Subscription & Status
    subscription_plan_id UUID REFERENCES subscription_plan(id),
    subscription_status VARCHAR(20) DEFAULT 'trial',  -- trial, active, suspended, cancelled
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Settings (flexible JSON storage)
    settings JSONB DEFAULT '{}',                  -- timezone, academic_year_start, grading_system, etc.
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_subscription_status CHECK (
        subscription_status IN ('trial', 'active', 'suspended', 'cancelled', 'expired')
    )
);

-- Indexes
CREATE INDEX idx_tenant_slug ON tenant(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenant_subscription_status ON tenant(subscription_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenant_is_active ON tenant(is_active) WHERE deleted_at IS NULL;
```

### 2. user

All system users across all tenants.

```sql
-- All users in the system (multi-tenant)
-- Docs: Central user authentication and profile
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),         -- NULL for super admins
    
    -- Authentication
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),                   -- NULL for OAuth-only users
    
    -- Profile
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    
    -- MFA
    mfa_enabled BOOLEAN DEFAULT false,
    mfa_secret VARCHAR(100),
    
    -- Metadata
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    
    -- Settings
    preferences JSONB DEFAULT '{}',               -- language, notifications, theme
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES "user"(id),
    
    -- Constraints
    CONSTRAINT uq_user_email_tenant UNIQUE (email, tenant_id)
);

-- Indexes
CREATE INDEX idx_user_tenant ON "user"(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_email ON "user"(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_is_active ON "user"(is_active) WHERE deleted_at IS NULL;
```

### 3. role

Role definitions (both global and tenant-specific).

```sql
-- Role definitions with optional inheritance
-- Docs: RBAC role hierarchy
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),         -- NULL for global/system roles
    
    -- Role Details
    name VARCHAR(50) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Hierarchy
    parent_role_id UUID REFERENCES role(id),      -- For role inheritance
    
    -- Type
    is_system_role BOOLEAN DEFAULT false,         -- Cannot be modified by tenants
    is_default BOOLEAN DEFAULT false,             -- Auto-assigned to new users
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_role_name_tenant UNIQUE (name, tenant_id)
);

-- Indexes
CREATE INDEX idx_role_tenant ON role(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_role_name ON role(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_role_is_system ON role(is_system_role) WHERE deleted_at IS NULL;
```

### 4. permission

Granular permissions for RBAC.

```sql
-- Granular permissions
-- Docs: Fine-grained access control
CREATE TABLE permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Permission Details
    name VARCHAR(100) NOT NULL UNIQUE,            -- e.g., 'user.create', 'assignment.grade'
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    
    -- Categorization
    category VARCHAR(50) NOT NULL,                -- e.g., 'users', 'academics', 'finance'
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role-Permission junction table
CREATE TABLE role_permission (
    role_id UUID REFERENCES role(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permission(id) ON DELETE CASCADE,
    
    -- Audit
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES "user"(id),
    
    PRIMARY KEY (role_id, permission_id)
);

-- User-Role junction table
CREATE TABLE user_role (
    user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
    role_id UUID REFERENCES role(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenant(id),         -- Context for the role assignment
    
    -- Audit
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES "user"(id),
    expires_at TIMESTAMP WITH TIME ZONE,          -- Optional temporary role assignment
    
    PRIMARY KEY (user_id, role_id, tenant_id)
);

-- Indexes
CREATE INDEX idx_permission_category ON permission(category);
CREATE INDEX idx_user_role_user ON user_role(user_id);
CREATE INDEX idx_user_role_tenant ON user_role(tenant_id);
```

### 5. student_profile

Extended profile for student users.

```sql
-- Extended student information
-- Docs: Links user to student-specific data
CREATE TABLE student_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Student Identification
    student_id VARCHAR(50),                       -- School-assigned student ID
    admission_number VARCHAR(50),
    admission_date DATE,
    
    -- Personal Info
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    nationality VARCHAR(100),
    state_of_origin VARCHAR(100),
    religion VARCHAR(50),
    
    -- Guardian Information
    guardian_user_id UUID REFERENCES "user"(id), -- Link to parent account
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- Academic
    current_class_id UUID,                        -- Will reference class table
    enrollment_status VARCHAR(20) DEFAULT 'active', -- active, graduated, withdrawn, transferred
    
    -- Medical
    medical_conditions TEXT,
    allergies TEXT,
    
    -- Documents (stored as JSONB array)
    documents JSONB DEFAULT '[]',                 -- [{type, url, verified}]
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_student_profile_user UNIQUE (user_id),
    CONSTRAINT uq_student_id_tenant UNIQUE (student_id, tenant_id),
    CONSTRAINT chk_enrollment_status CHECK (
        enrollment_status IN ('active', 'graduated', 'withdrawn', 'transferred', 'suspended')
    )
);

-- Indexes
CREATE INDEX idx_student_profile_tenant ON student_profile(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_student_profile_class ON student_profile(current_class_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_student_profile_status ON student_profile(enrollment_status) WHERE deleted_at IS NULL;
```

### 6. staff_profile

Extended profile for staff (teachers, admins, etc.).

```sql
-- Extended staff information
-- Docs: Links user to staff-specific data
CREATE TABLE staff_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Staff Identification
    staff_id VARCHAR(50),                         -- School-assigned staff ID
    employee_number VARCHAR(50),
    join_date DATE,
    
    -- Personal Info
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(100),
    
    -- Employment
    department VARCHAR(100),
    designation VARCHAR(100),
    employment_type VARCHAR(20),                  -- full-time, part-time, contract
    employment_status VARCHAR(20) DEFAULT 'active', -- active, on_leave, resigned, terminated
    
    -- Qualifications (stored as JSONB array)
    qualifications JSONB DEFAULT '[]',            -- [{degree, institution, year}]
    
    -- Documents
    documents JSONB DEFAULT '[]',                 -- [{type, url, verified}]
    
    -- Banking (encrypted or tokenized in production)
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    account_name VARCHAR(200),
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_staff_profile_user UNIQUE (user_id),
    CONSTRAINT uq_staff_id_tenant UNIQUE (staff_id, tenant_id)
);

-- Indexes
CREATE INDEX idx_staff_profile_tenant ON staff_profile(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_profile_department ON staff_profile(department) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_profile_status ON staff_profile(employment_status) WHERE deleted_at IS NULL;
```

---

## Academic Tables

### 7. academic_session

Academic year/session definition.

```sql
-- Academic year/session
-- Docs: Container for terms and academic activities
CREATE TABLE academic_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Session Details
    name VARCHAR(100) NOT NULL,                   -- e.g., '2024/2025'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status
    is_current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_session_name_tenant UNIQUE (name, tenant_id),
    CONSTRAINT chk_session_dates CHECK (end_date > start_date)
);

-- Ensure only one current session per tenant
CREATE UNIQUE INDEX idx_academic_session_current 
    ON academic_session(tenant_id) 
    WHERE is_current = true AND deleted_at IS NULL;
```

### 8. term

Terms within an academic session.

```sql
-- Academic terms within a session
-- Docs: First term, Second term, Third term, etc.
CREATE TABLE term (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    academic_session_id UUID NOT NULL REFERENCES academic_session(id),
    
    -- Term Details
    name VARCHAR(100) NOT NULL,                   -- e.g., 'First Term'
    sequence_number SMALLINT NOT NULL,            -- 1, 2, 3
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status
    is_current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_term_session_sequence UNIQUE (academic_session_id, sequence_number),
    CONSTRAINT chk_term_dates CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX idx_term_tenant ON term(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_term_session ON term(academic_session_id) WHERE deleted_at IS NULL;
```

### 9. class

Class/Grade levels.

```sql
-- Class/Grade definitions
-- Docs: JSS1, SS2, Grade 5, etc.
CREATE TABLE class (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Class Details
    name VARCHAR(100) NOT NULL,                   -- e.g., 'JSS 1', 'Primary 5'
    code VARCHAR(20),                             -- Short code like 'JSS1'
    level SMALLINT,                               -- Numeric level for sorting (1-12)
    category VARCHAR(50),                         -- 'primary', 'junior_secondary', 'senior_secondary'
    
    -- Capacity
    max_students INTEGER,
    
    -- Class Teacher
    class_teacher_id UUID REFERENCES "user"(id),
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_class_name_tenant UNIQUE (name, tenant_id)
);

-- Indexes
CREATE INDEX idx_class_tenant ON class(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_level ON class(level) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_teacher ON class(class_teacher_id) WHERE deleted_at IS NULL;
```

### 10. class_section

Sections/Arms within a class (e.g., JSS1A, JSS1B).

```sql
-- Class sections (arms)
-- Docs: Multiple sections per class level
CREATE TABLE class_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    class_id UUID NOT NULL REFERENCES class(id),
    
    -- Section Details
    name VARCHAR(50) NOT NULL,                    -- e.g., 'A', 'B', 'Gold', 'Silver'
    full_name VARCHAR(100),                       -- e.g., 'JSS 1A'
    
    -- Capacity
    max_students INTEGER,
    
    -- Section Teacher
    form_teacher_id UUID REFERENCES "user"(id),
    
    -- Room
    room_number VARCHAR(50),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_section_class UNIQUE (class_id, name)
);

-- Indexes
CREATE INDEX idx_class_section_tenant ON class_section(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_section_class ON class_section(class_id) WHERE deleted_at IS NULL;
```

### 11. subject

Subject definitions.

```sql
-- Subject definitions
-- Docs: Mathematics, English, Physics, etc.
CREATE TABLE subject (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Subject Details
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    
    -- Categorization
    category VARCHAR(50),                         -- 'core', 'elective', 'vocational'
    department VARCHAR(100),                      -- 'sciences', 'arts', 'commercial'
    
    -- Credits/Units
    credit_units SMALLINT DEFAULT 1,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_subject_name_tenant UNIQUE (name, tenant_id)
);

-- Indexes
CREATE INDEX idx_subject_tenant ON subject(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_subject_category ON subject(category) WHERE deleted_at IS NULL;
```

### 12. class_subject

Links subjects to classes with teacher assignment.

```sql
-- Subject-Class-Teacher mapping
-- Docs: Which teacher teaches what subject in which class
CREATE TABLE class_subject (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    class_section_id UUID NOT NULL REFERENCES class_section(id),
    subject_id UUID NOT NULL REFERENCES subject(id),
    teacher_id UUID REFERENCES "user"(id),
    
    -- Schedule (optional)
    schedule JSONB DEFAULT '[]',                  -- [{day, start_time, end_time, room}]
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_class_subject UNIQUE (class_section_id, subject_id)
);

-- Indexes
CREATE INDEX idx_class_subject_tenant ON class_subject(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_class_subject_teacher ON class_subject(teacher_id) WHERE deleted_at IS NULL;
```

### 13. enrollment

Student enrollment in class sections.

```sql
-- Student enrollment in class sections
-- Docs: Tracks student class assignments per term
CREATE TABLE enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    student_id UUID NOT NULL REFERENCES student_profile(id),
    class_section_id UUID NOT NULL REFERENCES class_section(id),
    academic_session_id UUID NOT NULL REFERENCES academic_session(id),
    term_id UUID REFERENCES term(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',          -- active, withdrawn, transferred
    
    -- Dates
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_enrollment_student_session UNIQUE (student_id, class_section_id, academic_session_id)
);

-- Indexes
CREATE INDEX idx_enrollment_tenant ON enrollment(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_enrollment_student ON enrollment(student_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_enrollment_section ON enrollment(class_section_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_enrollment_session ON enrollment(academic_session_id) WHERE deleted_at IS NULL;
```

### 14. assignment

Assignments created by teachers.

```sql
-- Assignments
-- Docs: Homework, classwork, projects
CREATE TABLE assignment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Assignment Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    -- Context
    class_subject_id UUID NOT NULL REFERENCES class_subject(id),
    term_id UUID NOT NULL REFERENCES term(id),
    created_by UUID NOT NULL REFERENCES "user"(id),
    
    -- Type & Grading
    type VARCHAR(20) DEFAULT 'homework',          -- homework, classwork, project, test
    max_score DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(5, 2) DEFAULT 1.0,             -- Weight in final grade calculation
    
    -- Dates
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Attachments
    attachments JSONB DEFAULT '[]',               -- [{name, url, type}]
    
    -- Settings
    allow_late_submission BOOLEAN DEFAULT true,
    late_submission_penalty DECIMAL(5, 2) DEFAULT 0, -- Percentage penalty
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft',           -- draft, published, closed
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_assignment_tenant ON assignment(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_class_subject ON assignment(class_subject_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_term ON assignment(term_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_due_date ON assignment(due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_status ON assignment(status) WHERE deleted_at IS NULL;
```

### 15. submission

Student assignment submissions.

```sql
-- Assignment submissions
-- Docs: Student submissions with grading
CREATE TABLE submission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    assignment_id UUID NOT NULL REFERENCES assignment(id),
    student_id UUID NOT NULL REFERENCES student_profile(id),
    
    -- Submission Content
    content TEXT,
    attachments JSONB DEFAULT '[]',               -- [{name, url, type}]
    
    -- Submission Status
    status VARCHAR(20) DEFAULT 'submitted',       -- draft, submitted, late, graded, returned
    submitted_at TIMESTAMP WITH TIME ZONE,
    is_late BOOLEAN DEFAULT false,
    
    -- Grading
    score DECIMAL(5, 2),
    feedback TEXT,
    graded_by UUID REFERENCES "user"(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT uq_submission_assignment_student UNIQUE (assignment_id, student_id)
);

-- Indexes
CREATE INDEX idx_submission_tenant ON submission(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submission_assignment ON submission(assignment_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submission_student ON submission(student_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_submission_status ON submission(status) WHERE deleted_at IS NULL;
```

### 16. attendance

Daily attendance tracking.

```sql
-- Attendance records
-- Docs: Daily student attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    student_id UUID NOT NULL REFERENCES student_profile(id),
    class_section_id UUID NOT NULL REFERENCES class_section(id),
    term_id UUID NOT NULL REFERENCES term(id),
    
    -- Attendance Details
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,                  -- present, absent, late, excused
    
    -- Session (for schools with multiple sessions)
    session_type VARCHAR(20) DEFAULT 'full_day',  -- full_day, morning, afternoon
    
    -- Time (optional)
    check_in_time TIME,
    check_out_time TIME,
    
    -- Notes
    remarks TEXT,
    
    -- Recorded By
    recorded_by UUID NOT NULL REFERENCES "user"(id),
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT uq_attendance_student_date UNIQUE (student_id, date, session_type),
    CONSTRAINT chk_attendance_status CHECK (
        status IN ('present', 'absent', 'late', 'excused', 'half_day')
    )
);

-- Indexes
CREATE INDEX idx_attendance_tenant ON attendance(tenant_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_term ON attendance(term_id);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### 17. grade

Term/Session grades.

```sql
-- Term grades
-- Docs: Aggregated grades per subject per term
CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    student_id UUID NOT NULL REFERENCES student_profile(id),
    class_subject_id UUID NOT NULL REFERENCES class_subject(id),
    term_id UUID NOT NULL REFERENCES term(id),
    
    -- Score Breakdown
    ca_score DECIMAL(5, 2),                       -- Continuous Assessment
    exam_score DECIMAL(5, 2),                     -- Examination score
    total_score DECIMAL(5, 2),                    -- Computed total
    
    -- Grade
    grade_letter VARCHAR(5),                      -- A, B, C, D, E, F
    grade_point DECIMAL(3, 2),                    -- For GPA calculation
    
    -- Position (optional)
    class_position INTEGER,
    subject_position INTEGER,
    
    -- Comments
    teacher_comment TEXT,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT uq_grade_student_subject_term UNIQUE (student_id, class_subject_id, term_id)
);

-- Indexes
CREATE INDEX idx_grade_tenant ON grade(tenant_id);
CREATE INDEX idx_grade_student ON grade(student_id);
CREATE INDEX idx_grade_term ON grade(term_id);
```

---

## Communication Tables

### 18. announcement

School-wide or targeted announcements.

```sql
-- Announcements
-- Docs: School-wide or targeted communications
CREATE TABLE announcement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),         -- NULL for platform-wide announcements
    
    -- Announcement Details
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Targeting
    target_audience VARCHAR(50) DEFAULT 'all',    -- all, teachers, parents, students, staff
    target_class_ids UUID[] DEFAULT '{}',         -- Specific classes (empty = all)
    
    -- Scheduling
    publish_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal',        -- low, normal, high, urgent
    is_pinned BOOLEAN DEFAULT false,
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Author
    created_by UUID NOT NULL REFERENCES "user"(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'published',       -- draft, published, archived
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_announcement_tenant ON announcement(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_announcement_publish ON announcement(publish_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_announcement_status ON announcement(status) WHERE deleted_at IS NULL;
```

### 19. message

Direct messaging between users.

```sql
-- Direct messages
-- Docs: User-to-user messaging
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Participants
    sender_id UUID NOT NULL REFERENCES "user"(id),
    recipient_id UUID NOT NULL REFERENCES "user"(id),
    
    -- Thread (for conversation grouping)
    thread_id UUID,
    parent_message_id UUID REFERENCES message(id),
    
    -- Content
    subject VARCHAR(255),
    body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by_sender BOOLEAN DEFAULT false,
    deleted_by_recipient BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_message_tenant ON message(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_sender ON message(sender_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_recipient ON message(recipient_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_thread ON message(thread_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_created ON message(created_at DESC) WHERE deleted_at IS NULL;
```

### 20. notification

System notifications.

```sql
-- System notifications
-- Docs: Push/in-app notifications
CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),
    user_id UUID NOT NULL REFERENCES "user"(id),
    
    -- Notification Details
    type VARCHAR(50) NOT NULL,                    -- assignment, grade, message, announcement, etc.
    title VARCHAR(255) NOT NULL,
    body TEXT,
    
    -- Reference
    reference_type VARCHAR(50),                   -- The entity type this notification relates to
    reference_id UUID,                            -- The entity ID
    
    -- Action URL
    action_url VARCHAR(500),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery
    channels VARCHAR(50)[] DEFAULT ARRAY['in_app'], -- in_app, email, sms, push
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notification_user ON notification(user_id);
CREATE INDEX idx_notification_tenant ON notification(tenant_id);
CREATE INDEX idx_notification_type ON notification(type);
CREATE INDEX idx_notification_is_read ON notification(is_read);
CREATE INDEX idx_notification_created ON notification(created_at DESC);
```

---

## Financial Tables

### 21. subscription_plan

Platform subscription tiers.

```sql
-- Subscription plans
-- Docs: Platform pricing tiers
CREATE TABLE subscription_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Plan Details
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Limits
    max_students INTEGER,
    max_staff INTEGER,
    max_storage_gb INTEGER,
    
    -- Features (feature flags)
    features JSONB DEFAULT '{}',                  -- {feature_name: boolean}
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,               -- Visible on pricing page
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_plan_active ON subscription_plan(is_active);
CREATE INDEX idx_subscription_plan_public ON subscription_plan(is_public);
```

### 22. payment

Payment transactions.

```sql
-- Payment transactions
-- Docs: Subscription and fee payments
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),
    user_id UUID REFERENCES "user"(id),           -- Who made the payment
    
    -- Payment Details
    type VARCHAR(50) NOT NULL,                    -- subscription, fee, invoice
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Payment Gateway
    gateway VARCHAR(50) NOT NULL,                 -- flutterwave, paystack, bank_transfer
    gateway_reference VARCHAR(255),
    gateway_response JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',         -- pending, processing, completed, failed, refunded
    
    -- Reference
    reference_type VARCHAR(50),                   -- subscription, fee_invoice
    reference_id UUID,
    
    -- Dates
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payment_tenant ON payment(tenant_id);
CREATE INDEX idx_payment_status ON payment(status);
CREATE INDEX idx_payment_gateway_ref ON payment(gateway_reference);
CREATE INDEX idx_payment_created ON payment(created_at DESC);
```

### 23. fee_structure

School fee definitions.

```sql
-- Fee structure
-- Docs: School fees configuration
CREATE TABLE fee_structure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    
    -- Fee Details
    name VARCHAR(100) NOT NULL,                   -- e.g., 'Tuition Fee', 'Sports Fee'
    description TEXT,
    
    -- Amount
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Applicability
    academic_session_id UUID REFERENCES academic_session(id),
    term_id UUID REFERENCES term(id),
    class_ids UUID[] DEFAULT '{}',                -- Empty = all classes
    
    -- Type
    type VARCHAR(50) DEFAULT 'mandatory',         -- mandatory, optional
    is_recurring BOOLEAN DEFAULT false,
    
    -- Due Date
    due_date DATE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_fee_structure_tenant ON fee_structure(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_fee_structure_session ON fee_structure(academic_session_id) WHERE deleted_at IS NULL;
```

---

## Audit & System Tables

### 24. audit_log

System-wide audit trail.

```sql
-- Audit log
-- Docs: Complete audit trail of system actions
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenant(id),
    user_id UUID REFERENCES "user"(id),
    
    -- Action Details
    action VARCHAR(50) NOT NULL,                  -- create, update, delete, login, logout, etc.
    resource_type VARCHAR(100) NOT NULL,          -- Table/entity name
    resource_id UUID,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- Partition by month for performance (optional for large deployments)
-- CREATE TABLE audit_log_y2026m01 PARTITION OF audit_log
--     FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 25. sync_queue

Offline sync queue for conflict resolution.

```sql
-- Sync queue for offline-first functionality
-- Docs: Tracks offline changes pending sync
CREATE TABLE sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    user_id UUID NOT NULL REFERENCES "user"(id),
    
    -- Operation Details
    operation VARCHAR(20) NOT NULL,               -- create, update, delete
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Payload
    payload JSONB NOT NULL,
    
    -- Client Info
    client_id VARCHAR(100),                       -- Device identifier
    client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Sync Status
    status VARCHAR(20) DEFAULT 'pending',         -- pending, processing, synced, conflict, failed
    sync_attempts INTEGER DEFAULT 0,
    last_sync_attempt TIMESTAMP WITH TIME ZONE,
    
    -- Conflict Resolution
    conflict_data JSONB,
    resolved_by UUID REFERENCES "user"(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_sync_queue_tenant ON sync_queue(tenant_id);
CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_entity ON sync_queue(entity_type, entity_id);
```

---

## Indexes & Performance

### Composite Indexes for Common Queries

```sql
-- Multi-tenant queries (always filter by tenant_id first)
CREATE INDEX idx_user_tenant_email ON "user"(tenant_id, email) WHERE deleted_at IS NULL;
CREATE INDEX idx_student_tenant_status ON student_profile(tenant_id, enrollment_status) WHERE deleted_at IS NULL;

-- Academic queries
CREATE INDEX idx_enrollment_term_section ON enrollment(term_id, class_section_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_term_status ON assignment(term_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_grade_student_term ON grade(student_id, term_id);

-- Communication queries
CREATE INDEX idx_notification_user_unread ON notification(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_message_recipient_unread ON message(recipient_id, is_read) WHERE is_read = false AND deleted_at IS NULL;
```

### Full-Text Search Indexes

```sql
-- For global search functionality
CREATE INDEX idx_user_search ON "user" USING gin(
    to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, ''))
) WHERE deleted_at IS NULL;

CREATE INDEX idx_announcement_search ON announcement USING gin(
    to_tsvector('english', title || ' ' || content)
) WHERE deleted_at IS NULL;
```

---

## Row-Level Security

PostgreSQL RLS policies ensure tenant data isolation at the database level.

```sql
-- Enable RLS on all tenant-specific tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE class ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment ENABLE ROW LEVEL SECURITY;
-- ... (all other tenant tables)

-- Create a function to get current tenant from session
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_tenant_id', TRUE)::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example RLS policy for user table
CREATE POLICY tenant_isolation_policy ON "user"
    USING (
        tenant_id = get_current_tenant_id()
        OR tenant_id IS NULL  -- For super admins
        OR get_current_tenant_id() IS NULL  -- For super admin operations
    );

-- Example RLS policy for student_profile
CREATE POLICY tenant_isolation_policy ON student_profile
    USING (tenant_id = get_current_tenant_id());
```

---

## Migration Strategy

### Initial Migration

```bash
# Generate initial migration
alembic revision --autogenerate -m "initial_schema"

# Apply migration
alembic upgrade head
```

### Seed Data

```sql
-- Default roles
INSERT INTO role (id, name, display_name, description, is_system_role) VALUES
    (gen_random_uuid(), 'super_admin', 'Super Administrator', 'Platform-wide administrator', true),
    (gen_random_uuid(), 'school_admin', 'School Administrator', 'School-level administrator', true),
    (gen_random_uuid(), 'teacher', 'Teacher', 'Teaching staff', true),
    (gen_random_uuid(), 'parent', 'Parent', 'Parent/Guardian', true),
    (gen_random_uuid(), 'student', 'Student', 'Student user', true),
    (gen_random_uuid(), 'bursar', 'Bursar', 'Financial officer', true),
    (gen_random_uuid(), 'registrar', 'Registrar', 'Student records officer', true),
    (gen_random_uuid(), 'librarian', 'Librarian', 'Library manager', true),
    (gen_random_uuid(), 'facility_manager', 'Facility Manager', 'Facilities and equipment manager', true),
    (gen_random_uuid(), 'exam_officer', 'Exam Officer', 'Examination coordinator', true);

-- Default permissions
INSERT INTO permission (id, name, display_name, category) VALUES
    -- User management
    (gen_random_uuid(), 'user.view', 'View Users', 'users'),
    (gen_random_uuid(), 'user.create', 'Create Users', 'users'),
    (gen_random_uuid(), 'user.update', 'Update Users', 'users'),
    (gen_random_uuid(), 'user.delete', 'Delete Users', 'users'),
    -- Academic
    (gen_random_uuid(), 'class.manage', 'Manage Classes', 'academics'),
    (gen_random_uuid(), 'assignment.create', 'Create Assignments', 'academics'),
    (gen_random_uuid(), 'assignment.grade', 'Grade Assignments', 'academics'),
    (gen_random_uuid(), 'grade.view', 'View Grades', 'academics'),
    (gen_random_uuid(), 'grade.manage', 'Manage Grades', 'academics'),
    (gen_random_uuid(), 'attendance.record', 'Record Attendance', 'academics'),
    -- Finance
    (gen_random_uuid(), 'fee.manage', 'Manage Fees', 'finance'),
    (gen_random_uuid(), 'payment.view', 'View Payments', 'finance'),
    -- Communication
    (gen_random_uuid(), 'announcement.create', 'Create Announcements', 'communication'),
    (gen_random_uuid(), 'message.send', 'Send Messages', 'communication');
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [03-API-SPECIFICATION.md](./03-API-SPECIFICATION.md) - API endpoints
- [05-MULTI-TENANCY.md](./05-MULTI-TENANCY.md) - Multi-tenant details

---

*Document maintained by: Schoolnify Development Team*

