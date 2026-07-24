import { useEffect } from "react";
import { useAtom } from "jotai";
import type Konva from "konva";
import { zoomAtom, panAtom } from "../_model/editor-settings";

export function useCanvasWheel(
  stageRef: React.RefObject<Konva.Stage | null>,
  width: number,
  height: number,
): void {
  const [zoom, setZoom] = useAtom(zoomAtom);
  const [pan, setPan] = useAtom(panAtom);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pointer = stage.getPointerPosition() || {
        x: width / 2,
        y: height / 2,
      };

      if (e.ctrlKey) {
        // Zoom relative to pointer position (Zoom-to-cursor)
        const mousePointTo = {
          x: (pointer.x - pan.x) / zoom,
          y: (pointer.y - pan.y) / zoom,
        };
        const speed = 1.05;
        const newScale = e.deltaY < 0 ? zoom * speed : zoom / speed;
        const clampedScale = Math.max(0.1, Math.min(newScale, 10));

        setZoom(clampedScale);
        setPan({
          x: pointer.x - mousePointTo.x * clampedScale,
          y: pointer.y - mousePointTo.y * clampedScale,
        });
      } else {
        // Panning via scroll wheel
        const panSpeed = 1.0;
        if (e.shiftKey) {
          setPan((p) => ({ ...p, x: p.x - e.deltaY * panSpeed }));
        } else {
          setPan((p) => ({
            x: p.x - e.deltaX * panSpeed,
            y: p.y - e.deltaY * panSpeed,
          }));
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, pan, width, height, stageRef, setZoom, setPan]);
}
