# Schoolnify - System Architecture Overview

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Tech Stack:** FastAPI (Python) + Next.js (TypeScript)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Technology Stack](#technology-stack)
4. [High-Level Architecture](#high-level-architecture)
5. [Component Breakdown](#component-breakdown)
6. [Data Flow](#data-flow)
7. [Deployment Architecture](#deployment-architecture)
8. [Key Design Decisions](#key-design-decisions)

---

## Executive Summary

Schoolnify is an **offline-first, multi-tenant school management system** designed for the Nigerian education market. The platform serves administrators, teachers, parents, and students with comprehensive tools for academic management, communication, and administrative operations.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Offline-First** | Critical functionality available without internet; seamless sync when connected |
| **Multi-Tenant** | Single codebase serving multiple schools with strict data isolation |
| **Role-Based Access** | Granular permissions based on user roles within each tenant |
| **Scalable** | Handle 500-1000 schools with up to 20,000 concurrent users |
| **Secure** | NDPR, FERPA, GDPR compliance; encryption at rest and in transit |

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SCHOOLNIFY PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Web Client    │  │  Mobile Client  │  │   Admin Portal  │              │
│  │   (Next.js)     │  │ (React Native)  │  │   (Next.js)     │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                │                                             │
│                    ┌───────────▼───────────┐                                │
│                    │    API Gateway /      │                                │
│                    │    Load Balancer      │                                │
│                    └───────────┬───────────┘                                │
│                                │                                             │
│           ┌────────────────────┼────────────────────┐                       │
│           │                    │                    │                        │
│  ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐              │
│  │  FastAPI        │  │  FastAPI        │  │  FastAPI        │              │
│  │  Instance 1     │  │  Instance 2     │  │  Instance N     │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           └────────────────────┼────────────────────┘                        │
│                                │                                             │
│  ┌─────────────────────────────┼─────────────────────────────┐              │
│  │                             │                              │              │
│  │  ┌──────────────┐  ┌────────▼────────┐  ┌──────────────┐  │              │
│  │  │    Redis     │  │   PostgreSQL    │  │     S3       │  │              │
│  │  │   (Cache)    │  │   (Primary DB)  │  │   (Files)    │  │              │
│  │  └──────────────┘  └─────────────────┘  └──────────────┘  │              │
│  │                         DATA LAYER                         │              │
│  └────────────────────────────────────────────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Backend (schoolnify-api)

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | FastAPI (Python 3.11+) | Async support, auto-docs, type hints, high performance |
| **ORM** | SQLAlchemy 2.0 | Async support, mature ecosystem, migration tools |
| **Database** | PostgreSQL 15+ | Multi-tenancy support, JSONB, full-text search, robust |
| **Migrations** | Alembic | Native SQLAlchemy integration |
| **Caching** | Redis | Session storage, rate limiting, real-time features |
| **Task Queue** | Celery + Redis | Background jobs, scheduled tasks, email queues |
| **Auth** | JWT + OAuth2 | Stateless auth, social login support |
| **File Storage** | S3-compatible (AWS/MinIO) | Scalable file storage for assignments, documents |
| **Email** | SMTP / SendGrid | Transactional emails, notifications |
| **SMS** | Termii / Africa's Talking | Nigerian market SMS delivery |

### Frontend (schoolnify-web)

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Framework** | Next.js 14+ (App Router) | SSR, RSC, file-based routing, API routes |
| **Language** | TypeScript | Type safety, better DX, catch errors early |
| **State Management** | Zustand + TanStack Query | Lightweight global state + server state management |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first, accessible components |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation |
| **Offline Storage** | IndexedDB (Dexie.js) | Client-side offline data persistence |
| **Sync Engine** | Custom + TanStack Query | Optimistic updates, background sync |
| **Charts** | Recharts | Data visualization for dashboards |
| **Tables** | TanStack Table | Feature-rich data tables |

### Infrastructure

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Containerization** | Docker | Consistent dev/prod environments |
| **Orchestration** | Docker Compose / Kubernetes | Multi-container management |
| **CI/CD** | GitHub Actions | Automated testing and deployment |
| **Hosting (API)** | Railway / Render / AWS | Python-friendly, scalable |
| **Hosting (Web)** | Vercel | Optimized for Next.js |
| **CDN** | Cloudflare | Edge caching, DDoS protection |
| **Monitoring** | Sentry + Prometheus | Error tracking, metrics |
| **Logging** | Structured logging (JSON) | Centralized log analysis |

---

## High-Level Architecture

### Layered Architecture (Backend)

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  API Routes (FastAPI Routers)                           │ │
│  │  - /api/v1/auth/*                                       │ │
│  │  - /api/v1/schools/*                                    │ │
│  │  - /api/v1/users/*                                      │ │
│  │  - /api/v1/classes/*                                    │ │
│  │  - /api/v1/assignments/*                                │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                       SERVICE LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Business Logic Services                                │ │
│  │  - AuthService                                          │ │
│  │  - TenantService                                        │ │
│  │  - UserService                                          │ │
│  │  - AcademicService                                      │ │
│  │  - NotificationService                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                      REPOSITORY LAYER                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Data Access Repositories                               │ │
│  │  - UserRepository                                       │ │
│  │  - SchoolRepository                                     │ │
│  │  - ClassRepository                                      │ │
│  │  - AssignmentRepository                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                         DATA LAYER                           │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SQLAlchemy Models + PostgreSQL                         │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (Next.js)

```
┌─────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP ROUTER                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  app/                                                        │
│  ├── (auth)/           # Auth group (login, register)       │
│  ├── (dashboard)/      # Protected dashboard routes         │
│  │   ├── admin/        # School admin pages                 │
│  │   ├── teacher/      # Teacher pages                      │
│  │   ├── parent/       # Parent pages                       │
│  │   ├── student/      # Student pages                      │
│  │   └── superadmin/   # Super admin pages                  │
│  ├── api/              # API routes (BFF pattern)           │
│  └── layout.tsx        # Root layout                        │
│                                                              │
│  components/                                                 │
│  ├── ui/               # shadcn/ui base components          │
│  ├── forms/            # Form components                    │
│  ├── tables/           # Table components                   │
│  └── dashboard/        # Dashboard-specific components      │
│                                                              │
│  lib/                                                        │
│  ├── api/              # API client (axios/fetch wrapper)   │
│  ├── hooks/            # Custom React hooks                 │
│  ├── stores/           # Zustand stores                     │
│  ├── utils/            # Utility functions                  │
│  └── offline/          # Offline sync logic                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. API Gateway / Load Balancer

- **Purpose:** Route requests, SSL termination, rate limiting
- **Implementation:** Nginx / Traefik / Cloud Load Balancer
- **Responsibilities:**
  - Request routing to backend instances
  - SSL/TLS termination
  - Rate limiting (per tenant, per user)
  - Request logging

### 2. FastAPI Application

- **Purpose:** Core business logic and API endpoints
- **Key Features:**
  - Async request handling
  - Automatic OpenAPI documentation
  - Dependency injection for services
  - Middleware for auth, logging, tenant context

### 3. PostgreSQL Database

- **Purpose:** Primary data persistence
- **Design Decisions:**
  - Shared tables with `tenant_id` column (multi-tenancy)
  - Row-Level Security (RLS) for tenant isolation
  - JSONB for flexible metadata storage
  - Full-text search for global search features

### 4. Redis

- **Purpose:** Caching and real-time features
- **Use Cases:**
  - Session storage
  - Rate limiting counters
  - Cache frequently accessed data
  - Pub/Sub for real-time notifications
  - Celery message broker

### 5. Background Workers (Celery)

- **Purpose:** Async task processing
- **Tasks:**
  - Email sending
  - SMS notifications
  - Report generation
  - Data exports
  - Scheduled reminders

### 6. File Storage (S3)

- **Purpose:** Store user-uploaded files
- **Content:**
  - Assignment submissions
  - School logos
  - Documents
  - Profile pictures

---

## Data Flow

### Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│ Next.js  │────▶│ FastAPI  │────▶│ Postgres │
│          │     │  (Web)   │     │  (API)   │     │   (DB)   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     │  1. Login      │                │                │
     │  credentials   │                │                │
     │───────────────▶│                │                │
     │                │  2. POST       │                │
     │                │  /api/auth/    │                │
     │                │  login         │                │
     │                │───────────────▶│                │
     │                │                │  3. Verify     │
     │                │                │  credentials   │
     │                │                │───────────────▶│
     │                │                │                │
     │                │                │  4. User data  │
     │                │                │◀───────────────│
     │                │                │                │
     │                │  5. JWT token  │                │
     │                │  + user info   │                │
     │                │◀───────────────│                │
     │                │                │                │
     │  6. Set cookie │                │                │
     │  + redirect    │                │                │
     │◀───────────────│                │                │
```

### Offline Sync Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐    ┌────────────────┐                   │
│  │  React App     │───▶│  Sync Manager  │                   │
│  │  (UI Layer)    │    │                │                   │
│  └────────────────┘    └───────┬────────┘                   │
│                                │                             │
│         ┌──────────────────────┼──────────────────────┐     │
│         │                      │                      │     │
│         ▼                      ▼                      ▼     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  IndexedDB   │    │  Pending     │    │  API Client  │  │
│  │  (Local DB)  │    │  Queue       │    │  (Network)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ When online
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      SERVER (FastAPI)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  Sync        │───▶│  Conflict    │───▶│  PostgreSQL  │  │
│  │  Endpoint    │    │  Resolver    │    │  Database    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE                                  │
│                         (CDN + DDoS Protection)                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         │                                               │
         ▼                                               ▼
┌─────────────────────┐                       ┌─────────────────────┐
│      VERCEL         │                       │  RAILWAY / RENDER   │
│  ┌───────────────┐  │                       │  ┌───────────────┐  │
│  │   Next.js     │  │                       │  │   FastAPI     │  │
│  │   Frontend    │  │  ───API calls───▶     │  │   Backend     │  │
│  └───────────────┘  │                       │  └───────────────┘  │
│                     │                       │         │           │
│  - SSR/SSG          │                       │         │           │
│  - Edge Functions   │                       │         ▼           │
│  - Image Optim.     │                       │  ┌───────────────┐  │
└─────────────────────┘                       │  │  PostgreSQL   │  │
                                              │  │  (Managed)    │  │
                                              │  └───────────────┘  │
                                              │         │           │
                                              │         ▼           │
                                              │  ┌───────────────┐  │
                                              │  │    Redis      │  │
                                              │  │  (Managed)    │  │
                                              │  └───────────────┘  │
                                              └─────────────────────┘
```

---

## Key Design Decisions

### 1. Why FastAPI over Node.js?

| Factor | FastAPI | Node.js |
|--------|---------|---------|
| **Type Safety** | Native Python type hints | Requires TypeScript setup |
| **Async** | First-class async/await | Callback-heavy, but improving |
| **Documentation** | Auto-generated OpenAPI | Manual or third-party |
| **Data Validation** | Pydantic built-in | Requires libraries (Zod, Joi) |
| **ML/AI Ready** | Python ecosystem | Limited |
| **Performance** | High (async) | High (event loop) |

**Decision:** FastAPI provides better developer experience with auto-docs, Pydantic validation, and Python's data science ecosystem for future analytics features.

### 2. Why PostgreSQL over MongoDB?

| Factor | PostgreSQL | MongoDB |
|--------|------------|---------|
| **Multi-tenancy** | Row-Level Security | Application-level isolation |
| **ACID Compliance** | Full | Limited |
| **Schema Flexibility** | JSONB columns | Native |
| **Joins** | Native, optimized | $lookup (less efficient) |
| **Full-text Search** | Built-in | Built-in |
| **Maturity** | 35+ years | ~15 years |

**Decision:** PostgreSQL's RLS provides database-level tenant isolation, reducing security risks. JSONB provides schema flexibility when needed.

### 3. Why Shared Tables with Tenant ID?

| Approach | Pros | Cons |
|----------|------|------|
| **Separate DBs** | Complete isolation | Complex maintenance, costly |
| **Separate Schemas** | Good isolation | Migration complexity |
| **Shared Tables + RLS** | Simple, scalable, cost-effective | Requires careful query design |

**Decision:** Shared tables with `tenant_id` + PostgreSQL RLS provides the best balance of isolation, simplicity, and scalability for 500-1000 tenants.

### 4. Offline-First Strategy

- **IndexedDB** for client-side storage (via Dexie.js)
- **Optimistic Updates** for immediate UI feedback
- **Background Sync** when connection restored
- **Conflict Resolution:** Last-write-wins with timestamp comparison (configurable per entity)

---

## Related Documents

- [02-DATABASE-DESIGN.md](./02-DATABASE-DESIGN.md) - Database schema and relationships
- [03-API-SPECIFICATION.md](./03-API-SPECIFICATION.md) - API endpoints and contracts
- [04-AUTHENTICATION.md](./04-AUTHENTICATION.md) - Auth and authorization details
- [05-MULTI-TENANCY.md](./05-MULTI-TENANCY.md) - Multi-tenant architecture
- [06-FRONTEND-ARCHITECTURE.md](./06-FRONTEND-ARCHITECTURE.md) - Next.js frontend details
- [07-DEVELOPMENT-GUIDE.md](./07-DEVELOPMENT-GUIDE.md) - Setup and conventions
- [08-PROJECT-ROADMAP.md](./08-PROJECT-ROADMAP.md) - Implementation phases

---

*Document maintained by: Schoolnify Development Team*

