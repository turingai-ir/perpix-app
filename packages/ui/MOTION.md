# PerPix motion standard

Motion should feel native on mobile, soft, and light. The UI uses CSS only and has no animation
library. GSAP belongs to the canvas studio and never to `packages/ui`.

## Principles

1. **Animate only `transform`, `translate` and `opacity`.** They run on the GPU. Never animate blur,
   `backdrop-filter`, shadows, width, height or layout.
2. **Use transitions, not keyframes, for UI state.** A transition can be interrupted. Reopening a
   menu mid-close reverses it smoothly from where it is, and this is most of the "iOS feel".
3. **Start from the source.** Menus, popovers and tooltips scale from their trigger. Base UI sets
   `--transform-origin`, and `motion-pop` uses it.
4. **Exit faster than you enter.** The user should never wait for something to leave.
5. **Respond to every touch.** Tappable controls use `pressable`, which presses in to 97% for 100ms.
6. **Keep motion scarce.** No list stagger, no bouncy springs and no decorative motion.

## Tokens

The values live in `src/styles/tokens.css` and `theme.css`. Use the tokens, never raw values.

| Use | Duration | Easing |
|---|---|---|
| Tap feedback | `--duration-tap` 100ms | `--ease-enter` |
| Hover or colour change | `--duration-press` 150ms | `--ease-enter` |
| Any layer closing | `--duration-exit` 160ms | `--ease-exit` |
| Menu, popover, dialog opening | `--duration-enter` 260ms | `--ease-enter` (out-quint) |
| Sheet or drawer | `--duration-sheet` 320ms | `--ease-spring` (`linear()` spring, ~3% overshoot) |
| Page change | `--duration-page` 380ms | `--ease-enter` |

## Utilities

| Class | For |
|---|---|
| `motion-fade` | Backdrops and scrims |
| `motion-pop` | Menu, popover, tooltip, dialog (scale and fade from the anchor) |
| `motion-sheet` | Sheets, sliding from `data-side`, with spring enter and drag support |
| `pressable` | Tap feedback on buttons and tappable rows |
| `focus-ring` | Visible keyboard focus (an outline, so it survives forced colours) |

These utilities work with Base UI's `data-starting-style` and `data-ending-style`, so a component
needs no JavaScript for its enter and exit motion.

## Gestures

- **Bottom sheets** dismiss with a downward swipe. `useSheetDrag` is built into `SheetContent` with
  `side="bottom"`. A sheet closes when it is dragged past 30% of its height (at least 80px) or flicked faster than
  0.5px/ms. Otherwise it springs back. Escape and the close button remain the keyboard and
  screen-reader path.
- **Carousels** use native `scroll-snap`. Sheet bodies use `overscroll-behavior: contain` so the
  page behind does not scroll.

## Page transitions

- **Route changes:** use React Router's `viewTransition` prop on `Link` or `navigate`.
- **Other state changes:** use `withViewTransition(update)` from `@perpix/ui/lib/view-transition`.
- **The default:** a short cross-fade with a slight rise.
- **Shared elements:** give an element the same `view-transition-name` on both pages (for example, a
  gallery card and its detail image) so it morphs between them.
- **Browsers without the API:** the content swaps instantly.

## Accessibility

- **Reduced motion:** every movement is removed and a short fade remains, so the change of state is
  still visible.
- **Focus and input:** motion never blocks them. Controls are usable from the first frame.
- **Gestures:** each gesture has a non-gesture equivalent, such as a button or Escape.

## Canvas studio (not in this package)

- **Effects tied to video time** (captions, scrubbing, export): use GSAP timelines. They can be
  seeked with `tl.seek(t)`, and they tween Konva node properties directly, followed by
  `layer.batchDraw()`.
- **Continuous loops:** use `Konva.Animation`.
- **Never set React state per frame.** While the studio plays, scrubs or drags, put
  `data-canvas-busy` on its root so that glass layers drop their backdrop blur.
