# Perpix App — Agent Handbook

## 1. Runtime and verification

`perpix-app` is a React 19, TypeScript, and Vite application. Its main tools
are Tailwind CSS, TanStack Query, Jotai, React Hook Form, Zod, React Router,
i18next, Workbox, Sentry, and Playwright.

Run commands from `perpix-app/`:

```bash
pnpm scripts:generate-api   # Requires the local backend OpenAPI endpoint
pnpm build                  # tsc -b and Vite production build
pnpm lint
pnpm exec playwright test
```

`tsconfig.app.json` is strict and enables unused-local/parameter checks. Run
the relevant test while iterating, then run build, lint, and relevant Playwright
coverage before handoff. Read the workspace handbook before cross-application or
structural work.

## 2. Source ownership and dependency direction

All new feature work belongs in `src/features/<feature-name>/`:

```text
src/features/<feature-name>/
├── index.ts        # public API only
├── model/          # framework-independent types, Zod schemas, formatters
├── services/       # API, streaming, IndexedDB, data transformation
├── hooks/          # TanStack Query, Jotai, view-model orchestration
├── components/     # UI containers and presentational components
└── _tests/         # feature behavior tests
```

- Legacy areas such as `src/feature/`, `src/pages/`, and `src/services/` may be
  modified only when required by the approved scope. Do not silently migrate
  them during unrelated feature work.
- Cross-feature imports go through the target feature's `index.ts`; never deep
  import another feature's internals.
- Dependencies flow inward: `components → hooks → services → model → core/shared`.
  Components never fetch or call APIs directly; services never import React.
- Use the `@/` alias for `src/` imports where it improves clarity.

## 3. Types, APIs, and state

- TypeScript is non-negotiably strict: do not use `any`, broad suppressions, or
  unsafe casts. Validate untrusted input with Zod and narrow unknown data using
  type guards or discriminated unions.
- `src/services/api/api.ts` is generated from the backend OpenAPI schema. Never
  hand-edit it. After an approved backend contract change, run
  `pnpm scripts:generate-api` and commit the resulting generated type changes.
- Use TanStack Query for server state, cache invalidation, mutations, and
  request lifecycle. Use Jotai only for client-local, shared UI state; keep
  ephemeral state local to the component.
- Keep API/streaming/IndexedDB details inside feature services. Convert raw
  transport errors to typed, user-safe states before they reach components.

## 4. UI, accessibility, and resilience

- Every user-visible string—including labels, placeholders, validation messages,
  `title`, and `aria-label`—uses i18next through `useAppTranslate`. Do not add
  hard-coded UI copy.
- Use semantic controls and test user interactions by accessible role and name.
  Support loading, empty, error, and permission states for data-driven UI.
- Keep components and custom hooks focused and under 100 lines. Avoid nested
  ternaries. Do not extract a generic abstraction until it has three real uses.
- For safe write operations, use optimistic updates and roll back on permanent
  failure. Persist reload-surviving offline state with `idb-keyval` in services;
  handle offline mode with localized, non-blocking feedback rather than a blank
  or frozen interface.
- Isolate high-frequency Konva updates in local components or Jotai atoms; do
  not let pointer movement or canvas rendering invalidate parent layouts.

## 5. Tests and repository intelligence

- Follow Red-Green-Refactor with Playwright. Place feature tests in `_tests/` and
  cover the user flow plus relevant loading, error, offline, rollback, and
  accessibility behavior.
- For `/graphify` requests, use the Graphify workflow first. When
  `graphify-out/graph.json` exists, query the graph before broad source search;
  after code changes run `graphify update .`.
- Do not report a change complete while required generation, build, lint, or
  relevant test gates fail. State exactly what was run and what remains.
