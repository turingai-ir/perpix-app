import { useEffect, useRef } from "react";

interface InitialZoomOptions {
  stageSize: { width: number; height: number } | null;
  imageSize: { width: number; height: number } | null;
  cardPosition: { x: number; y: number };
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
}

export function useInitialZoomResets({
  stageSize,
  imageSize,
  cardPosition,
  setZoom,
  setPan,
}: InitialZoomOptions): void {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (stageSize && imageSize && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const isMobile = stageSize.width < 640;
      const initialZoom = isMobile ? 0.7 : 1.0;
      setZoom(initialZoom);

      const cardCenterX = cardPosition.x + imageSize.width / 2;
      const cardCenterY = cardPosition.y + imageSize.height / 2;
      setPan({
        x: stageSize.width / 2 - cardCenterX * initialZoom,
        y: stageSize.height / 2 - cardCenterY * initialZoom,
      });
    }
  }, [stageSize, imageSize, cardPosition, setZoom, setPan]);
}
