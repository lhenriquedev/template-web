# Template Web

Feature-first React 19 + TypeScript + Vite starter for authenticated web applications.

It ships with a provider-based app shell, protected routing, shared UI primitives, React Hook Form + Zod auth forms, TanStack Query, and a split authenticated layout ready for domain features.

For the full architecture guide, see `docs/ARCHITECTURE.md`.

## Current status

The template currently includes:

- a stable provider tree with React Query, auth context, router, and global toaster
- a feature-first route structure for dashboard, categories, companies, transactions, profile, and bank accounts
- a split authenticated shell under `src/components/layout/`
- sign-in and sign-up flows with separated routes, components, hooks, and schemas
- explicit session helpers in `src/storage/session.ts`

The domain screens are intentionally minimal placeholders so the route map stays coherent while each feature evolves.

## Stack

### Core

- React 19
- TypeScript 5
- Vite 7
- pnpm

### UI and styling

- shadcn/ui
- Tailwind CSS 4
- @base-ui/react
- Hugeicons
- Sonner
- Vaul
- Recharts

### Routing and state

- React Router 7
- TanStack Query
- TanStack Table

### Forms and validation

- React Hook Form
- Zod
- @hookform/resolvers

### HTTP

- Axios

## Requirements

- Node.js >= 18
- pnpm >= 8

## Getting started

1. Clone the repository.

```bash
git clone <repository-url>
cd template-web
```

2. Install dependencies.

```bash
pnpm install
```

3. Create a local environment file.

```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

4. Start the development server.

```bash
pnpm dev
```

## Available scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm preview
pnpm test
pnpm test:ui
pnpm test:coverage
```

## Project structure

```text
src/
├── components/
│   ├── layout/              # Authenticated shell and shared layout parts
│   ├── ui/                  # Shared UI primitives
│   ├── AppSidebar.tsx       # Compatibility export for the shell
│   ├── ErrorBoundary.tsx
│   └── LoadingScreen.tsx
├── contexts/
│   └── AuthContext.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── schemas/
├── lib/
│   └── queryClient.ts
├── router/
│   ├── AuthGuard.tsx
│   ├── index.tsx
│   └── paths.ts
├── services/
│   ├── AuthService.ts
│   └── httpClient.ts
├── storage/
│   ├── keys.ts
│   └── session.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Architecture at a glance

### Provider tree

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

### Routing model

`src/router/index.tsx` separates the app into:

- private routes behind `AuthGuard`
- public auth routes for `/sign-in` and `/sign-up`
- an authenticated shell rendered through `SidebarComponent`

### Authentication model

`src/contexts/AuthContext.tsx` is responsible for:

- tracking whether the user is signed in
- persisting access and refresh tokens through `src/storage/session.ts`
- attaching the bearer token through an Axios request interceptor
- attempting token refresh on `401` responses
- clearing local session state on sign-out or refresh failure

## Development conventions

These repo rules are enforced in app code:

- never use `any`
- keep components under 150 lines
- never declare nested components
- separate UI from logic
- use React Hook Form for forms
- use Zod for validation
- organize by feature whenever possible

## How to extend the template

When adding a new domain:

1. create `src/features/<domain>/`
2. keep route entries under `src/features/<domain>/routes/`
3. move query and mutation logic into hooks
4. keep form schemas separate as they grow
5. reuse `src/components/layout/` and `src/components/ui/` instead of rebuilding shell patterns
6. update `README.md` and `docs/ARCHITECTURE.md` in the same change set

## Testing

Test scripts are present, but the test setup still needs cleanup:

- `vitest.config.ts` references a missing `src/test/setup.ts`
- `tests/example.spec.ts` is still the default Playwright sample

If you adopt this template for active work, cleaning up test scaffolding should be an early task.

## Suggested next improvements

1. replace placeholder feature screens with real domain flows
2. add production-ready profile views and session actions
3. clean up the Vitest and Playwright setup
4. remove legacy empty structure such as `src/pages/` once no longer needed

## Environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

Guidelines:

- client-exposed variables must start with `VITE_`
- access them with `import.meta.env`
- never commit secrets to version control

## License

MIT
