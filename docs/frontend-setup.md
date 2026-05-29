# Schoolnify Web

The frontend for Schoolnify — a multi-tenant school management platform. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- Node.js 18+
- The [Schoolnify API](https://github.com/your-org/schoolnify-api) running locally on port 8080

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
BACKEND_URL=http://localhost:8080
```

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Multi-Tenant Subdomains

In development, school dashboards are accessed via subdomains:

```
http://springfield-academy.localhost:3000
```

The `proxy.ts` middleware detects subdomain slugs and rewrites requests to `/school-admin/*` routes. API requests (`/api/*`) are proxied to the backend via Next.js rewrites in `next.config.ts`.

## Project Structure

```
src/
├── api/                # API client and endpoint functions
│   ├── client.ts       # Base fetch wrapper (credentials: include)
│   └── endpoints/      # Endpoint functions grouped by domain
├── app/                # Next.js App Router pages
│   ├── (auth)/         # Auth pages (signin, signup, verify-email)
│   ├── (dashboard)/    # School admin dashboard
│   ├── (marketing)/    # Public marketing pages
│   └── layout.tsx      # Root layout with providers
├── components/         # Reusable UI components
│   ├── auth/           # AuthGuard, auth-related components
│   └── dashboard/      # Sidebar, header, tour, etc.
├── hooks/              # React Query mutation/query hooks
│   ├── use-auth.ts     # Auth mutation hooks (login, signup, verify)
│   └── use-session.ts  # Session query hook + logout
├── lib/                # Utilities, config, query client
├── providers/          # React Query provider
├── proxy.ts            # Subdomain routing (Next.js 16 proxy)
└── types/              # TypeScript type definitions
```

## Auth Flow

Authentication uses HttpOnly cookies managed by the backend. The frontend never stores tokens manually.

- **Signup:** `POST /auth/admin-signup` → verify email (OTP) → create organization → redirect to subdomain
- **Login (subdomain):** `POST /auth/login` → cookies set on same origin → dashboard
- **Login (main site):** `POST /auth/login` → redirect to subdomain with token → `POST /auth/establish-session` → cookies set on subdomain
- **Session check:** `GET /auth/me` via `useSession()` hook (React Query, cached 5min)
- **Route protection:** `AuthGuard` component wraps dashboard layouts (`mode="protected"`) and auth pages (`mode="guest"`)
- **Logout:** `POST /auth/logout` → clear session cache → redirect to `/signin`

## API Proxy

In development, all browser API requests use relative URLs (`/api/v1/...`) and are proxied to the backend through Next.js rewrites. This avoids cross-site cookie issues with subdomains.

```
Browser → /api/v1/auth/me → Next.js rewrite → http://localhost:8080/api/v1/auth/me
```

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State:** TanStack React Query v5
- **Auth:** HttpOnly cookies, Bearer token fallback
- **Routing:** Subdomain proxy (`proxy.ts`), API rewrites (`next.config.ts`)
