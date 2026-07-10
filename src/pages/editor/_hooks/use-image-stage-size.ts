import { useEffect, useRef, useState } from "react";

interface ImageStageSize {
  height: number;
  width: number;
}

interface ImageStageLayout {
  containerRef: React.RefObject<HTMLDivElement | null>;
  stageSize: ImageStageSize | null;
}

export function useImageStageSize(
  image: HTMLImageElement | null,
): ImageStageLayout {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableSize, setAvailableSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setAvailableSize({
        height: entry.contentRect.height,
        width: entry.contentRect.width,
      });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  if (!image || !availableSize.width || !availableSize.height) {
    return { containerRef, stageSize: null };
  }

  const scale = Math.min(
    1,
    availableSize.width / image.naturalWidth,
    availableSize.height / image.naturalHeight,
  );

  return {
    containerRef,
    stageSize: {
      height: image.naturalHeight * scale,
      width: image.naturalWidth * scale,
    },
  };
}
