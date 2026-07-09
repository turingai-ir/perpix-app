import { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import { useAtom, useAtomValue } from "jotai";
import * as store from "../_hooks/store";
import { useZoomPan } from "../_hooks/use-zoom-pan";
import { useContainerSize } from "../_hooks/use-container-size";
import Konva from "konva";
import { EditorCanvasImage } from "./editor-canvas-image";
import { useEditorCanvasLayout } from "../_hooks/use-editor-canvas-layout";
import { useEditorImageElement } from "../_hooks/use-editor-image-element";
import { useEditorKonvaFilters } from "../_hooks/use-editor-konva-filters";
import { useEditorCropInitializer } from "../_hooks/use-editor-crop-initializer";

export function EditorCanvas() {
  const srcImage = useAtomValue(store.srcImageAtom);
  const activeTool = useAtomValue(store.activeToolAtom);
  const filters = useAtomValue(store.filtersAtom);
  const zoom = useAtomValue(store.zoomAtom);
  const pan = useAtomValue(store.panAtom);
  const currentDim = useAtomValue(store.currentDimensionsAtom);
  const [cropConfig, setCropConfig] = useAtom(store.cropConfigAtom);
  const imgEl = useEditorImageElement(srcImage);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const size = useContainerSize(containerRef);
  const zp = useZoomPan();
  const kFilters = useEditorKonvaFilters(filters);
  const imageLayout = useEditorCanvasLayout(
    size,
    imgEl ? { width: imgEl.width, height: imgEl.height } : null,
  );
  useEditorCropInitializer({
    activeTool,
    cropConfig,
    currentDimensions: currentDim,
    imageElement: imgEl,
    setCropConfig,
  });

  useEffect(() => {
    if (imageRef.current && imgEl) {
      try {
        imageRef.current.clearCache();
        imageRef.current.cache();
        imageRef.current.getLayer()?.batchDraw();
      } catch {
        // Konva can reject cache updates for transient image states.
      }
    }
  }, [filters, imgEl]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-1 touch-none items-center justify-center overflow-hidden bg-neutral-900"
    >
      <Stage
        width={size.width}
        height={size.height}
        scaleX={activeTool === "crop" ? 1 : zoom}
        scaleY={activeTool === "crop" ? 1 : zoom}
        x={activeTool === "crop" ? 0 : pan.x}
        y={activeTool === "crop" ? 0 : pan.y}
        draggable={activeTool === "none"}
        onWheel={zp.handleWheel}
        onTouchStart={zp.handleTouchStart}
        onTouchMove={zp.handleTouchMove}
        onTouchEnd={zp.handleTouchEnd}
        onDragEnd={zp.handleDragEnd}
      >
        <Layer>
          {imgEl && imageLayout && (
            <EditorCanvasImage
              imageRef={imageRef}
              image={imgEl}
              x={imageLayout.imageX}
              y={imageLayout.imageY}
              width={imageLayout.imageWidth}
              height={imageLayout.imageHeight}
              filters={kFilters}
              brightness={filters.brightness}
              contrast={filters.contrast}
              blurRadius={filters.blur}
              showCropOverlay={activeTool === "crop" && cropConfig.width > 0}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
