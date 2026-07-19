import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import type Konva from "konva";
import type { CropArea } from "../_model/crop-area";
import type { AlignmentGuide } from "../_model/image-alignment";
import { CheckerboardBackground } from "./checkerboard-background";
import { ImageAlignmentGuides } from "./image-alignment-guides";
import { ImageCropOverlay } from "./image-crop-overlay";
import { EditorGridLayer } from "./editor-grid-layer";
import { EditorRulerLayer } from "./editor-ruler-layer";
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
  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) props.onDeselectImage();
      }}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) props.onDeselectImage();
      }}
    >
      <EditorGridLayer
        stageSize={props.stageSize}
        cardPosition={props.cardPosition}
      />
      <Layer>
        <CheckerboardBackground {...props.cardPosition} {...props.imageSize} />
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
          onClearAlignmentGuides={props.onClearAlignmentGuides}
          onSelect={props.onSelectImage}
          stageSize={props.stageSize}
        />
        {!props.isCropping ? (
          <ImageAlignmentGuides
            guides={props.alignmentGuides}
            stageHeight={height}
            stageWidth={width}
          />
        ) : (
          <ImageCropOverlay
            bounds={imageBounds}
            crop={props.displayedCrop}
            fixedRatio={props.fixedRatio}
            onChange={props.onCropChange}
          />
        )}
      </Layer>
      <EditorRulerLayer
        stageRef={stageRef}
        stageSize={props.stageSize}
        cardPosition={props.cardPosition}
      />
    </Stage>
  );
}
