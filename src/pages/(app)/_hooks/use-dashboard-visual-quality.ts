import { useEffect, type RefObject } from "react";

import { monitorScrollQuality } from "@/lib/visual-quality";

/**
 * The dashboard owns the heavy glass effects, so it alone measures scrolling
 * to decide whether this device should drop to the lite visual tier.
 */
export function useDashboardVisualQuality(
  pageRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const viewport = pageRef.current?.closest<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!viewport) return;
    return monitorScrollQuality(viewport);
  }, [pageRef]);
}
