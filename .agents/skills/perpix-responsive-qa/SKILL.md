---
name: perpix-responsive-qa
description: Verify PerPix frontend changes across desktop, tablet, and mobile using the existing Playwright setup. Use when a UI surface is added or materially changed, or when fixing responsive, overflow, RTL, dialog, form, loading, error, or visual-regression defects. Do not use for copy-only changes with no layout impact.
---

# PerPix responsive QA

Treat responsive behavior as an acceptance criterion, not a finishing pass. Use this skill after implementation and before handoff; use Impeccable's `shape`, `adapt`, and `audit` workflow for design direction and UX judgement.

## Scope and setup

- Preserve the project's existing Playwright configuration and use the local server at `http://localhost:5173/`. Start it only through the configured Playwright web server or `pnpm dev`; port `5173` must stay strict.
- Do not add packages or alter global browser/device configuration merely to test one surface.
- Begin with the smallest relevant test or route. Reuse existing fixtures and mock patterns before creating a new one.
- Use the actual authenticated or mocked state needed by the surface; do not take a screenshot of an unrelated redirect, skeleton, or empty shell.

## Required device pass

For each material UI change, inspect the affected state at these CSS viewport classes unless the product requirement specifies others:

| Device class | Viewport |
| --- | --- |
| Mobile | 375 x 812 |
| Tablet | 768 x 1024 |
| Desktop | 1440 x 900 |

Check the target surface at every applicable size for:

- no horizontal page overflow, clipped content, or inaccessible actions;
- usable touch targets and a clear reading/action order;
- dialogs, popovers, drawers, menus, and tooltips staying visible and dismissible;
- forms with validation, long labels, keyboard focus, and submit/loading/disabled states;
- empty, loading, error, and dense-content states when the component supports them;
- Persian/RTL layout, including mixed Persian–Latin numbers, dates, file names, and icons;
- image/canvas/media sizing without distortion or runaway scroll areas.

## Playwright evidence

When behavior changed or the surface has previously regressed, add or update the smallest focused Playwright test. Set its viewport deliberately in the test or use an existing project profile; do not rely on the desktop default.

- Use stable, semantic locators and existing test helpers.
- Capture a screenshot assertion only after the route, test data, fonts, theme, locale, and animation state are deterministic.
- Review screenshot diffs at all three sizes. Update a baseline only when the visual change is intended and the other checks pass.
- Test interactions at the size where they change—for example, a mobile drawer rather than only its desktop navigation.

## Handoff

Report the tested route/state and device classes. Explicitly record any size or state that could not be exercised and why. Do not claim responsive coverage from a desktop-only run.
