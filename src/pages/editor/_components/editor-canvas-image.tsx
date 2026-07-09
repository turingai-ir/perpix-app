import type { ComponentProps, RefObject } from "react";
import { Group, Image as KonvaImage, Rect } from "react-konva";
import Konva from "konva";

import { CropOverlay } from "./crop-overlay";

type EditorImageFilters = NonNullable<ComponentProps<typeof KonvaImage>["filters"]>;

interface EditorCanvasImageProps {
  imageRef: RefObject<Konva.Image | null>;
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  filters: EditorImageFilters;
  brightness: number;
  contrast: number;
  blurRadius: number;
  showCropOverlay: boolean;
}

export function EditorCanvasImage({
  imageRef,
  image,
  x,
  y,
  width,
  height,
  filters,
  brightness,
  contrast,
  blurRadius,
  showCropOverlay,
}: EditorCanvasImageProps) {
  return (
    <Group x={x} y={y}>
      <Rect
        width={width}
        height={height}
        fill="#0a0a0a"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
        shadowColor="black"
        shadowBlur={28}
        shadowOpacity={0.55}
        shadowOffset={{ x: 0, y: 16 }}
      />
      <KonvaImage
        ref={imageRef}
        image={image}
        width={width}
        height={height}
        filters={filters}
        brightness={brightness}
        contrast={contrast}
        blurRadius={blurRadius}
      />
      {showCropOverlay && (
        <CropOverlay imageWidth={width} imageHeight={height} />
      )}
    </Group>
  );
}
