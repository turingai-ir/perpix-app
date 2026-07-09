import { useEffect, useRef } from "react";
import { Rect, Transformer, Group } from "react-konva";
import { useAtom, useAtomValue } from "jotai";
import * as store from "../_hooks/store";
import Konva from "konva";

interface CropOverlayProps {
  imageWidth: number;
  imageHeight: number;
}

export function CropOverlay({ imageWidth, imageHeight }: CropOverlayProps) {
  const [cropConfig, setCropConfig] = useAtom(store.cropConfigAtom);
  const currentDim = useAtomValue(store.currentDimensionsAtom);
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const scaleX = imageWidth / currentDim.width;
  const scaleY = imageHeight / currentDim.height;
  const x = cropConfig.x * scaleX,
    y = cropConfig.y * scaleY;
  const w = cropConfig.width * scaleX,
    h = cropConfig.height * scaleY;

  useEffect(() => {
    if (shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [cropConfig.aspect]);

  const handleTransform = () => {
    const n = shapeRef.current;
    if (!n) return;
    const sx = n.scaleX(),
      sy = n.scaleY();
    n.scaleX(1);
    n.scaleY(1);
    setCropConfig((p) => ({
      ...p,
      x: Math.max(0, n.x()) / scaleX,
      y: Math.max(0, n.y()) / scaleY,
      width: Math.min(imageWidth - n.x(), n.width() * sx) / scaleX,
      height: Math.min(imageHeight - n.y(), n.height() * sy) / scaleY,
    }));
  };

  const handleDrag = () => {
    const n = shapeRef.current;
    if (!n) return;
    const newX = Math.max(0, Math.min(imageWidth - n.width(), n.x()));
    const newY = Math.max(0, Math.min(imageHeight - n.height(), n.y()));
    n.x(newX);
    n.y(newY);
    setCropConfig((p) => ({ ...p, x: newX / scaleX, y: newY / scaleY }));
  };

  const masks = [
    { x: 0, y: 0, w: imageWidth, h: y },
    { x: 0, y, w: x, h },
    { x: x + w, y, w: imageWidth - (x + w), h },
    { x: 0, y: y + h, w: imageWidth, h: imageHeight - (y + h) },
  ];

  const anchors =
    cropConfig.aspect !== null
      ? ["top-left", "top-right", "bottom-left", "bottom-right"]
      : [
          "top-left",
          "top-center",
          "top-right",
          "middle-right",
          "bottom-right",
          "bottom-center",
          "bottom-left",
          "middle-left",
        ];

  return (
    <Group>
      {masks.map((m, i) => (
        <Rect
          key={i}
          x={m.x}
          y={m.y}
          width={m.w}
          height={m.h}
          fill="rgba(0,0,0,0.5)"
        />
      ))}
      <Rect
        ref={shapeRef}
        x={x}
        y={y}
        width={w}
        height={h}
        stroke="#ffffff"
        strokeWidth={2}
        dash={[4, 4]}
        draggable
        onDragMove={handleDrag}
        onTransform={handleTransform}
      />
      <Transformer
        ref={trRef}
        keepRatio={cropConfig.aspect !== null}
        enabledAnchors={anchors}
        rotateEnabled={false}
        borderStroke="#3b82f6"
        anchorStroke="#3b82f6"
        anchorFill="#ffffff"
        anchorSize={8}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 30 || newBox.height < 30) return oldBox;
          const insideW =
            newBox.x + newBox.width <= imageWidth && newBox.x >= 0;
          const insideH =
            newBox.y + newBox.height <= imageHeight && newBox.y >= 0;
          return insideW && insideH ? newBox : oldBox;
        }}
      />
    </Group>
  );
}
