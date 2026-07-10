import { useEffect, useState } from "react";

interface ImageStageSize {
  height: number;
  width: number;
}

interface ImageStageLayout {
  imageSize: ImageStageSize | null;
  stageSize: ImageStageSize | null;
}

export function useImageStageSize(
  image: HTMLImageElement | null,
  contentSize?: { height: number; width: number } | null,
  containerRef?: React.RefObject<HTMLDivElement | null>,
): ImageStageLayout {
  const [availableSize, setAvailableSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setAvailableSize({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [containerRef]);

  if (!image || !availableSize.width || !availableSize.height) {
    return { imageSize: null, stageSize: null };
  }

  const contentWidth = contentSize?.width ?? image.naturalWidth;
  const contentHeight = contentSize?.height ?? image.naturalHeight;
  const scale = Math.min(
    1,
    Math.max(1, availableSize.width - 32) / contentWidth,
    Math.max(1, availableSize.height - 128) / contentHeight,
  );

  return {
    imageSize: {
      height: contentHeight * scale,
      width: contentWidth * scale,
    },
    stageSize: availableSize,
  };
}
