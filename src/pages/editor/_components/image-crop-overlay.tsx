import { useEffect, useRef } from "react";
import { Group, Rect, Transformer } from "react-konva";
import type Konva from "konva";
import type { CropArea } from "../_model/crop-area";
import { CropShade } from "./crop-shade";

interface ImageCropOverlayProps {
  bounds: CropArea;
  crop: CropArea;
  fixedRatio: boolean;
  onChange: (crop: CropArea) => void;
}

export function ImageCropOverlay(props: ImageCropOverlayProps) {
  const cropNodeRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const { bounds, crop, fixedRatio, onChange } = props;

  useEffect(() => {
    if (!cropNodeRef.current || !transformerRef.current) return;
    transformerRef.current.nodes([cropNodeRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, []);

  const updateCrop = () => {
    const node = cropNodeRef.current;
    if (!node) return;
    const width = node.width() * node.scaleX();
    const height = node.height() * node.scaleY();
    node.scale({ x: 1, y: 1 });
    onChange({ height, width, x: node.x(), y: node.y() });
  };

  return (
    <Group>
      <CropShade bounds={bounds} crop={crop} />
      <Rect
        ref={cropNodeRef}
        {...crop}
        draggable
        dragBoundFunc={(position) => ({
          x: Math.max(
            bounds.x,
            Math.min(position.x, bounds.x + bounds.width - crop.width),
          ),
          y: Math.max(
            bounds.y,
            Math.min(position.y, bounds.y + bounds.height - crop.height),
          ),
        })}
        onDragEnd={updateCrop}
        onTransform={updateCrop}
        onTransformEnd={updateCrop}
        stroke="#ffffff"
        strokeWidth={2}
      />
      <Transformer
        ref={transformerRef}
        anchorFill="#ffffff"
        anchorStroke="#111827"
        anchorSize={12}
        borderStroke="#ffffff"
        enabledAnchors={
          fixedRatio
            ? ["top-left", "top-right", "bottom-left", "bottom-right"]
            : undefined
        }
        flipEnabled={false}
        ignoreStroke
        keepRatio={fixedRatio}
        rotateEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 24 || newBox.height < 24) return oldBox;
          const tolerance = 1;
          if (
            newBox.x < bounds.x - tolerance ||
            newBox.y < bounds.y - tolerance ||
            newBox.x + newBox.width > bounds.x + bounds.width + tolerance ||
            newBox.y + newBox.height > bounds.y + bounds.height + tolerance
          ) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </Group>
  );
}
