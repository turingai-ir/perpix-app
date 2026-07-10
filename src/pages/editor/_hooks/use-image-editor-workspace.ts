import { useState, type RefObject } from "react";
import { useImageAlignmentSnap } from "./use-image-alignment-snap";
import { useImageCrop } from "./use-image-crop";
import { useImageStageSize } from "./use-image-stage-size";
import {
  denormalizeCrop,
  denormalizePosition,
  getCenteredPosition,
  normalizeCrop,
  normalizePosition,
  type CropArea,
  type CropDisplayOrigin,
} from "../_model/crop-area";
import type { CropRatioId } from "../_model/crop-ratios";
import type { ImageEditorWorkspaceViewModel } from "./image-editor-workspace-types";

const ZERO_POSITION: CropDisplayOrigin = { x: 0, y: 0 };
const ZERO_SIZE = { height: 0, width: 0 };

export function useImageEditorWorkspace(
  image: HTMLImageElement,
  containerRef: RefObject<HTMLDivElement | null>,
): ImageEditorWorkspaceViewModel {
  const crop = useImageCrop(image);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [normalizedImagePosition, setNormalizedImagePosition] =
    useState(ZERO_POSITION);
  const { imageSize, stageSize } = useImageStageSize(
    image,
    crop.appliedCrop,
    containerRef,
  );
  const cardPosition = getCenteredPosition(
    stageSize ?? ZERO_SIZE,
    imageSize ?? ZERO_SIZE,
  );
  const imagePosition = imageSize
    ? denormalizePosition(normalizedImagePosition, imageSize, cardPosition)
    : cardPosition;
  const snap = useImageAlignmentSnap({
    imageHeight: imageSize?.height ?? 0,
    imageWidth: imageSize?.width ?? 0,
    stageHeight: stageSize?.height ?? 0,
    stageWidth: stageSize?.width ?? 0,
  });

  const finishImageDrag = (position: CropDisplayOrigin) => {
    if (!imageSize) return;
    setNormalizedImagePosition(
      normalizePosition(position, imageSize, cardPosition),
    );
  };
  const changeCrop = (nextCrop: CropArea) => {
    if (!imageSize) return;
    crop.setDraftCrop(normalizeCrop(nextCrop, imageSize, imagePosition));
  };
  const selectCropRatio = (ratio: CropRatioId) => {
    crop.selectRatio(ratio, (imageSize?.width ?? 1) / (imageSize?.height ?? 1));
  };

  return {
    alignmentGuides: snap.alignmentGuides,
    appliedCrop: crop.appliedCrop,
    cardPosition,
    displayedCrop: imageSize
      ? denormalizeCrop(crop.draftCrop, imageSize, imagePosition)
      : crop.draftCrop,
    draftCrop: crop.draftCrop,
    fixedCropRatio: crop.selectedRatioValue !== null,
    imagePosition,
    imageSize,
    isCropping: crop.isCropping,
    isImageSelected,
    selectedCropRatio: crop.selectedRatio,
    selectedCropRatioValue: crop.selectedRatioValue,
    stageSize,
    applyCrop: crop.applyCrop,
    beginCrop: crop.beginCrop,
    cancelCrop: crop.cancelCrop,
    changeCrop,
    clearAlignmentGuides: snap.clearAlignmentGuides,
    deselectImage: () => setIsImageSelected(crop.isCropping),
    finishImageDrag,
    moveImage: snap.handleImageDragMove,
    selectCropRatio,
    selectImage: () => setIsImageSelected(true),
  };
}
