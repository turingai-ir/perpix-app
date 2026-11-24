---
name: perpix-component-audit
description: Quality, Accessibility, and Design Audit rubric for PerPix UI components. Use whenever building, modifying, or auditing components in packages/ui or Storybook. Mandates systematic verification across 6 core pillars (Theme, Responsive, Native Feel, RTL, a11y, Edge Cases).
---

# PerPix Component Audit Rubric

This skill defines the mandatory 6-pillar standard for every UI component built or maintained in `@perpix/ui`. Every component must pass this rubric before being merged or considered complete.

---

## The 6 Core Audit Pillars

### Pillar 1: Dual-Theme Liquid Glass Fidelity
- **Light & Dark Theme Parity:** Test the component against both dark and light backdrops over mesh gradients, solid backgrounds, and canvas grids.
- **Translucent Glass Contrast Rule (Never Use Solid-Fill Foreground Tokens):** NEVER use `text-*-foreground` tokens (`text-success-foreground`, `text-destructive-foreground`, `text-primary-foreground`) on translucent glass surfaces (`glass-tinted`, `glass`). In dark mode, solid foreground tokens resolve to dark ink (`oklch(0.17 ...)` = near black). Always use `text-foreground` or allow inheritance of `color: var(--liquid-tint-foreground)` (crisp white `oklch(0.985 ...)` on tinted glass) to guarantee high contrast (> 7:1) in both themes.
- **Concentric Radii & Wrapper Full-Round:** Outer wrapper containers around circular elements (such as `Avatar`) must declare `rounded-full`. Never leave outer wrappers square or unstyled, which causes square focus rings or clipping boxes around round avatars or pills.
- **Subtle Glass Highlights:** In dark mode (`.dark`), ensure borders use softened opacity (`oklch(1 0 0 / 10%)` or `color-mix(in oklch, var(--foreground) 10%, transparent)`). Never introduce stark, bright white wireframe borders on dark surfaces.
- **Apple & 2020+ Device Compatibility:** Ensure blur rules include `-webkit-backdrop-filter` alongside standard `backdrop-filter` in both declarations and `@supports` queries for iOS 14–17 Safari compatibility.
- **Accessibility Fallbacks:** Provide opaque solid fallback backgrounds for `prefers-reduced-transparency`, `prefers-contrast: more`, and environments without backdrop blur support.

### Pillar 2: Multi-Device & Mobile-First Baseline
- **390px Mobile Baseline:** All components must be designed for mobile first (390px iPhone width) and scale cleanly up to tablet (768px) and desktop (1440px).
- **Usable Touch Targets (Coarse Pointer >= 44px):** All interactive controls and sub-controls (buttons, inputs, checkboxes, switches, slider thumbs, tabs, clear buttons, password toggles, badge remove buttons, sheet grabber handles) must provide hit areas of at least 44x44px on coarse pointers. For visually compact buttons (16–20px icons), use an invisible pseudo-element expansion:
  ```css
  pointer-coarse:before:absolute pointer-coarse:before:-inset-2 pointer-coarse:before:min-h-[44px] pointer-coarse:before:min-w-[44px]
  ```
  This preserves compact visual aesthetics on desktop while making mobile tapping effortless.
- **Safe Area Insets:** Fixed or sliding bottom elements (sheets, toast viewports, floating bars) must respect `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)`.
- **Overscroll Containment:** All scrollable overlays, dropdowns, dialogs, and sheets must declare `overscroll-contain` to prevent page bounce and scroll-chaining.

### Pillar 3: Native Mobile Feel, Tactility & Lifecycle Motion
- **Auto-Dismiss & Lifecycle Management:** Transient feedback components (like Toast, alerts, banners) must provide auto-remove timers (configurable duration, default 5000ms) with automatic pause on hover and focus so users can read or interact without rush.
- **Fluid Exit & Enter Transitions (CSS Only):** Components that appear and disappear must define fluid enter and exit states with CSS spring easing:
  ```css
  data-[starting-style]:opacity-0 data-[starting-style]:translate-y-4 data-[starting-style]:scale-95
  data-[ending-style]:opacity-0 data-[ending-style]:scale-90 data-[ending-style]:translate-y-4
  ```
  Never allow components to vanish or unmount abruptly without exit animations.
- **Visual Countdown Progress:** Auto-dismissing elements should provide an optional countdown progress bar (`ToastProgress`) that smoothly animates down to 0% and pauses when hovered.
- **Tactile Haptics:** Interactive toggles and value adjustments must invoke `triggerHaptic("selection")` (switches, checkboxes, tab changes, button actions, slider steps).
- **Desktop Drag-to-Scroll:** Horizontal scrollable tracks (tabs, chip carousels) must support desktop mouse panning via `useDragScroll`, with `cursor-grab` / `cursor-grabbing`.
- **Click Swallowing on Drag:** When the user drags across interactive items with the mouse (movement > 4px), subsequent click events must be swallowed so dragging does not accidentally trigger tab switches or button clicks.
- **Snap Management:** Horizontal tracks must disable CSS scroll-snap during active mouse dragging (`snap-none`) to prevent violent stutter, re-enabling snapping on release.
- **Hidden Scrollbars with Visual Affordance:** Use `no-scrollbar` for a clean app-like surface, but always pair it with visual cues: frosted glass edge fade masks (`mask-image`) and floating glass navigation arrows.
- **No Text Selection During Gesture:** Use `select-none` on draggable and pressable controls so text does not highlight while panning.
- **Spring Motion:** Transitions must use CSS spring easing (`var(--ease-spring)`), durations between 150ms–300ms, and animate only `transform` and `opacity`. Never introduce JS animation libraries into `packages/ui`.

### Pillar 4: Universal RTL & Bidirectional Compatibility
- **Strict Logical CSS Properties:** Absolutely no bare physical properties (`left-`, `right-`, `ml-`, `mr-`, `pl-`, `pr-`). Always use logical CSS: `start-`, `end-`, `ms-`, `me-`, `ps-`, `pe-`, `inset-inline-*`, `rounded-s-*`, `rounded-e-*`.
- **Group Overlaps & Crescent Margins:** In overlapping groups (such as `AvatarGroup`), avoid broken physical `-space-x-* rtl:space-x-reverse`. Use logical sibling offset `[&>*+*]:-ms-2.5` to ensure consistent circular crescent overlap in both LTR and RTL.
- **Cross-Engine RTL Normalization:** Use `getRtlScrollType()` when computing scroll offsets or programmatic scrolling to normalize between Chromium/Firefox negative `scrollLeft`, WebKit/Safari positive `scrollLeft`, and legacy reverse engines.
- **Direct Drag Manipulation:** Dragging mouse to the right must move content to the right in both LTR and RTL.
- **Bidirectional Icons:** Directional icons (like navigation chevrons) must rotate 180 degrees in RTL (`rtl:rotate-180`) so they point toward their logical destination.
- **Synchronous RTL Resolution:** Components must resolve direction synchronously from Base UI `useDirection()` or `document.documentElement.dir` on the initial render to prevent inverted first-frame masks.

### Pillar 5: Accessibility (WCAG 2.2 AA & Semantics)
- **Base UI Primitive Foundations:** Build strictly on Base UI primitives to inherit accessible keyboard navigation, ARIA attributes, focus management, and focus trapping.
- **Visible Focus States:** All interactive controls must define accessible focus rings (`focus-ring`: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`).
- **Accessible Names:** Icon-only buttons must declare an `aria-label` or localized label prop (e.g. `closeLabel`).
- **Decorative Icons:** All non-interactive icons must declare `aria-hidden="true"`.
- **Color Contrast:** Foreground text and labels on glass must meet WCAG 2.2 AA contrast standards (minimum 4.5:1 for normal text against the rendered backdrop).

### Pillar 6: State Completeness & Essential Feature Checklist
Every component must fulfill the **Complete Component Contract** before being considered ready:

1. **Toast & Notifications (`toast.tsx`):**
   - [x] Auto-dismiss timer (`timeout`, default 5000ms) with pause on hover/focus
   - [x] Visual countdown timer bar (`ToastProgress`)
   - [x] Smooth enter & exit animations (`data-[starting-style]`, `data-[ending-style]`)
   - [x] Space-saving iOS stacked deck mode (`stacked`) with hover/click expand
   - [x] Zero-boilerplate root container (`<Toaster />`)
   - [x] Imperative helper API: `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, `toast.promise()`, `toast.dismiss()`

2. **Input & Form Controls (`input.tsx`):**
   - [x] Clearable button slot with 44px coarse hit target (`clearable`, `onClear`)
   - [x] Password visibility eye toggle (`type="password"`, `showPasswordToggle`) with accessible name
   - [x] Neutral `helperText` (guidance) alongside destructive `errorText` (validation error)
   - [x] Symmetrical start/end icon slots (`startIcon`, `endIcon`)
   - [x] Visual error glow with `aria-invalid="true"`

3. **Button (`button.tsx`):**
   - [x] Loading spinner with `loading` prop and accessible `aria-busy="true"`
   - [x] Dedicated `loadingText` prop (e.g. `در حال ارسال...`) replacing label during active operations
   - [x] Calibrated tactile feedback (`haptic="light" | "medium" | "heavy"`)
   - [x] Shapes: `rounded` (control) and `pill` (capsule)
   - [x] Icon-only sizes with mobile coarse expansion (`pointer-coarse:size-11` >= 44px)

4. **Avatar (`avatar.tsx`):**
   - [x] Outer wrapper `rounded-full` to eliminate square box rings
   - [x] Automatic initials extraction (`name` prop) supporting Persian/Arabic and Latin names
   - [x] Realtime status dots (`status="online" | "busy" | "away" | "offline"`)
   - [x] Group container (`AvatarGroup`) with logical crescent overlap (`[&>*+*]:-ms-2.5`)

5. **Badge & Tags (`badge.tsx`):**
   - [x] Status dots (`dot`, `dotVariant`)
   - [x] Removable chip mode (`removable`, `onRemove`) with 44px coarse hit target
   - [x] Interactive pressable chip styling (`interactive`)
   - [x] Numeric `count` with localized Persian numerals and `overflowCount` (`+۹۹`)

6. **Sheet & Dialog (`dialog.tsx`, `sheet.tsx`):**
   - [x] Dedicated scrollable body container (`DialogBody`, `SheetBody`) with pinned header/footer
   - [x] Swipable bottom-sheet drag grabber (`SheetGrabber`) with 44px coarse hit height
   - [x] Modal scroll prevention via `overscroll-contain`
   - [x] Localized corner close button (`closeLabel`)

7. **Tabs (`tabs.tsx`):**
   - [x] Authentic Apple HIG sliding pill indicator (`TabsIndicator`)
   - [x] Horizontal drag-to-scroll with `snap-none` during active drag
   - [x] Frosted edge dissolution masks (`getMaskImage`) and floating nav arrows
   - [x] Coarse pointer touch height (`pointer-coarse:min-h-11` >= 44px)

8. **Select & Dropdown Menu (`select.tsx`, `dropdown-menu.tsx`):**
   - [x] Full keyboard navigation and focus management via Base UI
   - [x] Selection checkmark indicator logically positioned at `end-2.5`
   - [x] Mobile touch item height (`pointer-coarse:min-h-11` >= 44px)

---

## Component Audit Verification Checklist

Before considering a component complete, verify:

```bash
# 1. Typecheck the UI package and Storybook
rtk proxy pnpm --filter @perpix/ui typecheck
rtk proxy pnpm --filter perpix-storybook typecheck

# 2. Run unit and automated component audit tests
rtk proxy pnpm --filter @perpix/ui test

# 3. Synchronize the codebase graph
graphify update .
```
