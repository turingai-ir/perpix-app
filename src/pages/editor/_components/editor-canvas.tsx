import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Group } from "react-konva";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import * as store from "../_hooks/store";
import { useZoomPan } from "../_hooks/use-zoom-pan";
import { useContainerSize } from "../_hooks/use-container-size";
import { CropOverlay } from "./crop-overlay";
import { loadImage } from "../_services/image-processor";
import { getPresetFilter } from "../_services/filter-effects";
import Konva from "konva";

export function EditorCanvas() {
  const srcImage = useAtomValue(store.srcImageAtom);
  const activeTool = useAtomValue(store.activeToolAtom);
  const filters = useAtomValue(store.filtersAtom);
  const zoom = useAtomValue(store.zoomAtom);
  const pan = useAtomValue(store.panAtom);
  const currentDim = useAtomValue(store.currentDimensionsAtom);
  const setLoading = useSetAtom(store.loadingAtom);
  const [cropConfig, setCropConfig] = useAtom(store.cropConfigAtom);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<Konva.Image>(null);
  const size = useContainerSize(containerRef);
  const zp = useZoomPan();

  useEffect(() => {
    if (!srcImage) return;
    setLoading(true);
    loadImage(srcImage)
      .then((img) => {
        setImgEl(img);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [srcImage, setLoading]);

  useEffect(() => {
    if (imageRef.current && imgEl) {
      try {
        imageRef.current.clearCache();
        imageRef.current.cache();
        imageRef.current.getLayer()?.batchDraw();
      } catch (e) {
        console.warn("Konva cache failed:", e);
      }
    }
  }, [filters, imgEl]);

  useEffect(() => {
    if (activeTool === "crop" && cropConfig.width === 0 && imgEl) {
      setCropConfig({
        aspect: null,
        x: 0,
        y: 0,
        width: currentDim.width,
        height: currentDim.height,
      });
    }
  }, [
    activeTool,
    cropConfig.width,
    imgEl,
    currentDim.width,
    currentDim.height,
    setCropConfig,
  ]);

  if (!srcImage || !imgEl) return null;

  const scale =
    Math.min(size.width / imgEl.width, size.height / imgEl.height) * 0.9;
  const w = imgEl.width * scale,
    h = imgEl.height * scale;
  const x = (size.width - w) / 2,
    y = (size.height - h) / 2;

  const presetFilter = getPresetFilter(filters.preset);
  const kFilters = [
    ...(filters.brightness !== 0 ? [Konva.Filters.Brighten] : []),
    ...(filters.contrast !== 0 ? [Konva.Filters.Contrast] : []),
    ...(filters.blur > 0 ? [Konva.Filters.Blur] : []),
    ...(presetFilter ? [presetFilter] : []),
  ];

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
          <Group x={x} y={y}>
            <KonvaImage
              ref={imageRef}
              image={imgEl}
              width={w}
              height={h}
              filters={kFilters}
              brightness={filters.brightness}
              contrast={filters.contrast}
              blurRadius={filters.blur}
            />
            {activeTool === "crop" && cropConfig.width > 0 && (
              <CropOverlay imageWidth={w} imageHeight={h} />
            )}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}
