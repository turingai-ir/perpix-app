Markdown \# AGENTS_FRONTEND.md

## Purpose

The core objective of this document is to guide development agents in
making clean, highly scalable, and production-ready modifications to
`perpix-app`. This architecture strictly values **uncompromising code
readability, atomic modularity, rigorous Test-Driven Development (TDD),
and bulletproof Offline-First/PWA resiliency**.

We heavily favor clean, descriptive, and straightforward React code over
complex, over-engineered architectural patterns.

---

## Complete Project Stack & Capabilities

Every implementation must strictly leverage and integrate with the
following ecosystem: \* **Core & Runtime:** React 19+ (Functional
paradigms, Hooks, Concurrent rendering) inside Vite 8+ (ESM
architecture). \* **Language:** TypeScript 6+ (Strict type-checking,
explicit return types for public APIs, no `any`). \* **Styling Engine:**
Tailwind CSS v4 (Utilizing modern native properties, strict omission of
heavy styling runtimes). \* **Server State Management:**
`@tanstack/react-query` v5 + `openapi-react-query` (For auto-generated
backend type-safety). \* **Local/Client State Management:** `Jotai`
(Atomic, fine-grained reactivity) + `Jotai-Immer` (For structural
immutability). \* **Routing System:** `React Router v8` (Utilizing
code-splitting boundaries). \* **Form & Validation Ecosystem:**
`React Hook Form` paired with `Zod` schemas. \* **Heavy Interactive
Canvas:** `Konva` + `React Konva` (Isolated, performance-critical visual
layers). \* **Offline Layers:** `idb-keyval` (IndexedDB
abstraction) driven by Workbox-window service workers. \* **Resiliency
Tracking:** `@sentry/react` error boundaries. \* **Test Automation
Engine:** `Playwright` (For rigorous component-level behavioral specs
and E2E simulation).

---

## The Golden Code Readability & Simplicity Manifesto

Code longevity is determined by its simplicity. Agents must strictly
obey these guidelines to prevent technical debt:

### 1. File Length and Scope Boundaries

- **Strict Line Limit:** No single React component or custom hook file
  may exceed **100 lines of code**. If a file grows past this
  boundary, sub-components or analytical sub-hooks must be factored
  out immediately.
- **Single Responsibility (SRP):** One file must do exactly one thing.
  A component handles layout/view execution; a hook handles reactive
  calculations/data orchestration.

### 2. Omission of Premature Abstractions

- **The Rule of Three:** Do not create generic helper utilities,
  wrapper components, or shared hooks unless the exact logic is
  explicitly duplicated in at least **three separate features**. Keep
  the code local and explicit until abstraction is forced.

### 3. Declarative and Accessible Syntactical Formatting

- **Ban on Nested Ternaries:** Nested ternary expressions
  (`condition ? a : anotherCondition ? b : c`) are strictly
  prohibited. Use clean, early returns or explicit block-scoped `if`
  statements instead.
- **Self-Explanatory Descriptiveness:** Prioritize long, heavily
  descriptive names over short, clever code shorthand. A variable must
  state exactly _what_ data it holds and _why_, rather than _how_ it
  processes it (e.g., use `workspaceValidationStatus` instead of
  `validWSStatus`).

---

## Strict Test-Driven Development (TDD) Protocol

Writing production components or business hooks prior to establishing a
failing automated test suite is classified as an architectural
violation. Agents must operate within the continuous
**Red-Green-Refactor** cycle using Playwright:

\`\`\`text ┌────────────────────────────────────────────────────────┐ ▼
│ \[1. Write Red Test\] ──► \[2. Implement Minimal Code\] ──► \[3.
Refactor UX & DX\] Step 1: Author the Behavioral Specification (Red)
Before implementing the target feature, create a corresponding test file
under the localized **tests**/ directory. The test must mock necessary
network request states using Playwright network interception and
validate:

Accessibility Integrity: Interact with elements exclusively via
user-centric ARIA roles (e.g., role="button", name="Submit"), ensuring
accessibility is baked in by design.

User Flow Scenarios: Explicitly assert how the UI responds to clicks,
typing, canvas operations, or offline transitions. Execute the suite and
confirm the test fails with an explicit specification error.

Step 2: Implement the Minimal Solution (Green) Write the most
transparent, least complex React structure or TypeScript hook needed to
satisfy the failing test assertions. Do not apply intricate layout
styling, performance caching, or complex edge-case handlers yet. Get the
test to a passing ("Green") state immediately.

Step 3: Refactor for Performance & Readability With a stable green test
suite protecting behavior, clean up the codebase.

Deduplicate styling classes via the cn() helper (clsx + tailwind-merge).

Eliminate unnecessary component re-renders by restructuring Jotai atom
bindings or wrapping intense canvas math in useMemo. Verify that the
test suite remains 100% functional and green.

Feature-Driven Clean Architecture (Vertical Slices) To safeguard scaling
capabilities in a massive codebase, application components are divided
into entirely self-contained, autonomous feature slices located in
src/features/. Cross-feature code leaks are completely mitigated by
sub-dividing modules into four distinct responsibility rings:

Plaintext src/features/`<feature_name>`{=html}/ ├── **tests**/ \#
Localized Playwright component/behavioral tests ├── index.ts \# Public
Gateway API (Strictly controls feature exposure) ├── model/ \#
Client-side Domain (Zod contracts, TypeScript types, formatters) ├──
services/ \# Infrastructure / API clients & IndexedDB offline layers ├──
hooks/ \# ViewModel Layer (TanStack data hooks, dynamic state
orchestrators) └── components/ \# Presentation View (Smart containers &
dumb UI items) 1. Model Ring (model/) Core Mandate: Pure Domain
Representation. Holds local Zod data schemas, static TypeScript types,
dynamic dictionary structures, and language locale JSON bundles.

Boundaries: Framework-agnostic. Zero React dependencies, zero custom
hook integrations, and absolutely no styling imports are permitted here.

2.  Services Ring (services/) Core Mandate: Data Synchronization,
    Abstraction, & Persistence. Contains direct references to endpoints
    generated by openapi-typescript and encapsulates
    @microsoft/fetch-event-source event streaming hooks or IndexedDB
    interactions (idb-keyval).

Boundaries: Responsible for turning raw backend network payloads into
clean, UI-ready structural interfaces. Never allows raw HTTP error
strings to directly touch view layouts.

3.  Hooks Ring (hooks/) Core Mandate: ViewModel and Reactive State
    Orchestration. Houses feature-specific custom React hooks, TanStack
    Query/Mutation cache configurations, and localized Jotai state
    atoms.

Boundaries: Connects the UI components to backend services and local
state layers. Exposes clean data objects and deterministic handler
callbacks directly to components.

4.  Components Ring (components/) Core Mandate: Visual Presentation.
    Divided into Smart Components (Containers that extract data and
    callbacks from local custom hooks) and Dumb Components (Pure
    presentational components driven solely via explicit incoming
    props).

Boundaries: Absolutely no direct fetch, API calling, or Axios logic
inside components. Components focus exclusively on rendering layout
design, applying Tailwind utility styles, managing motion physics, or
executing interactive visual matrices inside react-konva.

PWA & Robust Offline-First Governance perpix-app is built to be
resilient in disconnected environments. Every asynchronous action must
function perfectly regardless of internet availability:

1.  Mandatory Optimistic Actions When executing write operations
    (mutations like adding an item or modifying canvas layout data), the
    custom application hook must immediately compute the expected final
    output and manipulate the local Jotai or TanStack Query cache state
    before the network call leaves the client container. If the network
    successfully resolves, silently commit the state. If it permanently
    fails, rollback smoothly and trigger a fallback layout.

2.  Autonomous IndexedDB State Sync Any local client-side configuration
    or state captured via Jotai that must survive an application reload
    or prolonged network absence must be automatically persisted to
    IndexedDB using idb-keyval within the feature's services/ layer.
    Hydration on application boot must be completely non-blocking,
    checking for operational race conditions before allowing the layout
    to depend on the state.

3.  Fault Tolerant Offline Error Strategy If a service or hook execution
    detects a network failure (navigator.onLine === false or an HTTP
    request failure caused by timeout), it must gracefully fallback to
    fetching the last known reliable data entry points from the
    IndexedDB cache. It should notify the user of the disconnected
    operational mode via a non-disruptive, localized toast alert
    (sonner), avoiding layout whiteouts or UI freezing.

Module Boundary and Isolation Rules The Public API Gate: A feature
module can interact with another feature module only via its root
index.ts file. Deep file parsing across feature boundaries is banned.

Correct: import { WorkspaceCanvas } from '@/features/workspace';

Incorrect: import { CanvasWrapper } from
'@/features/workspace/components/CanvasWrapper';

Flow Trajectory Rules: Imports must always flow unidirectionally inward
toward core primitives: components ──► hooks ──► services ──► model ──►
core/shared.

Performance Isolation (Konva & Heavy UI Layers) Because react-konva
renders canvas arrays completely outside the native HTML DOM, any state
updating coordinate grids or matrix dimensions must be strictly
encapsulated into hyper-localized components or localized Jotai atomic
variables.

Never let rapid canvas interactions (like dragging shapes or drawing
paths) bubble rendering cycles up to parent layout components. Maintain
a stable 60fps interaction rate at all times.

Automated Handover & Verification Chain Prior to finalizing any feature
modifications, agents must run and pass the following terminal
verification steps:

API Integrity Verification: pnpm scripts:generate-api (Confirms full
contract symmetry with the active backend schema).

TypeScript Compilation Check: pnpm build (The command tsc -b must
execute perfectly without a single compilation warning).

Syntax Lint Audit: pnpm lint (Confirms absolute formatting compliance
across ESLint and Prettier rule-sets).

Behavioral Regression Suite: pnpm playwright test (Ensures the newly
authored TDD specifications and all existing legacy feature tests
execute flawlessly).

Completion Report Requirements Your final response upon execution must
specify:

Targeted Files: A list of components, hooks, or models created or
modified.

Offline-First Impact Summary: A concise brief describing how cache
mutations, IndexedDB persistence (idb-keyval), and network-lost
scenarios were tested and accounted for.

TDD Validation Diagnostics: Code snippet showing passing Playwright
diagnostic logs for the newly added feature metrics.
