# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite template with shadcn/ui components, configured for building modern web applications with authentication, routing, and API integration.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Core Architecture

### Application Structure

The app follows a layered architecture with clear separation of concerns:

1. **Entry Point Flow**: `main.tsx` → `App.tsx` → `Router` → Pages
2. **Provider Hierarchy** (App.tsx:10-21):
   - `ErrorBoundary` (outermost error handling)
   - `QueryClientProvider` (TanStack Query for server state)
   - `AuthProvider` (authentication context and token management)
   - `BrowserRouter` (React Router v7)
   - `SidebarComponent` (layout wrapper)

### Authentication System

The authentication system uses JWT tokens with automatic refresh:

- **Storage**: Tokens stored in localStorage with namespaced keys (src/storage/keys.ts)
- **Token Management** (src/contexts/AuthContext.tsx):
  - Request interceptor: Automatically attaches access tokens to all API requests (line 30-42)
  - Response interceptor: Handles 401 errors and refreshes tokens automatically (line 44-77)
  - If refresh fails or returns 401, user is signed out and localStorage is cleared
- **AuthGuard Component** (src/router/AuthGuard.tsx): Protects routes based on authentication state
  - Currently hardcoded to `signedIn = true` (line 4) - update this to use `useAuth()` hook in production
- **AuthService** (src/services/AuthService.ts): API methods for sign-in, sign-up, and token refresh

### Routing Architecture

Uses React Router v7 with lazy-loaded pages (src/router/index.tsx):
- Routes are code-split using `lazy()` for better performance
- Two route groups:
  - Private routes: Wrapped in `<AuthGuard isPrivate />`
  - Public routes: Wrapped in `<AuthGuard isPrivate={false} />`
- Add new pages by importing them with `lazy()` and adding a `<Route>` in the appropriate group

### API Configuration

- **HTTP Client** (src/services/httpClient.ts): Axios instance configured with:
  - Base URL from environment variable: `VITE_API_URL`
  - Interceptors added by AuthProvider for token management
- **Service Pattern**: Create service classes (like AuthService) with static methods for API calls
- **Query Client** (src/lib/queryClient.ts): Default TanStack Query client for data fetching

### UI Components

- **shadcn/ui Configuration** (components.json):
  - Style: `base-nova`
  - Icon library: `hugeicons`
  - Tailwind CSS with CSS variables enabled
  - Components installed in `src/components/ui/`
- **Path Aliases** (configured in vite.config.ts and tsconfig.json):
  - `@/` → `src/`
  - Import components: `@/components/ui/button`
  - Import hooks: `@/hooks/useIsMobile`
  - Import utilities: `@/lib/utils`
- **Utility Function** (src/lib/utils.ts): `cn()` function for merging Tailwind classes

### Important Patterns

1. **Adding New API Services**:
   - Create service class in `src/services/` (follow AuthService pattern)
   - Use `httpClient` for all requests (tokens are handled automatically)
   - Define DTO interfaces for type safety

2. **Adding New Protected Routes**:
   - Create page component in `src/pages/`
   - Import with `lazy()` in `src/router/index.tsx`
   - Add `<Route>` inside the `<Route element={<AuthGuard isPrivate />}>` block

3. **Environment Variables**:
   - Prefix with `VITE_` to expose to client
   - Access with `import.meta.env.VITE_VARIABLE_NAME`
   - Currently configured: `VITE_API_URL`

4. **ESLint Configuration**:
   - Uses flat config format (eslint.config.js)
   - Allows `loader` export in addition to components (line 25) for React Router loaders
   - Configured for TypeScript, React Hooks, and React Refresh

## Key Implementation Notes

- The AuthGuard component currently has `signedIn` hardcoded to `true`. For production, replace line 4 in src/router/AuthGuard.tsx with: `const { signedIn } = useAuth();`
- Token refresh happens automatically via response interceptor - no manual intervention needed
- All localStorage keys are namespaced with "template:" prefix - update this for your project
- React 19 is used, leveraging the new `use()` hook for context (see AuthContext.tsx:105)
