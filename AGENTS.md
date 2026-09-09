# PerPix Frontend Agent Instructions

## Source of Truth

- Follow the actual dependencies, versions and scripts in `package.json`.
- Follow existing project patterns before introducing new architecture.
- Do not install, upgrade or remove dependencies unless explicitly requested.
- Detailed architecture requirements are stored in:
  `docs/agent-guides/FRONTEND_ARCHITECTURE_FULL.md`

## Context Discipline

- Read only files directly related to the current task.
- Search for symbols and usages before opening complete files.
- Do not scan the entire repository unless architectural analysis is required.
- Never inspect `node_modules`, `dist`, `coverage` or generated output directories.
- Keep terminal output limited to actionable errors and relevant results.
- Do not modify or refactor unrelated code.
- Before reading more than five files, confirm they are necessary for the task.
- Never print an entire large file when a focused excerpt is sufficient.
- Treat `src/services/api/api.ts` as a large generated file. Never read it completely; search for the exact symbol, type or endpoint and inspect only the relevant section.
- Do not edit `src/services/api/api.ts` manually unless explicitly requested.
- Never read `src/services/i18/locales/fa.json` completely. Search for the exact translation key and inspect only nearby entries.
- Use `ui-ux-pro-max` only for new pages, complete redesigns or explicit design-system work.
- Do not load `ui-ux-pro-max` for text changes, bug fixes or minor styling.

## Code Standards

- Use TypeScript without introducing `any`.
- Prefer readable, straightforward React code.
- Avoid nested ternary expressions.
- Use the Rule of Three before creating shared abstractions.
- Preserve accessibility, RTL and existing localization conventions.
- User-visible text must follow the project's existing i18n system.
- Components must not perform direct API calls when existing services and hooks handle them.
- Cross-feature imports must use the feature's public `index.ts` API.
- Reuse existing components, hooks and utilities before creating new ones.
- Do not introduce new architectural patterns without a clear project requirement.

## File Scope

- New or substantially modified components and hooks should remain focused and preferably below 100 logical lines.
- Split files only when they contain multiple responsibilities.
- Do not refactor unrelated legacy files solely to satisfy a line limit.
- Make the smallest change that completely solves the requested task.

## Detailed Architecture Trigger

Read `docs/agent-guides/FRONTEND_ARCHITECTURE_FULL.md` before working on:

- API integrations or generated API contracts
- Jotai or TanStack Query state
- Offline-first behavior
- IndexedDB persistence
- PWA or service workers
- React Konva or performance-sensitive canvas code
- Feature boundaries or architectural changes
- Large cross-file refactors

Do not load the complete architecture document for isolated text, color, spacing or simple UI changes.

## Testing Strategy

Always begin with the smallest relevant validation.

### Trivial UI Changes

For text, color, spacing or isolated styling changes:

- Do not create a new test unless behavior changes.
- Run only the smallest relevant lint or type validation.
- Do not run the complete build or Playwright suite unless requested.

### Behavioral Changes

For interactions, bug fixes or business logic:

- Add or update the relevant test.
- Follow Red-Green-Refactor when practical.
- Run targeted tests for the affected feature.
- Do not run unrelated test suites.

### Critical Changes

For API, offline behavior, persistence, routing, authentication, canvas or shared architecture:

- Read the complete architecture document.
- Apply its TDD and resiliency requirements.
- Run the relevant build, lint and Playwright validations.
- Run `generate-api` only when API contracts are involved.
- Run the complete verification suite before merge or when explicitly requested.

## Terminal and Tool Output

- Use targeted searches instead of repository-wide file reads.
- Prefer concise commands and filtered output.
- Do not include complete build logs when only a small error section is relevant.
- Do not repeatedly run successful commands without a concrete reason.
- Stop and report the blocker when additional broad analysis is required.

## Completion Report

Keep the final response concise and include:

- Files changed
- Validation performed
- Important risks or remaining work