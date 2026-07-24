import { useRef } from "react";
import { useAtom } from "jotai";
import type Konva from "konva";
import { zoomAtom, panAtom } from "../_model/editor-settings";

interface TouchPanHandlers {
  onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onMouseUp: () => void;
  onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  onTouchEnd: () => void;
}

export function useCanvasTouchPan(onDeselect: () => void): TouchPanHandlers {
  const [zoom, setZoom] = useAtom(zoomAtom);
  const [pan, setPan] = useAtom(panAtom);

  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  const lastDistRef = useRef(0);

  const startDrag = (pos: { x: number; y: number }) => {
    isPanningRef.current = true;
    startPanRef.current = { x: pos.x - pan.x, y: pos.y - pan.y };
  };

  const updateDrag = (pos: { x: number; y: number }) => {
    if (!isPanningRef.current) return;
    setPan({
      x: pos.x - startPanRef.current.x,
      y: pos.y - startPanRef.current.y,
    });
  };

  return {
    onMouseDown: (e) => {
      if (e.target === e.currentTarget) {
        onDeselect();
        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) startDrag(pos);
      }
    },
    onMouseMove: (e) => {
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) updateDrag(pos);
    },
    onMouseUp: () => {
      isPanningRef.current = false;
    },
    onTouchStart: (e) => {
      const stage = e.target.getStage();
      if (!stage) return;
      if (e.target === e.currentTarget) onDeselect();

      const touches = e.evt.touches;
      if (touches.length === 1 && e.target === e.currentTarget) {
        const pos = stage.getPointerPosition();
        if (pos) startDrag(pos);
      } else if (touches.length === 2) {
        isPanningRef.current = false;
        const p1 = { x: touches[0].clientX, y: touches[0].clientY };
        const p2 = { x: touches[1].clientX, y: touches[1].clientY };
        lastDistRef.current = Math.sqrt(
          (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2,
        );
      }
    },
    onTouchMove: (e) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const touches = e.evt.touches;
      if (touches.length === 1 && isPanningRef.current) {
        const pos = stage.getPointerPosition();
        if (pos) updateDrag(pos);
      } else if (touches.length === 2) {
        e.evt.preventDefault();
        const p1 = { x: touches[0].clientX, y: touches[0].clientY };
        const p2 = { x: touches[1].clientX, y: touches[1].clientY };
        const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

        if (lastDistRef.current > 0) {
          const scale = zoom * (dist / lastDistRef.current);
          const clampedScale = Math.max(0.1, Math.min(scale, 10));
          const mousePointTo = {
            x: (midPoint.x - pan.x) / zoom,
            y: (midPoint.y - pan.y) / zoom,
          };

          setZoom(clampedScale);
          setPan({
            x: midPoint.x - mousePointTo.x * clampedScale,
            y: midPoint.y - mousePointTo.y * clampedScale,
          });
        }
        lastDistRef.current = dist;
      }
    },
    onTouchEnd: () => {
      isPanningRef.current = false;
      lastDistRef.current = 0;
    },
  };
}
