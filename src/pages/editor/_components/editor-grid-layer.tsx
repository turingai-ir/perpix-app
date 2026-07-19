import { useAtomValue } from "jotai";
import { Layer, Shape } from "react-konva";
import { showGridAtom } from "../_model/editor-settings";

interface EditorGridLayerProps {
  stageSize: { width: number; height: number };
  cardPosition: { x: number; y: number };
}

export function EditorGridLayer({
  stageSize,
  cardPosition,
}: EditorGridLayerProps) {
  const showGrid = useAtomValue(showGridAtom);
  if (!showGrid) return null;

  return (
    <Layer>
      <Shape
        listening={false}
        sceneFunc={(context) => {
          const gridSpacing = 50;
          const width = stageSize.width;
          const height = stageSize.height;

          context.beginPath();
          context.strokeStyle = "rgba(255, 255, 255, 0.08)";
          context.lineWidth = 1;

          // Draw vertical lines
          let startX = cardPosition.x % gridSpacing;
          if (startX < 0) startX += gridSpacing;
          for (let x = startX; x < width; x += gridSpacing) {
            context.moveTo(x + 0.5, 0);
            context.lineTo(x + 0.5, height);
          }

          // Draw horizontal lines
          let startY = cardPosition.y % gridSpacing;
          if (startY < 0) startY += gridSpacing;
          for (let y = startY; y < height; y += gridSpacing) {
            context.moveTo(0, y + 0.5);
            context.lineTo(width, y + 0.5);
          }

          context.stroke();
        }}
      />
    </Layer>
  );
}
