import type Konva from "konva";
import { useCallback, useRef, useState } from "react";
import { getImageAlignmentSnaps } from "./get-image-alignment-snap";
import type { AlignmentGuide } from "../_model/image-alignment";

interface ImageAlignmentSnapOptions {
  imageHeight: number;
  imageWidth: number;
  stageHeight: number;
  stageWidth: number;
}

export function useImageAlignmentSnap({
  imageHeight,
  imageWidth,
  stageHeight,
  stageWidth,
}: ImageAlignmentSnapOptions) {
  const [alignmentGuides, setAlignmentGuides] = useState<AlignmentGuide[]>([]);
  const previousGuides = useRef<AlignmentGuide[]>([]);

  const updateAlignmentGuides = useCallback((nextGuides: AlignmentGuide[]) => {
    if (hasSameGuides(previousGuides.current, nextGuides)) return;
    previousGuides.current = nextGuides;
    setAlignmentGuides(nextGuides);
  }, []);

  const handleImageDragMove = useCallback(
    (event: Konva.KonvaEventObject<DragEvent>) => {
      const imageNode = event.target as Konva.Image;
      const horizontalSnaps = getImageAlignmentSnaps(
        imageNode.x(),
        imageWidth,
        stageWidth,
      );
      const verticalSnaps = getImageAlignmentSnaps(
        imageNode.y(),
        imageHeight,
        stageHeight,
      );

      const horizontalSnap = horizontalSnaps[0];
      const verticalSnap = verticalSnaps[0];
      if (horizontalSnap) imageNode.x(imageNode.x() + horizontalSnap.delta);
      if (verticalSnap) imageNode.y(imageNode.y() + verticalSnap.delta);

      const nextGuides: AlignmentGuide[] = [];
      for (const snap of horizontalSnaps) {
        nextGuides.push({
          orientation: "vertical",
          position: snap.position,
        });
      }
      for (const snap of verticalSnaps) {
        nextGuides.push({
          orientation: "horizontal",
          position: snap.position,
        });
      }
      updateAlignmentGuides(nextGuides);
    },
    [imageHeight, imageWidth, stageHeight, stageWidth, updateAlignmentGuides],
  );

  const clearAlignmentGuides = useCallback(() => {
    updateAlignmentGuides([]);
  }, [updateAlignmentGuides]);

  return { alignmentGuides, clearAlignmentGuides, handleImageDragMove };
}

function hasSameGuides(
  currentGuides: AlignmentGuide[],
  nextGuides: AlignmentGuide[],
): boolean {
  return (
    currentGuides.length === nextGuides.length &&
    currentGuides.every(
      (guide, index) =>
        guide.orientation === nextGuides[index].orientation &&
        guide.position === nextGuides[index].position,
    )
  );
}
