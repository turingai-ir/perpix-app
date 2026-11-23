import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";

/* Dismiss when dragged past this share of the sheet's height, or flicked faster than this (px/ms). */
const DISMISS_RATIO = 0.3;
const DISMISS_VELOCITY = 0.5;
/* Short sheets still need a deliberate pull before they close. */
const MIN_DISMISS_DISTANCE = 80;
/* Dragging up past the rest position moves the sheet at this fraction of the finger (rubber band). */
const OVERDRAG = 0.2;

type DragState = {
  pointerId: number;
  startY: number;
  lastY: number;
  lastTime: number;
  velocity: number;
};

/**
 * Swipe-down-to-dismiss for a bottom sheet. Spread the returned handlers on the grab area (not the
 * scrolling body). The finger offset is written to the `translate` property so it composes with the
 * sheet's enter/exit `transform`; releasing either springs back or calls `onDismiss`.
 * Keyboard and screen-reader users close the sheet with Escape or the close button.
 */
export function useSheetDrag(
  sheetRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const drag = useRef<DragState | null>(null);

  const setOffset = (offset: number) => {
    sheetRef.current?.style.setProperty(
      "translate",
      offset ? `0 ${offset}px` : "",
    );
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !sheetRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    sheetRef.current.toggleAttribute("data-dragging", true);
    const now = performance.now();
    drag.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: now,
      velocity: 0,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const now = performance.now();
    state.velocity =
      (event.clientY - state.lastY) / Math.max(now - state.lastTime, 1);
    state.lastY = event.clientY;
    state.lastTime = now;
    const delta = event.clientY - state.startY;
    setOffset(delta > 0 ? delta : delta * OVERDRAG);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current;
    const sheet = sheetRef.current;
    if (!state || state.pointerId !== event.pointerId || !sheet) return;
    drag.current = null;
    sheet.removeAttribute("data-dragging");
    const delta = event.clientY - state.startY;
    const flicked = delta > 12 && state.velocity > DISMISS_VELOCITY;
    const distance = Math.max(
      sheet.offsetHeight * DISMISS_RATIO,
      MIN_DISMISS_DISTANCE,
    );
    const dismiss = delta > distance || flicked;
    if (dismiss) {
      onDismiss();
      return;
    }
    setOffset(0);
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
  };
}
