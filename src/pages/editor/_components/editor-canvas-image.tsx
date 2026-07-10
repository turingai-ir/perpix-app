import { Group, Image as KonvaImage, Rect } from "react-konva";
import type { CropArea } from "../_model/crop-area";

export type CanvasDragMoveHandler = NonNullable<
  React.ComponentProps<typeof Group>["onDragMove"]
>;

interface EditorCanvasImageProps {
  appliedCrop: CropArea;
  cardPosition: { x: number; y: number };
  image: HTMLImageElement;
  imagePosition: { x: number; y: number };
  imageSize: { height: number; width: number };
  isCropping: boolean;
  isSelected: boolean;
  onDragEnd: (position: { x: number; y: number }) => void;
  onDragMove: CanvasDragMoveHandler;
  onClearAlignmentGuides: () => void;
  onSelect: () => void;
  stageSize: { height: number; width: number };
}

export function EditorCanvasImage(props: EditorCanvasImageProps) {
  const dragBounds = (position: { x: number; y: number }) => ({
    x: Math.max(
      0,
      Math.min(position.x, props.stageSize.width - props.imageSize.width),
    ),
    y: Math.max(
      0,
      Math.min(position.y, props.stageSize.height - props.imageSize.height),
    ),
  });
  const image = (
    <KonvaImage
      image={props.image}
      crop={props.appliedCrop}
      width={props.imageSize.width}
      height={props.imageSize.height}
    />
  );

  return (
    <Group
      x={props.imagePosition.x}
      y={props.imagePosition.y}
      draggable={!props.isCropping}
      dragBoundFunc={dragBounds}
      onClick={props.onSelect}
      onTap={props.onSelect}
      onDragStart={props.onSelect}
      onDragMove={props.onDragMove}
      onDragEnd={(event) => {
        props.onClearAlignmentGuides();
        props.onDragEnd(event.target.position());
      }}
    >
      <Rect
        width={props.imageSize.width}
        height={props.imageSize.height}
        fill="rgba(0, 0, 0, 0.001)"
      />
      {props.isSelected ? (
        image
      ) : (
        <Group
          clipX={props.cardPosition.x - props.imagePosition.x}
          clipY={props.cardPosition.y - props.imagePosition.y}
          clipWidth={props.imageSize.width}
          clipHeight={props.imageSize.height}
        >
          {image}
        </Group>
      )}
    </Group>
  );
}
