# Architecture

## Purpose

This document explains the template architecture in two layers:

1. **Current state**: what is implemented in the repository today.
2. **Target direction**: how new work should extend the template without drifting from its structure.

The goal is to keep the codebase coherent as a feature-first React application shell.

## System overview

This project is a **React 19 + TypeScript + Vite** single-page application built around:

- application bootstrap in `src/main.tsx`
- provider composition in `src/App.tsx`
- routing in `src/router/index.tsx`
- authentication in `src/contexts/AuthContext.tsx`
- session persistence in `src/storage/session.ts`
- API access in `src/services/httpClient.ts` and `src/services/AuthService.ts`
- authenticated layout in `src/components/layout/`
- feature route entries under `src/features/*/routes/`

The template now follows the documented shell shape and provides minimal route entries for each main domain.

## Application runtime

### Bootstrap

`src/main.tsx` mounts `App` inside `StrictMode`.

### Root provider tree

The root tree in `src/App.tsx` is:

```tsx
<ErrorBoundary>
  <QueryClientProvider>
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>

  <Toaster />
</ErrorBoundary>
```

Responsibilities:

- `ErrorBoundary`: catches unhandled React tree errors.
- `QueryClientProvider`: exposes TanStack Query for server state.
- `AuthProvider`: owns session state and Axios interceptors.
- `BrowserRouter`: enables client-side routing.
- `Router`: separates public and private route groups.
- `Toaster`: renders global feedback through `sonner`.

## Routing and layout

Routing lives in `src/router/index.tsx`.

### Current state

The app uses two route groups:

- **private routes** inside `AuthGuard` and `SidebarComponent`
- **public routes** for `sign-in` and `sign-up`

Current private route entries:

- `dashboard`
- `categories`
- `companies`
- `transactions`
- `profile`
- `bank accounts`

Each private route is backed by a real file under `src/features/*/routes/`, even when the feature is still intentionally minimal.

### Layout structure

The authenticated shell is split into small layout-focused components:

- `src/components/layout/AppShell.tsx`
- `src/components/layout/AppShellHeader.tsx`
- `src/components/layout/AppSidebarNav.tsx`
- `src/components/layout/AppSidebarBrand.tsx`
- `src/components/layout/AppSidebarSection.tsx`
- `src/components/layout/AppSidebarUser.tsx`
- `src/components/layout/navigation.ts`

This keeps route metadata, shell UI, and profile rendering separated.

### Target direction

New routeable work should be added under `src/features/<domain>/routes/` and connected through shared route metadata instead of scattering labels and paths across multiple files.

## Authentication and session lifecycle

Authentication is centralized in `src/contexts/AuthContext.tsx`.

### Current flow

1. `signIn()` calls `AuthService.signIn()`.
2. Session tokens are stored through helpers in `src/storage/session.ts`.
3. A request interceptor injects the bearer token into outgoing requests.
4. A response interceptor attempts refresh on `401`.
5. `signOut()` calls the backend endpoint and always clears local session state.

Session helpers live in `src/storage/session.ts`:

- `getAccessToken`
- `getRefreshToken`
- `setSessionTokens`
- `clearSessionTokens`
- `hasSessionTokens`

### Service layer role

`src/services/AuthService.ts` owns the authentication API surface:

- `signUp`
- `signIn`
- `refreshToken`
- `getProfile`
- `signOut`

### Target direction

Keep auth orchestration in Context, but keep domain data and feature interactions outside Context unless they are truly global.

## State and data flow

### Current state

- **server state**: TanStack Query via `src/lib/queryClient.ts`
- **global session state**: `AuthContext`
- **feature data access**: domain hooks such as `src/features/profile/hooks/useProfile.ts`
- **form state**: React Hook Form + Zod in the auth feature

The template now follows the intended pattern of services for raw I/O and hooks for query usage.

### Target direction

For each new feature:

- keep API calls in services
- wrap server interactions with feature hooks
- keep components render-focused
- reserve Context for cross-cutting concerns only

## Module organization

### Current structure

The current structure is mostly feature-first:

- `src/components/layout/`: authenticated shell pieces
- `src/components/ui/`: shared UI primitives
- `src/contexts/`: global providers
- `src/features/auth/`: auth routes, forms, hooks, schemas
- `src/features/dashboard/`: dashboard route entry
- `src/features/categories/`: category route entry
- `src/features/companies/`: company route entry
- `src/features/transactions/`: transaction route entry
- `src/features/profile/`: profile hook and route entry
- `src/features/bank-accounts/`: bank account route entry
- `src/router/`: route composition and path constants
- `src/services/`: HTTP and API access
- `src/storage/`: storage keys and session helpers

### AGENTS alignment

The app-level code now follows the repo rules more closely:

- large shell code was split into smaller files
- nested components were removed from app code
- auth logic moved into hooks
- forms use React Hook Form + Zod
- routeable UI lives inside features

### Vendor boundary

`src/components/ui/` still contains generated or vendor-style primitives that are not fully normalized to the same file-size rule. For now, they are treated as a shared design-system boundary rather than feature code.

## UI composition

### Current state

- The authenticated shell is reusable and route-driven.
- Navigation metadata is centralized in `src/components/layout/navigation.ts`.
- Auth pages are split into routes, components, hooks, and schemas.
- Domain pages use minimal placeholders so the route map stays coherent without pretending the business features are complete.

### Target direction

As each domain grows, add:

- domain-specific components
- domain hooks using React Query
- schemas when forms appear
- route entries that stay thin and compositional

## Current limitations

The architecture is now aligned with the template direction, but a few intentional gaps remain:

- most private feature screens are placeholders, not full business modules yet
- `vitest.config.ts` still points to a missing `src/test/setup.ts`
- `tests/example.spec.ts` is still the default Playwright sample
- `src/pages/` is now legacy territory and can be removed when no longer needed

## Architectural summary

The template now provides:

- a stable provider stack
- a coherent authenticated shell
- feature-first route entries
- auth forms with separated UI, hooks, and schemas
- explicit session helpers
- centralized navigation metadata

The main rule going forward is simple: add new behavior inside features, keep route files thin, and update this document whenever the structure changes.
