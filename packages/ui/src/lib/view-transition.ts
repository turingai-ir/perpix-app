import { flushSync } from "react-dom";

/**
 * Runs a React state update inside a View Transition (page-level cross-fade, shared elements via
 * `view-transition-name`). Route changes should use React Router's `viewTransition` instead.
 * Falls back to a plain update when the API is missing; reduced motion is handled in theme.css.
 */
export function withViewTransition(update: () => void) {
  if (typeof document === "undefined" || !("startViewTransition" in document)) {
    update();
    return;
  }
  document.startViewTransition(() => {
    flushSync(update);
  });
}
