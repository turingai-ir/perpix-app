import { useMemo } from "react";
import { Shape } from "react-konva";

export function CheckerboardBackground(props: {
  height: number;
  width: number;
  x?: number;
  y?: number;
}) {
  const patternCanvas = useMemo(() => createCheckerboardPattern(), []);
  return (
    <Shape
      {...props}
      sceneFunc={(context) => {
        const pattern = context.createPattern(patternCanvas, "repeat");
        if (!pattern) return;
        context.fillStyle = pattern;
        context.fillRect(0, 0, props.width, props.height);
      }}
      listening={false}
    />
  );
}

function createCheckerboardPattern(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 24;
  canvas.height = 24;
  if (!context) return canvas;
  context.fillStyle = "#f5f5f5";
  context.fillRect(0, 0, 24, 24);
  context.fillStyle = "#d4d4d4";
  context.fillRect(0, 0, 12, 12);
  context.fillRect(12, 12, 12, 12);
  return canvas;
}
