import { useAtomValue } from "jotai";
import { Group, Shape } from "react-konva";
import { showGridAtom, zoomAtom, panAtom } from "../_model/editor-settings";

interface EditorGridLayerProps {
  stageSize: { width: number; height: number };
  cardPosition: { x: number; y: number };
}

export function EditorGridLayer({
  stageSize,
  cardPosition,
}: EditorGridLayerProps) {
  const showGrid = useAtomValue(showGridAtom);
  const zoom = useAtomValue(zoomAtom);
  const pan = useAtomValue(panAtom);

  if (!showGrid) return null;

  return (
    <Group>
      <Shape
        listening={false}
        sceneFunc={(context) => {
          let interval = 50;
          if (zoom < 0.2) interval = 200;
          else if (zoom < 0.5) interval = 100;

          const gridSpacing = interval * zoom;
          const width = stageSize.width;
          const height = stageSize.height;

          context.beginPath();
          context.strokeStyle = "rgba(255, 255, 255, 0.08)";
          context.lineWidth = 1;

          // Draw vertical lines
          const startXVal = pan.x + cardPosition.x * zoom;
          let startX = startXVal % gridSpacing;
          if (startX < 0) startX += gridSpacing;
          for (let x = startX; x < width; x += gridSpacing) {
            context.moveTo(Math.round(x) + 0.5, 0);
            context.lineTo(Math.round(x) + 0.5, height);
          }

          // Draw horizontal lines
          const startYVal = pan.y + cardPosition.y * zoom;
          let startY = startYVal % gridSpacing;
          if (startY < 0) startY += gridSpacing;
          for (let y = startY; y < height; y += gridSpacing) {
            context.moveTo(0, Math.round(y) + 0.5);
            context.lineTo(width, Math.round(y) + 0.5);
          }

          context.stroke();
        }}
      />
    </Group>
  );
}
