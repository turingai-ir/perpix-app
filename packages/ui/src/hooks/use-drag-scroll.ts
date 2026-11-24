import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";

type DragScrollOptions = {
  /** Distance in pixels before a mousedown is considered a drag operation. Defaults to 5. */
  dragThreshold?: number;
  /** Scroll distance in pixels for arrow button step navigation. Defaults to 180. */
  step?: number;
};

type RtlScrollType = "negative" | "positive" | "reverse";
let cachedRtlScrollType: RtlScrollType | null = null;

/**
 * Detects browser-specific scrollLeft behavior in RTL mode.
 * - "negative" (Chromium, Firefox, Safari 16+): 0 is start (right), -maxScroll is end (left).
 * - "positive" (legacy WebKit/iOS Safari): 0 is start (right), +maxScroll is end (left).
 * - "reverse" (rare engines): maxScroll is start (right), 0 is end (left).
 */
export function getRtlScrollType(): RtlScrollType {
  if (cachedRtlScrollType) return cachedRtlScrollType;
  if (typeof document === "undefined") return "negative";

  const div = document.createElement("div");
  div.dir = "rtl";
  div.style.width = "4px";
  div.style.height = "1px";
  div.style.overflow = "scroll";
  div.style.position = "absolute";
  div.style.top = "-9999px";

  const inner = document.createElement("div");
  inner.style.width = "8px";
  inner.style.height = "1px";
  div.appendChild(inner);

  document.body.appendChild(div);

  if (div.scrollLeft > 0) {
    cachedRtlScrollType = "positive";
  } else {
    div.scrollLeft = 1;
    if (div.scrollLeft === 0) {
      cachedRtlScrollType = "negative";
    } else {
      cachedRtlScrollType = "reverse";
    }
  }

  document.body.removeChild(div);
  return cachedRtlScrollType;
}

export function useDragScroll(
  ref: RefObject<HTMLElement | null>,
  options: DragScrollOptions = {},
) {
  const { dragThreshold = 5, step = 180 } = options;

  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return (
        document.documentElement.dir === "rtl" ||
        document.body.dir === "rtl"
      );
    }
    return false;
  });

  const dragInfo = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    isRtl: boolean;
    rtlType: RtlScrollType;
    hasMoved: boolean;
  } | null>(null);

  const wasDraggedRecently = useRef(false);

  // Update overflow boundaries (canScrollStart / canScrollEnd)
  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    const rtl = getComputedStyle(el).direction === "rtl";
    setIsRtl(rtl);

    if (maxScroll <= 2) {
      setCanScrollStart(false);
      setCanScrollEnd(false);
      return;
    }

    if (!rtl) {
      // Standard LTR
      setCanScrollStart(scrollLeft > 3);
      setCanScrollEnd(scrollLeft < maxScroll - 3);
      return;
    }

    // Normalized RTL calculation
    const rtlType = getRtlScrollType();
    let distFromStart = 0;
    let distFromEnd = 0;

    if (rtlType === "negative") {
      // 0 is start (right), -maxScroll is end (left)
      distFromStart = Math.abs(scrollLeft);
      distFromEnd = maxScroll - distFromStart;
    } else if (rtlType === "positive") {
      // 0 is start (right), +maxScroll is end (left)
      distFromStart = scrollLeft;
      distFromEnd = maxScroll - distFromStart;
    } else {
      // reverse: maxScroll is start (right), 0 is end (left)
      distFromStart = maxScroll - scrollLeft;
      distFromEnd = scrollLeft;
    }

    setCanScrollStart(distFromStart > 3);
    setCanScrollEnd(distFromEnd > 3);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateScrollState();
      });
      ro.observe(el);
      for (const child of el.children) {
        ro.observe(child);
      }
    }

    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro?.disconnect();
    };
  }, [ref, updateScrollState]);

  // Pointer drag event handlers for desktop mouse interaction
  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const el = ref.current;
      if (!el) return;

      const rtl = getComputedStyle(el).direction === "rtl";
      const rtlType = rtl ? getRtlScrollType() : "negative";

      dragInfo.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: el.scrollLeft,
        isRtl: rtl,
        rtlType,
        hasMoved: false,
      };
    },
    [ref],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = dragInfo.current;
      const el = ref.current;
      if (!state || !el || state.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - state.startX;

      if (!state.hasMoved) {
        if (Math.abs(deltaX) >= dragThreshold) {
          state.hasMoved = true;
          setIsDragging(true);
          el.toggleAttribute("data-dragging", true);
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            // Ignore capture error if unmounted
          }
        }
      }

      if (state.hasMoved) {
        // Direct manipulation: content under cursor moves 1:1 with mouse movement
        if (!state.isRtl) {
          el.scrollLeft = state.startScrollLeft - deltaX;
        } else {
          if (state.rtlType === "negative") {
            el.scrollLeft = state.startScrollLeft - deltaX;
          } else {
            // positive or reverse WebKit
            el.scrollLeft = state.startScrollLeft + deltaX;
          }
        }
      }
    },
    [dragThreshold, ref],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const state = dragInfo.current;
      const el = ref.current;
      if (!state || state.pointerId !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // ignore
        }
      }

      if (state.hasMoved) {
        wasDraggedRecently.current = true;
        setTimeout(() => {
          wasDraggedRecently.current = false;
        }, 80);
      }

      dragInfo.current = null;
      setIsDragging(false);
      el?.removeAttribute("data-dragging");
    },
    [ref],
  );

  const onClickCapture = useCallback((event: ReactMouseEvent) => {
    // Prevent accidental click/tab-switch when user finished dragging
    if (wasDraggedRecently.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  // Programmatic scroll helpers for navigation arrows (Normalized for RTL engines)
  const scrollStart = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rtl = getComputedStyle(el).direction === "rtl";
    if (!rtl) {
      el.scrollBy({ left: -step, behavior: "smooth" });
      return;
    }

    const rtlType = getRtlScrollType();
    // Scroll towards start (right edge): in "negative" it increases towards 0 (+step).
    // In "positive" it decreases towards 0 (-step).
    const delta = rtlType === "positive" ? -step : step;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, [ref, step]);

  const scrollEnd = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rtl = getComputedStyle(el).direction === "rtl";
    if (!rtl) {
      el.scrollBy({ left: step, behavior: "smooth" });
      return;
    }

    const rtlType = getRtlScrollType();
    // Scroll towards end (left edge): in "negative" it moves towards -maxScroll (-step).
    // In "positive" it moves towards +maxScroll (+step).
    const delta = rtlType === "positive" ? step : -step;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, [ref, step]);

  return {
    canScrollStart,
    canScrollEnd,
    isDragging,
    isRtl,
    scrollStart,
    scrollEnd,
    updateScrollState,
    containerProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
    },
  };
}
