# Schoolnify - Multi-Tenancy Architecture

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Strategy:** Shared Tables with Tenant ID + PostgreSQL RLS

---

## Table of Contents

1. [Overview](#overview)
2. [Tenancy Strategy](#tenancy-strategy)
3. [Data Isolation](#data-isolation)
4. [Tenant Identification](#tenant-identification)
5. [Tenant Lifecycle](#tenant-lifecycle)
6. [Cross-Tenant Operations](#cross-tenant-operations)
7. [Performance Considerations](#performance-considerations)
8. [Implementation](#implementation)

---

## Overview

Schoolnify operates as a multi-tenant SaaS platform where each **tenant** represents a school. The architecture ensures:

- **Data Isolation:** Complete separation of data between schools
- **Shared Infrastructure:** Cost-effective resource utilization
- **Customization:** Tenant-specific configurations and branding
- **Scalability:** Ability to onboard hundreds of schools

### Key Metrics

| Metric | Target |
|--------|--------|
| Maximum Tenants | 1,000+ schools |
| Users per Tenant | Up to 5,000 |
| Concurrent Users | 20,000 platform-wide |
| Data Isolation | Database-level (RLS) |

---

## Tenancy Strategy

### Comparison of Strategies

| Approach | Isolation | Complexity | Cost | Scalability |
|----------|-----------|------------|------|-------------|
| Separate Databases | ✅ Highest | ⚠️ High | ❌ Expensive | ⚠️ Limited |
| Separate Schemas | ✅ High | ⚠️ Medium | ⚠️ Moderate | ⚠️ Medium |
| **Shared Tables + RLS** | ✅ High | ✅ Low | ✅ Cost-effective | ✅ High |

### Chosen Strategy: Shared Tables with Row-Level Security

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SINGLE DATABASE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                        USERS TABLE                                 │ │
│  ├──────────┬────────────┬────────────┬────────────┬─────────────────┤ │
│  │    id    │ tenant_id  │   email    │    name    │      role       │ │
│  ├──────────┼────────────┼────────────┼────────────┼─────────────────┤ │
│  │  uuid-1  │  school-A  │ john@a.com │   John     │    teacher      │ │
│  │  uuid-2  │  school-A  │ jane@a.com │   Jane     │    student      │ │
│  │  uuid-3  │  school-B  │ mike@b.com │   Mike     │    teacher      │ │
│  │  uuid-4  │  school-B  │ sara@b.com │   Sara     │    admin        │ │
│  └──────────┴────────────┴────────────┴────────────┴─────────────────┘ │
│                                                                          │
│  PostgreSQL Row-Level Security (RLS) ensures:                           │
│  - School A users can ONLY see rows where tenant_id = school-A          │
│  - School B users can ONLY see rows where tenant_id = school-B          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Benefits of This Approach

1. **Database-Level Security:** RLS enforces isolation even if application code has bugs
2. **Simplified Operations:** Single database to backup, maintain, and monitor
3. **Cost-Effective:** Shared infrastructure reduces hosting costs
4. **Easy Migrations:** One schema to update for all tenants
5. **Cross-Tenant Analytics:** Super admins can query across tenants easily

---

## Data Isolation

### Row-Level Security (RLS) Setup

```sql
-- Enable RLS on all tenant-scoped tables
-- Ref: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

-- 1. Create function to get current tenant from session
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    -- Returns NULL if not set (for super admin operations)
    RETURN NULLIF(current_setting('app.current_tenant_id', TRUE), '')::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$;

-- 2. Create function to check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
    RETURN COALESCE(current_setting('app.is_super_admin', TRUE)::BOOLEAN, FALSE);
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;

-- 3. Enable RLS on user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policy for user table
CREATE POLICY tenant_isolation ON "user"
    FOR ALL
    USING (
        -- Super admins can see all users
        is_super_admin()
        OR
        -- Users with NULL tenant_id (super admins) are visible
        tenant_id IS NULL
        OR
        -- Users can only see their own tenant's data
        tenant_id = get_current_tenant_id()
    )
    WITH CHECK (
        -- Super admins can modify any user
        is_super_admin()
        OR
        -- Regular users can only modify within their tenant
        tenant_id = get_current_tenant_id()
    );

-- 5. Apply similar policies to all tenant-scoped tables
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'student_profile',
        'staff_profile',
        'class',
        'class_section',
        'class_subject',
        'subject',
        'academic_session',
        'term',
        'enrollment',
        'assignment',
        'submission',
        'attendance',
        'grade',
        'announcement',
        'message',
        'notification',
        'fee_structure',
        'payment'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        EXECUTE format('
            CREATE POLICY tenant_isolation ON %I
                FOR ALL
                USING (
                    is_super_admin()
                    OR tenant_id = get_current_tenant_id()
                )
                WITH CHECK (
                    is_super_admin()
                    OR tenant_id = get_current_tenant_id()
                )
        ', table_name);
    END LOOP;
END;
$$;
```

### Application-Level Enforcement

```python
# app/core/tenant.py

from contextvars import ContextVar
from typing import Optional
from uuid import UUID

# Context variable to store current tenant
# Ref: https://docs.python.org/3/library/contextvars.html
current_tenant: ContextVar[Optional[UUID]] = ContextVar('current_tenant', default=None)
is_super_admin_ctx: ContextVar[bool] = ContextVar('is_super_admin', default=False)


def get_tenant_id() -> Optional[UUID]:
    """Get the current tenant ID from context."""
    return current_tenant.get()


def set_tenant_id(tenant_id: UUID):
    """Set the current tenant ID in context."""
    current_tenant.set(tenant_id)


def clear_tenant():
    """Clear the current tenant context."""
    current_tenant.set(None)


def set_super_admin(value: bool = True):
    """Mark current context as super admin."""
    is_super_admin_ctx.set(value)


# SQLAlchemy session setup with tenant context
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import event

async def set_tenant_context(session: AsyncSession, tenant_id: Optional[UUID]):
    """Set PostgreSQL session variables for RLS."""
    if tenant_id:
        await session.execute(
            f"SET app.current_tenant_id = '{tenant_id}'"
        )
    else:
        await session.execute(
            "SET app.current_tenant_id = ''"
        )
    
    if is_super_admin_ctx.get():
        await session.execute(
            "SET app.is_super_admin = 'true'"
        )
    else:
        await session.execute(
            "SET app.is_super_admin = 'false'"
        )
```

### Middleware Integration

```python
# app/middleware/tenant.py

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.tenant import set_tenant_id, set_super_admin, clear_tenant
from app.core.security import decode_token

class TenantMiddleware(BaseHTTPMiddleware):
    """
    Extract tenant context from requests and set up RLS.
    
    Tenant is determined from:
    1. JWT token (primary)
    2. X-Tenant-ID header (for service-to-service)
    3. Subdomain (optional)
    """
    
    # Routes that don't require tenant context
    PUBLIC_ROUTES = [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
        "/api/v1/auth/verify-email",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/health",
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Clear any existing tenant context
        clear_tenant()
        
        # Skip tenant resolution for public routes
        if any(request.url.path.startswith(route) for route in self.PUBLIC_ROUTES):
            return await call_next(request)
        
        tenant_id = None
        is_super_admin = False
        
        # 1. Extract from JWT token
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = decode_token(token)
                
                tenant_id = payload.get("tenant_id")
                user_roles = payload.get("roles", [])
                is_super_admin = "super_admin" in user_roles
                
            except Exception:
                pass  # Invalid token will be caught by auth middleware
        
        # 2. Override with X-Tenant-ID header (for super admins or service calls)
        header_tenant = request.headers.get("X-Tenant-ID")
        if header_tenant and is_super_admin:
            tenant_id = header_tenant
        
        # Set tenant context
        if tenant_id:
            set_tenant_id(UUID(tenant_id))
        
        if is_super_admin:
            set_super_admin(True)
        
        # Continue with request
        response = await call_next(request)
        
        # Cleanup
        clear_tenant()
        
        return response
```

---

## Tenant Identification

### Tenant Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TENANT RESOLUTION                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. JWT Token (Primary)                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...                  │ │
│     │                                                                  │ │
│     │  Payload: {                                                      │ │
│     │    "sub": "user-uuid",                                          │ │
│     │    "tenant_id": "tenant-uuid",  ◄── Primary source              │ │
│     │    "roles": ["teacher"]                                         │ │
│     │  }                                                               │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  2. X-Tenant-ID Header (Super Admin Override)                           │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  X-Tenant-ID: different-tenant-uuid                             │ │
│     │                                                                  │ │
│     │  Only honored if user is super_admin                            │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  3. Subdomain (Optional - for custom domains)                           │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  Host: kings-college.schoolnify.com                             │ │
│     │         └─────────────┘                                          │ │
│     │              │                                                   │ │
│     │              ▼                                                   │ │
│     │         Lookup tenant by slug                                   │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Custom Domain Support

```python
# app/services/tenant.py

from cachetools import TTLCache

# Cache tenant lookups for 5 minutes
tenant_cache = TTLCache(maxsize=1000, ttl=300)


async def resolve_tenant_by_domain(domain: str) -> Optional[Tenant]:
    """
    Resolve tenant from custom domain or subdomain.
    
    Supports:
    - Subdomains: kings-college.schoolnify.com
    - Custom domains: portal.kingscollege.edu.ng
    """
    
    # Check cache first
    if domain in tenant_cache:
        return tenant_cache[domain]
    
    # Extract subdomain
    if domain.endswith(".schoolnify.com"):
        slug = domain.replace(".schoolnify.com", "")
        tenant = await db.execute(
            select(Tenant).where(Tenant.slug == slug, Tenant.is_active == True)
        )
        tenant = tenant.scalar_one_or_none()
    else:
        # Custom domain lookup
        tenant = await db.execute(
            select(Tenant).where(
                Tenant.custom_domain == domain,
                Tenant.is_active == True
            )
        )
        tenant = tenant.scalar_one_or_none()
    
    if tenant:
        tenant_cache[domain] = tenant
    
    return tenant
```

---

## Tenant Lifecycle

### Onboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TENANT ONBOARDING                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. School Registration (Self-Serve or Admin-Created)                   │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  POST /api/v1/auth/register                                     │ │
│     │  {                                                               │ │
│     │    "school": { "name": "Kings College", "email": "..." },       │ │
│     │    "admin": { "first_name": "John", "email": "...", ... }       │ │
│     │  }                                                               │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  2. Create Tenant Record                                                │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Generate unique tenant ID                                    │ │
│     │  - Create slug from name (kings-college-lagos)                  │ │
│     │  - Set subscription_status = "trial"                            │ │
│     │  - Set trial expiration (e.g., 14 days)                        │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  3. Create School Admin User                                            │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Link to tenant_id                                            │ │
│     │  - Assign "school_admin" role                                   │ │
│     │  - Send verification email                                      │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  4. Initialize Tenant Data                                              │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Create default roles (teacher, student, parent, etc.)        │ │
│     │  - Set default permissions                                      │ │
│     │  - Initialize settings (timezone, grading system)              │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  5. Send Welcome Email                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Login instructions                                           │ │
│     │  - Getting started guide                                        │ │
│     │  - Support contact                                              │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tenant Service Implementation

```python
# app/services/tenant.py

from uuid import UUID
from datetime import datetime, timedelta
from slugify import slugify
from app.models import Tenant, User, Role
from app.core.config import settings


class TenantService:
    """Service for managing tenant lifecycle."""
    
    TRIAL_DURATION_DAYS = 14
    
    async def create_tenant(
        self,
        db: AsyncSession,
        school_data: SchoolCreate,
        admin_data: AdminCreate
    ) -> tuple[Tenant, User]:
        """
        Create a new tenant (school) with admin user.
        
        Returns:
            Tuple of (Tenant, Admin User)
        """
        
        # 1. Generate unique slug
        base_slug = slugify(school_data.name)
        slug = await self._generate_unique_slug(db, base_slug)
        
        # 2. Create tenant
        tenant = Tenant(
            name=school_data.name,
            slug=slug,
            email=school_data.email,
            phone=school_data.phone,
            address_line_1=school_data.address_line_1,
            city=school_data.city,
            state=school_data.state,
            country=school_data.country or "Nigeria",
            subscription_status="trial",
            subscription_expires_at=datetime.utcnow() + timedelta(days=self.TRIAL_DURATION_DAYS),
            settings={
                "timezone": "Africa/Lagos",
                "grading_system": "WAEC",
                "academic_year_start": 9  # September
            }
        )
        db.add(tenant)
        await db.flush()  # Get tenant ID
        
        # 3. Create admin user
        admin_user = User(
            tenant_id=tenant.id,
            email=admin_data.email,
            password_hash=get_password_hash(admin_data.password),
            first_name=admin_data.first_name,
            last_name=admin_data.last_name,
            is_active=True,
            is_email_verified=False
        )
        db.add(admin_user)
        await db.flush()
        
        # 4. Assign school_admin role
        school_admin_role = await db.execute(
            select(Role).where(
                Role.name == "school_admin",
                Role.is_system_role == True
            )
        )
        school_admin_role = school_admin_role.scalar_one()
        
        await db.execute(
            insert(user_role).values(
                user_id=admin_user.id,
                role_id=school_admin_role.id,
                tenant_id=tenant.id
            )
        )
        
        # 5. Initialize tenant-specific roles
        await self._initialize_tenant_roles(db, tenant.id)
        
        await db.commit()
        
        # 6. Send welcome email (async task)
        send_welcome_email.delay(
            email=admin_user.email,
            name=admin_user.first_name,
            school_name=tenant.name,
            verification_token=create_verification_token(admin_user.id)
        )
        
        return tenant, admin_user
    
    async def _generate_unique_slug(self, db: AsyncSession, base_slug: str) -> str:
        """Generate a unique slug for the tenant."""
        slug = base_slug
        counter = 1
        
        while True:
            existing = await db.execute(
                select(Tenant).where(Tenant.slug == slug)
            )
            if not existing.scalar_one_or_none():
                return slug
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    async def _initialize_tenant_roles(self, db: AsyncSession, tenant_id: UUID):
        """Create tenant-specific copies of default roles."""
        # Roles are shared (system roles) - no need to duplicate
        # But we could create tenant-specific custom roles here if needed
        pass
    
    async def deactivate_tenant(self, db: AsyncSession, tenant_id: UUID):
        """
        Deactivate a tenant (soft delete).
        
        This:
        - Sets is_active = False
        - Prevents all user logins
        - Preserves data for potential reactivation
        """
        tenant = await db.get(Tenant, tenant_id)
        if not tenant:
            raise TenantNotFoundError(f"Tenant {tenant_id} not found")
        
        tenant.is_active = False
        tenant.subscription_status = "cancelled"
        tenant.updated_at = datetime.utcnow()
        
        await db.commit()
        
        # Log the deactivation
        await log_audit_event(
            db,
            action="tenant_deactivated",
            resource_type="tenant",
            resource_id=tenant_id
        )
    
    async def delete_tenant_data(self, db: AsyncSession, tenant_id: UUID):
        """
        Permanently delete all tenant data.
        
        WARNING: This is irreversible!
        Should only be called after grace period.
        """
        # Delete in correct order to respect foreign keys
        tables = [
            "submission",
            "assignment",
            "grade",
            "attendance",
            "enrollment",
            "class_subject",
            "class_section",
            "class",
            "subject",
            "term",
            "academic_session",
            "message",
            "notification",
            "announcement",
            "payment",
            "fee_structure",
            "student_profile",
            "staff_profile",
            "user_role",
            "role",
            "user",
            "tenant"
        ]
        
        for table in tables:
            await db.execute(
                text(f"DELETE FROM {table} WHERE tenant_id = :tenant_id"),
                {"tenant_id": tenant_id}
            )
        
        # Finally delete the tenant itself
        await db.execute(
            text("DELETE FROM tenant WHERE id = :tenant_id"),
            {"tenant_id": tenant_id}
        )
        
        await db.commit()
```

### Offboarding Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TENANT OFFBOARDING                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. Subscription Expiration / Cancellation                              │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Set subscription_status = "expired" or "cancelled"          │ │
│     │  - Send notification to admin                                   │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  2. Grace Period (30 days)                                              │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Data remains accessible (read-only mode)                     │ │
│     │  - Admin can download data exports                              │ │
│     │  - Send reminder emails                                         │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  3. Deactivation                                                        │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Set is_active = False                                        │ │
│     │  - Block all logins                                             │ │
│     │  - Final notification to admin                                  │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  4. Data Retention (90 days)                                            │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Data preserved for potential reactivation                    │ │
│     │  - Available upon request for export                            │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  5. Permanent Deletion                                                  │
│     ┌─────────────────────────────────────────────────────────────────┐ │
│     │  - Delete all tenant data                                       │ │
│     │  - Remove from all systems                                      │ │
│     │  - Final confirmation to admin                                  │ │
│     └─────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Cross-Tenant Operations

### Super Admin Access

Super admins can access any tenant's data by:

1. Setting the `X-Tenant-ID` header
2. Using the RLS bypass (`is_super_admin()` function)

```python
# app/api/v1/routes/superadmin.py

from fastapi import APIRouter, Depends, Header
from app.core.tenant import set_tenant_id, set_super_admin

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])


@router.get("/tenants/{tenant_id}/users")
async def get_tenant_users(
    tenant_id: UUID,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all users for a specific tenant.
    Super admin only.
    """
    # Set tenant context for this request
    set_tenant_id(tenant_id)
    
    # RLS will now filter to this tenant
    users = await db.execute(
        select(User).where(User.is_active == True)
    )
    
    return users.scalars().all()


@router.get("/analytics/platform")
async def get_platform_analytics(
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get platform-wide analytics.
    Requires super admin access to bypass RLS.
    """
    # Set super admin flag to bypass RLS
    set_super_admin(True)
    
    # Now we can query across all tenants
    stats = await db.execute("""
        SELECT 
            COUNT(DISTINCT t.id) as total_tenants,
            COUNT(DISTINCT u.id) as total_users,
            COUNT(DISTINCT s.id) as total_students
        FROM tenant t
        LEFT JOIN "user" u ON u.tenant_id = t.id
        LEFT JOIN student_profile s ON s.tenant_id = t.id
        WHERE t.is_active = TRUE
    """)
    
    return stats.one()
```

### Data Export

```python
# app/services/data_export.py

class DataExportService:
    """Export tenant data for migration or backup."""
    
    async def export_tenant_data(
        self,
        db: AsyncSession,
        tenant_id: UUID,
        format: str = "json"
    ) -> dict:
        """
        Export all data for a tenant.
        
        Used for:
        - Data portability (GDPR compliance)
        - Tenant migration
        - Backup before deletion
        """
        set_tenant_id(tenant_id)
        
        # Collect all tenant data
        data = {
            "tenant": await self._export_tenant(db, tenant_id),
            "users": await self._export_users(db),
            "students": await self._export_students(db),
            "classes": await self._export_classes(db),
            "assignments": await self._export_assignments(db),
            "grades": await self._export_grades(db),
            "attendance": await self._export_attendance(db),
            "exported_at": datetime.utcnow().isoformat()
        }
        
        if format == "json":
            return data
        elif format == "csv":
            return self._convert_to_csv_zip(data)
        else:
            raise ValueError(f"Unsupported format: {format}")
```

---

## Performance Considerations

### Indexing Strategy

```sql
-- All tenant-scoped tables should have tenant_id as the first column in indexes
-- This ensures efficient filtering when RLS is applied

-- Bad: Index on just the lookup column
CREATE INDEX idx_user_email ON "user"(email);

-- Good: Composite index with tenant_id first
CREATE INDEX idx_user_tenant_email ON "user"(tenant_id, email) WHERE deleted_at IS NULL;

-- For frequently filtered columns
CREATE INDEX idx_student_tenant_status ON student_profile(tenant_id, enrollment_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_assignment_tenant_due ON assignment(tenant_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_attendance_tenant_date ON attendance(tenant_id, date);
```

### Query Optimization

```python
# Always include tenant_id in queries, even with RLS
# This helps the query planner use indexes efficiently

# Less optimal (RLS adds the filter, but index may not be used)
users = await db.execute(
    select(User).where(User.is_active == True)
)

# More optimal (explicitly include tenant_id for index usage)
users = await db.execute(
    select(User).where(
        User.tenant_id == get_tenant_id(),
        User.is_active == True
    )
)
```

### Caching Strategy

```python
# Cache tenant-specific data with tenant_id in the cache key

def cache_key(resource: str, tenant_id: UUID, *args) -> str:
    """Generate a cache key with tenant isolation."""
    return f"tenant:{tenant_id}:{resource}:{':'.join(str(a) for a in args)}"

# Example usage
async def get_tenant_settings(tenant_id: UUID) -> dict:
    cache_key_str = cache_key("settings", tenant_id)
    
    # Try cache first
    cached = await redis.get(cache_key_str)
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    tenant = await db.get(Tenant, tenant_id)
    settings = tenant.settings
    
    # Cache for 5 minutes
    await redis.setex(cache_key_str, 300, json.dumps(settings))
    
    return settings
```

### Connection Pooling

```python
# app/core/database.py

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Configure connection pool for multi-tenant workload
# Ref: https://docs.sqlalchemy.org/en/20/core/pooling.html

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,          # Base pool size
    max_overflow=30,       # Additional connections under load
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=3600,     # Recycle connections after 1 hour
)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)
```

---

## Implementation

### Database Session with Tenant Context

```python
# app/core/dependencies.py

from fastapi import Depends
from app.core.database import async_session
from app.core.tenant import get_tenant_id, is_super_admin_ctx

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for database session with tenant context.
    
    Sets PostgreSQL session variables for RLS before each request.
    """
    async with async_session() as session:
        # Set tenant context for RLS
        tenant_id = get_tenant_id()
        is_super = is_super_admin_ctx.get()
        
        if tenant_id:
            await session.execute(
                text(f"SET app.current_tenant_id = '{tenant_id}'")
            )
        else:
            await session.execute(
                text("SET app.current_tenant_id = ''")
            )
        
        await session.execute(
            text(f"SET app.is_super_admin = '{'true' if is_super else 'false'}'")
        )
        
        try:
            yield session
        finally:
            # Clean up session variables
            await session.execute(text("RESET app.current_tenant_id"))
            await session.execute(text("RESET app.is_super_admin"))
```

### Model Mixin for Tenant-Scoped Entities

```python
# app/models/mixins.py

from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

class TenantMixin:
    """
    Mixin for all tenant-scoped models.
    
    Provides:
    - tenant_id foreign key
    - Automatic tenant assignment on creation
    """
    
    @declared_attr
    def tenant_id(cls):
        return Column(
            UUID(as_uuid=True),
            ForeignKey("tenant.id", ondelete="CASCADE"),
            nullable=False,
            index=True
        )
    
    @staticmethod
    def set_tenant_id(mapper, connection, target):
        """Automatically set tenant_id from context if not provided."""
        if target.tenant_id is None:
            tenant_id = get_tenant_id()
            if tenant_id:
                target.tenant_id = tenant_id
            else:
                raise ValueError("tenant_id is required but not set in context")

# Apply to models
from sqlalchemy import event

class User(Base, TenantMixin, TimestampMixin):
    __tablename__ = "user"
    # ... other columns

# Register event listener
event.listen(User, "before_insert", TenantMixin.set_tenant_id)
```

### Testing with Tenant Isolation

```python
# tests/conftest.py

import pytest
from app.core.tenant import set_tenant_id, clear_tenant

@pytest.fixture
async def tenant_a(db: AsyncSession):
    """Create test tenant A."""
    tenant = Tenant(name="Test School A", slug="test-school-a", ...)
    db.add(tenant)
    await db.commit()
    return tenant

@pytest.fixture
async def tenant_b(db: AsyncSession):
    """Create test tenant B."""
    tenant = Tenant(name="Test School B", slug="test-school-b", ...)
    db.add(tenant)
    await db.commit()
    return tenant

@pytest.fixture
def use_tenant_a(tenant_a):
    """Set tenant context to tenant A."""
    set_tenant_id(tenant_a.id)
    yield tenant_a
    clear_tenant()

# Test tenant isolation
async def test_tenant_isolation(db, tenant_a, tenant_b, use_tenant_a):
    """Verify that tenant A cannot see tenant B's data."""
    
    # Create user in tenant A (current context)
    user_a = User(email="user@a.com", tenant_id=tenant_a.id, ...)
    db.add(user_a)
    
    # Create user in tenant B (different tenant)
    user_b = User(email="user@b.com", tenant_id=tenant_b.id, ...)
    db.add(user_b)
    await db.commit()
    
    # Query users (should only return tenant A's user due to RLS)
    users = await db.execute(select(User))
    user_list = users.scalars().all()
    
    assert len(user_list) == 1
    assert user_list[0].email == "user@a.com"
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [02-DATABASE-DESIGN.md](./02-DATABASE-DESIGN.md) - Database schema
- [04-AUTHENTICATION.md](./04-AUTHENTICATION.md) - Auth implementation

---

*Document maintained by: Schoolnify Development Team*

