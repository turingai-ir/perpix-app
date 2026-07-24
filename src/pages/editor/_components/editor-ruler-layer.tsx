import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { Group, Line, Shape } from "react-konva";
import type Konva from "konva";
import { showRulerAtom, zoomAtom, panAtom } from "../_model/editor-settings";
import { drawRulers } from "./draw-rulers";

interface EditorRulerLayerProps {
  stageSize: { width: number; height: number };
  cardPosition: { x: number; y: number };
  stageRef: React.RefObject<Konva.Stage | null>;
}

const RULER_SIZE = 20;

export function EditorRulerLayer({
  stageSize,
  cardPosition,
  stageRef,
}: EditorRulerLayerProps) {
  const showRuler = useAtomValue(showRulerAtom);
  const zoom = useAtomValue(zoomAtom);
  const pan = useAtomValue(panAtom);
  const groupRef = useRef<Konva.Group>(null);
  const pointerXRef = useRef<Konva.Line>(null);
  const pointerYRef = useRef<Konva.Line>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !showRuler) return;

    const handleMouseMove = () => {
      const pos = stage.getPointerPosition();
      if (!pos) return;

      if (pointerXRef.current) {
        pointerXRef.current.x(pos.x);
        pointerXRef.current.visible(pos.x >= RULER_SIZE);
      }
      if (pointerYRef.current) {
        pointerYRef.current.y(pos.y);
        pointerYRef.current.visible(pos.y >= RULER_SIZE);
      }
      groupRef.current?.getLayer()?.batchDraw();
    };

    stage.on("mousemove", handleMouseMove);
    return () => {
      stage.off("mousemove", handleMouseMove);
    };
  }, [stageRef, showRuler]);

  if (!showRuler) return null;

  return (
    <Group ref={groupRef}>
      <Shape
        listening={false}
        sceneFunc={(context) => {
          drawRulers(context, stageSize, cardPosition, RULER_SIZE, zoom, pan);
        }}
      />
      <Line
        ref={pointerXRef}
        points={[0, 0, 0, RULER_SIZE]}
        stroke="#ef4444"
        strokeWidth={1}
        listening={false}
        visible={false}
      />
      <Line
        ref={pointerYRef}
        points={[0, 0, RULER_SIZE, 0]}
        stroke="#ef4444"
        strokeWidth={1}
        listening={false}
        visible={false}
      />
    </Group>
  );
}
