import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { useRef } from "react";
import { zoomAtom, panAtom, activeToolAtom } from "./store";
import Konva from "konva";

export function useZoomPan() {
  const [zoom, setZoom] = useAtom(zoomAtom);
  const setPan = useSetAtom(panAtom);
  const activeTool = useAtomValue(activeToolAtom);
  const lastDist = useRef<number | null>(null);
  const lastCenter = useRef<{ x: number; y: number } | null>(null);

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (activeTool !== "none") return;
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = zoom;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const boundedScale = Math.max(0.1, Math.min(10, newScale));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    setZoom(boundedScale);
    setPan({
      x: pointer.x - mousePointTo.x * boundedScale,
      y: pointer.y - mousePointTo.y * boundedScale,
    });
  };

  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (activeTool !== "none" || e.evt.touches.length !== 2) return;
    const t1 = e.evt.touches[0];
    const t2 = e.evt.touches[1];
    lastDist.current = Math.hypot(
      t1.clientX - t2.clientX,
      t1.clientY - t2.clientY,
    );
    lastCenter.current = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
  };

  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    if (
      activeTool !== "none" ||
      e.evt.touches.length !== 2 ||
      !lastDist.current ||
      !lastCenter.current
    )
      return;
    const stage = e.target.getStage();
    if (!stage) return;

    const t1 = e.evt.touches[0];
    const t2 = e.evt.touches[1];
    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    const center = {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };

    const oldScale = zoom;
    const scaleFactor = dist / lastDist.current;
    const newScale = Math.max(0.1, Math.min(10, oldScale * scaleFactor));

    const centerPointTo = {
      x: (lastCenter.current.x - stage.x()) / oldScale,
      y: (lastCenter.current.y - stage.y()) / oldScale,
    };

    setZoom(newScale);
    setPan({
      x: center.x - centerPointTo.x * newScale,
      y: center.y - centerPointTo.y * newScale,
    });

    lastDist.current = dist;
    lastCenter.current = center;
  };

  const handleTouchEnd = () => {
    lastDist.current = null;
    lastCenter.current = null;
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (activeTool !== "none") return;
    setPan({ x: e.target.x(), y: e.target.y() });
  };

  return {
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDragEnd,
  };
}
