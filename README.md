# 📚 Schoolnify Technical Documentation

<div align="center">

![Schoolnify](https://img.shields.io/badge/Schoolnify-School%20Management-blue?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Offline-First Cross-Platform School Management System**

*Empowering Nigerian schools with modern, reliable, and accessible technology*

[Getting Started](#-getting-started) •
[Documentation](#-documentation-index) •
[Architecture](#%EF%B8%8F-architecture-overview) •
[Roadmap](#-development-roadmap)

</div>

---

## 🎯 Project Overview

Schoolnify is a comprehensive **multi-tenant school management system** designed for the Nigerian education market. It prioritizes **offline-first functionality** to ensure schools can operate seamlessly regardless of internet connectivity.

### Key Features

| Category | Features |
|----------|----------|
| 🎓 **Academic** | Class management, assignments, grading, attendance, report cards |
| 👥 **User Management** | Multi-role support, permission system, parent-student linking |
| 💰 **Finance** | Fee management, Paystack/Flutterwave integration, receipts |
| 📢 **Communication** | Announcements, messaging, SMS/email notifications |
| 📊 **Analytics** | Dashboards, reports, data exports |
| 🔒 **Security** | JWT auth, MFA, role-based access, data encryption |
| 📱 **Offline-First** | Works without internet, syncs when connected |

### Target Users

| Role | Capabilities |
|------|-------------|
| **Super Admin** | Platform-wide administration, subscription management, analytics |
| **School Admin** | Full school management, staff, settings, reports |
| **Teacher** | Classes, assignments, grading, attendance |
| **Bursar** | Fee structures, payments, financial reports |
| **Registrar** | Admissions, student records, enrollment |
| **Librarian** | Library resources, borrowing, cataloging |
| **Facility Manager** | Equipment, maintenance, bookings |
| **Parent** | Child monitoring, fee payments, communication |
| **Student** | Assignments, grades, schedules, resources |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SCHOOLNIFY PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ┌──────────────┐                                 │
│                            │  Cloudflare  │                                 │
│                            │  CDN + DNS   │                                 │
│                            └──────┬───────┘                                 │
│                                   │                                          │
│           ┌───────────────────────┴───────────────────────┐                 │
│           │                                               │                  │
│  ┌────────▼────────┐                          ┌───────────▼───────────┐     │
│  │     VERCEL      │                          │   RAILWAY / RENDER    │     │
│  │  ┌───────────┐  │                          │  ┌─────────────────┐  │     │
│  │  │  Next.js  │  │   ──── REST API ────▶   │  │    FastAPI      │  │     │
│  │  │  14+ App  │  │                          │  │    Backend      │  │     │
│  │  │  Router   │  │                          │  └────────┬────────┘  │     │
│  │  └───────────┘  │                          │           │           │     │
│  │                 │                          │  ┌────────▼────────┐  │     │
│  │  • SSR/SSG     │                          │  │     Celery      │  │     │
│  │  • TypeScript  │                          │  │    Workers      │  │     │
│  │  • Tailwind    │                          │  └─────────────────┘  │     │
│  │  • shadcn/ui   │                          │                       │     │
│  └─────────────────┘                          └───────────┬───────────┘     │
│           │                                               │                  │
│           │                          ┌────────────────────┴────────────────┐│
│  ┌────────▼────────┐                │                                      ││
│  │   IndexedDB     │     ┌──────────▼──────────┐     ┌──────────────────┐  ││
│  │   (Dexie.js)    │     │     PostgreSQL      │     │      Redis       │  ││
│  │                 │     │     (Primary)       │     │     (Cache)      │  ││
│  │  • Offline      │     │                     │     │                  │  ││
│  │  • Sync Queue   │     │  • Multi-tenant     │     │  • Sessions      │  ││
│  │  • Local Cache  │     │  • Row-Level Sec.   │     │  • Rate Limits   │  ││
│  └─────────────────┘     │  • Full-text Search │     │  • Task Queue    │  ││
│                          └─────────────────────┘     └──────────────────┘  ││
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

<table>
<tr>
<td valign="top" width="50%">

#### 🔧 Backend (schoolnify-api)

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Async web framework |
| **SQLAlchemy 2.0** | ORM with async support |
| **PostgreSQL 15** | Primary database |
| **Alembic** | Database migrations |
| **Redis** | Caching & sessions |
| **Celery** | Background tasks |
| **Pydantic** | Data validation |
| **JWT** | Authentication |

</td>
<td valign="top" width="50%">

#### 🎨 Frontend (schoolnify-web)

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **Zustand** | Client state |
| **TanStack Query** | Server state |
| **Dexie.js** | Offline storage |
| **React Hook Form** | Form handling |

</td>
</tr>
</table>

---

## 📖 Documentation Index

### Core Architecture

| # | Document | Description |
|---|----------|-------------|
| 01 | [Architecture Overview](./docs/01-ARCHITECTURE-OVERVIEW.md) | System design, tech stack choices, component breakdown |
| 02 | [Database Design](./docs/02-DATABASE-DESIGN.md) | Schema definitions, relationships, indexes, RLS policies |
| 03 | [API Specification](./docs/03-API-SPECIFICATION.md) | REST endpoints, request/response formats, error handling |

### Security & Multi-Tenancy

| # | Document | Description |
|---|----------|-------------|
| 04 | [Authentication](./docs/04-AUTHENTICATION.md) | JWT tokens, MFA, password policies, session management |
| 05 | [Multi-Tenancy](./docs/05-MULTI-TENANCY.md) | Tenant isolation, Row-Level Security, data scoping |

### Implementation

| # | Document | Description |
|---|----------|-------------|
| 06 | [Frontend Architecture](./docs/06-FRONTEND-ARCHITECTURE.md) | Next.js structure, state management, offline-first |
| 07 | [Development Guide](./docs/07-DEVELOPMENT-GUIDE.md) | Setup, coding standards, testing, CI/CD, deployment |
| 08 | [Project Roadmap](./docs/08-PROJECT-ROADMAP.md) | Phases, timeline, milestones, success metrics |

### Reference

| Document | Description |
|----------|-------------|
| [Original Blueprint](./docs/Blueprint%20for%20Offline-First%20Cross-Platform%20School%20Management%20System.docx) | Initial requirements and specifications |

---

## 🚀 Getting Started

### Prerequisites

| Software | Version | Required |
|----------|---------|----------|
| Python | 3.11+ | ✅ |
| Node.js | 20 LTS | ✅ |
| PostgreSQL | 15+ | ✅ |
| Redis | 7+ | ✅ |
| Docker | 24+ | Recommended |
| pnpm | 8+ | Recommended |

### Quick Start

#### 1️⃣ Clone & Setup Infrastructure

```bash
# Clone the repository
git clone https://github.com/your-org/schoolnify.git
cd schoolnify

# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Verify containers are running
docker-compose ps
```

#### 2️⃣ Backend Setup

```bash
cd schoolnify-api

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
alembic upgrade head

# Seed initial data (optional)
python -m app.scripts.seed_data

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### 3️⃣ Frontend Setup

```bash
# In a new terminal
cd schoolnify-web

# Install dependencies
pnpm install  # or: npm install

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Start development server
pnpm dev  # or: npm run dev
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 Frontend | http://localhost:3000 | Next.js application |
| 🔌 Backend API | http://localhost:8000 | FastAPI server |
| 📄 Swagger Docs | http://localhost:8000/docs | Interactive API docs |
| 📘 ReDoc | http://localhost:8000/redoc | Alternative API docs |
| 🗄️ pgAdmin | http://localhost:5050 | Database management (if using Docker) |

---

## 📅 Development Roadmap

### Phase Overview

```
Phase 1        Phase 2        Phase 3        Phase 4        Phase 5
FOUNDATION     ACADEMIC       COMMUNICATION  ADVANCED       LAUNCH
Weeks 1-6      Weeks 7-12     Weeks 13-18    Weeks 19-24    Weeks 25-28
   │              │              │              │              │
   ▼              ▼              ▼              ▼              ▼
┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
│ Auth │ ───▶ │Class │ ───▶ │ Msg  │ ───▶ │Report│ ───▶ │ Test │
│Tenant│      │Grade │      │ Pay  │      │Offline│     │Deploy│
│Users │      │Assign│      │Notify│      │ Sync │      │Launch│
└──────┘      └──────┘      └──────┘      └──────┘      └──────┘
   │              │              │              │              │
   ▼              ▼              ▼              ▼              ▼
 Alpha         Feature        Beta          RC           GA
 Release       Complete       Release       Release      Release
```

### Detailed Timeline

| Phase | Duration | Key Deliverables | Milestone |
|-------|----------|------------------|-----------|
| **Phase 1** | 6 weeks | Auth, Multi-tenancy, User Management, Roles | Internal Alpha |
| **Phase 2** | 6 weeks | Classes, Students, Assignments, Grading, Attendance | Feature Complete |
| **Phase 3** | 6 weeks | Messaging, Announcements, Payments, Notifications | Beta (Pilot Schools) |
| **Phase 4** | 6 weeks | Reports, Analytics, Offline-First, Data Sync | Release Candidate |
| **Phase 5** | 4 weeks | Testing, Performance, Documentation, Launch | Public GA |

**Total Estimated Timeline: 28 weeks (7 months)**

See [Project Roadmap](./docs/08-PROJECT-ROADMAP.md) for detailed breakdown with weekly tasks.

---

## 🗂️ Project Structure

```
schoolnify/
├── 📁 docs/                      # Technical documentation (you are here)
│   ├── 01-ARCHITECTURE-OVERVIEW.md
│   ├── 02-DATABASE-DESIGN.md
│   ├── 03-API-SPECIFICATION.md
│   ├── 04-AUTHENTICATION.md
│   ├── 05-MULTI-TENANCY.md
│   ├── 06-FRONTEND-ARCHITECTURE.md
│   ├── 07-DEVELOPMENT-GUIDE.md
│   ├── 08-PROJECT-ROADMAP.md
│   └── README.md
│
├── 📁 schoolnify-api/            # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/              # API routes
│   │   ├── core/                # Config, security, database
│   │   ├── models/              # SQLAlchemy models
│   │   ├── services/            # Business logic
│   │   └── main.py              # Application entry
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # Backend tests
│   └── requirements.txt
│
└── 📁 schoolnify-web/            # Next.js Frontend
    ├── src/
    │   ├── app/                 # App Router pages
    │   ├── components/          # React components
    │   ├── lib/                 # Utilities, hooks, stores
    │   └── types/               # TypeScript types
    ├── public/                  # Static assets
    └── package.json
```

---

## 🔐 Security Highlights

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | Argon2id with salt |
| **JWT Tokens** | Short-lived access + refresh token rotation |
| **MFA** | TOTP with backup codes |
| **Tenant Isolation** | PostgreSQL Row-Level Security |
| **Rate Limiting** | Per-user and per-IP limits |
| **CORS** | Strict origin validation |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest |
| **Audit Logging** | All sensitive actions logged |

---

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| **API Response Time** | < 200ms (p95) |
| **Page Load Time** | < 2s (First Contentful Paint) |
| **Concurrent Users** | 20,000+ platform-wide |
| **Users per School** | Up to 5,000 |
| **Number of Schools** | 1,000+ |
| **Uptime** | 99.9% |

---

## 🤝 Contributing

1. 📖 Read the [Development Guide](./docs/07-DEVELOPMENT-GUIDE.md)
2. 🍴 Fork the repository
3. 🌿 Create a feature branch (`feature/your-feature`)
4. ✅ Write tests for your changes
5. 📝 Follow the coding standards (Ruff for Python, ESLint for TS)
6. 🔄 Submit a Pull Request

### Commit Convention

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
refactor(scope): code refactoring
test(scope): add tests
chore(scope): maintenance tasks
```

---

## 📞 Support & Contact

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, feature requests |
| Documentation | Technical reference |
| Email | support@schoolnify.com |

---

<div align="center">

![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)
![Version](https://img.shields.io/badge/Version-0.1.0--alpha-blue?style=flat-square)

*Last Updated: March 2026*

</div>
