import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

interface DragStart {
  pointerId: number;
  time: number;
  x: number;
}

const SWIPE_DISTANCE = 72;
const SWIPE_VELOCITY = 500;

function movedTowardEnd(offsetX: number) {
  const rtl = document.documentElement.dir === "rtl";
  return rtl ? offsetX > 0 : offsetX < 0;
}

/** Horizontal swipe-to-navigate for the viewer's media frame. */
export function useViewerSwipe({
  disabled,
  hasTarget,
  onMove,
}: {
  disabled: boolean;
  /** Whether a neighbouring file exists in the swipe direction. */
  hasTarget: (delta: number) => boolean;
  onMove: (delta: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const dragX = useMotionValue(0);
  const transform = useMotionTemplate`translate3d(${dragX}px, 0, 0)`;
  const dragStart = useRef<DragStart | undefined>(undefined);

  function settle() {
    setIsDragging(false);
    void animate(dragX, 0, {
      type: "spring",
      duration: shouldReduceMotion ? 0.01 : 0.32,
      bounce: 0,
    });
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0) return;
    if (event.nativeEvent.isTrusted) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    dragStart.current = {
      pointerId: event.pointerId,
      time: performance.now(),
      x: event.clientX,
    };
    setIsDragging(true);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const offsetX = event.clientX - start.x;
    const delta = movedTowardEnd(offsetX) ? 1 : -1;
    dragX.set(hasTarget(delta) ? offsetX : offsetX * 0.22);
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const offsetX = event.clientX - start.x;
    const elapsed = Math.max(performance.now() - start.time, 1);
    dragStart.current = undefined;
    const velocityX = (offsetX / elapsed) * 1000;
    const isSwipe =
      Math.abs(offsetX) >= SWIPE_DISTANCE ||
      Math.abs(velocityX) >= SWIPE_VELOCITY;
    if (!disabled && isSwipe) onMove(movedTowardEnd(offsetX) ? 1 : -1);
    settle();
  }

  function onPointerCancel() {
    dragStart.current = undefined;
    settle();
  }

  return {
    isDragging,
    transform,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
