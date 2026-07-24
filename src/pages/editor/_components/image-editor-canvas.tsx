import { useRef } from "react";
import { useAtomValue } from "jotai";
import { Group, Layer, Stage } from "react-konva";
import type Konva from "konva";
import type { CropArea } from "../_model/crop-area";
import type { AlignmentGuide } from "../_model/image-alignment";
import { CheckerboardBackground } from "./checkerboard-background";
import { ImageAlignmentGuides } from "./image-alignment-guides";
import { ImageCropOverlay } from "./image-crop-overlay";
import { EditorGridLayer } from "./editor-grid-layer";
import { EditorRulerLayer } from "./editor-ruler-layer";
import { zoomAtom, panAtom } from "../_model/editor-settings";
import { useCanvasWheel } from "../_hooks/use-canvas-wheel";
import { useCanvasTouchPan } from "../_hooks/use-canvas-touch-pan";
import {
  EditorCanvasImage,
  type CanvasDragMoveHandler,
} from "./editor-canvas-image";

interface ImageEditorCanvasProps {
  appliedCrop: CropArea;
  alignmentGuides: AlignmentGuide[];
  cardPosition: { x: number; y: number };
  displayedCrop: CropArea;
  fixedRatio: boolean;
  image: HTMLImageElement;
  imagePosition: { x: number; y: number };
  isCropping: boolean;
  isImageSelected: boolean;
  onCropChange: (crop: CropArea) => void;
  onClearAlignmentGuides: () => void;
  onDeselectImage: () => void;
  onImageDragEnd: (position: { x: number; y: number }) => void;
  onImageDragMove: CanvasDragMoveHandler;
  onSelectImage: () => void;
  imageSize: { height: number; width: number };
  stageSize: { height: number; width: number };
}

export function ImageEditorCanvas(props: ImageEditorCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const { height, width } = props.stageSize;
  const imageBounds = { ...props.imagePosition, ...props.imageSize };

  const zoom = useAtomValue(zoomAtom);
  const pan = useAtomValue(panAtom);

  useCanvasWheel(stageRef, width, height);
  const touchPan = useCanvasTouchPan(props.onDeselectImage);
  const translatedGuides = props.alignmentGuides.map((guide) => ({
    ...guide,
    position:
      guide.orientation === "vertical"
        ? pan.x + guide.position * zoom
        : pan.y + guide.position * zoom,
  }));

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={touchPan.onMouseDown}
      onMouseMove={touchPan.onMouseMove}
      onMouseUp={touchPan.onMouseUp}
      onTouchStart={touchPan.onTouchStart}
      onTouchMove={touchPan.onTouchMove}
      onTouchEnd={touchPan.onTouchEnd}
    >
      <Layer>
        <EditorGridLayer
          stageSize={props.stageSize}
          cardPosition={props.cardPosition}
        />
        <Group scaleX={zoom} scaleY={zoom} x={pan.x} y={pan.y}>
          <CheckerboardBackground
            {...props.cardPosition}
            {...props.imageSize}
          />
          <EditorCanvasImage
            appliedCrop={props.appliedCrop}
            cardPosition={props.cardPosition}
            image={props.image}
            imagePosition={props.imagePosition}
            imageSize={props.imageSize}
            isCropping={props.isCropping}
            isSelected={props.isImageSelected}
            onDragEnd={props.onImageDragEnd}
            onDragMove={props.onImageDragMove}
            onSelect={props.onSelectImage}
            onClearAlignmentGuides={props.onClearAlignmentGuides}
            stageSize={props.stageSize}
          />
          {props.isCropping && (
            <ImageCropOverlay
              bounds={imageBounds}
              crop={props.displayedCrop}
              fixedRatio={props.fixedRatio}
              onChange={props.onCropChange}
            />
          )}
        </Group>
        {!props.isCropping && (
          <ImageAlignmentGuides
            guides={translatedGuides}
            stageHeight={height}
            stageWidth={width}
          />
        )}
        <EditorRulerLayer
          stageRef={stageRef}
          stageSize={props.stageSize}
          cardPosition={props.cardPosition}
        />
      </Layer>
    </Stage>
  );
}
