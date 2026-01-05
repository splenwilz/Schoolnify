# Schoolnify - Development & Deployment Guide

> **Version:** 1.0.0  
> **Last Updated:** January 2026

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Project Configuration](#project-configuration)
4. [Development Workflow](#development-workflow)
5. [Code Standards](#code-standards)
6. [Testing](#testing)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Deployment](#deployment)
9. [Monitoring & Logging](#monitoring--logging)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Python** | 3.11+ | Backend runtime |
| **Node.js** | 20 LTS | Frontend runtime |
| **PostgreSQL** | 15+ | Primary database |
| **Redis** | 7+ | Caching, sessions |
| **Docker** | 24+ | Containerization |
| **Docker Compose** | 2.20+ | Local dev environment |
| **Git** | 2.40+ | Version control |

### Recommended Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | IDE with recommended extensions |
| **pgAdmin** / **TablePlus** | Database management |
| **Postman** / **Insomnia** | API testing |
| **pnpm** | Fast, disk-efficient package manager |

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "charliermarsh.ruff",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "formulahendry.auto-rename-tag"
  ]
}
```

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/schoolnify.git
cd schoolnify
```

### 2. Backend Setup (FastAPI)

```bash
cd schoolnify-api

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev dependencies

# Copy environment file
cp .env.example .env
# Edit .env with your local settings
```

### 3. Frontend Setup (Next.js)

```bash
cd schoolnify-web

# Install dependencies (using pnpm recommended)
pnpm install
# Or with npm:
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your local settings
```

### 4. Database Setup

#### Option A: Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Verify containers are running
docker-compose ps
```

#### Option B: Local Installation

```bash
# macOS (using Homebrew)
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

# Create database
createdb schoolnify_dev
```

### 5. Run Migrations

```bash
cd schoolnify-api

# Run Alembic migrations
alembic upgrade head

# Seed initial data (roles, permissions)
python -m app.scripts.seed_data
```

### 6. Start Development Servers

```bash
# Terminal 1: Backend
cd schoolnify-api
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd schoolnify-web
pnpm dev
# Or: npm run dev

# Terminal 3: Celery Worker (for background tasks)
cd schoolnify-api
celery -A app.celery_app worker --loglevel=info
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |
| pgAdmin (if using Docker) | http://localhost:5050 |

---

## Project Configuration

### Backend Environment Variables

```bash
# schoolnify-api/.env

# Application
APP_NAME=Schoolnify
APP_ENV=development  # development, staging, production
DEBUG=true
SECRET_KEY=your-super-secret-key-change-in-production

# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/schoolnify_dev
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=jwt-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
EMAIL_FROM=noreply@schoolnify.com

# SMS (Termii)
TERMII_API_KEY=your-termii-api-key
TERMII_SENDER_ID=Schoolnify

# File Storage (S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=schoolnify-uploads
AWS_S3_REGION=eu-west-1

# Payment Gateways
PAYSTACK_SECRET_KEY=sk_test_xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend Environment Variables

```bash
# schoolnify-web/.env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=nextauth-secret-change-in-production

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Docker Compose (Local Development)

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: schoolnify-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: schoolnify_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: schoolnify-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    container_name: schoolnify-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@schoolnify.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

---

## Development Workflow

### Git Branching Strategy

```
main                    # Production-ready code
├── develop            # Integration branch for features
│   ├── feature/xxx    # Feature branches
│   ├── fix/xxx        # Bug fix branches
│   └── refactor/xxx   # Refactoring branches
├── release/x.x.x      # Release preparation
└── hotfix/xxx         # Production hotfixes
```

### Branch Naming Convention

```bash
# Features
feature/user-authentication
feature/assignment-grading

# Bug fixes
fix/login-redirect-issue
fix/grade-calculation-error

# Refactoring
refactor/auth-service
refactor/database-queries
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

[optional body]

[optional footer]

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting (no code change)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance

# Examples
feat(auth): add multi-factor authentication
fix(grades): correct GPA calculation formula
docs(api): update assignment endpoints documentation
refactor(users): simplify user service layer
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure all tests pass locally
4. Create PR with description using template
5. Request code review (minimum 1 reviewer)
6. Address review comments
7. Squash and merge after approval

```markdown
<!-- PR Template -->
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented hard-to-understand areas
- [ ] Documentation updated
- [ ] No new warnings
```

---

## Code Standards

### Python (Backend)

#### Style Guide

- Follow [PEP 8](https://peps.python.org/pep-0008/)
- Use [Ruff](https://docs.astral.sh/ruff/) for linting and formatting
- Maximum line length: 100 characters

```bash
# Run linter
ruff check .

# Run formatter
ruff format .

# Fix auto-fixable issues
ruff check --fix .
```

#### Ruff Configuration

```toml
# pyproject.toml

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
]
ignore = ["E501"]  # Line too long (handled by formatter)

[tool.ruff.lint.isort]
known-first-party = ["app"]
```

#### Type Hints

```python
# Always use type hints
from typing import Optional, List
from uuid import UUID

async def get_user(
    db: AsyncSession,
    user_id: UUID
) -> Optional[User]:
    """Get a user by ID."""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

async def get_users(
    db: AsyncSession,
    filters: UserFilters
) -> List[User]:
    """Get users with filters."""
    query = select(User).where(User.is_active == True)
    # ... apply filters
    result = await db.execute(query)
    return result.scalars().all()
```

### TypeScript (Frontend)

#### Style Guide

- Use [ESLint](https://eslint.org/) with Next.js config
- Use [Prettier](https://prettier.io/) for formatting
- Strict TypeScript mode enabled

```bash
# Run linter
pnpm lint

# Run formatter
pnpm format

# Type check
pnpm type-check
```

#### ESLint Configuration

```javascript
// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
```

#### Prettier Configuration

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Python modules | snake_case | `user_service.py` |
| Python classes | PascalCase | `UserService` |
| React components | PascalCase | `UserProfile.tsx` |
| React hooks | camelCase with use prefix | `useAuth.ts` |
| API routes | kebab-case | `forgot-password/route.ts` |
| CSS modules | kebab-case | `user-profile.module.css` |
| Test files | *.test.ts or *.spec.ts | `auth.test.ts` |

---

## Testing

### Backend Testing (pytest)

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run specific test
pytest tests/test_auth.py::test_login_success

# Run with verbose output
pytest -v
```

#### Test Structure

```python
# tests/test_auth.py

import pytest
from httpx import AsyncClient
from app.main import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def test_user(db: AsyncSession):
    """Create a test user."""
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("password123"),
        first_name="Test",
        last_name="User",
        is_active=True,
        is_email_verified=True,
    )
    db.add(user)
    await db.commit()
    return user

class TestLogin:
    async def test_login_success(self, client: AsyncClient, test_user: User):
        """Test successful login."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "password123",
            },
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data["data"]

    async def test_login_invalid_password(self, client: AsyncClient, test_user: User):
        """Test login with wrong password."""
        response = await client.post(
            "/api/v1/auth/login",
            json={
                "email": "test@example.com",
                "password": "wrongpassword",
            },
        )
        
        assert response.status_code == 401
```

### Frontend Testing (Vitest)

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific file
pnpm test src/lib/utils/format.test.ts
```

#### Test Structure

```typescript
// src/lib/utils/__tests__/format.test.ts

import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency, formatGrade } from '../format'

describe('formatDate', () => {
  it('formats date in full format', () => {
    const date = new Date('2026-01-05T10:30:00Z')
    expect(formatDate(date, 'full')).toBe('Monday, January 5, 2026')
  })

  it('formats date in short format', () => {
    const date = new Date('2026-01-05')
    expect(formatDate(date, 'short')).toBe('Jan 5, 2026')
  })

  it('handles null date', () => {
    expect(formatDate(null)).toBe('-')
  })
})

describe('formatCurrency', () => {
  it('formats NGN correctly', () => {
    expect(formatCurrency(150000, 'NGN')).toBe('₦150,000.00')
  })

  it('formats with no decimals', () => {
    expect(formatCurrency(150000, 'NGN', 0)).toBe('₦150,000')
  })
})
```

### E2E Testing (Playwright)

```bash
# Run E2E tests
pnpm e2e

# Run with UI
pnpm e2e:ui

# Run specific test
pnpm e2e tests/auth.spec.ts
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml

name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Backend Tests
  backend-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        working-directory: ./schoolnify-api
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run linter
        working-directory: ./schoolnify-api
        run: ruff check .
      
      - name: Run tests
        working-directory: ./schoolnify-api
        env:
          DATABASE_URL: postgresql+asyncpg://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379/0
        run: pytest --cov=app --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: ./schoolnify-api/coverage.xml

  # Frontend Tests
  frontend-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        working-directory: ./schoolnify-web
        run: pnpm install --frozen-lockfile
      
      - name: Run linter
        working-directory: ./schoolnify-web
        run: pnpm lint
      
      - name: Run type check
        working-directory: ./schoolnify-web
        run: pnpm type-check
      
      - name: Run tests
        working-directory: ./schoolnify-web
        run: pnpm test:coverage
      
      - name: Build
        working-directory: ./schoolnify-web
        run: pnpm build

  # E2E Tests
  e2e-test:
    runs-on: ubuntu-latest
    needs: [backend-test, frontend-test]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Playwright
        working-directory: ./schoolnify-web
        run: |
          pnpm install --frozen-lockfile
          pnpm exec playwright install --with-deps
      
      - name: Run E2E tests
        working-directory: ./schoolnify-web
        run: pnpm e2e
```

### Deployment Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: schoolnify-api

  deploy-frontend:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./schoolnify-web
```

---

## Deployment

### Production Architecture

```
                                    ┌─────────────────┐
                                    │   Cloudflare    │
                                    │   (CDN + DNS)   │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    │                                                  │
           ┌────────▼────────┐                              ┌─────────▼─────────┐
           │     Vercel      │                              │  Railway / Render │
           │   (Frontend)    │                              │    (Backend)      │
           │                 │                              │                   │
           │  - Next.js SSR  │    ─── API calls ──▶         │  - FastAPI       │
           │  - Static files │                              │  - Celery Worker │
           │  - Edge funcs   │                              │                   │
           └─────────────────┘                              └────────┬──────────┘
                                                                     │
                                                    ┌────────────────┴────────────────┐
                                                    │                                 │
                                           ┌────────▼────────┐              ┌─────────▼─────────┐
                                           │   PostgreSQL    │              │      Redis        │
                                           │  (Managed DB)   │              │   (Managed)       │
                                           │                 │              │                   │
                                           │  - Railway      │              │  - Upstash        │
                                           │  - Supabase     │              │  - Railway        │
                                           │  - Neon         │              │                   │
                                           └─────────────────┘              └───────────────────┘
```

### Environment Configuration

| Environment | Frontend URL | Backend URL | Database |
|-------------|--------------|-------------|----------|
| Production | schoolnify.com | api.schoolnify.com | prod-db |
| Staging | staging.schoolnify.com | staging-api.schoolnify.com | staging-db |
| Development | localhost:3000 | localhost:8000 | dev-db |

### Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Feature flags reviewed
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

---

## Monitoring & Logging

### Application Monitoring

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking |
| **Prometheus + Grafana** | Metrics |
| **Uptime Robot** | Uptime monitoring |

### Sentry Configuration

```python
# Backend
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    environment=settings.APP_ENV,
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
)
```

```typescript
// Frontend
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  tracesSampleRate: 0.1,
})
```

### Structured Logging

```python
# Backend logging configuration
import structlog

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = structlog.get_logger()

# Usage
logger.info(
    "user_login",
    user_id=user.id,
    tenant_id=user.tenant_id,
    ip_address=request.client.host,
)
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [08-PROJECT-ROADMAP.md](./08-PROJECT-ROADMAP.md) - Implementation phases

---

*Document maintained by: Schoolnify Development Team*

