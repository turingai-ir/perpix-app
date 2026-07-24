import { useState, type RefObject } from "react";
import { useSetAtom } from "jotai";
import { useImageAlignmentSnap } from "./use-image-alignment-snap";
import { useImageCrop } from "./use-image-crop";
import { useImageStageSize } from "./use-image-stage-size";
import {
  denormalizeCrop,
  denormalizePosition,
  getCenteredPosition,
  normalizeCrop,
  type CropArea,
  type CropDisplayOrigin,
} from "../_model/crop-area";
import type { CropRatioId } from "../_model/crop-ratios";
import type { ImageEditorWorkspaceViewModel } from "./image-editor-workspace-types";
import { useImageWorkspaceHistory } from "./use-image-workspace-history";
import { useInitialZoomResets } from "./use-initial-zoom-resets";
import { zoomAtom, panAtom } from "../_model/editor-settings";

const ZERO_SIZE = { height: 0, width: 0 };

export function useImageEditorWorkspace(
  image: HTMLImageElement,
  containerRef: RefObject<HTMLDivElement | null>,
  documentId?: string,
): ImageEditorWorkspaceViewModel {
  const crop = useImageCrop();
  const [isImageSelected, setIsImageSelected] = useState(false);
  const history = useImageWorkspaceHistory(image, documentId);
  const setZoom = useSetAtom(zoomAtom);
  const setPan = useSetAtom(panAtom);

  const { imageSize, stageSize } = useImageStageSize(
    image,
    history.current.appliedCrop,
    containerRef,
  );
  const cardPosition = getCenteredPosition(
    stageSize ?? ZERO_SIZE,
    imageSize ?? ZERO_SIZE,
  );
  const imagePosition = imageSize
    ? denormalizePosition(
        history.current.normalizedImagePosition,
        imageSize,
        cardPosition,
      )
    : cardPosition;

  useInitialZoomResets({
    stageSize,
    imageSize,
    cardPosition,
    setZoom,
    setPan,
  });

  const snap = useImageAlignmentSnap({
    imageHeight: imageSize?.height ?? 0,
    imageWidth: imageSize?.width ?? 0,
    cardPosition,
    cardWidth: imageSize?.width ?? 0,
    cardHeight: imageSize?.height ?? 0,
  });

  return {
    alignmentGuides: snap.alignmentGuides,
    appliedCrop: history.current.appliedCrop,
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
    applyCrop: () =>
      history.applyCrop(crop.applyCrop(history.current.appliedCrop)),
    beginCrop: crop.beginCrop,
    cancelCrop: crop.cancelCrop,
    changeCrop: (c: CropArea) => {
      if (imageSize)
        crop.setDraftCrop(normalizeCrop(c, imageSize, imagePosition));
    },
    clearAlignmentGuides: snap.clearAlignmentGuides,
    deselectImage: () => setIsImageSelected(crop.isCropping),
    finishImageDrag: (p: CropDisplayOrigin) => {
      if (imageSize) history.finishImageDrag(p, imageSize, cardPosition);
    },
    moveImage: snap.handleImageDragMove,
    selectCropRatio: (r: CropRatioId) => {
      crop.selectRatio(r, (imageSize?.width ?? 1) / (imageSize?.height ?? 1));
    },
    selectImage: () => setIsImageSelected(true),
    canRedo: history.canRedo,
    canUndo: history.canUndo,
    redo: history.redo,
    undo: history.undo,
  };
}
