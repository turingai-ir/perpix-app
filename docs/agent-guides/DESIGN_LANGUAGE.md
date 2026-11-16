# PerPix Design Language

Reference standard: **Apple Human Interface Guidelines** (roles, hierarchy, concentric shapes,
Liquid Glass materials, 44 pt touch targets). Implementation: **shadcn base-nova + Tailwind 4 tokens**, following shadcn's
theming conventions exactly: CSS variables in `:root`/`.dark`, `X` + `X-foreground` pairs, `@theme inline` mapping,
alpha modifiers for soft fills (`bg-destructive/10`, `ring-foreground/10`). `src/shared/ui` is upstream shadcn code and exempt from the lint rules below.
Audience: coding agents first, humans second. Every rule is meant to be checkable (lint, test or grep).

Status tags: **[exists]** implemented in tokens/code · **[new]** defined here, component or lint still to be added.
Tokens live in `src/app/styles/tokens.css` (values) and `theme.css` (Tailwind utilities). Do not invent pixel values.

## 0. How an agent must decide

1. Pick a **role** (title, body, control, card, overlay), never a pixel value.
2. Use the role's token/component from this file.
3. If no role fits, stop and report it. Do not add an arbitrary value (`text-[13px]`, `rounded-[14px]`, `#hex`).
4. Reuse order: `@/shared/ui` → `@/shared/components` → Tailwind utilities on tokens.

## 1. Principles

- **Clarity**: one primary action per surface; hierarchy comes from role, not from colour alone.
- **Deference**: UI chrome yields to the user's media (images, video). Content layer is opaque; chrome may be glass.
- **Depth**: layers are communicated by material and elevation level (section 5), not by ad-hoc shadows.
- **Consistency over novelty**: a new screen must look like an existing one built from the same roles.
- **Accessible by default**: RTL, dark, reduced motion, reduced transparency, coarse pointer all work without extra code.

## 2. Colour [exists]

Three layers, one direction of dependency: **palette (primitive) → tokens (semantic) → components**.
Components use only semantic tokens. OKLCH only. No `#hex`, no Tailwind palette colours (`slate-400`, `violet-300`...), no `white`/`black`.

### 2.1 Palette: `src/app/styles/palette.css`
Eight 12-step ramps: `neutral`, `violet`, `magenta`, `blue`, `cyan`, `green`, `amber`, `red`. Step meaning is identical in every ramp
and in both themes (each ramp is redefined under `.dark`, so semantics are written once):

| Steps | Purpose |
|---|---|
| 1–2 | App / surface backgrounds |
| 3–5 | Component background: rest (3), hover (4), active/selected (5) |
| 6 / 7–8 | Subtle border / strong border, focus ring |
| 9–10 | Solid fill (9 = brand or status colour), hover (10) |
| 11–12 | Text: low-contrast (11), high-contrast (12) |

Change a colour by editing its **step**, never by adding a literal elsewhere. Components never reference `--violet-9` etc. directly.

### 2.2 Semantic tokens: `src/app/styles/tokens.css` (mapped in `theme.css`)

| Role | Tokens |
|---|---|
| Surfaces | `background` (page), `card`, `popover`, `muted` (+ `-foreground`); `sidebar` |
| Text | `foreground`, `muted-foreground` |
| Action / emphasis | `primary`, `secondary`, `accent` (+ `-foreground`), `ring` |
| Status | `destructive`, `success`, `warning`, `info`, `review`, each with `-foreground` (text on solid) |
| Borders | `border` (default edge), `input` (form control edge), `ring` (focus) |
| Media type | `image-accent`, `video-accent` (+ `-soft`) |
| Always-dark surfaces (composer, hero buttons, scrims over media) | `night`, `night-foreground` |
| Always-dark glass widgets only | `accent-violet … accent-teal`, `on-accent` |
| Charts | `chart-1 … chart-5` |
| Brand (invariant) | `--brand-gradient`, `--*-brand` (logo colours) |

Surface model (Apple grouped background): light = white `card` on tinted `background`; dark = `background` < `card` < `popover` by lightness (elevation).

Rules:
- Status colour never stands alone: pair with icon or text. Soft status chip (shadcn idiom) = `bg-<status>/10 border-<status>/30 text-<status>`.
- Borders: `border-border` by default. Emphasis or hairlines on glass: alpha on a token (`border-foreground/20`, `ring-foreground/10`). On always-dark surfaces: `border-night-foreground/10`. Never `border-white/10`.
- Brand gradient is for brand moments only (logo, hero, one highlight per screen). **[new rule]**
- A new colour is a new ramp step or ramp (`palette.css`, light **and** dark), then a semantic alias in `tokens.css`, then `theme.css`.

## 3. Typography **[exists: `text-<role>` utilities]**

Font: Vazirmatn (`font-sans`). Roles replace raw `text-*` sizes. Values are derived from current real usage
(`text-sm` 123×, `text-xs` 148×, `text-[11px]` 16×, `text-[0.8125rem]` 8×), not copied from iOS (iOS body is 17 pt; this is a dense web app).

| Role | Size | Weight | Use | Today's nearest |
|---|---|---|---|---|
| `large-title` | 2.125rem | bold | Marketing / hero only | `text-4xl` |
| `title-1` | 1.75rem | bold | Page title | `text-3xl` |
| `title-2` | 1.375rem | semibold | Section / dialog title | `text-xl` |
| `title-3` | 1.125rem | semibold | Card title | `text-lg` |
| `headline` | 0.9375rem | semibold | Emphasised row, label | `text-sm font-semibold` |
| `body` | 0.875rem | normal | Default text | `text-sm` |
| `subhead` | 0.8125rem | normal | Secondary description | `text-[0.8125rem]`, `text-[13px]` |
| `footnote` | 0.75rem | normal | Meta, helper | `text-xs` |
| `caption` | 0.6875rem | medium | Badges, counters. **Floor: nothing below 11 px.** | `text-[11px]` |

Utilities: `text-large-title`, `text-title-1|2|3`, `text-headline`, `text-body`, `text-subhead`, `text-footnote`, `text-caption`
(size + line-height + tracking). Weight is a separate `font-*` class (`headline` → `font-semibold`).
Weights allowed: `normal`, `medium`, `semibold`, `bold`. `font-extrabold` (24× today) is only for `large-title`.
Line-height and tracking belong to the role, not the call site. Use `text-balance` on titles. Persian digits via existing i18n helpers.

## 4. Shape **[exists scale, new roles]**

Base `--radius: 0.75rem` (`theme.css`). Use named steps only:

| Role | Class | Px (approx) |
|---|---|---|
| Inline chip, small control | `rounded-md` | 10 |
| Control (button, input, select) | `rounded-control` (= `rounded-lg`) | 12 |
| Card, tile, popover | `rounded-card` (= `rounded-xl`) | 16 |
| Dialog, sheet, hero card | `rounded-overlay` (= `rounded-2xl`) | 22 |
| Pill, avatar | `rounded-full` | — |

**Concentric rule (Apple):** child radius = parent radius − padding between them (never larger than parent). Use `rounded-[inherit]`
only for overlays that must follow the parent. Today's arbitrary values map to: `14px`, `0.8rem`, `0.9rem` → `rounded-lg`/`xl`;
`1.25rem` → `rounded-2xl`; `1.75rem` → `rounded-3xl`.

## 5. Elevation and materials **[exists: shadow tokens]**

Apple conveys depth with material, not heavy shadow. Five levels:

| Level | Layer | Surface | Shadow |
|---|---|---|---|
| 0 | Page | `bg-background` | none |
| 1 | Content card | `bg-card` + `border` | none / hairline |
| 2 | Floating chrome (nav, toolbar, composer) | glass (`glass-surface`, blur) | soft |
| 3 | Popover, menu, tooltip | `bg-popover` (+ blur) | medium |
| 4 | Dialog, sheet, toast | `bg-popover`/`card` solid-enough | large |

Liquid Glass rules:
- Glass is for the **control/navigation layer floating over content**. Never for content cards. No glass on glass.
- Every glass surface must have a `reduced-transparency:` fallback (variant exists in `theme.css`, see `utilities.css`).
- Shadows are **layered (ambient + direct)** tokens: `shadow-raised` (level 2), `shadow-overlay` (level 3), `shadow-modal` (level 4).
  Values: `--elevation-*` in `tokens.css`, tinted by `--shadow-ink` (adapts to dark). No `shadow-[...]` in components.

- **Glass edge:** `inset-shadow-highlight-sm|highlight|highlight-lg` (lit top edge) + one elevation level, e.g. `inset-shadow-highlight shadow-overlay`.

## 6. Spacing and layout **[exists: role spacing tokens]**

- 4 px grid. Allowed steps: `0.5 1 2 3 4 6 8 12 16`. Half-steps (`1.5`, `2.5`) only inside a single control's internal padding.
- Role tokens: padding `p-inset-sm` (0.75rem) / `p-inset` (1rem) / `p-inset-lg` (1.5rem); gaps `gap-group` (0.5rem) / `gap-block` (1rem) / `gap-section` (1.5rem).
  Prefer them over raw numbers for surface padding and sibling gaps (also work as `px-`, `py-`, `space-y-`).
- Default rhythm: `gap-2` inside a group, `gap-4` between groups, `p-4` card padding (`p-3` dense), `gap-6+` between sections.
- Mobile-first (`sm:`/`md:`/`lg:`); use logical properties (`ms-`, `pe-`, `start-`) for RTL, never `left/right`.
- Respect safe areas on PWA (`env(safe-area-inset-*)`).

## 7. Interaction [exists]

- Touch targets: handled in `shared/ui` via `pointer-coarse:` (44 px default, matches Apple). Never hand-size targets.
- Focus: `focus-visible:` ring only (`ring` token). Never remove outline without replacement.
- Press feedback: subtle (`active:translate-y-px` pattern in `button.tsx`). Disabled = `opacity-50`, not a new colour.
- Icon-only controls require `aria-label` (i18n). Async status uses polite live regions (toasts).
- Don't pre-disable submit; show validation next to the field and focus the first error.

## 8. Motion [exists]

- Tokens: `--animate-*` and `--ease-out-quint` in `theme.css`. Durations: `duration-press` 150 ms, `duration-enter` 260 ms, `duration-page` 380 ms (`--duration-*` in `tokens.css`; pair with `transition-colors|transform|opacity`).
- Animate **only `transform` and `opacity`**. Never `transition-all` (list the properties: `transition-colors`, `transition-transform`).
- Reduced motion is handled globally in `base.css`; do not re-implement per component. Motion explains cause/effect, never decorates.

## 9. Patterns (what to build with)

| Need | Use |
|---|---|
| Button, input, dialog, sheet, menu | `@/shared/ui` (shadcn base-nova) |
| Error / loading / list states | `@/shared/components` (`error-section`, `loading-section`, `profile-list-state`) |
| Page header, section, surface, empty state, stat tile | **[new]** add to `shared/components` on the Rule of Three, not before |
| Text with a role | **[new]** `Text`/typography with `variant` = section 3 roles (replaces `Heading1..5`) |

## 10. Anti-patterns (agents: grep your own diff for these)

| Don't | Do |
|---|---|
| `text-[11px]`, `text-[13px]`, `text-[0.8125rem]` | role `caption` / `subhead` (section 3) |
| `text-[10px]` or smaller | `caption` (11 px floor) |
| `rounded-[14px]`, `rounded-[1.25rem]` | named radius (section 4) |
| `#hex`, `bg-violet-400`, `text-slate-400`, `text-white` | semantic token (section 2) |
| `transition-all` (outside `shared/ui`) | explicit property transition |
| `shadow-[...]`, ad-hoc `shadow-2xl` | elevation token (section 5) |
| Glass card inside glass card | opaque `card` for content |
| `left-*`, `ml-*`, `text-left` | logical (`start-*`, `ms-*`, `text-start`) |
| Status by colour only | colour + icon/text |
| New `*.css` for ordinary UI | Tailwind on tokens |

## 11. Enforcement roadmap (what makes this agent-proof)

Prose is advisory; agents obey what fails the build. Order of rollout, each step independent:

1. **Tokens**: ✅ done (type roles, radius roles, elevation, spacing roles, durations, `night`). Adding one means: `tokens.css`/`theme.css` **and** the `extendTailwindMerge` list in `src/shared/lib/utils.ts`.
2. **Lint**: ✅ done. `no-restricted-syntax` errors in `eslint.config.js` for arbitrary `text-[Npx]`, `rounded-[Npx]`, `-[#hex]`, Tailwind palette/`white`/`black` colours and `transition-all`. Exempt: `src/shared/ui`, `_tests`, `header-slogan.tsx`. Not yet linted: `shadow-[...]` (see backlog).
3. **Component**: role-based `Text` in `shared/ui`; migrate on touch.
4. **Living spec**: extend `src/pages/design-preview` to render every role/level so humans and visual tests share one source.
5. **Visual tests**: Playwright screenshots (light/dark, RTL, reduced-transparency) of the preview page.

Migration policy: touch a file → migrate its violations. No repo-wide rewrite.

## 12. Known backlog

- Arbitrary `shadow-[...]` that mixes a token-coloured glow (`color-mix(... var(--primary) ...)`, `var(--item-glow)`) is allowed; plain white/black literals are linted. Coloured brand glows in hero/art surfaces (finance-hero, identity-hero, account-widget) still use tinted `rgb()` literals.
- Art scenes (`*.module.css`) and Konva/canvas code use literal colours by design (architecture doc section 3; canvas cannot read CSS variables).
- `src/shared/ui` keeps shadcn upstream values (`transition-all`, `text-[0.8rem]`, `rounded-[min(...)]`). Do not "fix" it; re-sync with `shadcn` instead.
