# Schoolnify - Frontend Architecture

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Framework:** Next.js 14+ (App Router) with TypeScript

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Routing & Layouts](#routing--layouts)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Offline-First Strategy](#offline-first-strategy)
7. [Authentication Flow](#authentication-flow)
8. [UI Components](#ui-components)
9. [Performance Optimization](#performance-optimization)
10. [Testing Strategy](#testing-strategy)

---

## Overview

The Schoolnify web frontend is built with Next.js 14+ using the App Router for modern React Server Components (RSC) support. The architecture prioritizes:

- **Offline-First:** Core functionality works without internet
- **Role-Based UI:** Different dashboards per user role
- **Performance:** Fast initial load, optimistic updates
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsive:** Mobile-first design approach

### Technology Choices

| Category | Technology | Justification |
|----------|------------|---------------|
| **Framework** | Next.js 14+ (App Router) | RSC, streaming, built-in optimization |
| **Language** | TypeScript 5.x | Type safety, better DX |
| **Styling** | Tailwind CSS 3.x | Utility-first, consistent design |
| **Components** | shadcn/ui | Accessible, customizable, not a dependency |
| **State (Client)** | Zustand | Lightweight, simple API |
| **State (Server)** | TanStack Query v5 | Caching, background refetch, mutations |
| **Forms** | React Hook Form + Zod | Performant, type-safe validation |
| **Tables** | TanStack Table | Headless, feature-rich |
| **Charts** | Recharts | Simple, responsive |
| **Icons** | Lucide React | Consistent, tree-shakable |
| **Offline Storage** | Dexie.js (IndexedDB) | Promise-based, typed |
| **Date Handling** | date-fns | Lightweight, tree-shakable |

---

## Project Structure

```
schoolnify-web/
├── public/
│   ├── fonts/                    # Custom fonts
│   ├── images/                   # Static images
│   └── manifest.json             # PWA manifest
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth group (public)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx        # Auth layout (centered, minimal)
│   │   │
│   │   ├── (dashboard)/          # Dashboard group (protected)
│   │   │   ├── layout.tsx        # Dashboard layout (sidebar, header)
│   │   │   ├── page.tsx          # Role-based redirect
│   │   │   │
│   │   │   ├── admin/            # School Admin pages
│   │   │   │   ├── page.tsx      # Admin dashboard
│   │   │   │   ├── users/
│   │   │   │   ├── classes/
│   │   │   │   ├── settings/
│   │   │   │   └── reports/
│   │   │   │
│   │   │   ├── teacher/          # Teacher pages
│   │   │   │   ├── page.tsx      # Teacher dashboard
│   │   │   │   ├── classes/
│   │   │   │   ├── assignments/
│   │   │   │   ├── grades/
│   │   │   │   └── attendance/
│   │   │   │
│   │   │   ├── parent/           # Parent pages
│   │   │   │   ├── page.tsx
│   │   │   │   ├── children/
│   │   │   │   └── fees/
│   │   │   │
│   │   │   ├── student/          # Student pages
│   │   │   │   ├── page.tsx
│   │   │   │   ├── assignments/
│   │   │   │   ├── grades/
│   │   │   │   └── schedule/
│   │   │   │
│   │   │   └── superadmin/       # Super Admin pages
│   │   │       ├── page.tsx
│   │   │       ├── tenants/
│   │   │       └── analytics/
│   │   │
│   │   ├── api/                  # API routes (BFF pattern)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   └── proxy/            # Proxy to FastAPI
│   │   │
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── not-found.tsx         # 404 page
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── forms/                # Form components
│   │   │   ├── login-form.tsx
│   │   │   ├── assignment-form.tsx
│   │   │   └── ...
│   │   │
│   │   ├── tables/               # Table components
│   │   │   ├── data-table.tsx    # Generic data table
│   │   │   ├── users-table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── charts/               # Chart components
│   │   │   ├── attendance-chart.tsx
│   │   │   ├── grade-distribution.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layouts/              # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   └── common/               # Shared components
│   │       ├── loading.tsx
│   │       ├── error-boundary.tsx
│   │       ├── empty-state.tsx
│   │       └── offline-indicator.tsx
│   │
│   ├── lib/
│   │   ├── api/                  # API client
│   │   │   ├── client.ts         # Axios/fetch wrapper
│   │   │   ├── auth.ts           # Auth API calls
│   │   │   ├── users.ts          # User API calls
│   │   │   └── ...
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-tenant.ts
│   │   │   ├── use-offline.ts
│   │   │   └── use-permissions.ts
│   │   │
│   │   ├── stores/               # Zustand stores
│   │   │   ├── auth-store.ts
│   │   │   ├── ui-store.ts
│   │   │   └── sync-store.ts
│   │   │
│   │   ├── offline/              # Offline functionality
│   │   │   ├── db.ts             # Dexie database
│   │   │   ├── sync.ts           # Sync logic
│   │   │   └── queue.ts          # Pending operations queue
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── cn.ts             # Class name merger
│   │   │   ├── format.ts         # Formatters (date, currency)
│   │   │   └── validators.ts     # Validation schemas
│   │   │
│   │   └── config/               # Configuration
│   │       ├── navigation.ts     # Navigation config
│   │       └── constants.ts      # App constants
│   │
│   ├── types/                    # TypeScript types
│   │   ├── api.ts                # API response types
│   │   ├── models.ts             # Domain models
│   │   └── auth.ts               # Auth types
│   │
│   └── styles/                   # Additional styles
│       └── fonts.ts              # Font configuration
│
├── .env.local                    # Local environment variables
├── .env.example                  # Example environment file
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## Routing & Layouts

### Route Groups

```typescript
// Route groups organize routes without affecting URLs
// Ref: https://nextjs.org/docs/app/building-your-application/routing/route-groups

// (auth) group - Public authentication pages
// URL: /login, /register, /forgot-password
// Layout: Centered, minimal, no navigation

// (dashboard) group - Protected dashboard pages
// URL: /admin/*, /teacher/*, /parent/*, /student/*
// Layout: Sidebar navigation, header, footer
```

### Root Layout

```typescript
// src/app/layout.tsx

import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Schoolnify - School Management System',
  description: 'Offline-first school management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

### Dashboard Layout

```typescript
// src/app/(dashboard)/layout.tsx

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Sidebar } from '@/components/layouts/sidebar'
import { Header } from '@/components/layouts/header'
import { OfflineIndicator } from '@/components/common/offline-indicator'
import { authOptions } from '@/lib/auth/options'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar user={session.user} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={session.user} />
        
        {/* Offline indicator */}
        <OfflineIndicator />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Role-Based Dashboard Redirect

```typescript
// src/app/(dashboard)/page.tsx

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

const ROLE_DASHBOARDS: Record<string, string> = {
  super_admin: '/superadmin',
  school_admin: '/admin',
  teacher: '/teacher',
  parent: '/parent',
  student: '/student',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.roles?.length) {
    redirect('/login')
  }

  // Redirect to role-specific dashboard
  const primaryRole = session.user.roles[0]
  const dashboard = ROLE_DASHBOARDS[primaryRole] || '/student'
  
  redirect(dashboard)
}
```

---

## State Management

### Client State (Zustand)

```typescript
// src/lib/stores/auth-store.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

// Ref: https://docs.pmnd.rs/zustand/getting-started/introduction

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
```

```typescript
// src/lib/stores/ui-store.ts

import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setTheme: (theme) => set({ theme }),
}))
```

### Server State (TanStack Query)

```typescript
// src/lib/hooks/use-users.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api/users'
import type { User, CreateUserData } from '@/types/models'

// Ref: https://tanstack.com/query/latest/docs/react/overview

// Query keys factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: object) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// List users hook
export function useUsers(filters?: { role?: string; status?: string }) {
  return useQuery({
    queryKey: userKeys.list(filters ?? {}),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Single user hook
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  })
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Update user mutation with optimistic update
export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      usersApi.updateUser(id, data),
    
    // Optimistic update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })
      
      const previousUser = queryClient.getQueryData(userKeys.detail(id))
      
      queryClient.setQueryData(userKeys.detail(id), (old: User) => ({
        ...old,
        ...data,
      }))
      
      return { previousUser }
    },
    
    onError: (err, { id }, context) => {
      queryClient.setQueryData(
        userKeys.detail(id), 
        context?.previousUser
      )
    },
    
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}
```

---

## API Integration

### API Client

```typescript
// src/lib/api/client.ts

import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/lib/stores/auth-store'

// Ref: https://axios-http.com/docs/intro

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token is typically sent via HTTP-only cookie
    // But we can add tenant ID header here
    const tenantId = getTenantId()
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await refreshToken()
        return apiClient(originalRequest!)
      } catch (refreshError) {
        // Logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    
    // Handle other errors
    return Promise.reject(error)
  }
)

// Typed response wrapper
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export async function get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params })
  return response.data
}

export async function post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data)
  return response.data
}

export async function put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data)
  return response.data
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url)
  return response.data
}
```

### API Service Example

```typescript
// src/lib/api/assignments.ts

import { get, post, put, del, ApiResponse } from './client'
import type { Assignment, CreateAssignmentData, Submission } from '@/types/models'

export const assignmentsApi = {
  // List assignments
  getAssignments: async (filters?: {
    class_subject_id?: string
    term_id?: string
    status?: string
  }): Promise<ApiResponse<Assignment[]>> => {
    return get('/assignments', filters)
  },

  // Get single assignment
  getAssignment: async (id: string): Promise<ApiResponse<Assignment>> => {
    return get(`/assignments/${id}`)
  },

  // Create assignment
  createAssignment: async (data: CreateAssignmentData): Promise<ApiResponse<Assignment>> => {
    return post('/assignments', data)
  },

  // Update assignment
  updateAssignment: async (
    id: string, 
    data: Partial<CreateAssignmentData>
  ): Promise<ApiResponse<Assignment>> => {
    return put(`/assignments/${id}`, data)
  },

  // Delete assignment
  deleteAssignment: async (id: string): Promise<ApiResponse<void>> => {
    return del(`/assignments/${id}`)
  },

  // Get submissions for an assignment
  getSubmissions: async (assignmentId: string): Promise<ApiResponse<Submission[]>> => {
    return get(`/assignments/${assignmentId}/submissions`)
  },

  // Submit assignment (for students)
  submitAssignment: async (
    assignmentId: string, 
    formData: FormData
  ): Promise<ApiResponse<Submission>> => {
    return post(`/assignments/${assignmentId}/submissions`, formData)
  },

  // Grade submission (for teachers)
  gradeSubmission: async (
    submissionId: string,
    data: { score: number; feedback: string }
  ): Promise<ApiResponse<Submission>> => {
    return put(`/submissions/${submissionId}/grade`, data)
  },
}
```

---

## Offline-First Strategy

### IndexedDB Setup with Dexie

```typescript
// src/lib/offline/db.ts

import Dexie, { Table } from 'dexie'
import type { User, Assignment, Submission } from '@/types/models'

// Ref: https://dexie.org/docs/Tutorial/Getting-started

// Sync status for offline records
export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error'

// Wrapper for offline-capable entities
interface OfflineRecord<T> {
  data: T
  syncStatus: SyncStatus
  localUpdatedAt: number
  serverUpdatedAt?: string
}

class SchoolnifyDB extends Dexie {
  // Tables
  users!: Table<OfflineRecord<User>>
  assignments!: Table<OfflineRecord<Assignment>>
  submissions!: Table<OfflineRecord<Submission>>
  pendingOperations!: Table<PendingOperation>

  constructor() {
    super('schoolnify-offline')
    
    this.version(1).stores({
      // Index on id and sync status for efficient queries
      users: 'data.id, syncStatus',
      assignments: 'data.id, data.class_subject_id, data.due_date, syncStatus',
      submissions: 'data.id, data.assignment_id, data.student_id, syncStatus',
      
      // Queue for pending operations
      pendingOperations: '++id, entityType, entityId, operation, createdAt',
    })
  }
}

export const db = new SchoolnifyDB()

// Pending operation for sync queue
export interface PendingOperation {
  id?: number
  entityType: 'assignment' | 'submission' | 'attendance' | 'grade'
  entityId: string
  operation: 'create' | 'update' | 'delete'
  data: object
  createdAt: number
  retryCount: number
}
```

### Sync Manager

```typescript
// src/lib/offline/sync.ts

import { db, PendingOperation } from './db'
import { apiClient } from '@/lib/api/client'
import { useSyncStore } from '@/lib/stores/sync-store'

// Ref: Background Sync API - https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API

class SyncManager {
  private isSyncing = false
  private syncInterval: NodeJS.Timeout | null = null

  // Start periodic sync
  startPeriodicSync(intervalMs: number = 30000) {
    if (this.syncInterval) return

    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncAll()
      }
    }, intervalMs)

    // Also sync on coming online
    window.addEventListener('online', () => this.syncAll())
  }

  // Stop periodic sync
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Sync all pending operations
  async syncAll(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return

    this.isSyncing = true
    useSyncStore.getState().setSyncing(true)

    try {
      const pendingOps = await db.pendingOperations
        .orderBy('createdAt')
        .toArray()

      for (const op of pendingOps) {
        await this.processPendingOperation(op)
      }

      // Pull latest data from server
      await this.pullLatestData()

      useSyncStore.getState().setLastSyncedAt(new Date())
    } catch (error) {
      console.error('Sync failed:', error)
      useSyncStore.getState().setSyncError(error as Error)
    } finally {
      this.isSyncing = false
      useSyncStore.getState().setSyncing(false)
    }
  }

  // Process a single pending operation
  private async processPendingOperation(op: PendingOperation): Promise<void> {
    const endpoint = this.getEndpoint(op.entityType, op.entityId, op.operation)

    try {
      switch (op.operation) {
        case 'create':
          await apiClient.post(endpoint, op.data)
          break
        case 'update':
          await apiClient.put(endpoint, op.data)
          break
        case 'delete':
          await apiClient.delete(endpoint)
          break
      }

      // Remove from queue on success
      await db.pendingOperations.delete(op.id!)
      
      // Update local record sync status
      await this.updateLocalSyncStatus(op.entityType, op.entityId, 'synced')
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Conflict - mark for manual resolution
        await this.updateLocalSyncStatus(op.entityType, op.entityId, 'conflict')
      } else {
        // Other error - increment retry count
        await db.pendingOperations.update(op.id!, {
          retryCount: op.retryCount + 1,
        })
        
        // Remove after 5 retries
        if (op.retryCount >= 5) {
          await db.pendingOperations.delete(op.id!)
          await this.updateLocalSyncStatus(op.entityType, op.entityId, 'error')
        }
      }
    }
  }

  // Pull latest data from server
  private async pullLatestData(): Promise<void> {
    // Get last sync timestamp
    const lastSync = useSyncStore.getState().lastSyncedAt

    // Fetch updated records since last sync
    const response = await apiClient.get('/sync/changes', {
      params: { since: lastSync?.toISOString() },
    })

    // Update local database
    for (const change of response.data.changes) {
      await this.applyServerChange(change)
    }
  }

  // Apply a change from the server
  private async applyServerChange(change: any): Promise<void> {
    const table = db.table(change.entityType)
    
    if (change.deleted) {
      await table.delete(change.id)
    } else {
      await table.put({
        data: change.data,
        syncStatus: 'synced',
        localUpdatedAt: Date.now(),
        serverUpdatedAt: change.updatedAt,
      })
    }
  }

  private getEndpoint(entityType: string, entityId: string, operation: string): string {
    const endpoints: Record<string, string> = {
      assignment: '/assignments',
      submission: '/submissions',
      attendance: '/attendance',
      grade: '/grades',
    }
    
    const base = endpoints[entityType]
    return operation === 'create' ? base : `${base}/${entityId}`
  }

  private async updateLocalSyncStatus(
    entityType: string, 
    entityId: string, 
    status: 'synced' | 'conflict' | 'error'
  ): Promise<void> {
    const table = db.table(entityType + 's') // assignments, submissions, etc.
    const record = await table.get(entityId)
    
    if (record) {
      await table.update(entityId, { syncStatus: status })
    }
  }
}

export const syncManager = new SyncManager()
```

### Offline-Aware Hook

```typescript
// src/lib/hooks/use-offline.ts

import { useState, useEffect } from 'react'
import { useSyncStore } from '@/lib/stores/sync-store'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  
  const { isSyncing, lastSyncedAt, pendingCount, syncError } = useSyncStore()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    isOnline,
    isSyncing,
    lastSyncedAt,
    pendingCount,
    syncError,
  }
}
```

---

## Authentication Flow

### NextAuth.js Configuration

```typescript
// src/lib/auth/options.ts

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiClient } from '@/lib/api/client'

// Ref: https://next-auth.js.org/configuration/options

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'School', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await apiClient.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
            tenant_slug: credentials.tenantSlug,
          })

          if (response.data.success) {
            return {
              id: response.data.data.user.id,
              email: response.data.data.user.email,
              name: `${response.data.data.user.first_name} ${response.data.data.user.last_name}`,
              roles: response.data.data.user.roles,
              tenant: response.data.data.user.tenant,
              accessToken: response.data.data.access_token,
              refreshToken: response.data.data.refresh_token,
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.tenant = user.tenant
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      // Token refresh
      if (trigger === 'update') {
        // Refresh access token if needed
        token = await refreshAccessToken(token)
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.roles = token.roles as string[]
      session.user.tenant = token.tenant as any
      session.accessToken = token.accessToken as string

      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
}
```

### Protected Route HOC

```typescript
// src/lib/hooks/use-auth.ts

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requiredRoles?: string[]) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated' && requiredRoles?.length) {
      const hasRequiredRole = requiredRoles.some(
        role => session?.user?.roles?.includes(role)
      )
      
      if (!hasRequiredRole) {
        router.push('/unauthorized')
      }
    }
  }, [status, session, requiredRoles, router])

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
```

---

## UI Components

### shadcn/ui Setup

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button input dialog table form card
```

### Custom Data Table

```typescript
// src/components/tables/data-table.tsx

'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// Ref: https://tanstack.com/table/latest/docs/guide/introduction

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKey && (
        <Input
          placeholder={`Search by ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

// Lazy load chart components
const AttendanceChart = dynamic(
  () => import('@/components/charts/attendance-chart'),
  { loading: () => <div>Loading chart...</div> }
)

// Lazy load editor components
const RichTextEditor = dynamic(
  () => import('@/components/forms/rich-text-editor'),
  { ssr: false }
)
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={user.avatarUrl || '/images/default-avatar.png'}
  alt={user.name}
  width={40}
  height={40}
  className="rounded-full"
  priority={false}  // Lazy load non-critical images
/>
```

### React Suspense Boundaries

```typescript
// src/app/(dashboard)/admin/users/page.tsx

import { Suspense } from 'react'
import { UsersTable } from '@/components/tables/users-table'
import { UsersTableSkeleton } from '@/components/tables/users-table-skeleton'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  )
}
```

---

## Testing Strategy

### Unit Tests (Vitest)

```typescript
// src/lib/utils/__tests__/format.test.ts

import { describe, it, expect } from 'vitest'
import { formatDate, formatCurrency } from '../format'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2026-01-05')
    expect(formatDate(date)).toBe('January 5, 2026')
  })
})

describe('formatCurrency', () => {
  it('formats NGN correctly', () => {
    expect(formatCurrency(150000)).toBe('₦150,000.00')
  })
})
```

### Component Tests (Testing Library)

```typescript
// src/components/ui/__tests__/button.test.tsx

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when loading', () => {
    render(<Button disabled>Loading...</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'teacher@school.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/teacher')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'wrong@email.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toContainText('Invalid credentials')
  })
})
```

---

## Related Documents

- [01-ARCHITECTURE-OVERVIEW.md](./01-ARCHITECTURE-OVERVIEW.md) - System architecture
- [03-API-SPECIFICATION.md](./03-API-SPECIFICATION.md) - API endpoints
- [07-DEVELOPMENT-GUIDE.md](./07-DEVELOPMENT-GUIDE.md) - Development setup

---

*Document maintained by: Schoolnify Development Team*

