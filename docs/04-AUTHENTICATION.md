# Schoolnify - Authentication & Authorization

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Implementation:** FastAPI + JWT + OAuth2

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Token Management](#token-management)
4. [Multi-Factor Authentication](#multi-factor-authentication)
5. [Role-Based Access Control](#role-based-access-control)
6. [Permission System](#permission-system)
7. [Implementation Details](#implementation-details)
8. [Security Best Practices](#security-best-practices)

---

## Overview

Schoolnify implements a comprehensive authentication and authorization system supporting:

- **JWT-based Authentication:** Stateless token-based auth
- **Role-Based Access Control (RBAC):** Hierarchical role system
- **Attribute-Based Access Control (ABAC):** Dynamic permissions based on context
- **Multi-Factor Authentication (MFA):** Optional TOTP-based 2FA
- **Multi-Tenancy:** Tenant-scoped permissions and access

### Security Standards

| Standard | Implementation |
|----------|----------------|
| Password Hashing | Argon2id (recommended) or bcrypt |
| Token Format | JWT (RS256 or HS256) |
| Token Storage | HTTP-only cookies + localStorage backup |
| HTTPS | Required in production |
| Rate Limiting | Per-user and per-IP limits |

---

## Authentication Flow

### Standard Login Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │ Next.js  │     │ FastAPI  │     │   Redis  │
│          │     │   BFF    │     │   API    │     │  (Cache) │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ 1. POST /login │                │                │
     │   {email, pwd} │                │                │
     │───────────────▶│                │                │
     │                │ 2. POST /auth/ │                │
     │                │    login       │                │
     │                │───────────────▶│                │
     │                │                │ 3. Validate    │
     │                │                │    credentials │
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │ 4. Check rate  │
     │                │                │    limits      │
     │                │                │◀───────────────│
     │                │                │                │
     │                │ 5. JWT tokens  │                │
     │                │◀───────────────│                │
     │                │                │                │
     │ 6. Set cookies │                │                │
     │    + response  │                │                │
     │◀───────────────│                │                │
     │                │                │                │
```

### MFA-Enabled Login Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │ FastAPI  │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     │ 1. Login       │                │
     │   credentials  │                │
     │───────────────▶│                │
     │                │ 2. Verify pwd  │
     │                │───────────────▶│
     │                │                │
     │                │ 3. User has    │
     │                │    MFA enabled │
     │                │◀───────────────│
     │                │                │
     │ 4. MFA required│                │
     │   + challenge  │                │
     │   token        │                │
     │◀───────────────│                │
     │                │                │
     │ 5. Submit TOTP │                │
     │   code         │                │
     │───────────────▶│                │
     │                │                │
     │                │ 6. Verify TOTP │
     │                │───────────────▶│
     │                │                │
     │ 7. JWT tokens  │                │
     │◀───────────────│                │
     │                │                │
```

---

## Token Management

### Token Types

| Token | Purpose | Lifetime | Storage |
|-------|---------|----------|---------|
| Access Token | API authentication | 15-60 minutes | Memory / HTTP-only cookie |
| Refresh Token | Obtain new access token | 7-30 days | HTTP-only cookie |
| MFA Challenge Token | Temporary MFA validation | 5 minutes | Memory |
| Password Reset Token | Password reset flow | 1 hour | Email link (hashed in DB) |
| Email Verification Token | Verify email address | 24 hours | Email link (hashed in DB) |
| Invitation Token | User invitation | 7 days | Email link (hashed in DB) |

### JWT Structure

```json
// Access Token Payload
{
    "sub": "uuid-user-id",              // Subject (user ID)
    "email": "user@school.com",
    "tenant_id": "uuid-tenant-id",
    "roles": ["teacher"],
    "permissions": ["assignment.create", "grade.view"],
    "type": "access",
    "iat": 1704456000,                  // Issued at
    "exp": 1704459600,                  // Expiration
    "jti": "uuid-token-id"              // JWT ID (for revocation)
}

// Refresh Token Payload
{
    "sub": "uuid-user-id",
    "tenant_id": "uuid-tenant-id",
    "type": "refresh",
    "family": "uuid-token-family",       // For refresh token rotation
    "iat": 1704456000,
    "exp": 1705060800,
    "jti": "uuid-token-id"
}
```

### Token Refresh Strategy

```python
# Refresh Token Rotation
# Ref: https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation

"""
1. Client sends refresh token to /auth/refresh
2. Server validates refresh token
3. Server issues NEW access + refresh tokens
4. Server invalidates OLD refresh token
5. If old refresh token is reused (stolen token attack):
   - Invalidate entire token family
   - Force user re-authentication
"""
```

### Token Revocation

```python
# Store revoked tokens in Redis with TTL matching token expiration
# Ref: Redis SET with EXPIRE

REVOKED_TOKENS_PREFIX = "revoked_token:"

async def revoke_token(jti: str, exp: int):
    """Revoke a token by adding it to the blacklist."""
    ttl = exp - int(time.time())
    if ttl > 0:
        await redis.setex(f"{REVOKED_TOKENS_PREFIX}{jti}", ttl, "1")

async def is_token_revoked(jti: str) -> bool:
    """Check if a token has been revoked."""
    return await redis.exists(f"{REVOKED_TOKENS_PREFIX}{jti}")
```

---

## Multi-Factor Authentication

### TOTP Implementation

```python
# Using pyotp library
# Ref: https://pyauth.github.io/pyotp/

import pyotp
import qrcode
import io
import base64

def generate_mfa_secret() -> str:
    """Generate a new TOTP secret."""
    return pyotp.random_base32()

def generate_qr_code(secret: str, email: str, issuer: str = "Schoolnify") -> str:
    """Generate QR code for authenticator app setup."""
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=email,
        issuer_name=issuer
    )
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(provisioning_uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    
    return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"

def verify_totp(secret: str, code: str) -> bool:
    """Verify a TOTP code."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)  # Allow 1 step tolerance (30 seconds)
```

### Backup Codes

```python
import secrets

def generate_backup_codes(count: int = 10) -> list[str]:
    """Generate single-use backup codes for MFA recovery."""
    return [secrets.token_hex(4).upper() for _ in range(count)]

# Store hashed backup codes in database
# Each code can only be used once
```

---

## Role-Based Access Control

### Role Hierarchy

```
                    ┌──────────────────┐
                    │   SUPER_ADMIN    │
                    │  (Platform-wide) │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │   SCHOOL_ADMIN   │
                    │  (Tenant-wide)   │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐   ┌────────▼────────┐   ┌───────▼───────┐
│    TEACHER    │   │     BURSAR      │   │   REGISTRAR   │
│               │   │                 │   │               │
└───────┬───────┘   └─────────────────┘   └───────────────┘
        │
        │ (View only)
        ▼
┌───────────────┐   ┌─────────────────┐
│    PARENT     │   │     STUDENT     │
│               │   │                 │
└───────────────┘   └─────────────────┘
```

### Default Roles

| Role | Description | Scope | Key Permissions |
|------|-------------|-------|-----------------|
| `super_admin` | Platform administrator | Global | All permissions across tenants |
| `school_admin` | School administrator | Tenant | All permissions within tenant |
| `teacher` | Teaching staff | Tenant | Manage classes, assignments, grades |
| `bursar` | Financial officer | Tenant | Manage fees, payments, financial reports |
| `registrar` | Records officer | Tenant | Manage admissions, student records |
| `librarian` | Library manager | Tenant | Manage library resources |
| `facility_manager` | Facilities manager | Tenant | Manage facilities, equipment |
| `exam_officer` | Examination officer | Tenant | Manage exams, results |
| `parent` | Parent/Guardian | Tenant | View child's academic data |
| `student` | Student | Tenant | View own data, submit assignments |

### Role Inheritance

```python
# Role inheritance configuration
# Child roles inherit all permissions from parent roles

ROLE_HIERARCHY = {
    "school_admin": ["teacher", "bursar", "registrar", "librarian", "facility_manager", "exam_officer"],
    "super_admin": ["school_admin"],
}

def get_effective_permissions(user_roles: list[str]) -> set[str]:
    """Get all permissions including inherited ones."""
    effective_roles = set(user_roles)
    
    # Recursively add inherited roles
    for role in user_roles:
        if role in ROLE_HIERARCHY:
            inherited = ROLE_HIERARCHY[role]
            effective_roles.update(inherited)
            for inherited_role in inherited:
                if inherited_role in ROLE_HIERARCHY:
                    effective_roles.update(ROLE_HIERARCHY[inherited_role])
    
    # Get permissions for all effective roles
    permissions = set()
    for role in effective_roles:
        permissions.update(get_role_permissions(role))
    
    return permissions
```

---

## Permission System

### Permission Categories

| Category | Permissions |
|----------|-------------|
| **Users** | `user.view`, `user.create`, `user.update`, `user.delete`, `user.invite` |
| **Students** | `student.view`, `student.create`, `student.update`, `student.delete`, `student.enroll` |
| **Classes** | `class.view`, `class.create`, `class.update`, `class.delete`, `class.assign_teacher` |
| **Subjects** | `subject.view`, `subject.create`, `subject.update`, `subject.delete` |
| **Assignments** | `assignment.view`, `assignment.create`, `assignment.update`, `assignment.delete`, `assignment.grade` |
| **Grades** | `grade.view`, `grade.create`, `grade.update`, `grade.publish` |
| **Attendance** | `attendance.view`, `attendance.record`, `attendance.update` |
| **Finance** | `fee.view`, `fee.create`, `fee.update`, `payment.view`, `payment.process` |
| **Communication** | `announcement.create`, `message.send` |
| **Reports** | `report.view`, `report.generate`, `report.export` |
| **Settings** | `settings.view`, `settings.update` |

### Permission Check Implementation

```python
# FastAPI dependency for permission checking
# Ref: FastAPI Dependencies - https://fastapi.tiangolo.com/tutorial/dependencies/

from fastapi import Depends, HTTPException, status
from functools import wraps

class PermissionChecker:
    """Dependency for checking user permissions."""
    
    def __init__(self, required_permissions: list[str], require_all: bool = True):
        self.required_permissions = required_permissions
        self.require_all = require_all
    
    async def __call__(self, current_user: User = Depends(get_current_user)):
        user_permissions = await get_user_permissions(current_user)
        
        if self.require_all:
            # User must have ALL required permissions
            has_permission = all(
                perm in user_permissions 
                for perm in self.required_permissions
            )
        else:
            # User must have AT LEAST ONE required permission
            has_permission = any(
                perm in user_permissions 
                for perm in self.required_permissions
            )
        
        if not has_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        
        return current_user

# Usage in routes
@router.post("/assignments")
async def create_assignment(
    data: AssignmentCreate,
    current_user: User = Depends(PermissionChecker(["assignment.create"]))
):
    """Create a new assignment."""
    pass

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: UUID,
    current_user: User = Depends(PermissionChecker(["user.delete"]))
):
    """Delete a user."""
    pass
```

### Resource-Level Permissions (ABAC)

```python
# Attribute-Based Access Control for fine-grained permissions
# Example: Teachers can only view/edit their own class assignments

from typing import Optional

class ResourcePermissionChecker:
    """Check permissions based on resource ownership/attributes."""
    
    @staticmethod
    async def can_access_assignment(
        user: User,
        assignment: Assignment,
        action: str
    ) -> bool:
        """Check if user can perform action on assignment."""
        
        # Super admins and school admins have full access
        if "super_admin" in user.roles or "school_admin" in user.roles:
            return True
        
        # Teachers can access their own class assignments
        if "teacher" in user.roles:
            if action in ["view", "update", "delete", "grade"]:
                # Check if teacher is assigned to this class-subject
                return assignment.class_subject.teacher_id == user.id
        
        # Students can view and submit to assignments in their class
        if "student" in user.roles:
            if action == "view":
                return await is_student_in_class(user.id, assignment.class_subject.class_section_id)
            if action == "submit":
                return await is_student_in_class(user.id, assignment.class_subject.class_section_id)
        
        # Parents can view assignments of their children
        if "parent" in user.roles:
            if action == "view":
                return await is_parent_of_student_in_class(
                    user.id, 
                    assignment.class_subject.class_section_id
                )
        
        return False

# Usage
@router.get("/assignments/{assignment_id}")
async def get_assignment(
    assignment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    assignment = await get_assignment_by_id(db, assignment_id)
    
    if not await ResourcePermissionChecker.can_access_assignment(
        current_user, 
        assignment, 
        "view"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this assignment"
        )
    
    return assignment
```

---

## Implementation Details

### FastAPI Security Configuration

```python
# app/core/security.py

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# Password hashing
# Ref: https://passlib.readthedocs.io/en/stable/
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# JWT Configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"  # Use RS256 for production with key rotation
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a new access token."""
    to_encode = data.copy()
    
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access",
        "jti": str(uuid.uuid4())
    })
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a new refresh token."""
    to_encode = data.copy()
    
    expire = datetime.utcnow() + (
        expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
        "jti": str(uuid.uuid4()),
        "family": str(uuid.uuid4())  # For refresh token rotation
    })
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Validate token and return current user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        jti: str = payload.get("jti")
        
        if user_id is None or token_type != "access":
            raise credentials_exception
        
        # Check if token is revoked
        if await is_token_revoked(jti):
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(db, user_id)
    if user is None or not user.is_active:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Ensure user is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user
```

### Tenant Context Middleware

```python
# app/middleware/tenant.py

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from contextvars import ContextVar

# Context variable for current tenant
# Ref: Python contextvars - https://docs.python.org/3/library/contextvars.html
current_tenant_id: ContextVar[Optional[str]] = ContextVar('current_tenant_id', default=None)


class TenantMiddleware(BaseHTTPMiddleware):
    """Extract and validate tenant context from requests."""
    
    async def dispatch(self, request: Request, call_next):
        # Extract tenant from multiple sources
        tenant_id = None
        
        # 1. From X-Tenant-ID header
        tenant_id = request.headers.get("X-Tenant-ID")
        
        # 2. From JWT token (if authenticated)
        if not tenant_id:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                try:
                    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                    tenant_id = payload.get("tenant_id")
                except JWTError:
                    pass
        
        # 3. From subdomain (optional)
        if not tenant_id:
            host = request.headers.get("Host", "")
            subdomain = host.split(".")[0] if "." in host else None
            if subdomain and subdomain not in ["api", "www", "staging"]:
                tenant = await get_tenant_by_slug(subdomain)
                if tenant:
                    tenant_id = str(tenant.id)
        
        # Set tenant context
        current_tenant_id.set(tenant_id)
        
        # Set PostgreSQL session variable for RLS
        if tenant_id:
            async with get_db_session() as db:
                await db.execute(
                    f"SET app.current_tenant_id = '{tenant_id}'"
                )
        
        response = await call_next(request)
        return response
```

### Password Validation

```python
# app/core/validators.py

import re
from pydantic import validator

class PasswordValidator:
    """Password strength validation."""
    
    MIN_LENGTH = 8
    MAX_LENGTH = 128
    
    # Password requirements
    PATTERNS = {
        "uppercase": r"[A-Z]",
        "lowercase": r"[a-z]",
        "digit": r"\d",
        "special": r"[!@#$%^&*(),.?\":{}|<>]"
    }
    
    @classmethod
    def validate(cls, password: str) -> tuple[bool, list[str]]:
        """Validate password strength."""
        errors = []
        
        if len(password) < cls.MIN_LENGTH:
            errors.append(f"Password must be at least {cls.MIN_LENGTH} characters")
        
        if len(password) > cls.MAX_LENGTH:
            errors.append(f"Password must be at most {cls.MAX_LENGTH} characters")
        
        if not re.search(cls.PATTERNS["uppercase"], password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(cls.PATTERNS["lowercase"], password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(cls.PATTERNS["digit"], password):
            errors.append("Password must contain at least one digit")
        
        if not re.search(cls.PATTERNS["special"], password):
            errors.append("Password must contain at least one special character")
        
        return len(errors) == 0, errors

# Pydantic model usage
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
    @validator("password")
    def validate_password(cls, v):
        is_valid, errors = PasswordValidator.validate(v)
        if not is_valid:
            raise ValueError("; ".join(errors))
        return v
```

---

## Security Best Practices

### 1. Rate Limiting

```python
# Using slowapi for rate limiting
# Ref: https://slowapi.readthedocs.io/

from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/auth/login")
@limiter.limit("10/minute")  # 10 attempts per minute per IP
async def login(request: Request, data: LoginRequest):
    pass

@router.post("/auth/forgot-password")
@limiter.limit("3/minute")  # Strict limit for password reset
async def forgot_password(request: Request, data: ForgotPasswordRequest):
    pass
```

### 2. Account Lockout

```python
# Lock account after failed login attempts

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15

async def check_account_lockout(user_id: str) -> bool:
    """Check if account is locked due to failed attempts."""
    key = f"failed_login:{user_id}"
    attempts = await redis.get(key)
    
    if attempts and int(attempts) >= MAX_FAILED_ATTEMPTS:
        return True
    return False

async def record_failed_attempt(user_id: str):
    """Record a failed login attempt."""
    key = f"failed_login:{user_id}"
    attempts = await redis.incr(key)
    
    if attempts == 1:
        await redis.expire(key, LOCKOUT_DURATION_MINUTES * 60)

async def clear_failed_attempts(user_id: str):
    """Clear failed attempts after successful login."""
    await redis.delete(f"failed_login:{user_id}")
```

### 3. Secure Headers

```python
# FastAPI middleware for security headers

from starlette.middleware.base import BaseHTTPMiddleware

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response
```

### 4. Audit Logging

```python
# Log all authentication events

async def log_auth_event(
    event_type: str,
    user_id: Optional[str],
    email: str,
    ip_address: str,
    user_agent: str,
    success: bool,
    details: Optional[dict] = None
):
    """Log authentication events for audit trail."""
    await db.execute(
        insert(audit_log).values(
            user_id=user_id,
            action=event_type,
            resource_type="authentication",
            ip_address=ip_address,
            user_agent=user_agent,
            new_values={
                "email": email,
                "success": success,
                "details": details
            }
        )
    )

# Usage in login
await log_auth_event(
    event_type="login_attempt",
    user_id=str(user.id) if user else None,
    email=data.email,
    ip_address=request.client.host,
    user_agent=request.headers.get("User-Agent"),
    success=True
)
```

### 5. Session Management

```python
# Track and manage user sessions

class SessionManager:
    """Manage user sessions across devices."""
    
    @staticmethod
    async def create_session(
        user_id: str,
        device_info: dict,
        ip_address: str
    ) -> str:
        """Create a new session."""
        session_id = str(uuid.uuid4())
        
        await redis.hset(
            f"user_sessions:{user_id}",
            session_id,
            json.dumps({
                "device": device_info,
                "ip": ip_address,
                "created_at": datetime.utcnow().isoformat(),
                "last_active": datetime.utcnow().isoformat()
            })
        )
        
        return session_id
    
    @staticmethod
    async def get_user_sessions(user_id: str) -> list[dict]:
        """Get all active sessions for a user."""
        sessions = await redis.hgetall(f"user_sessions:{user_id}")
        return [
            {"id": k, **json.loads(v)} 
            for k, v in sessions.items()
        ]
    
    @staticmethod
    async def revoke_session(user_id: str, session_id: str):
        """Revoke a specific session."""
        await redis.hdel(f"user_sessions:{user_id}", session_id)
    
    @staticmethod
    async def revoke_all_sessions(user_id: str):
        """Revoke all sessions for a user."""
        await redis.delete(f"user_sessions:{user_id}")
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [03-API-SPECIFICATION.md](./03-API-SPECIFICATION.md) - API endpoints
- [05-MULTI-TENANCY.md](./05-MULTI-TENANCY.md) - Multi-tenant implementation

---

*Document maintained by: Schoolnify Development Team*


