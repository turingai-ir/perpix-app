import { useMemo } from "react";
import { Image as KonvaImage, Layer, Shape, Stage } from "react-konva";
import { useImageStageSize } from "../_hooks/use-image-stage-size";
import { useLoadedImage } from "../_hooks/use-loaded-image";

export interface ImageEditorProps {
  src: string;
}

function createCheckerboardPattern(): HTMLCanvasElement {
  const squareSize = 12;
  const patternSize = squareSize * 2;
  const patternCanvas = document.createElement("canvas");
  const patternContext = patternCanvas.getContext("2d");

  patternCanvas.width = patternSize;
  patternCanvas.height = patternSize;
  if (!patternContext) return patternCanvas;

  patternContext.fillStyle = "#f5f5f5";
  patternContext.fillRect(0, 0, patternSize, patternSize);
  patternContext.fillStyle = "#d4d4d4";
  patternContext.fillRect(0, 0, squareSize, squareSize);
  patternContext.fillRect(squareSize, squareSize, squareSize, squareSize);
  return patternCanvas;
}

export function ImageEditor({ src }: ImageEditorProps) {
  const image = useLoadedImage(src);
  const { containerRef, stageSize } = useImageStageSize(image);
  const checkerboardPattern = useMemo(() => createCheckerboardPattern(), []);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="ویرایش تصویر"
      className="flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950 p-4"
    >
      {image && stageSize ? (
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            <Shape
              width={stageSize.width}
              height={stageSize.height}
              sceneFunc={(context) => {
                const pattern = context.createPattern(
                  checkerboardPattern,
                  "repeat",
                );
                if (!pattern) return;
                context.fillStyle = pattern;
                context.fillRect(0, 0, stageSize.width, stageSize.height);
              }}
              listening={false}
            />
            <KonvaImage
              image={image}
              width={stageSize.width}
              height={stageSize.height}
              draggable
            />
          </Layer>
        </Stage>
      ) : null}
    </div>
  );
}
