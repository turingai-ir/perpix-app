---
name: perpix-ui-kit
description: The PerPix UI standard. Use before building, changing or reviewing any component in packages/ui, any Storybook story, or any app screen that migrates to @perpix/ui. Covers Liquid Glass surfaces, Base UI primitives written with shadcn conventions, design-language roles, CSS-only motion, Phosphor icons, RTL, mobile-first sizing and accessibility.
---

# PerPix UI kit standard

`packages/ui` (`@perpix/ui`) is the only UI kit. Every rule here was decided with the product owner. Do not reopen these decisions without being asked.

## 0. Scope and migration

- New reusable UI goes in `packages/ui/src/components/<name>.tsx` and is imported as `@perpix/ui/components/<name>`.
- Apps (`apps/app`, `apps/admin`) migrate gradually. Do not rewrite existing app screens, and do not delete legacy app components, unless the task asks for it.
- One-off, business-specific UI (finance summary, tables bound to API data, typography used by one page) stays in the app. Promote it to the kit only by the Rule of Three.
- Package exports: `globals.css`, `components/*`, `lib/*`, `hooks/*`, `vazirmatn.css`. A new file is public once it is in one of these folders.

## 1. Visual direction: simple Liquid Glass

### 1.1 Where glass goes
- **Glass:** chrome that floats over content: top bars, tab bars, toolbars, menus, popovers, tooltips, dialogs, sheets, floating status cards and buttons.
- **Solid:** content: lists, cards in a grid, forms on a page, tables, media. Content runs edge to edge under the floating chrome. Pad scroll areas so the chrome does not cover the first or last item.
- Never stack glass on glass more than one level. A button on a glass sheet is fine; a glass card inside a glass panel is not.

### 1.2 Utilities (defined in `src/styles/theme.css`)

| Utility | Use |
|---|---|
| `glass` | Default floating surface: fill, hairline edge, shine, shadow, plus `backdrop-filter: blur() saturate()` |
| `glass-flat` | The same surface without blur. Use over playing video, an active canvas, or long scrolling lists of glass items |
| `glass-tinted` | Primary action. Brand-violet tint with `--liquid-tint-foreground` text |
| `glass-tint-<color>` | Changes the tint, for example `glass-tint-destructive` |
| `glass-scrim` | The dimmed backdrop behind modal dialogs and sheets |

For a plain floating container use `<GlassSurface intensity="soft" | "flat">`. Never write `backdrop-filter`, `backdrop-blur-*` or `bg-white/xx` by hand.

### 1.3 Approved values (tokens in `src/styles/tokens.css`)

| Token | Light | Dark |
|---|---|---|
| `--liquid-fill` | card colour at 50% | same |
| `--liquid-fill-flat` | card colour at 90% | same |
| `--glass-blur` | 20px (12px on `pointer: coarse`) | same |
| `--glass-saturate` | 125% | same |
| `--glass-edge-light` | white at 40% | white at 14% |
| `--glass-shine` | inset top line 55% white, bottom line 15% | 16% and 5% |
| `--liquid-scrim` | night at 22% | night at 55% |

- Change the look only through these tokens, never inside a component. Before any change, check light and dark over a busy, colourful backdrop.
- Glass overrides `--muted-foreground` to `foreground` at 80%, so secondary text stays readable. Use `text-muted-foreground` on glass; never hand-pick a grey.

### 1.4 Rejected: never reintroduce
- Gradient or rainbow rims, conic borders, "liquid" distortion or SVG displacement filters.
- Dark or grey borders on glass. The edge is a white hairline only.
- Heavy saturation (over about 140%), blur over about 24px, or a fill under about 40%.
- Large radii and pill shapes everywhere (see §2.2).
- shadcn's default look (zinc palette, flat borders, `shadow-sm` cards). We use its structure, not its style.

### 1.5 Fallbacks (already in the utilities)
- `prefers-reduced-transparency`, `prefers-contrast: more` and no `backdrop-filter` support each give an opaque fill.
- `forced-colors` gives system colours with a real border.
- `[data-canvas-busy]` on an ancestor turns `glass` into `glass-flat`. The studio sets it while playing, scrubbing or dragging.
- Do not override these with `!important` or inline styles.

## 2. Design-language roles

Pick a role, never a pixel value. The `cn` helper knows these roles, so a role passed in `className` overrides the component's default.

### 2.1 Type: `text-<role>`
`large-title`, `title-1`, `title-2`, `title-3`, `headline`, `body`, `subhead`, `footnote`, `caption`. Weight is set separately: `font-semibold` for titles and buttons, `font-medium` for row titles.

### 2.2 Radius (moderate; the product serves both B2C and B2B)

| Class | Use |
|---|---|
| `rounded-control` | Buttons, inputs, chips, small icons in tiles |
| `rounded-card` | Cards, tiles, `GlassSurface` |
| `rounded-overlay` | Popover, menu, dialog |
| `rounded-panel` | Sheets and drawers (`rounded-t-panel` for bottom sheets) |
| `rounded-full` | Only pill bars (tab bar, floating top bar), avatars and round icon buttons |

Nested radii must look concentric: an inner radius is the outer radius minus the padding.

### 2.3 Spacing, shadows and colour
- **Spacing:** `p-inset-sm`, `p-inset`, `p-inset-lg` for padding; `gap-group` (related items), `gap-block` (inside a section), `gap-section` (between sections). Use logical spacing: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `inset-x-`.
- **Shadows:** `shadow-raised`, `shadow-overlay`, `shadow-modal`. Glass utilities already add their own shadow.
- **Colours:** semantic only: `primary`, `foreground`, `muted-foreground`, `destructive`, `border`, `card`, and the `accent-*` set for content tiles. A new colour becomes a token in `tokens.css` and is mapped in `theme.css`.
- **Forbidden:** `text-[..px]`, `rounded-[..]`, `#hex`, `rgb()` in components, `transition-all`, and `!important`.

## 3. Components: Base UI with shadcn conventions

### 3.1 Primitives
- Build on `@base-ui/react/<part>` (`button`, `dialog`, `popover`, `menu`, `tooltip`, `select`, `switch`, `tabs`, `toast` and so on).
- Never copy shadcn component source, and never add Radix, Headless UI or React Aria.
- Base UI already handles focus traps, `aria-*`, portals, positioning, dismissal and `data-open`, `data-starting-style`, `data-ending-style`, `data-side`. Use them; do not reimplement them.

### 3.2 File shape (shadcn conventions, exactly)

```tsx
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@perpix/ui/lib/utils";

function PopoverContent({ className, ...props }: PopoverPrimitive.Popup.Props) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner sideOffset={8}>
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn("glass motion-pop rounded-overlay p-inset outline-none", className)}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
```

- One file per component family, kebab-case file name, named `function` components, and one `export { … }` at the end.
- Name parts by shadcn convention: `X`, `XTrigger`, `XContent`, `XHeader`, `XFooter`, `XTitle`, `XDescription`, `XClose`, `XItem`.
- Every rendered part carries `data-slot="<component>-<part>"`. Tests and app overrides target `data-slot` and `data-*` state, never class names.
- Accept `className` and merge it last with `cn(defaults, className)`. Spread the remaining props onto the primitive.
- Variants use `cva`. Export the `xVariants` function, and expose the chosen variant as `data-variant`. Default variant: `glass`.
- Props use the primitive's own types (`PopoverPrimitive.Popup.Props`), extended by intersection. Do not use `any`.
- Compose other parts through Base UI's `render` prop (`render={<Button variant="glass" size="icon-sm" />}`), not by wrapping in an extra element.
- Keep each file focused and under about 100 logical lines. Put behaviour hooks in `src/hooks/` (for example `use-sheet-drag.ts`).

### 3.3 Inputs a component receives, and what stays outside it
- All user-visible text comes in through props (`closeLabel`, `label`, `placeholder`). The kit has no i18n, API calls, stores, routing, feature flags or business logic.
- An icon-only control requires an accessible-label prop.

### 3.4 Available components and feature contracts

| Component | Features & Complete Contract |
|---|---|
| `button` | Variants: `glass`, `tinted` (primary), `brand` (hero gradient), `success`, `destructive`, `outline`, `subtle`, `plain`. Shapes: `rounded`, `pill`. Sizes: `xs`–`xl`, `icon-xs`–`icon-xl`. Features: `loading`, `loadingText`, `haptic` (light/medium), coarse-pointer 44px hit targets. |
| `glass-surface` | `intensity`: `soft` (Liquid Glass blur) or `flat` (no blur for playing canvas/busy). Floating chrome container. |
| `toast` | Stacked deck collapse (`stacked`), pause on hover, visual countdown bar (`ToastProgress`), exit transitions (`data-[ending-style]`), drop-in `<Toaster />`, and imperative API: `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, `toast.promise()`, `toast.dismiss()`. |
| `input` | Clearable button slot (`clearable`, `onClear`), password reveal eye toggle (`showPasswordToggle` on `type="password"`), neutral `helperText` alongside destructive `errorText`, symmetrical `startIcon` / `endIcon` slots, 44px touch targets. |
| `avatar` | Outer wrapper `rounded-full`, automatic initials generator (`name` prop) supporting Persian/Arabic and Latin, status dots (`online`, `busy`, `away`, `offline`), `AvatarGroup` with logical crescent overlap (`[&>*+*]:-ms-2.5`). |
| `badge` | Status dots (`dot`, `dotVariant`), removable chips (`removable`, `onRemove`) with 44px coarse hit target, interactive pressable chip styling (`interactive`), numeric `count` with localized Persian numerals and `overflowCount` (`+۹۹`). |
| `dialog` | Centered glass modal, `glass-scrim`, `closeLabel`, dedicated `DialogBody` scroll container with pinned header/footer, `overscroll-contain`. |
| `sheet` | `side`: `bottom` (mobile default), `top`, `inline-start`, `inline-end`. Dedicated `SheetBody`, swipe-to-dismiss grabber (`SheetGrabber` with 44px touch height). |
| `tabs` | Sliding pill indicator (`TabsIndicator`), horizontal drag-to-scroll via `useDragScroll`, `snap-none` during active drag, frosted edge dissolution masks (`getMaskImage`), floating glass nav arrows, 44px touch targets. |
| `checkbox` | Base UI checkbox, tactile haptics, tri-state indeterminate mode (`MinusIcon`), 44px coarse hit target. |
| `switch` | Base UI switch, tactile haptics, sliding thumb with 44px coarse hit target expansion. |
| `slider` | Base UI slider, live value bubble (`showValueBubble`), tactile step haptics, 44px coarse touch area. |
| `select` | Base UI select, custom dropdown popup with checked indicators at `end-2.5`, 44px item height on mobile (`pointer-coarse:min-h-11`). |
| `dropdown-menu` | Base UI menu, items with icons, checked state (`DropdownMenuCheckboxItem`), destructive variant, shortcut slot (`DropdownMenuShortcut`). |
| `popover` | Base UI popover, glass overlay with spring animation (`motion-pop`), collision padding. |
| `tooltip` | Base UI tooltip, night surface (`bg-night`), hidden on mobile touch devices (`pointer-coarse:hidden`). |
| `direction-provider` | Direction context for synchronous RTL and LTR subtrees. |

## 4. Icons
- Use `@phosphor-icons/react` with the `XIcon` names (`XIcon`, `CheckIcon`, `CaretLeftIcon`). Do not use lucide or inline SVG for UI icons.
- Decorative icons get `aria-hidden`. Size comes from the parent (buttons set `size-4.5` by default) or a `size-*` class.
- Weight is `regular` by default. Use `fill` only for the active or selected state (active tab, selected item); do not use `bold`, `duotone` or `thin`.
- Directional icons (carets, arrows) mirror in RTL with `ltr:rotate-180` or `rtl:-scale-x-100`.
- Every tsconfig that type-checks Phosphor needs the `paths` entry `"react": ["./node_modules/@types/react"]`, `"react/*": ["./node_modules/@types/react/*"]`. Copy it from `packages/ui/tsconfig.json`.

## 5. Motion

`packages/ui/MOTION.md` is the full standard; read it before adding any movement. The essentials:

- **What moves:** only `transform`, `translate` and `opacity`. Never animate blur, `backdrop-filter`, shadow, size or layout.
- **How:** CSS transitions driven by Base UI's `data-starting-style` and `data-ending-style`, not keyframes, so motion can be interrupted.
- **Utilities:** `motion-fade` (scrims), `motion-pop` (menus, popovers, tooltips, dialogs, scaling from `--transform-origin`), `motion-sheet` (edge slide with a spring, drag-aware), `pressable` (scales to 97% on tap), `focus-ring` (outline).
- **Duration tokens:** tap 100ms, press 150ms, exit 160ms, enter 260ms, sheet 320ms, page 380ms. Easings are `--ease-enter`, `--ease-exit` and `--ease-spring`. Exits are always faster than entries.
- **Pages:** React Router `viewTransition`, or `withViewTransition()` from `@perpix/ui/lib/view-transition`.
- **Libraries:** no animation library in `packages/ui` (no GSAP, Motion, Animate UI or react-spring). GSAP lives only in the canvas studio, for seekable timelines.
- **Reduced motion:** a short fade remains. Controls work from the first frame, and every gesture has a button or Escape equivalent.

## 6. Mobile-first and the native-app feel

The product is mobile-first and must feel like a native app, not a website. Design every screen at 390px first. Desktop is an enlargement of the phone layout, never the other way round.

### 6.1 Base behaviour (already global in `src/styles/native.css`)
- No tap highlight, no double-tap zoom delay (`touch-action: manipulation`), and no long-press text selection or preview on controls.
- No rubber-band bounce or pull-to-refresh on the whole document (`overscroll-behavior: none`).
- Inputs are at least 16px on touch screens, so iOS never zooms in.
- Do not undo these in components. Readable content (article text, captions, prompts) stays selectable; add `select-text` where needed.

### 6.2 Layout like an app
- **Shell:** use `h-dvh` / `min-h-dvh`, never `100vh`.
  - The page is a fixed shell: floating top bar, a content area that scrolls, and a bottom tab bar.
  - Only the content scrolls; the bars stay in place.
- **Safe areas:** every edge bar pads with `env(safe-area-inset-*)`.
- **Primary navigation:**
  - Phones: a bottom tab bar (3–5 tabs, icon plus a short label, active icon `weight="fill"`).
  - `lg:` and up: a sidebar.
  - Never use a hamburger menu as the main navigation on phones.
- **Actions:**
  - Primary actions sit within thumb reach (bottom half, or a floating button above the tab bar), not in the top corners.
  - Destructive confirmations are bottom sheets on phones.
- **Overlays on phones:** menus, pickers and forms open as bottom sheets (`Sheet side="bottom"`) and as popovers or dialogs from `md:` up.
- **Titles:** large page titles (`text-large-title`) at the top of a screen. A compact title can stay pinned in the top bar while scrolling.

### 6.3 Touch and response
- **Tap targets:** at least 44px on `pointer-coarse`, handled inside the component. Apps never hand-size targets.
- **Visible response:** every tap responds within 100ms. Use `pressable` on buttons, rows and cards; `active:` states, not `hover:`, carry the feedback.
- **Hover:** never required. Anything shown on hover must also be reachable by tap.
- **Gestures (always with a button equivalent):**
  - Swipe down closes a bottom sheet.
  - Horizontal swipe is for carousels only, using `scroll-snap`.
- **Scrolling:**
  - Scroll containers use `overscroll-contain`.
  - Horizontal lists scroll natively with momentum and snap; no JavaScript scroll libraries.
  - Gesture areas use `touch-none`.
- **Keyboard on phones:** set `inputMode`, `enterKeyHint` and `autoComplete` on every input. Keep the focused field and its submit button visible above the keyboard.

### 6.4 Perceived speed
- **Loading:** show skeletons in the real layout, not centered spinners. A spinner is only allowed inside a button that is busy.
- **Updates:** optimistic. Update the UI at once and roll back on error with a toast.
- **Navigation:** routes change with a View Transition (§5). Keep tab screens mounted so switching tabs is instant and keeps the scroll position.
- **Content shift:** images and media reserve their aspect ratio; no layout shift when data arrives.

### 6.5 App chrome (set once per app, in the app's `index.html`)
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`, so safe areas work.
- **Status bar:** `<meta name="theme-color">` for light and dark, so the bar matches the app.
- **PWA:** `display: standalone` in the manifest, with `apple-mobile-web-app-capable`.

## 7. Accessibility (required, not optional)
- **Keyboard:** everything works by keyboard. Focus is visible through `focus-ring`, which survives forced colours. Do not use `outline-none` without `focus-ring`.
- **Names and semantics:** every control has an accessible name. Dialogs and sheets have a `Title` (visually hidden is allowed) and, ideally, a `Description`.
- **Contrast:** text on glass is at least 4.5:1 (3:1 for large text and icons). Measure it over the real backdrop in light and dark with `better-colors`.
- **State:** never shown only through colour. Use weight, icon fill or text as well.
- **Direction:** RTL is the default locale direction. Check every component in both `dir="rtl"` and `dir="ltr"`.

## 8. Definition of done
1. **Story:** a story in `apps/storybook/stories/<name>.stories.tsx` shows every variant and state (default, hover, focus, disabled, open, loading or empty where relevant), over a busy colourful backdrop and a plain one, in light, dark, RTL and LTR.
2. **Visual:** checked at 390px width and on desktop. When unsure, compare options with `variant`.
3. **Reviews:** `better-accessibility` for keyboard and names; `better-colors` for measured contrast; `review-animations` if the change moves anything; `perpix-responsive-qa` when an app screen changes.
4. **Behaviour:** behavioural logic (gestures, hooks) has a test or a Playwright check.
5. **Checks:** `pnpm --filter @perpix/ui typecheck`, `pnpm --filter @perpix/ui test`, and the storybook typecheck pass. Then run `graphify update .`.

## Related skills
- **Surfaces and polish:** `better-ui`
- **Layout and text:** `better-layout`, `better-typography`, `better-writing`
- **Motion:** `animate`, `review-animations`
- **Canvas studio only:** `gsap-web`
- **Comparing design options:** `variant`
- **React structure:** `vercel-composition-patterns` (compound components, prop design, React 19), which matches §3
- **React performance:** `vercel-react-best-practices`. Ignore its Next.js-only rules (RSC, `next/*`, server actions); this is a Vite SPA
- **Accessibility audit:** `accessibility` (WCAG 2.2 checklist) with `better-accessibility`
- **Final UI review:** `web-design-guidelines`
- **Mobile QA:** `perpix-responsive-qa`

## Precedence

This skill wins over generic skills whenever they disagree. Known conflicts:
- `animate` and `better-ui` suggest the Motion library and springs in JavaScript. Use CSS only (§5).
- `better-ui` uses `scale(0.96)` on press. Use `pressable` (0.97).
- `vercel-composition-patterns` and `web-design-guidelines` may show Radix or shadcn code. Keep the patterns, but build on Base UI (§3).
- `gsap-web` covers scroll storytelling, Lenis and ScrollTrigger. In PerPix, GSAP is only for studio timelines and existing app animations. Never use smooth-scroll libraries: they break the native scroll feel (§6).
