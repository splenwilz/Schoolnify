# Schoolnify

<div align="center">

![Schoolnify](https://img.shields.io/badge/Schoolnify-School%20Management-blue?style=for-the-badge)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**Multi-Tenant School Management Platform**

[Getting Started](#getting-started) · [Architecture](#architecture) · [Contributing](#contributing)

</div>

---

## Overview

Schoolnify is a multi-tenant school management platform. Each school gets its own subdomain (e.g., `springfield.schoolnify.com`) with a full suite of tools for managing academics, finance, communication, and administration.

### Features

| Category | Features |
|----------|----------|
| **Academic** | Class management, assignments, grading, attendance, report cards |
| **User Management** | Multi-role support, permission system, parent-student linking |
| **Finance** | Fee management, payment integration, receipts |
| **Communication** | Announcements, messaging, notifications |
| **Analytics** | Dashboards, reports, data exports |
| **Security** | Token auth, role-based access, data encryption, audit logging |

### Roles

| Role | Capabilities |
|------|-------------|
| **School Admin** | Full school management, staff, settings, reports |
| **Teacher** | Classes, assignments, grading, attendance |
| **Bursar** | Fee structures, payments, financial reports |
| **Librarian** | Library resources, borrowing, cataloging |
| **Parent** | Child monitoring, fee payments, communication |
| **Student** | Assignments, grades, schedules, resources |

---

## Architecture

```
                        ┌──────────────┐
                        │  Cloudflare  │
                        │  CDN + DNS   │
                        └──────┬───────┘
                               │
           ┌───────────────────┴───────────────────────┐
           │                                           │
  ┌────────▼────────┐                      ┌───────────▼───────────┐
  │     VERCEL      │                      │    RAILWAY / FLY      │
  │  ┌───────────┐  │                      │  ┌─────────────────┐  │
  │  │  Next.js  │  │   ── REST API ──▶    │  │   Rust Backend  │  │
  │  │  16 App   │  │                      │  │   (Actix/Axum)  │  │
  │  │  Router   │  │                      │  └────────┬────────┘  │
  │  └───────────┘  │                      │           │           │
  │                 │                      │  ┌────────▼────────┐  │
  │  • SSR/SSG     │                      │  │   PostgreSQL    │  │
  │  • TypeScript  │                      │  │   + Redis       │  │
  │  • Tailwind    │                      │  └─────────────────┘  │
  │  • shadcn/ui   │                      │                       │
  └─────────────────┘                      └───────────────────────┘
```

### Tech Stack

<table>
<tr>
<td valign="top" width="50%">

#### Backend ([schoolnify-api](https://github.com/your-org/schoolnify-api))

| Technology | Purpose |
|------------|---------|
| **Rust** | Backend language |
| **PostgreSQL** | Primary database |
| **Redis** | Caching & sessions |
| **WorkOS** | Authentication |

</td>
<td valign="top" width="50%">

#### Frontend (schoolnify-web)

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **TanStack Query** | Server state |

</td>
</tr>
</table>

---

## Repositories

| Repo | Description |
|------|-------------|
| **schoolnify** (this repo) | Monorepo root, docs, project-level config |
| **[schoolnify-api](https://github.com/your-org/schoolnify-api)** | Rust backend API |
| **schoolnify-web** | Next.js frontend (in `./schoolnify-web/`) |

---

## Getting Started

### Prerequisites

| Software | Version | Required |
|----------|---------|----------|
| Rust | Latest stable | For backend |
| Node.js | 18+ | For frontend |
| PostgreSQL | 15+ | Database |
| Redis | 7+ | Caching |

### Frontend Setup

```bash
cd schoolnify-web

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local — set BACKEND_URL=http://localhost:8080

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). School dashboards are accessed via subdomains in dev:

```
http://springfield-academy.localhost:3000
```

See [`schoolnify-web/README.md`](./schoolnify-web/README.md) for detailed frontend docs.

### Backend Setup

See the [schoolnify-api](https://github.com/your-org/schoolnify-api) repo for backend setup instructions.

### Access Points (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| School Dashboard | http://{slug}.localhost:3000 |
| Backend API | http://localhost:8080 |
| API Docs | http://localhost:8080/docs |

---

## Contributing

1. Read the relevant repo's README
2. Fork the repository
3. Create a feature branch (`feature/your-feature`)
4. Write tests for your changes
5. Submit a Pull Request

### Commit Convention

```
feat(scope): add new feature
fix(scope): fix bug
docs(scope): update documentation
refactor(scope): code refactoring
test(scope): add tests
```

---

## Support

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, feature requests |
| Email | support@schoolnify.com |

---

<div align="center">

![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat-square)
![Version](https://img.shields.io/badge/Version-0.1.0--alpha-blue?style=flat-square)

</div>
