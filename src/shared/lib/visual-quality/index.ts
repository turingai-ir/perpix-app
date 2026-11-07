import {
  applyVisualQuality,
  resolveVisualQuality,
  storeVisualQuality,
} from "./quality";
import { watchScrollSmoothness } from "./scroll-smoothness";

export type { VisualQuality } from "./quality";

// Only an automatic "full" decision can still be revised by measurement.
let canDowngrade = false;

/**
 * Sets `<html data-fx>` before the first render so heavy glass effects only
 * run on devices that keep scrolling smooth.
 */
export function initVisualQuality() {
  const { tier, isForced } = resolveVisualQuality();
  applyVisualQuality(tier);
  canDowngrade = tier === "full" && !isForced;
}

/**
 * Measures scrolling of the viewport that hosts the heavy effects and moves
 * to the lite tier when it janks. Call it from the surface that pays for the
 * effects, so slow scrolling elsewhere never affects the decision.
 */
export function monitorScrollQuality(viewport: HTMLElement): () => void {
  if (!canDowngrade) return () => {};

  return watchScrollSmoothness(viewport, () => {
    canDowngrade = false;
    applyVisualQuality("lite");
    storeVisualQuality({ tier: "lite", source: "auto", at: Date.now() });
  });
}
