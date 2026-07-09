import { useMemo } from "react";

interface EditorCanvasSize {
  width: number;
  height: number;
}

interface EditorCanvasLayout {
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
}

export function useEditorCanvasLayout(
  stageSize: EditorCanvasSize,
  imageSize: EditorCanvasSize | null,
): EditorCanvasLayout | null {
  return useMemo(() => {
    if (!imageSize || imageSize.width === 0 || imageSize.height === 0) {
      return null;
    }

    const imageScale = Math.min(
      stageSize.width / imageSize.width,
      stageSize.height / imageSize.height,
    );
    const imageWidth = imageSize.width * imageScale;
    const imageHeight = imageSize.height * imageScale;

    return {
      imageWidth,
      imageHeight,
      imageX: (stageSize.width - imageWidth) / 2,
      imageY: (stageSize.height - imageHeight) / 2,
    };
  }, [imageSize, stageSize.height, stageSize.width]);
}
